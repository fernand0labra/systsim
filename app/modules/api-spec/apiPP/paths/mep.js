module.exports = function(powerPlant) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      res.status(200).json(powerPlant.getMEP());
    }
  
    GET.apiDoc = {
      summary: 'Return the Modeled Electricity Price.',
      tags: ['Power Plant'],
      operationId: 'getMEP',
      responses: {
        200: {
          description: 'The Modeled Electricity Price.',
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