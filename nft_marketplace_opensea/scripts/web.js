

$('#wallet').click(function(e){
  debugger
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum
    .request({
      method: "eth_requestAccounts",
    })
    .then((accounts) => {
      console.log(accounts[0]);
      $('#connected_account').text(accounts[0])
       data = {
        'connected_account' : accounts[0],
          }
          $.ajax({url: "/connect/metamsk", method :'POST', data : data,success: function(result){
            location.reload()
          }
        });
    })
    .catch((error) => {
      alert("Something went wrong");
    });
   } 
   else{
    alert("Metamask is not installed")
   }
})


$('#dwallet').click(function(e){
      $.ajax({url: "/disconnect/metamsk", method :'POST',success: function(result){
        location.replace('/')
      }})

})


$(".purchase").click(function(){
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
        alert("Something went wrong...")
      }
      // alert(result)
    }});

});

