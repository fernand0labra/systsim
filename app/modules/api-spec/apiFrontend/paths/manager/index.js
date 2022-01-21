const axios = require('axios')

module.exports = function(title) {
    let operations = {
      POST
    };
  
    async function POST(req, res, next) {
        var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')
        
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
  
        if(req.body.updating=='1')
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
            updating: req.body.updating,
            newRatio: req.body.newRatio,
            newPrice: r.data.ppInfo[4]
          })
        else if (req.body.updating=='2')
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
            updating: req.body.updating,
            newRatio: r.data.ppInfo[5],
            newPrice: req.body.newPrice
          })
        else
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
            newRatio: r.data.ppInfo[5],
            newPrice: r.data.ppInfo[4]
          })
    }

    POST.apiDoc = {
      summary: 'Show manager page',
      tags: ['Manager'],
      operationId: 'getManagerPage',
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
                updating: {
                  description: 'The page is updating',
                  type: 'string'
                },
                newRatio: {
                  description: 'The new electricity ratio',
                  type: 'string'
                },
                newPrice: {
                  description: 'The new current electricity price',
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