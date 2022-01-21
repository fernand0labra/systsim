const User = require('../../../data/schemas/user')

module.exports = function() {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
      new Promise( (resolve, reject) => {
        (async function() {
          let users = await User.find()
          resolve(users)
        }());
      }).then( (users) => {
        res.status(200).json(users)
      })
    }

    GET.apiDoc = {
      summary: 'Get all users from the Database.',
      tags: ['AllUsers'],
      operationId: 'getAllUsers',
      responses: {
        200: {
          description: 'The users of the system.',
          schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      _account: {
                        description: 'accountID',
                        type: 'string'
                      },
                      _identity: {
                        description: 'identityID',
                        type: 'string'
                      },
                      _memberType: {
                        description: 'memberID',
                        type: 'string'
                      },
                      loggedIn: {
                        description: 'The user is logged in',
                        type: 'number',
                        format: 'int32'
                      }
                },
                required: ['_id']
            }
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