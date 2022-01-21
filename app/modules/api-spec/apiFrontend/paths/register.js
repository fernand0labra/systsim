const axios = require('axios')

module.exports = function(title) {
    let operations = {
      GET,
      POST
    };
  
    function GET(req, res, next) {
        res.render("register", { title: title, error: ''}); 
    }

    GET.apiDoc = {
      summary: 'Show register form.',
      tags: ['Register'],
      operationId: 'getRegisterForm',
      responses: {
        200: {
          description: 'The HTML of the register form.',
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
        try {
            // Obtain the object of the user
            var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/user',  { params: { _id: req.body.identifier, idType: '_id' } });
        } catch (err) {
            res.render("register", { title: title, error: 'The identifier is not registered'}); 
            return
        }

        // Store information of the user
        var _account = r.data._account;
        var _memberType = r.data._memberType;
        var _identity = r.data._identity;

        try {
            // Obtain the object of the consumer/prosumer
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer',  { params: { _id: _memberType } });
            var memberType='Consumer'
        } catch (err) {
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/prosumer',  { params: { _id: _memberType } });
            var memberType='Consumer & Prosumer'
            var production = r.data.production;
            var _consumer = r.data._consumer;
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer',  { params: { _id: _consumer } });
        }
        var consumption = r.data.consumption;

        // Obtain the object of the identity
        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/identity',  { params: { _id: _identity } });
        var address = r.data.address;
        var port = r.data.port;

        // Obtain the object of the account if exists
        try{
            r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/account',  { params:
                { 
                username: req.body.username,
                password: req.body.password,
                type: 'username'
                } 
            });
            res.render("register", { title: 'Welcome to Systsim', error: 'The account is already registered'}); 
            return;
        } catch{ 
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            };

            r = await axios.post('http://' + process.env.npm_package_config_ip + ':10001/account', {
                _id: _account,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                mail: req.body.mail,
                username: req.body.username,
                password: req.body.hash,
                admin: 0
            }, axiosConfig);   

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

            // Indicate that the user is online
            await axios.put('http://' + process.env.npm_package_config_ip + ':10001/user',  
            { 
                _id: req.body.identifier,
                _account: _account,
                _identity: _identity,
                _memberType: _memberType,
                loggedIn: 1
            });

            res.render("user", { 
                title: 'Welcome to Systsim',
                fullName: req.body.first_name + ' ' + req.body.last_name,
                memberType: memberType,
                fullAddress: address + ':' +  port,
                speed: r.data.wInfo[0],
                cep: r.data.mInfo[1],
                consumption: consumption,
                production: production,
                bufferSize: 0,
                net: production - consumption,
                port: port,
                _id: req.body.identifier,
                underRatio: underRatio,
                excessiveRatio: excessiveRatio,
                updating: '0',
                newUnder: underRatio,
                newExcessive: excessiveRatio
            });
        }
    }

    POST.apiDoc = {
      summary: 'Register a new user.',
      tags: ['Register'],
      operationId: 'registerUser',
      parameters: [
        {
          in: 'body',
          name: 'parameters',
          required: true,
          schema: {
            type: 'object',
            properties: {
              first_name: {
                description: 'First name of the user',
                type: 'string'
              },
              last_name: {
                description: 'Last name of the user',
                type: 'string'
              },
              email: {
                description: 'Email of the user',
                type: 'string'
              },
              username: {
                description: 'Username of the user',
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
              identifier: {
                description: 'Identifier of the user',
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