async function lowLevelWind(req, res, wind) {
    var url = new URL(req.url, `http://${req.headers.host}`);

    if (req.url.toLowerCase().split('?')[0] === "/speed") {    
      switch (req.method.toUpperCase()) {
        // Return Wind Speed
        case "GET": 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            let date = url.searchParams.getAll('date[]');
            var speed;
            (async function(){
              speed = await wind.speed(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]), parseInt(date[3]));
            }()).then(() => {
              res.end(JSON.stringify(speed));
            })
            break;
        default:
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain');
            res.write('Not implemented\n');
            res.end();
      };
    } else {
      res.statusCode = 404;
      res.end();
    };
  }
  
  module.exports = lowLevelWind;