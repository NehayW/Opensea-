# Project marketplace made in blockchain and node

To Run this project on your local please follow this step.

1. npm install and ipfs daemon in other window

2. Write you API_URL_KEY, API_KEY and metamask PRIVATE_KEY in the .env file like following
PRIVATE_KEY=??
API_URL_KEY=https://eth-rinkeby.alchemyapi.io/v2/??API_KEY=??

3. npx hardhat run scripts/deploy.js --network rinkeby

4. add deployed address on .env file like following
CONTRACTN = address_contract_of_nft
CONTRACTM = address_contarct_of_marketplace

5. deploy your contract-  npx hardhat run scripts/deploy.js --network rinkeby

6. npm start

7. Here is working Link

https://watch.screencastify.com/v/EcbjDjria8VtuYJmB6DZ
