module.exports = function(market) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      (async function(){
        await market.fillDemand()
      }()).then(() => {
        res.status(200).json(market.demand);
      })
    }
  
    GET.apiDoc = {
      summary: 'Return demand of the market.',
      tags: ['Market'],
      operationId: 'getDemand',
      responses: {
        200: {
          description: 'The actual demand.',
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