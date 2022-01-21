const Consumer = require('../../../data/schemas/consumer')

module.exports = function() {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      new Promise( (resolve, reject) => {
        (async function() {
          let consumers = await Consumer.find()
          resolve(consumers)
        }());
      }).then( (consumers) => {
        res.status(200).json(consumers)
      })
    }

    GET.apiDoc = {
      summary: 'Get all consumers from the Database.',
      tags: ['AllConsumers'],
      operationId: 'getAllConsumers',
      responses: {
        200: {
          description: 'The consumers of the system.',
          schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {
                      description: 'ID',
                      type: 'string'
                    },
                    consumption: {
                      description: 'Consumption of the consumer',
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