module.exports = function(powerPlant) {
    let operations = {
      GET,
      PUT
    };
  
    function GET(req, res, next) {
      res.status(200).json(powerPlant.currentElectricityPrice);
    }
  
    GET.apiDoc = {
      summary: 'Return the Current Electricity Price of the Power Plant.',
      tags: ['Power Plant'],
      operationId: 'getCEP',
      responses: {
        200: {
          description: 'The Current Electricity Price at the time of request.',
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
      powerPlant.currentElectricityPrice = parseFloat(req.body.currentElectricityPrice);
      res.status(200).send()
    }
  
    PUT.apiDoc = {
      summary: 'Change the Current Electricity Price of the Power Plant.',
      tags: ['Power Plant'],
      operationId: 'changeCEP',
      parameters: [
        {
          in: 'body',
          name: 'parameters',
          schema: {
            type: 'object',
            properties: {
              currentElectricityPrice: {
                  description: 'The Current Electricity Price of the Power Plant',
                  type: 'string'
              }
            }
          }
        }
      ],  
      responses: {
        200: {
          description: 'CEP updated.'
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