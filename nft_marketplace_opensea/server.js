const express = require('express')
const app = express();
const path = require('path');
const { ethers } = require("hardhat");
const bodyParser = require("body-parser");
const contract = require("./scripts/interact.js");
const axios = require("axios");

app.set('view engine', 'ejs');

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());
var session;

app.use('/style', express.static(path.join(__dirname, '/src/css')));
app.use('/image', express.static(path.join(__dirname, '/src/image')));
app.use('/script', express.static(path.join(__dirname, '/scripts')));

app.use(bodyParser.urlencoded({
    extended : true
}));

const fileUpload = require("express-fileupload")

app.use(fileUpload())

const fileReader = require("filereader");

const { create } = require("ipfs-http-client");
const fs = require("fs");
const { type } = require('os');
async function ipfsClient() {
    const ipfs = await create(
        {
            host: '127.0.0.1',
            port: 5001,
            protocol: 'http',
        }
    );
    return ipfs;
}


async function saveFile(file, name, price, description) {
    try{
        let ipfs = await ipfsClient();
        data = file.data
        let result = await ipfs.add(data);
        console.log(result)
        metadata = {
            "description": description,
            "image": "https://ipfs.io/ipfs/"+result.path,
            "name": name,
            "price" : price
        }
        const meta = await ipfs.add(JSON.stringify(metadata))
        mintThenList(meta, price)
    }
    catch(err)
    {
        console.log(err)
    }

}

const mintThenList = async (result, price) => {
    try{
        const uri = `https://ipfs.io/ipfs/${result.path}`
        // mint nft 
        await(await contract.contract.nft.mint(uri)).wait()
        // get tokenId of new nft 
        const id = await contract.contract.nft.tokenCount()
        // approve marketplace to spend nft
        await(await contract.contract.nft.setApprovalForAll(contract.contract.marketplace.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await(await contract.contract.marketplace.makeItem(contract.contract.nft.address, id, listingPrice)).wait()
    }
    catch(err){

    }
}

app.post("/upload", async function(req, res) {
    var file = req.files.file
    var fileName = req.body.name
    var price = req.body.price
    var description = req.body.description
    await saveFile(file,fileName,price,description)
    res.render("SavedNft", {"session": session});
});

app.get("/", function(req, res) {
    res.render("home", {"session": session});
});


app.post("/connect/metamsk", function(req, res) {
    session=req.session;
    session.accountId=req.body.connected_account;
    res.render('home', {"session": session});

});

app.post("/disconnect/metamsk", function(req, res) {
    req.session.destroy();
    session=req.session;
    res.render('home', {"session": session});
});

app.get("/create", function(req, res) {
    res.render("create", {"session": session});
})

app.get("/thankyou", function(req, res){
    res.render("SavedNft", {"session": session});
})

app.get("/listed_nft", async function(req, res) {
    var data = [] 
    try {
        const totalItem = await contract.contract.marketplace.itemCount()  
        for(var i=1; i <=totalItem; i++)
        {
            var item = await contract.contract.marketplace.items(i)
            const uri = await contract.contract.nft.tokenURI(item.tokenId)
            const response = await axios(uri);
            const totalPrice = await contract.contract.marketplace.getTotalPrice(item.itemId)

            // data.push(response.data); 
            let listItem = {
                totalPrice : ethers.utils.formatEther(totalPrice),
                price: item.price,
                itemId: item.itemId,
                name: response.data.name,
                description: response.data.description,
                image: response.data.image
            } 
            data.push(listItem)
        }
        console.log(data)
        res.render("ListedItems", {"data" : data, "session": session});
    }
    catch(err)
    {
        console.log(err)
    }
});


app.post("/purchase", async function(req, res) {
     try {
        console.log(req.body.itemId)
        var totalPrice = await contract.contract.marketplace.getTotalPrice(req.body.itemId)
        await (await contract.contract.marketplace.purchaseItem(req.body.itemId, { value:  totalPrice})).wait()
        return res.send("True")
      } catch (err) {
        console.log(err)
        return res.send("False")
      }
});

app.get("/my_purchase", async function(req, res) {
    try
    {  
        var account = session.accountId
        console.log(account)
        var purchasedItem = await getPurchasedItems(account)
        console.log(purchasedItem)
        res.render("PurchasedItem", {"purchasedItem" : purchasedItem, "session": session})
        
    }
    catch(err)
    {
        console.log(err)
        res.render("PurchasedItem", {"purchasedItem" : [], "session": session})
    }

    
});


const getPurchasedItems = async (account) => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    try{
            const filter =  contract.contract.marketplace.filters.Bought(null,null,null,null,null,account)
            const results = await contract.contract.marketplace.queryFilter(filter)
            const purchases = await Promise.all(results.map(async i => {
                var item = i.args
                const totalPrice = await contract.contract.marketplace.getTotalPrice(item.itemId)
                const uri = await contract.contract.nft.tokenURI(item.tokenId)
                const response = await axios(uri);
                console.log(response)
                let purchasedItem = {
                    totalPrice : ethers.utils.formatEther(totalPrice),
                    price: item.price,
                    itemId: item.itemId,
                    name: response.data.name,
                    description: response.data.description,
                    image: response.data.image
                  }
                return purchasedItem
            }))
            return purchases
    }
    catch(err)
    {

    }
   
  }

app.listen(process.env.PORT || 4080);


