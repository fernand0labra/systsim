module.exports = function(powerPlant) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      res.status(200).json(powerPlant.consumption);
    }
  
    GET.apiDoc = {
      summary: 'Return consumption.',
      tags: ['Power Plant'],
      operationId: 'getConsumption',
      responses: {
        200: {
          description: 'The consumption of the Power Plant.',
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
  
    return operations;
  }