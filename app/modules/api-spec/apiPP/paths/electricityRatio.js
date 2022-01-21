module.exports = function(powerPlant) {
    let operations = {
      GET,
      PUT
    };
  
    function GET(req, res, next) {
      res.status(200).json(powerPlant.electricityRatio);
    }
  
    GET.apiDoc = {
      summary: 'Return the Electricity Ratio of the Power Plant.',
      tags: ['Power Plant'],
      operationId: 'getRatio',
      responses: {
        200: {
          description: 'The Electricity Ratio at the time of request.',
          schema: {
            type: 'number',
            format: 'float'
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
  
    function PUT(req, res, next) {
      powerPlant.electricityRatio = parseFloat(req.body.electricityRatio);
      res.status(200).send()
    }
  
    PUT.apiDoc = {
      summary: 'Change the Electricity Ratio of the Power Plant.',
      tags: ['Power Plant'],
      operationId: 'changeRatio',
      parameters: [
        {
          in: 'body',
          name: 'parameters',
          schema: {
            type: 'object',
            properties: {
              electricityRatio: {
                  description: 'Ratio of market/buffer',
                  type: 'string'
              }
            }
          }
        }
      ],  
      responses: {
        200: {
          description: 'Electricity Ratio updated.'
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

