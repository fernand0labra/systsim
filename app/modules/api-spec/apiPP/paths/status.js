module.exports = function(powerPlant) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      res.status(200).json(powerPlant.plantStatus);
    }
  
    GET.apiDoc = {
      summary: 'Return status.',
      tags: ['Power Plant'],
      operationId: 'getStatus',
      responses: {
        200: {
          description: 'The status of the Power Plant.',
          schema: {
            type: 'integer',
            format: 'int32'
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