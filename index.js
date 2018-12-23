$( document ).ready(function() {

  var api_key = "NR8TI0JEZXJ0JSMH";

  var url = "https://www.alphavantage.com";

  // getHourDataEurUsd();
  //
  // function getHourDataEurUsd() {
  //   $.get( "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=60min&outputsize=full&apikey=NR8TI0JEZXJ0JSMH", function( data ) {
  //     saveDataHours(data);
  //   });
  // }
  //
  // function saveDataHours(data) {
  //
  //   console.log("saving data...");
  //   localStorage.setItem("data", JSON.stringify(data));
  // }

  function getData() {

    return JSON.parse(localStorage.getItem("data"))["Time Series FX (60min)"];
  }

  function diffAbsolute(a,b) {

    return Math.abs(a-b);
  }

  function test() {
    var data = getData();

    for(var i in data) {

      
    }
  }

  console.log(getData());

});
