const axios = require('axios')

module.exports = function(title) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
        var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: 
        { 
          _id: req.body._id,
          idType: '_id'
        } 
      });

      var _memberType = r.data._memberType;
      r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/prosumer',  { params: 
        { 
          _id: _memberType
        } 
      });

      var production = r.data.production
      var _consumer = r.data._consumer

      var underRatio = r.data.underRatio
      var excessiveRatio = r.data.excessiveRatio

      r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer', { params: {
        _id: r.data._consumer
      }})

      var consumption = r.data.consumption

      r = await axios.put('http://' + process.env.npm_package_config_ip + ':10001/prosumer', 
      {
        _id: _memberType,
        _consumer: _consumer,
        production: production,
        blocked: 1,
        underRatio: underRatio,
        excessiveRatio: excessiveRatio
      });
      
      (async function(){
        setTimeout(async function(){
          var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: 
            { 
              _id: req.body._id,
              idType: '_id'
            } 
          });
  
          var _memberType = r.data._memberType;
          r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/prosumer',  { params: 
            { 
              _id: _memberType
            } 
          });
  
          var production = r.data.production
          var _consumer = r.data._consumer

          var underRatio = r.data.underRatio
          var excessiveRatio = r.data.excessiveRatio
          
          await axios.put('http://' + process.env.npm_package_config_ip + ':10001/prosumer', 
          {
            _id: _memberType,
            _consumer: _consumer,
            production: production,
            blocked: 0,
            underRatio: underRatio,
            excessiveRatio: excessiveRatio
          });
        }, 10000)
      }());
      
      res.render("update", {
        title: req.body.username,
        registered: req.body.registered,
        fullName: req.body.fullName,
        username: req.body.username,
        _id: req.body._id,
        fullAddress: req.body.fullAddress,
        memberType: req.body.memberType,
        consumption: consumption,
        production: production,
        _manager: req.body._manager,
        blocked: 1
      })
    }

    POST.apiDoc = {
      summary: 'Block a user.',
      tags: ['Manager'],
      operationId: 'blockUser',
      parameters: [
        {
          in: 'body',
          name: 'parameters',
          required: true,
          schema: {
            type: 'object',
            properties: {
              registered: {
                description: 'The user is registered in the system',
                type: 'string'
              },
              fullName: {
                description: 'The full name of the user',
                type: 'string'
              },
              username: {
                description: 'The username of the user',
                type: 'string'
              },
              _id: {
                description: 'The identifier of the user',
                type: 'string'
              },
              fullAddress: {
                description: 'The full address of the user',
                type: 'string'
              },
              memberType: {
                description: 'The type of member in the system',
                type: 'string'
              },
              _manager: {
                description: 'The identifier of the manager',
                type: 'string'
              }
            }
          }
        },
      ],
      responses: {
        201: {
            description: 'The HTML of the user page.',
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