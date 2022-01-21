const axios = require('axios')

module.exports = function(title) {
    let operations = {
      GET,
      POST
    };
  
    function GET(req, res, next) {
        res.render("login", { title: title}); 
    }

    GET.apiDoc = {
      summary: 'Show login form.',
      tags: ['Login'],
      operationId: 'getLoginForm',
      responses: {
        200: {
          description: 'The HTML of the login form.',
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
    
    async function POST(req, res, next) {
      try{
          // Obtain the object of the account
          var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/account',  { params: 
            { 
              username: req.body.username,
              password: req.body.hash,
              type: 'username'
            } 
          })
      } catch (err) {
        res.render("login", {title: title, error: 'The username or password are incorrect'})
        return
      }

      var first_name = r.data.first_name;
      var last_name = r.data.last_name;
      var admin = r.data.admin;
      var _account = r.data._id;

      var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: 
        { 
          _id: _account,
          idType: '_account'
        } 
      });

      // Store information of the user
      var _id = r.data._id
      var _identity = r.data._identity
      var _memberType = r.data._memberType

      // Indicate that the user is online
      await axios.put('http://' + process.env.npm_package_config_ip + ':10001/user', 
      { 
        _id: _id,
        _account: _account,
        _identity: _identity,
        _memberType: _memberType,
        loggedIn: 1
      });

      if(admin==0){
        try {
            // Obtain the object of the consumer/prosumer
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer',  { params: { _id: _memberType } });
            var memberType='Consumer'
        } catch (err) {
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/prosumer',  { params: { _id: _memberType } });
            var memberType='Consumer & Producer'
            var production = r.data.production;
            var _consumer = r.data._consumer;
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer',  { params: { _id: _consumer } });
        }
        var consumption = r.data.consumption;

        // Obtain the object of the identity
        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/identity',  { params: { _id: _identity } });
        var address = r.data.address;
        var port = r.data.port;

        var r = await axios.get('http://' + process.env.npm_package_config_ip + ':4000/info')

        var underRatio = 0;
        var excessiveRatio = 0;

        if(memberType=='Consumer'){
          consumption = r.data.cInfo[0][r.data.cInfo[1].indexOf(r.data.cInfo[1].find((p) => p == port))];
          production = 0
        }else {
          consumption = r.data.pInfo[0][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == port))];
          production = r.data.pInfo[1][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == port))];
          underRatio = r.data.pInfo[4][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == port))];
          excessiveRatio = r.data.pInfo[5][r.data.pInfo[2].indexOf(r.data.pInfo[2].find((p) => p == port))];
        }

        res.render("user", { 
          title: 'Welcome to Systsim',
          fullName: first_name + ' ' + last_name,
          memberType: memberType,
          fullAddress: address + ':' +  port,
          speed: r.data.wInfo[0],
          cep: r.data.mInfo[1],
          consumption: consumption,
          production: production,
          bufferSize: 0,
          net: production - consumption,
          port: port,
          _id: _id,
          underRatio: underRatio,
          excessiveRatio: excessiveRatio,
          updating: '0',
          newUnder: underRatio,
          newExcessive: excessiveRatio
        });
      } else {
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

        res.render("manager", {
          title: title,
          production: r.data.ppInfo[0],
          consumption: r.data.ppInfo[1],
          status: status,
          mep: r.data.ppInfo[3],
          cep: r.data.ppInfo[4],
          demand: r.data.mInfo[0],
          _id: _id,
          electricityRatio: r.data.ppInfo[5],
          updating: '0',
          newRatio: r.data.ppInfo[5],
          newPrice: r.data.ppInfo[4]
        })
      }
    }

    POST.apiDoc = {
      summary: 'Login a user.',
      tags: ['Login'],
      operationId: 'loginUser',
      parameters: [
        {
          in: 'body',
          name: 'credentials',
          required: true,
          schema: {
            type: 'object',
            properties: {
              username: {
                description: 'Username',
                type: 'string'
              },
              password: {
                description: 'Empty string TODO',
                type: 'string'
              },
              hash: {
                description: 'Hash of the password',
                type: 'string'
              },
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