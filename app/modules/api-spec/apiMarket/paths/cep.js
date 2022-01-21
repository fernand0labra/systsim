module.exports = function(market) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      (async function(){
        await market.calculateCEP()
      }()).then(() => {
        res.status(200).json(market.currentElectricityPrice);
      })
    }
  
    GET.apiDoc = {
      summary: 'Return the Current Electricity Price of the Market.',
      tags: ['Market'],
      operationId: 'getCEP',
      responses: {
        200: {
          description: 'The CurPent Electricity price at the time of request.',
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