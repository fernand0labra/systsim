const axios = require('axios')

module.exports = function(prosumer) {
    let operations = {
      GET
    };
  
    async function GET(req, res, next) {
        let r = await axios.get('http://localhost:4001/speed', {params: {
          date: req.query.date
        }})
        res.status(200).json(prosumer.production(r.data))
    }
  
    GET.apiDoc = {
      summary: 'Return production.',
      tags: ['Prosumer'],
      operationId: 'getProduction',
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
          description: 'The production for a certain hour, day, month and year.',
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