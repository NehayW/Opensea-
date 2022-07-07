const express = require('express')
const app = express();
const path = require('path');
const { ethers } = require("hardhat");
const bodyParser = require("body-parser");
const contract = require("./scripts/interact.js");
const axios = require("axios");
app.set('view engine', 'ejs');

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
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https"
        }
    );
    return ipfs;
}


async function saveFile(file, name, price, description) {
    let ipfs = await ipfsClient();
    let data = fs.readFileSync('greet.png')
    data = file.data
    let result = await ipfs.add(data);
    metadata = {
        "description": description,
        "image": "https://ipfs.io/ipfs/"+result.path,
        "name": name,
        "price" : price
    }
    const meta = await ipfs.add(JSON.stringify(metadata))
    mintThenList(meta, price)

}

const mintThenList = async (result, price) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
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

app.post("/upload", async function(req, res) {
    var file = req.files.file
    var fileName = req.body.name
    var price = req.body.price
    var description = req.body.description
    await saveFile(file,fileName,price,description)
    res.render("SavedNft");
});

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/create", function(req, res) {
    res.render("create");
})

app.get("/listed_nfts", async function(req, res) {
    console.log(contract.contract.nft)
    const totalItem = await contract.contract.marketplace.itemCount()  
    var data = []  
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
    res.render("my_listed_items", {"data" : data});
});


app.post("/purchase", async function(req, res) {
    var totalPrice = await contract.contract.marketplace.getTotalPrice(req.body.itemId)
    await (await contract.contract.marketplace.purchaseItem(req.body.itemId, { value:  totalPrice})).wait()
    res.render("my_purchases")
});

app.get("/my_purchase", async function(req, res) {
    var account = '0xe39f8f9141427A2eB583C56cadFEd966394053BB'
    var purchasedItem = await getPurchasedItems(account)
    console.log(purchasedItem)  
    res.render("my_purchases", {"purchasedItem" : purchasedItem});
});


const getPurchasedItems = async (account) => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  contract.contract.marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await contract.contract.marketplace.queryFilter(filter)
    const purchases = await Promise.all(results.map(async i => {
        var item = i.args
        const totalPrice = await contract.contract.marketplace.getTotalPrice(item.itemId)
        const uri = await contract.contract.nft.tokenURI(item.tokenId)
        const response = await axios(uri);
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

app.listen(process.env.PORT || 4000);


