const axios = require('axios')

module.exports = function() {
    let operations = {
      POST
    };
  
    async function POST(req, res, next) {
        try{
            var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: 
              { 
                _id: req.body._id,
                idType: '_id'
              } 
            });
    
            await axios.put('http://' + process.env.npm_package_config_ip + ':10001/user', 
            {
              _id: req.body._id,
              _account: r.data._account,
              _identity: r.data._identity,
              _memberType: r.data._memberType,
              loggedIn: 0
            });
            req.logout(); 
            res.redirect("/"); 
          }
          catch (err) {
            console.error(err)
          }
    }

    POST.apiDoc = {
      summary: 'Show home page.',
      tags: ['Home'],
      operationId: 'getHomePage',
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
                }
              }
            }
        }
      ],
      responses: {
        200: {
          description: 'The HTML of the home page.',
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