#!/usr/bin/env node

// Module dependencies.
var http = require('http');
var express = require('express')

// AUTHENTICATION
                    // var https = require('https') 

var normalizePort = require('../utils/normalizePort')



// ************************************************ //
//                     FRONTEND                     //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var frontEnd = require('./frontend')

// Instantiate express app for frontend server
app = express();

// Define frontend server
frontEnd(app)

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Set IP address
var ip = process.env.npm_package_config_ip;

// Frontend Port
var port = normalizePort('12345')
app.set('port', port)

/* AUTHENTICATION
                    // Define TLS options
                    const tls_options = {
                      key: fs.readFileSync("./app/modules/auth/systsim_backend_key_genpkey_ed25519.pem"),
                      cert: fs.readFileSync("./app/modules/auth/systsim_backend_key_genpkey_ed25519_cert.pem"),
                    };
*/

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server
var server = http.createServer(app);

// AUTHENTICATION
                    // const server = https.createServer(tls_options, app)

// Listen on provided port, on all network interfaces.
server.listen(port, ip);



// ************************************************ //
//                     DATABASE                     //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var apiDocDB = require('../../modules/api-spec/apiDB/api-doc.js')
var openAPI = require('express-openapi')
var passport = require('passport');

// Instantiate express app for database server
db = express();

// Database app dependencies
db.use(bodyParser.json({ extended: false }));
db.use(require("express-session")({
  secret: "Long live the empire",
  resave: false,
  saveUninitialized: false
}));
db.use(passport.initialize()); 
db.use(passport.session()); 

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: db,
  apiDoc: apiDocDB,
  dependencies: {
    passport: passport
  },
  paths: './app/modules/api-spec/apiDB/paths',
  docsPath: '/docs/database'
});

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Database Port
var portDB = normalizePort('10001');
db.set('port', portDB);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server
var serverDB = http.createServer(db);

// Listen on provided port, on all network interfaces.
serverDB.listen(portDB, ip);

/* <<<<<<<<<<<<<<<< MONGODB CONFIG >>>>>>>>>>>>>>>>> */

var conn = mongoose.createConnection("mongodb://localhost:27017/systsim", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}); 

mongoose.connect("mongodb://localhost:27017/systsim", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then( () => {
  console.log('Connected to Database')
}).catch( (err) => {
  console.error(err)
})




process.on('SIGTERM', () => {
  (async function() {
    await conn.dropDatabase()
    await conn.close()
  }()).then( () => {
    process.exit(10)
  }).catch( (err) => {
    console.error(err)
    process.exit(10)
  })
})

async function updatePassport(newPassport) {
  passport = newPassport;
}

module.exports =  updatePassport;