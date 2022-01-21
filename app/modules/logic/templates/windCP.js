// Module dependencies.
var express = require('express');
var http = require('http');

const axios = require('axios')
const openAPI = require('express-openapi')
var lowLevelWind = require('../../api-spec/apiWind/lowLevel')

var normalizePort = require('../../../core/utils/normalizePort')

const Wind = require('../modules/Wind');
const mongoose = require('mongoose')



// ************************************************ //
//                     WIND                         //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var port = normalizePort(process.argv[2]);

var windCP = express();
windCP.use(express.json());
windCP.use(express.urlencoded({ extended: false }));

var wind = new Wind(Math.random()*port, Math.random());

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: windCP,
  apiDoc: require('../../api-spec/apiWind/api-doc'),
  dependencies: {
    wind: wind
  },
  paths: './app/modules/api-spec/apiWind/paths',
  docsPath: '/docs/wind'
});

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Set IP address
var ip = '127.0.0.1';

// Get port from environment and store in Express.
windCP.set('port', 8001);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server for Low-level API
var server = http.createServer(async (req, res) => {
  await lowLevelWind(req, res, wind);
})

// Listen on provided port, on all network interfaces.
server.listen(port, ip);

// Create HTTP Server for API Docs
var apiSpec = http.createServer(windCP)

// Listen on provided port, on all network interfaces.
apiSpec.listen(8001, ip);

/* <<<<<<<<<<<<<<<<<<< DATABASE >>>>>>>>>>>>>>>>>>> */

var windID = new mongoose.Types.ObjectId().toString();

setTimeout(() => {
  // Create Wind Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      const res = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/wind', {
        _id: windID,
        speed: wind.speedBase
      }, axiosConfig);
    } catch (err) {
        console.error(err)
    }
  }())
}, 2000)
 
module.exports = windCP;
