// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
  // 0x5FbDB2315678afecb367f032d93F642f64180aa3

  // We get the contract to deploy
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(1);
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address); 
  // 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
