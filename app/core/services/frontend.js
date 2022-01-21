// Module Dependencies
var express = require('express')

var path = require('path');
var bodyParser = require("body-parser"); 
var cookieParser = require('cookie-parser');
var logger = require('morgan'); 

var axios = require('axios')
var openAPI = require('express-openapi')
var swaggerUi = require("swagger-ui-express");
var apiDocFrontend = require('../../modules/api-spec/apiFrontend/api-doc.js')



/**
 * Applies dependencies to the frontend app
 * 
 * @param {Express} app The express app of the frontend
 */
function frontEnd(app) {

    /* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

    // View engine setup
    app.set('views', path.join(__dirname, '../../shared/ui-components'));
    app.use(express.static(path.join(__dirname, '../../shared/')));
    app.set('view engine', 'pug');

    app.use(logger('dev')); // dev -> Concise output colored by response status for development use
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true })); 

    /* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */
    
    let title = 'Welcome to Systsim'

    openAPI.initialize({
      app: app,
      apiDoc: apiDocFrontend,
      dependencies: {
        title: title
      },
      paths: './app/modules/api-spec/apiFrontend/paths',
      docsPath: '/docs/frontend'
    });

    options = {
      explorer: true,
      swaggerOptions: {
        urls: [
          {
            url: 'http://systsim.ddns.net:12345/docs/frontend',
            name: 'Frontend API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/database',
            name: 'DB API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/wind',
            name: 'Wind API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/market',
            name: 'Market API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/powerPlant',
            name: 'Power Plant API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/consumer',
            name: 'Consumer API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/prosumer',
            name: 'Prosumer API'
          },
          {
            url: 'http://systsim.ddns.net:12345/docs/simulation',
            name: 'Simulation API'
          }
        ]
      }
    }
    
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(null, options)
    );

    app.get('/docs/database*', async function (req, res){
      var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001' + req.originalUrl)
      res.send(r.data)
    })

    app.get('/docs/wind*', async function (req, res){
      var r = await axios.get('http://localhost:8001' + req.originalUrl)
      res.send(r.data)
    })

    app.get('/docs/market*', async function (req, res){
      var r = await axios.get('http://localhost:8002' + req.originalUrl)
      res.send(r.data)
    })

    app.get('/docs/powerPlant*', async function (req, res){
      var r = await axios.get('http://localhost:8003' + req.originalUrl)
      res.send(r.data)
    })

    app.get('/docs/consumer*', async function (req, res) {
      // Get simulation info
      var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')
      let port = r.data.cInfo[1][0]; // Select first consumer

      r = await axios.get('http://localhost:' + port + req.originalUrl)
      res.send(r.data)
    })

    app.get('/docs/prosumer*', async function (req, res) {
      // Get simulation info
      var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')
      let port = r.data.pInfo[2][0]; // Select first prosumer

      r = await axios.get('http://localhost:' + port + req.originalUrl)
      res.send(r.data)
    })

    app.get('/docs/simulation*', async function (req, res) {
      var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000' + req.originalUrl)
      res.send(r.data)
    })
}

module.exports = frontEnd