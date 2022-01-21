const Account = require('../../../data/schemas/account')
var LocalStrategy = require("passport-local");

module.exports = function(passport) {

    setTimeout(async ()=>{
      passport.use(new LocalStrategy(Account.authenticate())); 
      passport.serializeUser(Account.serializeUser()); 
      passport.deserializeUser(Account.deserializeUser());

      var updatePassport = require('../../../../core/services/backend.js')
      await updatePassport(passport);
    }, 2000);

    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    async function GET(req, res, next) {
      if(req.query.type=='_id'){
        Account.findById(req.query._id, (err, element) => {
          if(element==null){
            res.status(404).send('Not Found');
          } else{
            res.status(200).json(element);
          }
        })
      } else if(req.query.type=='username'){
          await passport.authenticate('local')(req, res, function () {
            Account.findOne({username: req.query.username}, (err, element) => {
              res.status(200).json(element);
            })
          });
      }
    }

    GET.apiDoc = {
      summary: 'Get an account from the Database.',
      tags: ['Account'],
      operationId: 'getAccount',
      parameters: [
          {
            in: 'query',
            name: 'username',
            required: false,
            type: 'string'
          },
          {
            in: 'query',
            name: 'password',
            required: false,
            type: 'string'
          },
          {
            in: 'query',
            name: '_id',
            required: false,
            type: 'string'
          },
          {
            in: 'query',
            name: 'type',
            required: true,
            type: 'string'
          }
      ],
      responses: {
        200: { 
          description: 'An account of the system.',
          schema: {
            type: 'object',
            properties: {
              _id: {
                description: 'ID',
                type: 'string'
              },
              first_name: {
                description: 'First name of the person',
                type: 'string'
              },
              last_name: {
                description: 'Last name of the person',
                type: 'string'
              },
              mail: {
                description: 'Mail of the person',
                type: 'string'
              },
              username: {
                description: 'Username of the person',
                type: 'string'
              },
              password: {
                description: 'Hash of the password of the person',
                type: 'string'
              },
              admin: {
                description: 'Permits of the account',
                type: 'integer',
                format: 'int32'
              }
            }
          }
        },
        401: {
          description: 'Not Authenticated'
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };
    
    function POST(req, res, next) {
      Account.register(new Account(
        { 
            _id: req.body._id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            mail: req.body.mail,
            username: req.body.username,
            admin: req.body.admin   
        }), 
          req.body.password, async function (err, account) { 
        if (err) { 
            return res.status(400).send('Error')
        } else{
            res.status(200).send('OK')
        }
      }); 
    }

    POST.apiDoc = {
      summary: 'Create an account in the Database.',
      tags: ['Account'],
      operationId: 'createAccount',
      parameters: [
          {
              in: 'body',
              name: 'account',
              schema: {
                type: 'object',
                properties: {
                  _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  first_name: {
                    description: 'First name of the person',
                    type: 'string'
                  },
                  last_name: {
                    description: 'Last name of the person',
                    type: 'string'
                  },
                  mail: {
                    description: 'Mail of the person',
                    type: 'string'
                  },
                  username: {
                    description: 'Username of the person',
                    type: 'string'
                  },
                  password: {
                    description: 'Hash of the password of the person',
                    type: 'string'
                  },
                  admin: {
                    description: 'Permits of the account',
                    type: 'integer',
                    format: 'int32'
                  }
                }
              }
          }
      ],
      responses: {
        201: {
            description: 'Created'
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };
 
    function PUT(req, res, next){
      new Promise((resolve, reject) => {
        Account.findByIdAndUpdate(req.body._id, {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          mail: req.body.mail,
          username: req.body.username,
          password: req.body.password,
          admin: req.body.admin
        }, (err) => {
          err ? reject(err) : resolve()
        });
      }).then(() => {
        res.status(200).send('OK');
      }).catch((err) => {
        res.status(404);
        console.log(err)
      })
    } 

    PUT.apiDoc = {
      summary: 'Update an account in the Database.',
      tags: ['Account'],
      operationId: 'updateAccount',
      parameters: [
          {
              in: 'body',
              name: 'account',
              schema: {
                type: 'object',
                properties: {
                  _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  first_name: {
                    description: 'First name of the person',
                    type: 'string'
                  },
                  last_name: {
                    description: 'Last name of the person',
                    type: 'string'
                  },
                  mail: {
                    description: 'Mail of the person',
                    type: 'string'
                  },
                  username: {
                    description: 'Username of the person',
                    type: 'string'
                  },
                  password: {
                    description: 'Hash of the password of the person',
                    type: 'string'
                  },
                  admin: {
                    description: 'Permits of the account',
                    type: 'integer',
                    format: 'int32'
                  }
                }
              }
          }
      ],
      responses: {
        200: {
            description: 'OK'
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
    };

    function DELETE(req, res, next){
      new Promise((resolve, reject) => {
        Account.findByIdAndDelete(req.query._id, (err) => {
          err ? reject(err) : resolve()
        });
      }).then(() => {
        res.status(200).send('OK');
      }).catch((err) => {
        res.status(404);
        console.log(err)
      })
    } 

    DELETE.apiDoc = {
      summary: 'Delete an account from the Database.',
      tags: ['Account'],
      operationId: 'deleteAccount',
      parameters: [
          {
              in: 'query',
              name: '_id',
              required: true,
              type: 'string'
          }
      ],
      responses: {
        200: {
            description: 'OK'
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