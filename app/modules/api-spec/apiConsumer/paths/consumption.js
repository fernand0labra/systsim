module.exports = function(consumer) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      res.status(200).json(consumer.consumption(req.query.day));
    }
  
    GET.apiDoc = {
      summary: 'Return consumption.',
      tags: ['Consumer'],
      operationId: 'getConsumption',
      parameters: [
        {
          in: 'query',
          name: 'day',
          required: true,
          type: 'integer',
          format: 'int32'
        }
      ],
      responses: {
        200: {
          description: 'The consumption for a certain day.',
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