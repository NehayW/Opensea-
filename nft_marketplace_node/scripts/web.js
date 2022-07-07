// const { ethers } = require("hardhat");
  
  // MetaMask Login/Connect
// const web3Handler = async () => {
//   alert('hello')
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     console.log('hell')
//     // setAccount(accounts[0])
//     console.log(accounts[0])
//     // Get provider from Metamask
//     const provider = new ethers.providers.Web3Provider(window.ethereum)
//     // Set signer
//     const signer = provider.getSigner()

//     window.ethereum.on('chainChanged', (chainId) => {
//       window.location.reload();
//     })

//     window.ethereum.on('accountsChanged', async function (accounts) {
//       // setAccount(accounts[0])
//     console.log(accounts[0])

//     })
//     loadContracts(signer)
//   }
  



//   const loadContracts = async (signer) => {
//     // Get deployed copies of contracts
//     const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
//     setMarketplace(marketplace)
//     const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
//     setNFT(nft)
//     setLoading(false)
//   }




$('#wallet').click(function(e){
  // web3Handler()
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum
    .request({
      method: "eth_requestAccounts",
    })
    .then((accounts) => {
      console.log(accounts[0]);
      $('#account').val(accounts[0])
    })
    .catch((error) => {
      alert("Something went wrong");
    });
   } 
})


// $(".purchase").click(function(){
//   debugger;
//     let data = {itemId: $("itemId").text()};
//     fetch("/purchase", {
//       method: "POST",
//       headers: {'Content-Type': 'application/json'}, 
//       body: JSON.stringify(data)
//     })
// });


$(".purchase").click(function(){
  debugger;
    data = {
      'itemId' : parseInt($(this).parent().find("small").html()),
    }
    $.ajax({url: "/purchase", method :'POST', data : data,success: function(result){
      debugger;
      // alert(result)
    }});

});