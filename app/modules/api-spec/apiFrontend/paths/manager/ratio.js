const axios = require('axios')

module.exports = function(title) {
    let operations = {
      POST
    };
  
    async function POST(req, res, next) {
      var r = await axios.put('http://localhost:4003/electricityRatio', {
        electricityRatio: req.body.newRatio
      })

        r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')
        let status = ''
        switch(r.data.ppInfo[2]){
          case 0:
            status = 'starting';
            break;
          case 1:
            status = 'running';
            break;
          case 2:
            status = 'stopped';
            break;
        }
  
        res.render("manager", {
          title: title,
          production: r.data.ppInfo[0],
          consumption: r.data.ppInfo[1],
          status: status,
          mep: r.data.ppInfo[3],
          cep: r.data.ppInfo[4],
          demand: r.data.mInfo[0],
          _id: req.body._id,
          electricityRatio: r.data.ppInfo[5],
          updating: '0',
          newRatio: r.data.ppInfo[5]
        })
    }

    POST.apiDoc = {
      summary: 'Update ratio of market/buffer',
      tags: ['Manager'],
      operationId: 'updateRatio',
      parameters: [
          {
            in: 'body',
            name: 'parameters',
            required: true,
            schema: {
              type: 'object',
              properties: {
                _id: {
                  description: 'Identifier of the manager',
                  type: 'string'
                },
                newRatio: {
                    description: 'Ratio of market/buffer',
                    type: 'string'
                }
              }
            }
          }
      ],
      responses: {
        200: {
          description: 'The HTML of the manager page',
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