$( document ).ready(function() {

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


  console.log(findOptimal());

  function findOptimal() {

    var minObj = 0;
    var maxObj = 20;

    var minStop = 0;
    var maxStop = 20;

    var tempMaxGain = {
      totalPos : 0,
      gain: 0,
      stop: 0,
      objectif: 0,
      percentage: 0
    };

    var iterationNumber = (maxObj+1 - minObj) * (maxStop+1 - minStop) * 20;
    var iteration = 0;

    for(var i = minObj; i <= maxObj; i++) {
      for(var j = minStop; j <= maxStop; j++) {

        for(var k = 0; k < 20; k++) {
          console.log((iteration/iterationNumber)*100);
          iteration++;

          var temp = strategie(Number(i), Number(j), Number(k)*5);

          if(temp.gain > tempMaxGain.gain) {
            tempMaxGain = temp;
          }

        }
      }
    }

    return tempMaxGain;
  }

  // console.log(strategie(20,1,5));
  // console.log(strategie(16,53,10));
  // console.log(tabData);



  function isInRange(value) {
    var range = ['08:00','22:00'];
    return value >= range[0] && value <= range[1];
  }


  //console.log(strategie(16,40,10));


  function strategie(obj, stop, objPercentage) {

    var nbPos  = 0;

    var isInPos = false;
    var priceCurrentpos;
    var isPosBuy;
    var totalGain = 0;
    var data = tabData;

    let amplitude;
    let corps;

    var echec = 0;

    var worstLose = 0;

    var bougieCompteur = 0;

    var maxBougie = 0;

    for(var i = 0; i < data.length; i++) {

      if(isInRange(data[i].hour)) {


      if(isInPos) {

        bougieCompteur++;

              if(isPosBuy) {
                if(pipToPoint(data[i]["2. high"] - Number(priceCurrentpos)) >= obj) {


                  //console.log("Close with gain buy at :", data[i].date, priceCurrentpos + pointToPip(obj));
                  totalGain += obj;
                  isInPos = false;

                } else if(priceCurrentpos - pipToPoint(data[i]["3. low"]) >= stop) {

                  //console.log("Close with lose buy at :", data[i].date);
                  totalGain -= pipToPoint(priceCurrentpos - data[i]["4. close"], priceCurrentpos - pointToPip(obj));



                  isInPos = false;
                  echec++;

                }

                if(worstLose < pipToPoint(priceCurrentpos - data[i]["3. low"], priceCurrentpos - pointToPip(obj))) {
                  worstLose = pipToPoint(priceCurrentpos - data[i]["3. low"], priceCurrentpos - pointToPip(obj));
                }

                if(bougieCompteur > maxBougie) {

                  maxBougie = bougieCompteur;
                }


              } else {

                if(pipToPoint(priceCurrentpos - data[i]["3. low"]) >= obj) {

                  //console.log("Close with gain sell at :", data[i].date, priceCurrentpos - pointToPip(obj));
                  totalGain += obj;
                  isInPos = false;

                } else if(pipToPoint(data[i]["2. high"] - priceCurrentpos) >= stop) {

                  //console.log("Close with lose sell at :", data[i].date, priceCurrentpos + pointToPip(obj));
                  totalGain -= pipToPoint(data[i]["4. close"] - priceCurrentpos);


                  isInPos = false;
                  echec++;
                }

                if(worstLose < pipToPoint(data[i]["2. high"] - priceCurrentpos)) {
                  worstLose =  pipToPoint(data[i]["2. high"] - priceCurrentpos);
                }

                if(bougieCompteur > maxBougie) {

                  maxBougie = bougieCompteur;
                }

              }

      } else {

        corps = diffAbsolute(data[i]["1. open"], data[i]["4. close"]);
        amplitude = diffAbsolute(data[i]["2. high"], data[i]["3. low"]);

        if(fullPercentage(corps, amplitude) >= objPercentage) {

          bougieCompteur = 0;
          nbPos++;

          if(isGreen(data[i]["1. open"], data[i]["4. close"])) {

            //console.log("open buy at :", data[i].date, data[i]["4. close"]);
            isPosBuy = true;

          } else {

            //console.log("open sell at :", data[i].date, data[i]["4. close"]);
            isPosBuy = false;
          }

          nbPos++;
          priceCurrentpos = Number(data[i]["4. close"]);
          isInPos = true;

        }
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
      pirePerte: worstLose,
      maxBougie: maxBougie
    };

    return obj;

  }

});
