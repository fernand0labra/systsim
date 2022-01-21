const axios = require('axios');
const { spawn } = require('child_process');

module.exports = function(path, cps, wInfo, mInfo, ppInfo, cInfo, pInfo, ports, children, nConsumers, nProsumers) {
    let operations = {
      GET,
      POST,
      DELETE
    };
  
    async function GET(req, res, next) {
        // Consumers information
        cInfo[0] = new Array();
        cInfo[2] = new Array();

        // Prosumers information
        pInfo[0] = new Array();
        pInfo[1] =  new Array();
        pInfo[3] = new Array();
        pInfo[4] = new Array();
        pInfo[5] = new Array();

        /* ** Fill Wind information ** */
        var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/wind')

        // Obtain speed
        wInfo[0] = r.data.speed
        

        /* ** Fill Market information ** */
        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/market')

        // Obtain demand
        mInfo[0] = r.data.demand

        // Obtain current electricity price
        mInfo[1] = r.data.cep

        
        /* ** Fill Power Plant information ** */

        // Obtain production
        r = await axios.get('http://localhost:4003/production')
        ppInfo[0] = r.data

        // Obtain consumption
        r = await axios.get('http://localhost:4003/consumption')
        ppInfo[1] = r.data

        // Obtain status
        r = await axios.get('http://localhost:4003/status')
        ppInfo[2] = r.data

        // Obtain modeled electricity price
        r = await axios.get('http://localhost:4003/mep')
        ppInfo[3] = r.data

        // Obtain current electricity price
        r = await axios.get('http://localhost:4003/cep')
        ppInfo[4] = r.data

        // Obtain current electricity ratio
        r = await axios.get('http://localhost:4003/electricityRatio')
        ppInfo[5] = r.data

        /* ** Fill Prosumers information ** */

        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allProsumers')

        _exclude = []
        length = r.data.length
        let index = 0

        while(index < length) {
            let prosumer = r.data[index]
            let consumer = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer', { params: {_id: prosumer._consumer} })
            _exclude.push(prosumer._consumer)

            // Obtain consumption
            pInfo[0].push(consumer.data.consumption)

            // Obtain production
            pInfo[1].push(prosumer.production)

            // Obtain memberType ID
            pInfo[3].push(prosumer._id)

            // Obtain underRatio
            pInfo[4].push(prosumer.underRatio)

            // Obtain excessiveRatio
            pInfo[5].push(prosumer.excessiveRatio)

            index++;
        }

        /* ** Fill Consumers information ** */

        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allConsumers')

        length = r.data.length
        index = 0;

        while(index < length) {
            let consumer = r.data[index]

            if(!_exclude.includes(consumer._id)){
            // Obtain consumption
            cInfo[0].push(consumer.consumption)

            // Obtain memberType ID
            cInfo[2].push(consumer._id)
            }

            index++;
        }

        res.status(200).send({wInfo, mInfo, ppInfo, cInfo, pInfo})
    }

    GET.apiDoc = {
      summary: 'Get simulation info.',
      tags: ['Simulation'],
      operationId: 'getSimulation',
      responses: {
        200: {
          description: 'The information of the different components of the simultaion.',
          schema: {
            type: 'object',
            properties: {
                wInfo: {
                    description: 'The structure with the Wind module information',
                    type: 'array',
                    items: {
                        type: 'number',
                        format: 'float'
                    }
                },
                mInfo: {
                    description: 'The structure with the Market module information',
                    type: 'array',
                    items: {
                        type: 'number',
                        format: 'float'
                    }
                }, 
                ppInfo: {
                    description: 'The structure with the Power Plant module information',
                    type: 'array',
                    items: {
                        type: 'number',
                        format: 'float'
                    }
                },
                cInfo: {
                    description: 'The structure with the Consumers information',
                    type: 'array',
                    items: {
                        type: 'number',
                        format: 'float'
                    }
                },
                pInfo: {
                    description: 'The structure with the Prosumers information',
                    type: 'array',
                    items: {
                        type: 'number',
                        format: 'float'
                    }
                }
            }
          }
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };
    
    function POST(req, res, next) {
        if (req.body.memberType == 1){ // Consumer
            let calcPort = 4004 + Math.floor(Math.random() * 1000)
            ports[1].push(calcPort.toString());
            cInfo[1] = ports[1]
            let childObject = spawn('node', [path + cps[3], ports[1][ports[1].length-1]]);
        
            childObject.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });       
        
            children[1].push(childObject);
            nConsumers++;
          }
          else{ // Prosumer
            let calcPort = 5004 + Math.floor(Math.random() * 1000)
            ports[2].push(calcPort.toString());    
            pInfo[2] = ports[2]          
            let childObject = spawn('node', [path + cps[4], ports[2][ports[2].length-1]]);
              
            childObject.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });       
        
            children[2].push(childObject);
            nProsumers++;
          };
  
          setTimeout(async ()=>{
            var updateStructs = require('../../../../core/services/simulator.js')

            await updateStructs(ports, children, cInfo, pInfo, nConsumers, nProsumers);
            res.status('201').send('OK')
          }, 4000);
    }

    POST.apiDoc = {
      summary: 'Create a member.',
      tags: ['Simulation'],
      operationId: 'createMember',
      parameters: [
        {
          in: 'body',
          name: 'parameters',
          required: true,
          schema: {
            type: 'object',
            properties: {
              memberType: {
                description: 'The type of member of the system',
                type: 'string'
              }
            }
          }
        },
      ],
      responses: {
        201: {
            description: 'Response.',
            schema: {
                type: 'string'
            }
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };

    function DELETE(req, res, next) {
      if(req.query.memberType == 'Consumer'){
            var pos = 1;
            nConsumers--;
          } else {
            var pos = 2;
            nProsumers--;
          }
        
          let index = ports[pos].indexOf(req.query.port)
          children[pos][index].kill('SIGTERM');

          setTimeout(async ()=>{
            var updateStructs = require('../../../../core/services/simulator.js')

            let newPorts = ports[pos].slice(0, index);
            ports[pos] = newPorts.concat(ports[pos].slice(index+1, ports.length));
          
            let newChildren = children[pos].slice(0, index);
            children[pos] = newChildren.concat(children[pos].slice(index+1, children.length));
          
            if(req.query.memberType == 'Consumer'){
              cInfo[1] = ports[pos]
              let newIds = cInfo[2].slice(0, index);
              cInfo[2] = newIds.concat(cInfo[2].slice(index+1, cInfo[2].length));
            } else {
              pInfo[2] = ports[pos]
              let newIds = pInfo[3].slice(0, index);
              pInfo[3] = newIds.concat(pInfo[3].slice(index+1, pInfo[3].length));
            };
        
            await updateStructs(ports, children, cInfo, pInfo, nConsumers, nProsumers);
            res.status('200').send('OK')
          }, 1000);
    }

    DELETE.apiDoc = {
      summary: 'Kill a member.',
      tags: ['Simulation'],
      operationId: 'killMember',
      parameters: [
        {
            in: 'query',
            name: 'memberType',
            required: true,
            type: 'string'
        },
        {
            in: 'query',
            name: 'port',
            required: true,
            type: 'string'
        }
      ],
      responses: {
        201: {
            description: 'Response.',
            schema: {
                type: 'string'
            }
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };
    
    return operations;
  }