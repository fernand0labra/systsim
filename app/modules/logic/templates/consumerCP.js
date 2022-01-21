// Module dependencies.
var express = require('express');
var http = require('http');

const axios = require('axios')
const openAPI = require('express-openapi')

var normalizePort = require('../../../core/utils/normalizePort')

const Identity = require('../members/Identity');
const Consumer = require('../members/Consumer');
const mongoose = require('mongoose')



// ************************************************ //
//                     CONSUMER                     //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var ip = '127.0.0.1';
var port = normalizePort(process.argv[2]);

var consumerCP = express();
var consumer = new Consumer(new Identity(toString(port), ip, port), Math.random(), Math.random());

var memberTypeID = new mongoose.Types.ObjectId().toString();

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: consumerCP,
  apiDoc: require('../../api-spec/apiConsumer/api-doc'),
  dependencies: {
    consumer: consumer,
    _memberType: memberTypeID
  },
  paths: './app/modules/api-spec/apiConsumer/paths',
  docsPath: '/docs/consumer'
});

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Get port from process and store in Express
consumerCP.set('port', port);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server
var server = http.createServer(consumerCP);

// Listen on provided port, on all network interfaces.
server.listen(port, ip);

/* <<<<<<<<<<<<<<<<<<< DATABASE >>>>>>>>>>>>>>>>>>> */

var identityID = new mongoose.Types.ObjectId().toString();
var userID = new mongoose.Types.ObjectId().toString();

setTimeout(() => {
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
        _id: memberTypeID,
        consumption: consumer.baseConsumption,
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
 * Delete all objects related to this consumer in the database
 */
async function consumerDel(){
  try { // Delete User Object in the DB
    const res = await axios.delete('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: { _id: userID } });
  } catch (err) {
    console.error(err)
  }

  try { // Delete Consumer Object in the DB
    const res = await axios.delete('http://' + process.env.npm_package_config_ip + ':10001/consumer',  { params: { _id: memberTypeID } });
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
  consumerDel().then( () => {
    process.exit(0)
  })
});

module.exports = consumerCP;
