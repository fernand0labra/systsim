module.exports = function(wind) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      let date = req.query.date
      res.status(200).json(wind.speed(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]), parseInt(date[3])));
    }
  
    GET.apiDoc = {
      summary: 'Return wind speed.',
      tags: ['Wind'],
      operationId: 'getSpeed',
      parameters: [
        {
          in: 'query',
          name: 'date',
          required: true,
          type: 'array',
          items: {
            type: 'string'
          }
        }
      ],
      responses: {
        200: {
          description: 'The speed for a certain hour, day, month and year.',
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