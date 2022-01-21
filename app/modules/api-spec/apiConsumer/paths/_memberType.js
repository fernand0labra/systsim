module.exports = function(_memberType) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      res.status(200).json(_memberType);
    }
  
    GET.apiDoc = {
      summary: 'Return memberType ID.',
      tags: ['Consumer'],
      operationId: 'getMemberTypeID',
      responses: {
        200: {
          description: 'The identifier of the member type object.',
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