const axios = require('axios')

module.exports = function(title) {
    let operations = {
      POST
    };
  
    async function POST(req, res, next) {
        var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')
        var _id = r.data.pInfo[3][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];

        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/prosumer', { params: 
          {
            _id: _id
          }
        })

        await axios.put('http://' + process.env.npm_package_config_ip + ':10001/prosumer', {
          _id: _id,
          _consumer: r.data._consumer,
          production: r.data.production,
          blocked: r.data.blocked,
          underRatio: parseFloat(req.body.newUnder),
          excessiveRatio: r.data.excessiveRatio
        })

        r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')

        var consumption = r.data.pInfo[0][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
        var production = r.data.pInfo[1][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
        var underRatio = r.data.pInfo[4][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
        var excessiveRatio = r.data.pInfo[5][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
        
        res.render("user", { 
            title: title,
            fullName: req.body.fullName,
            memberType: req.body.memberType,
            fullAddress: req.body.fullAddress,
            speed: r.data.wInfo[0],
            cep: r.data.mInfo[1],
            consumption: consumption,
            production: production,
            bufferSize: 0,
            net: production - consumption,
            port: req.body.port,
            _id: req.body._id,
            updating: '0',
            underRatio: underRatio,
            excessiveRatio: excessiveRatio
        });
    }

    POST.apiDoc = {
      summary: 'Show user page',
      tags: ['User'],
      operationId: 'getUserPage',
      parameters: [
        {
          in: 'body',
          name: 'parameters',
          required: true,
          schema: {
            type: 'object',
            properties: {
              _id: {
                description: 'Identifier of the user',
                type: 'string'
              },
              fullName: {
                description: 'Full name of the user',
                type: 'string'
              },
              memberType: {
                description: 'Type of member of the system',
                type: 'string'
              },
              fullAddress: {
                description: 'Full Address of the user',
                type: 'string'
              },
              port: {
                description: 'Port of the user address',
                type: 'string'
              },
              updating: {
                description: 'The page is updating',
                type: 'string'
              },
              newUnder: {
                description: 'The new under-production ratio',
                type: 'string'
              }
            }
          }
        }
      ],
      responses: {
        201: {
          description: 'The HTML of the user page',
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