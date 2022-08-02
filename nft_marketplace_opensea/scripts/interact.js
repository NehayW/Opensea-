const { ethers } = require("hardhat");

const API_KEY = process.env.API_KEY; //get from alchemy
const CONTRACT_ADDRESS_NFT = process.env.CONTRACTN; //deployed contract address
const CONTRACT_ADDRESS_MARKETPLACE = process.env.CONTRACTM; //deployed contract address

const PRIVATE_KEY = process.env.PRIVATE_KEY; //metamask

const nft_contract = require('../artifacts/contracts/Nft.sol/NFT.json');
const marketplace_contract = require('../artifacts/contracts/Marketplace.sol/Marketplace.json');


// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);


// contract instance
const nft = new ethers.Contract(CONTRACT_ADDRESS_NFT, nft_contract.abi, signer);
const marketplace = new ethers.Contract(CONTRACT_ADDRESS_MARKETPLACE, marketplace_contract.abi, signer);

// console.log(nft)
// console.log(marketplace)
// {contract : {'nft': nft, 'marketplace' : marketplace}};

// export default function nfts() {
//   return "marketplace"
// }
module.exports = {contract : {'nft': nft, 'marketplace' : marketplace}};



