const Prosumer = require('../../../data/schemas/prosumer')

module.exports = function() {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      new Promise( (resolve, reject) => {
        (async function() {
          let prosumers = await Prosumer.find()
          resolve(prosumers)
        }());
      }).then( (prosumers) => {
        res.status(200).json(prosumers)
      })
    }

    GET.apiDoc = {
      summary: 'Get all prosumers from the Database.',
      tags: ['AllProsumers'],
      operationId: 'getAllProsumers',
      responses: {
        200: {
          description: 'The prosumers of the system.',
          schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      _consumer: {
                        description: 'consumerID',
                        type: 'string'
                      },
                      production: {
                        description: 'Production of the prosumer',
                        type: 'number',
                        format: 'float'
                      },
                      blocked: {
                        description: 'The prosumer is blocked from selling',
                        type: 'number',
                        format: 'int32'                    
                      },
                      underRatio: {
                        description: 'Ratio of how much should be bought from the market and how much should be taken from the buffer',
                        type: 'number',
                        format: 'float'                    
                      },
                      excessiveRatio: {
                        description: 'Ratio of how much should be sold to the market and how much should be sent to the buffer',
                        type: 'number',
                        format: 'float'                    
                      }
                  },
                  required: ['_id']
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
 
    return operations;
  }