async function lowLevelPP(req, res, powerPlant) {
    if (req.url.toLowerCase().split('?')[0] === "/cep") {
      switch (req.method.toUpperCase()) {
        // Return Current Electricity Price
        case "GET": 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(JSON.stringify(powerPlant.currentElectricityPrice));
            break;
        case "PUT":
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');

            let body = ''
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                let data = JSON.parse(body)
                powerPlant.currentElectricityPrice = parseFloat(data.currentElectricityPrice);
                res.end()
            });
            break;
        default:
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain');
            res.write('Not implemented\n');
            res.end();
      };
    } else if(req.url.toLowerCase().split('?')[0] === "/consumption"){
        switch (req.method.toUpperCase()) {
            // Return Consumption of the Power Plant
            case "GET": 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(powerPlant.consumption));
                break;
            default:
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain');
                res.write('Not implemented\n');
                res.end();
        }
    } else if(req.url.toLowerCase().split('?')[0] === "/electricityratio"){
        switch (req.method.toUpperCase()) {
            // Return Electricity Ratio
            case "GET": 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(powerPlant.electricityRatio));
                break;
            case "PUT":
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');

                let body = ''
                req.on("data", (chunk) => {
                    body += chunk.toString();
                });

                req.on("end", () => {
                    let data = JSON.parse(body)
                    powerPlant.electricityRatio = parseFloat(data.electricityRatio);
                    res.end()
                });
                break;
            default:
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain');
                res.write('Not implemented\n');
                res.end();
        }
    } else if(req.url.toLowerCase().split('?')[0] === "/mep"){
        switch (req.method.toUpperCase()) {
            // Return Modeled Electricity Price
            case "GET": 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(powerPlant.getMEP()));
                break;
            default:
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain');
                res.write('Not implemented\n');
                res.end();
        }
    } else if(req.url.toLowerCase().split('?')[0] === "/production"){
        switch (req.method.toUpperCase()) {
            // Return Production of the Power Plant
            case "GET": 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(powerPlant.production));
                break;
            default:
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain');
                res.write('Not implemented\n');
                res.end();
        }
    } else if(req.url.toLowerCase().split('?')[0] === "/status"){
        switch (req.method.toUpperCase()) {
            // Return Status of the Power Plant
            case "GET": 
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(powerPlant.plantStatus));
                break;
            default:
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/plain');
                res.write('Not implemented\n');
                res.end();
        }
    } else {
      res.statusCode = 404;
      res.end();
    };
  }
  
  module.exports = lowLevelPP;