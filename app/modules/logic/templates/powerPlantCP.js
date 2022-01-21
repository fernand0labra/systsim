// Module dependencies.
var express = require('express');
var http = require('http');

const axios = require('axios');
const openAPI = require('express-openapi')
var bodyParser = require('body-parser');
var lowLevelPP = require('../../api-spec/apiPP/lowLevel')

var normalizePort = require('../../../core/utils/normalizePort')

const PowerPlant = require('../modules/PowerPlant');
const mongoose = require('mongoose');



// ************************************************ //
//                   POWER PLANT                    //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var powerPlantCP = express();
powerPlantCP.use(bodyParser.json({ extended: false }));

var powerPlant = new PowerPlant(Math.floor(Math.random()*40), Math.floor(Math.random()*30), Math.floor(Math.random()*40));

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: powerPlantCP,
  apiDoc: require('../../api-spec/apiPP/api-doc'),
  dependencies: {
    powerPlant: powerPlant
  },
  paths: './app/modules/api-spec/apiPP/paths',
  docsPath: '/docs/powerPlant'
});

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Set IP address
var ip = '127.0.0.1';

// Get port from environment and store in Express.
var port = normalizePort(process.argv[2]);
powerPlantCP.set('port', 8003);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server for Low-level API
var server = http.createServer(async (req, res) => {
  await lowLevelPP(req, res, powerPlant);
})

// Listen on provided port, on all network interfaces.
server.listen(port, ip);

// Create HTTP Server for API Docs
var apiSpec = http.createServer(powerPlantCP)

// Listen on provided port, on all network interfaces.
apiSpec.listen(8003, ip);

/* <<<<<<<<<<<<<<<<<<< DATABASE >>>>>>>>>>>>>>>>>>> */

var identityID = new mongoose.Types.ObjectId().toString();
var accountID = new mongoose.Types.ObjectId().toString();
var userID = new mongoose.Types.ObjectId().toString();

setTimeout( () => {
  // Create Identity Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      const res = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/identity', {
        _id: identityID,
        address: ip,
        port: port
      }, axiosConfig);
    } catch (err) {
        console.error(err)
    }
  }());

  // Create Account Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };

      r = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/account', {
        _id: accountID,
        first_name: 'Administrator',
        last_name: '',
        mail: 'administrator@gmail.com',
        username: 'admin',
        password: '0DPiKuNIrrVmD8IUCuw1hQxNqZc=', // admin
        admin: 1
      }, axiosConfig);   
    } catch (err) {
        console.error(err)
    }
  }());

  // Create User Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      const res = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/user', {
        _id: userID,
        _account: accountID,
        _identity: identityID,
        _memberType: new mongoose.Types.ObjectId().toString(),
        loggedIn: 0
      }, axiosConfig);
    } catch (err) {
        console.error(err)
    }
  }());
}, 2000)

module.exports = powerPlantCP;
