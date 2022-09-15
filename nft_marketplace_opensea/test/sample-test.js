const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Nft", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Nft = await ethers.getContractFactory("Nft");
    const nft = await Nft.deploy("DApp NFT", "DAPP");
    await nft.deployed();

    expect(await nft.mint(uri)).to.equal(1);
    const setmintTx = await nft.mint(_uri);
    // wait until the transaction is mined
    await setmintTx.wait();

    expect(await nft.mint()).to.equal(1);
  });
});

describe("Make Item", function () {
  it("Should make item for Marketplace", async function () {
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();
    
    const setmintTx = await marketplace.makeItem(nft,_tokenId,_price);
    // wait until the transaction is mined
    await setmintTx.wait();
  });
});


describe("Purchase Item", function () {
  it("Should make item for Marketplace", async function () {
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    // expect(await marketplace.makeItem(_nft,_tokenId,_price));
    const setmintTx = await marketplace.purchaseItem(_itemId);
    // wait until the transaction is mined
    await setmintTx.wait();
  });
});



// const chai = require('chai')
// const expect = chai.expect
// const request = require('supertest');
// const app = require('../server')

// describe('POST /upload', function() {
//   it('Upload', function(done) {
//     request(app)
//     .post('/upload')
//     data={
//       file: {
//         name: 'bitcoin.jpg',
//         data: "<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 08 06 06 07 06 05 08 07 07 07 09 09 08 0a 0c 15 0e 0c 0b 0b 0c 19 12 13 0f ... 10366 more bytes>",
//         size: 10416,
//         encoding: '7bit',
//         tempFilePath: '',
//         truncated: false,
//         mimetype: 'image/jpeg',
        
//         md5: '6117673d1bf169ed11baae8f92fd4108',
//         mv: [Function: mv]
//       }
//       fileName: "NFT new" 
//       price: "0.01"
//       description: "This is nft"
//   }
//   .send(data)
//     .expect(200, done);
//   });
// });

