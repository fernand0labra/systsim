// Module dependencies.
var express = require('express');
var http = require('http');

const axios = require('axios');
const openAPI = require('express-openapi')
var lowLevelMarket = require('../../api-spec/apiMarket/lowLevel')

var normalizePort = require('../../../core/utils/normalizePort')

const Market = require('../modules/Market');
const mongoose = require('mongoose')



// ************************************************ //
//                    MARKET                        //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var marketCP = express();
var market = new Market();

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: marketCP,
  apiDoc: require('../../api-spec/apiMarket/api-doc'),
  dependencies: {
    market: market
  },
  paths: './app/modules/api-spec/apiMarket/paths',
  docsPath: '/docs/market'
});

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Set IP address
var ip = '127.0.0.1';

// Get port from environment and store in Express.
var port = normalizePort(process.argv[2]);
marketCP.set('port', 8002);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server for Low-level API
var server = http.createServer(async (req, res) => {
  await lowLevelMarket(req, res, market);
})

// Listen on provided port, on all network interfaces.
server.listen(port, ip);

// Create HTTP Server for API Docs
var apiSpec = http.createServer(marketCP)

// Listen on provided port, on all network interfaces.
apiSpec.listen(8002, ip);

/* <<<<<<<<<<<<<<<<<<< DATABASE >>>>>>>>>>>>>>>>>>> */

var marketID = new mongoose.Types.ObjectId().toString();

setTimeout(() => {
  // Create Market Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      const res = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/market', {
        _id: marketID,
        demand: market.demand,
        cep: market.currentElectricityPrice
      }, axiosConfig);
    } catch (err) {
        console.error(err)
    }
  }())

  setInterval( () => {
    market.fillDemand();
    market.calculateCEP();
  }, 2000)
}, 2000)

module.exports = marketCP;
