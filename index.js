$( document ).ready(function() {

  var api_key = "NR8TI0JEZXJ0JSMH";

  var url = "https://www.alphavantage.com";

  //getHourDataEurUsd();

  function getHourDataEurUsd() {
    $.get( "https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&outputsize=full&to_symbol=USD&interval=60min&apikey=NR8TI0JEZXJ0JSMH", function( data ) {
      saveDataHours(data);
    });
  }

  function saveDataHours(data) {

    console.log("saving data...");
    localStorage.setItem("data", JSON.stringify(data));
  }

  function getData() {

    return JSON.parse(localStorage.getItem("data"))["Time Series FX (60min)"];
  }

  function getArrayData() {

    var data = getData();
    var tempArray = [];

    for(var i in data) {

      data[i].date = i;
      tempArray.push(data[i]);
    }

    return tempArray.reverse();
  }


  function diffAbsolute(a,b) {

    return Math.abs(a-b);
  }

  function fullPercentage(effectif, total) {

    return (effectif/total)*100;
  }

  function pointToPip(a) {

    return Math.abs(a/10000);
  }

  function pipToPoint(a) {

    return Math.abs(a*10000);
  }

  function isGreen(a, b) {
    if(a < b) {

      return true;
    } else {

      return false;
    }
  }

  function compare(a, b) {


    if(a.gain >= b.gain) {
      return true;
    } else {

      return false
    }
  }


  // console.log(findOptimal());
  //
  // function findOptimal() {
  //
  //   var minObj = 5;
  //   var maxObj = 60;
  //
  //   var minStop = 5;
  //   var maxStop = 30;
  //
  //   var tempMaxGain = {
  //     totalPos : 0,
  //     gain: 0,
  //     stop: 0,
  //     objectif: 0,
  //     percentage: 0
  //   };
  //
  //   var iterationNumber = (maxObj+1 - minObj) * (maxStop+1 - minStop) * 20;
  //   var iteration = 0;
  //
  //   for(var i = minObj; i <= maxObj; i++) {
  //     for(var j = minStop; j <= maxStop; j++) {
  //
  //       for(var k = 0; k < 20; k++) {
  //         console.log((iteration/iterationNumber)*100);
  //         iteration++;
  //
  //         var temp = strategie(Number(i), Number(j), Number(k)*5);
  //
  //         if(temp.gain > tempMaxGain.gain) {
  //           tempMaxGain = temp;
  //         }
  //
  //       }
  //     }
  //   }
  //
  //   return tempMaxGain;
  // }

  console.log(strategie(24,18,5));

  function strategie(obj, stop, objPercentage) {

    var nbPos  = 0;

    var isInPos = false;
    var priceCurrentpos;
    var isPosBuy;
    var totalGain = 0;
    var data = getArrayData();

    let amplitude;
    let corps;

    var echec = 0;

    var worstLose = 0;

    for(var i = 0; i < data.length; i++) {

      if(isInPos) {

              if(isPosBuy) {
                if(pipToPoint(data[i]["2. high"] - Number(priceCurrentpos)) >= obj) {


                  //console.log("Close with gain buy at :", data[i].date, priceCurrentpos + pointToPip(obj));
                  totalGain += obj;
                  isInPos = false;

                } else if(priceCurrentpos - pipToPoint(data[i]["3. low"]) >= stop) {

                  //console.log("Close with lose buy at :", data[i].date);
                  totalGain -= pipToPoint(priceCurrentpos - data[i]["4. close"], priceCurrentpos - pointToPip(obj));

                  if(worstLose < pipToPoint(priceCurrentpos - data[i]["3. low"], priceCurrentpos - pointToPip(obj))) {
                    worstLose = pipToPoint(priceCurrentpos - data[i]["3. low"], priceCurrentpos - pointToPip(obj));
                  }

                  isInPos = false;
                  echec++;

                }


              } else {

                if(pipToPoint(priceCurrentpos - data[i]["3. low"]) >= obj) {

                  //console.log("Close with gain sell at :", data[i].date, priceCurrentpos - pointToPip(obj));
                  totalGain += obj;
                  isInPos = false;

                } else if(pipToPoint(data[i]["2. high"] - priceCurrentpos) >= stop) {

                  //console.log("Close with lose sell at :", data[i].date, priceCurrentpos + pointToPip(obj));
                  totalGain -= pipToPoint(data[i]["4. close"] - priceCurrentpos);

                  if(worstLose < pipToPoint(data[i]["2. high"] - priceCurrentpos)) {
                    worstLose =  pipToPoint(data[i]["2. high"] - priceCurrentpos);
                  }

                  isInPos = false;
                  echec++;
                }
              }

      } else {

        corps = diffAbsolute(data[i]["1. open"], data[i]["4. close"]);
        amplitude = diffAbsolute(data[i]["2. high"], data[i]["3. low"]);

        if(fullPercentage(corps, amplitude) >= objPercentage) {

          nbPos++;

          if(isGreen(data[i]["1. open"], data[i]["4. close"])) {

            console.log("open buy at :", data[i].date, data[i]["4. close"]);
            isPosBuy = true;

          } else {

            console.log("open sell at :", data[i].date, data[i]["4. close"]);
            isPosBuy = false;
          }

          nbPos++;
          priceCurrentpos = Number(data[i]["4. close"]);
          isInPos = true;

        }
      }

    }

    totalGain = totalGain - (0.6*nbPos);

    var obj = {
      totalPos : nbPos,
      gain: totalGain,
      stop: stop,
      objectif: obj,
      percentage: objPercentage,
      failRate: (echec/nbPos)*100,
      pirePerte: worstLose
    };

    return obj;

  }

  // test();
  // function test(obj, stop, objPercentage) {
  //
  //   var nbPos  = 0;
  //
  //   var isInPos = false;
  //   var priceCurrentpos;
  //   var isPosBuy;
  //   var totalGain = 0;
  //   var data = getData();
  //
  //   let amplitude;
  //   let corps;
  //
  //   for(var i in data) {
  //
  //     if(isInPos) {
  //
  //       if(isPosBuy) {
  //
  //         if(pipToPoint(data[i]["2. high"] - priceCurrentpos) >= obj) {
  //
  //           totalGain += obj;
  //           isInPos = false;
  //
  //         } else if(priceCurrentpos - pipToPoint(data[i]["3. low"]) >= stop) {
  //
  //           totalGain -= pipToPoint(priceCurrentpos - data[i]["4. close"]);
  //           isInPos = false;
  //
  //         }
  //
  //
  //       } else {
  //
  //         if(pipToPoint(priceCurrentpos - data[i]["3. low"]) >= obj) {
  //
  //           totalGain += obj;
  //           isInPos = false;
  //
  //         } else if(pipToPoint(data[i]["2. high"] - priceCurrentpos) >= stop) {
  //
  //           totalGain -= pipToPoint(data[i]["4. close"] - priceCurrentpos);
  //           isInPos = false;
  //         }
  //       }
  //
  //     } else {
  //
  //       corps = diffAbsolute(data[i]["1. open"], data[i]["4. close"]);
  //       amplitude = diffAbsolute(data[i]["2. high"], data[i]["3. low"]);
  //
  //
  //       if(amplitude > pointToPip(10) && corps != 0) {
  //
  //         if(isGreen(data[i]["1. open"], data[i]["4. close"])) {
  //
  //           isPosBuy = true;
  //         } else {
  //
  //           isPosBuy = false;
  //         }
  //
  //         nbPos++;
  //         priceCurrentpos = data[i]["4. close"];
  //         isInPos = true;
  //       }
  //
  //     }
  //
  //
  //   }
  //
  //   return {gain: totalGain, totalPos: nbPos};
  // }

});
