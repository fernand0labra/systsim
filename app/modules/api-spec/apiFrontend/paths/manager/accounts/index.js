const axios = require('axios')

module.exports = function(title) {
    let operations = {
      POST
    };
  
    async function POST(req, res, next) {
      var users = new Array()

      var r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allUsers')
      let data = r.data
      let length = r.data.length
      var index = 0;

      while(index < length) {
        var _id = data[index]._id;
        var _account = data[index]._account;
        var _identity = data[index]._identity;
        var _memberType = data[index]._memberType;
        var loggedIn = data[index].loggedIn;

        var registered = true;
        var username = '';
        var fullName = ' ';

        try{
          r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/account', { params: {
            _id: _account,
            type: '_id'
          }})

          username = r.data.username;
          fullName = r.data.first_name + ' ' + r.data.last_name;

          if(loggedIn==1)
            fullName += ' (Logged In)'

          if(r.data.admin == 1){
            index++;
            continue;
          }
        } catch (err) {
          registered = false;
        }

        r = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/identity', { params: {
          _id: _identity
        }})

        var address = r.data.address;
        var port = r.data.port;

        var memberType = 'Consumer'
        try{
          await axios.get('http://' + process.env.npm_package_config_ip + ':10001/consumer', { params: {
            _id: _memberType
          }})
        } catch (err) {
          memberType = 'Consumer and Producer'
        }

        memberType=='Consumer' ?
        users.push({
          registered: registered,
          _id: _id,
          username: username,
          fullName: fullName,
          fullAddress: address + ':' + port,
          memberType: memberType
        }) :
        users.push({
          registered: registered,
          _id: _id,
          username: username,
          fullName: fullName,
          fullAddress: address + ':' + port,
          memberType: memberType
        });
        index++;
      };

      res.render("accounts", {
        title: 'System Members',
        users: users,
        userSize: users.length,
        _id: req.body._id
      })
    }

    POST.apiDoc = {
      summary: 'Show accounts page.',
      tags: ['Manager'],
      operationId: 'getAccountsPage',
      parameters: [
          {
            in: 'body',
            name: 'parameters',
            required: true,
            schema: {
              type: 'object',
              properties: {
                _id: {
                  description: 'The identifier of the manager',
                  type: 'string'
                }
              }
            }
          }
      ],
      responses: {
        200: {
          description: 'The HTML of the accounts page.',
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