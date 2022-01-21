async function lowLevelMarket(req, res, market) {
    if (req.url.toLowerCase().split('?')[0] === "/cep") {    
      switch (req.method.toUpperCase()) {
        // Return Current Electricity Price
        case "GET": 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            (async function(){
                await market.calculateCEP()
            }()).then(() => {
                res.end(JSON.stringify(market.currentElectricityPrice));
            })
            break;
        default:
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain');
            res.write('Not implemented\n');
            res.end();
      };
    } else if(req.url.toLowerCase().split('?')[0] === "/demand"){
        switch (req.method.toUpperCase()) {
            // Return Current Electricity Price
            case "GET": 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                (async function(){
                    await market.fillDemand()
                }()).then(() => {
                    res.end(JSON.stringify(market.demand));
                })
                break;
            default:
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain');
                res.write('Not implemented\n');
        }
    } else {
      res.statusCode = 404;
      res.end();
    };
  }
  
  module.exports = lowLevelMarket;