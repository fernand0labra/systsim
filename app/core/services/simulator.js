#!/usr/bin/env node

// Module dependencies.
const { ChildProcess } = require('child_process');
var http = require('http');
var express = require('express');

var axios = require('axios');
var openAPI = require('express-openapi')
var apiDocSimul = require('../../modules/api-spec/apiSimul/api-doc.js')

var sample = require('../utils/sample');
var simulate = require('../utils/simulate');
var normalizePort = require('../utils/normalizePort');



// ************************************************ //
//                    SIMULATION                    //
// ************************************************ //

/* <<<<<<<<<<<<<<<<< DEPENDENCIES >>>>>>>>>>>>>>>>> */

var simul = express();

simul.use(express.json());
simul.use(express.urlencoded({ extended: false }));

/* <<<<<<<<<<<<<<<<<< NETWORKING >>>>>>>>>>>>>>>>>> */

// Set IP address
var ip = process.env.npm_package_config_ip;

// Get port from environment and store in Express.
var port = normalizePort('4000');
simul.set('port', port);

/* <<<<<<<<<<<<<<<<< HTTP SERVER >>>>>>>>>>>>>>>>>> */

// Create HTTP Server
var server = http.createServer(simul);

// Listen on provided port, on all network interfaces.
server.listen(port, ip);



// ************************************************ //
//                SAMPLING AUTOMATION               //
// ************************************************ //

/* <<<<<<<<<<<<< STRUCTS DEFINITION >>>>>>>>>>>>>>> */

 let nConsumers = 2;
 let nProsumers = 2;
 
 var path = './app/modules/logic/templates/';
 let cps = ['windCP.js', 'marketCP.js', 'powerPlantCP.js', 'consumerCP.js', 'prosumerCP.js'];
 
 // Storage structs for child processes objects
 var netModules = new Array(); // wind -- market -- powerPlant
 var consumers = new Array();
 var prosumers = new Array();
 
var children = [netModules, consumers, prosumers];

// Storage structs for child processes ports
var netModulesPort = ['4001', '4002', '4003']; // wind -- market -- powerPlant
var consumersPort = new Array();
var prosumersPort = new Array();

var ports = [netModulesPort, consumersPort, prosumersPort];

// Creation of child processes for each of the members and modules
simulate(path, cps, children, ports, nConsumers, nProsumers)

console.log('netModulesPort: ' + netModulesPort.toString());
console.log('consumersPort: ' + consumersPort.toString());
console.log('prosumersPort: ' + prosumersPort.toString());

/* <<<<<<<<<<<< STRUCTS INITIALIZATION >>>>>>>>>>>>> */

// Wind information
var speedW = 0;

var wInfo = [speedW];

// Market information
var demandM = 0;
var cepM = 0;

var mInfo = [demandM, cepM];

// Power Plant information
var productionPP = 0;
var consumptionPP = 0;
var statusPP = 0;
var mep_PP = 0;
var cep_PP = 0;

var ppInfo = [productionPP, consumptionPP, statusPP, mep_PP, cep_PP];

// Consumers information
var consumptionsC = new Array();
var _idsC = new Array();

var cInfo = [consumptionsC, consumersPort, _idsC];

// Prosumers information
var consumptionsP = new Array();
var productionsP = new Array();
var _idsP = new Array();

var pInfo = [consumptionsP, productionsP, prosumersPort, _idsP];

// Sample information from all the elements of the network
let date = [Math.floor(Math.random()*23+1), Math.floor(Math.random()*29+1), Math.floor(Math.random()*11+1), 2021];

/* <<<<<<<<<<<<<<<<<<<<< API >>>>>>>>>>>>>>>>>>>>>> */

openAPI.initialize({
  app: simul,
  apiDoc: apiDocSimul,
  dependencies: {
    path: path,
    cps: cps,
    wInfo: wInfo,
    mInfo: mInfo,
    ppInfo: ppInfo,
    cInfo: cInfo,
    pInfo: pInfo,
    ports: ports,
    children: children,
    nConsumers: nConsumers,
    nProsumers: nProsumers
  },
  paths: './app/modules/api-spec/apiSimul/paths',
  docsPath: '/docs/simulation'
});

/* <<<<<<<<<<<<<<<<<< AUTOMATION >>>>>>>>>>>>>>>>>> */

setInterval( () => {
  new Promise(async (resolve, reject) => { // Reset structs and sample
    // Consumers information
    cInfo[0] = new Array(); // consumptionsC
    cInfo[2] = new Array(); // consumersID

    // Prosumers information
    pInfo[0] = new Array(); // consumptionsP
    pInfo[1] = new Array(); // productionsP
    pInfo[3] = new Array(); // prosumersID

    // Sample information
    resolve(await sample(date, wInfo, mInfo, ppInfo, cInfo, pInfo))
  }).then(async () => { // Update information in the database

    // Update wind
    r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/wind')
    axios.put('http://' + process.env.npm_package_config_ip + ':10001/wind', {
              _id: r.data._id,
              speed: wInfo[0]
            });

    // Update market
    r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/market')
    axios.put('http://' + process.env.npm_package_config_ip + ':10001/market', {
              _id: r.data._id,
              demand: mInfo[0],
              cep: mInfo[1]
            });
    
    _exclude = []
    // Update prosumers
    r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allProsumers')
    let index = 0;
    r.data.forEach(async (prosumer) => {
      r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer', { params: {_id: prosumer._consumer} })
      _exclude.push(prosumer._consumer) // Exclude consumer because the identifier has been used
      await axios.put('http://' + process.env.npm_package_config_ip + ':10001/consumer', {
        _id: prosumer._consumer,
        consumption: pInfo[0][pInfo[3].indexOf(pInfo[3].find((_id) => _id == prosumer._id))]
      })

      let underRatio = prosumer.underRatio;
      let excessiveRatio = prosumer.excessiveRatio;

      axios.put('http://' + process.env.npm_package_config_ip + ':10001/prosumer', {
        _id: prosumer._id,
        _consumer: prosumer._consumer,
        production: pInfo[1][pInfo[3].indexOf(pInfo[3].find((_id) => _id == prosumer._id))],
        blocked: prosumer.blocked,
        underRatio: underRatio,
        excessiveRatio: excessiveRatio
      })
      index+=1;
    })
  
    // Update consumers
    r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allConsumers')
    index = 0;
    r.data.forEach((consumer) => {
      if(!_exclude.includes(consumer._id)) // Consumers that are not prosumers
        axios.put('http://' + process.env.npm_package_config_ip + ':10001/consumer', {
          _id: consumer._id,
          consumption: cInfo[0][cInfo[2].indexOf(cInfo[2].find((_id) => _id == consumer._id))]
        })
      index+=1;
    })
  }).catch((error) => {
    console.log(error)
    console.log("ERROR ON THE SAMPLING")
  })
}, 6000)



/**
 * Updates the structs from the API to the automation sampling
 * 
 * @param {string[][]} newPorts Ports Info [netModulesPort, consumersPort, prosumersPort]
 * @param {ChildProcess[][]} newChildren Children Info <<childProcess>>
 * @param {any[][]} newcInfo Consumers Info [consumptionsC, consumersPort, consumersID]
 * @param {any[][]} newpInfo Prosumers Info [consumptionsP, productionsP, prosumersPort, prosumersID]
 * @param {number} newConsumers Number of Consumers in the system
 * @param {number} newProsumers Number of Prosumers in the system
 */
async function updateStructs(newPorts, newChildren, newcInfo, newpInfo, newConsumers, newProsumers){
  children = JSON.parse(JSON.stringify(newChildren));
  ports = JSON.parse(JSON.stringify(newPorts));
  cInfo = JSON.parse(JSON.stringify(newcInfo));
  pInfo = JSON.parse(JSON.stringify(newpInfo));

  nConsumers = newConsumers;
  nProsumers = newProsumers;
}

module.exports = updateStructs