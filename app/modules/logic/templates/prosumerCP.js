// Module dependencies.
var express = require('express');
var http = require('http');

const axios = require('axios')
const openAPI = require('express-openapi')

var normalizePort = require('../../../core/utils/normalizePort')

const Identity = require('../members/Identity');
const Consumer = require('../members/Consumer');
const Prosumer = require('../members/Prosumer');
const mongoose = require('mongoose')



// ************************************************ //
//                     PROSUMER                     //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var ip = '127.0.0.1';
var port = normalizePort(process.argv[2]);

var prosumerCP = express();
prosumerCP.use(express.json());
prosumerCP.use(express.urlencoded({ extended: false }));

var consumer = new Consumer(new Identity(toString(port), ip, port), Math.random(), Math.random());
var prosumer = new Prosumer(consumer);
var memberTypeID = new mongoose.Types.ObjectId().toString();

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: prosumerCP,
  apiDoc: require('../../api-spec/apiProsumer/api-doc'),
  dependencies: {
    prosumer: prosumer,
    _memberType: memberTypeID
  },
  paths: './app/modules/api-spec/apiProsumer/paths',
  docsPath: '/docs/prosumer'
});

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Get port from environment and store in Express.
prosumerCP.set('port', port);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server
var server = http.createServer(prosumerCP);

// Listen on provided port, on all network interfaces.
server.listen(port, ip);

/* <<<<<<<<<<<<<<<<<<< DATABASE >>>>>>>>>>>>>>>>>>> */

var identityID = new mongoose.Types.ObjectId().toString();
var consumerID = new mongoose.Types.ObjectId().toString();
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

  // Create Consumer Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      const res = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/consumer', {
        _id: consumerID,
        consumption: consumer.baseConsumption,
      }, axiosConfig);
    } catch (err) {
        console.error(err)
    }
  }());

  // Create Prosumer Object in the DB
  (async function() {
    try {
      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      const res = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/prosumer', {
        _id: memberTypeID,
        _consumer: consumerID,
        production: 0,
        blocked: 0,
        underRatio: 0.5,
        excessiveRatio: 0.5
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
        _account: new mongoose.Types.ObjectId().toString(),
        _identity: identityID,
        _memberType: memberTypeID,
        loggedIn: 0
      }, axiosConfig);
    } catch (err) {
        console.error(err)
    }
  }());
}, 2000)



/**
 * Delete all objects related to this prosumer in the database
 */
async function prosumerDel(){
  try { // Delete User Object in the DB
    const res = await axios.delete('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: { _id: userID } });
  } catch (err) {
    console.error(err)
  }

  try { // Delete Prosumer Object in the DB
    const res = await axios.delete('http://' + process.env.npm_package_config_ip + ':10001/prosumer',  { params: { _id: memberTypeID } });
  } catch (err) {
    console.error(err)
  }

  try { // Delete Consumer Object in the DB
    const res = await axios.delete('http://' + process.env.npm_package_config_ip + ':10001/consumer',  { params: { _id: consumerID } });
  } catch (err) {
    console.error(err)
  }

  try { // Delete Identity Object in the DB
    const res = await axios.delete('http://' + process.env.npm_package_config_ip + ':10001/identity',  { params: { _id: identityID } });
  } catch (err) {
    console.error(err)
  }
}

process.on('SIGTERM', () => {
  prosumerDel().then( () => {
    process.exit(0)
  })
});
 
module.exports = prosumerCP;
