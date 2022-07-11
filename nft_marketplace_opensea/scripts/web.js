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
      console(error)
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
      if(result=="true")
      {
        location.replace("/thankyou")
      }
      else
      {
        location.replace("/thankyou")
        
        // alert("Something went wrong may be nft is already sold..!!")
      }
    }});

});