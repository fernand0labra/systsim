module.exports = function(powerPlant) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      res.status(200).json(powerPlant.production);
    }
  
    GET.apiDoc = {
      summary: 'Return production.',
      tags: ['Power Plant'],
      operationId: 'getProduction',
      responses: {
        200: {
          description: 'The production of the Power Plant.',
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