const axios = require('axios')

module.exports = function(title) {
    let operations = {
      POST
    };
  
    async function POST(req, res, next) {
        var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')
        var production = 0;
        var underRatio = 0;
        var excessiveRatio = 0;

        if(req.body.memberType=='Consumer'){
            var consumption = r.data.cInfo[0][r.data.cInfo[1].indexOf(r.data.cInfo[1].find((p) => p == req.body.port))];
        }else {
            var consumption = r.data.pInfo[0][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
            production = r.data.pInfo[1][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
            underRatio = r.data.pInfo[4][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
            excessiveRatio = r.data.pInfo[5][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == req.body.port))];
        }
        
        if(req.body.updating=='1')
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
            underRatio: underRatio,
            excessiveRatio: excessiveRatio,
            updating: req.body.updating,
            newUnder: req.body.newUnder,
            newExcessive: excessiveRatio
          });
        else if(req.body.updating=='2')
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
            underRatio: underRatio,
            excessiveRatio: excessiveRatio,
            updating: req.body.updating,
            newUnder: underRatio,
            newExcessive: req.body.newExcessive
          });
        else
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
            underRatio: underRatio,
            excessiveRatio: excessiveRatio,
            updating: req.body.updating,
            newUnder: underRatio,
            newExcessive: excessiveRatio
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
              },
              newExcessive: {
                description: 'The new excessive-production ratio',
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