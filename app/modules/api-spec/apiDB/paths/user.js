const User = require('../../../data/schemas/user')
const mongoose = require('mongoose')

module.exports = function() {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    function GET(req, res, next) {
      if(req.query.idType == '_id'){
        new Promise((resolve, reject) => {
          User.findById(req.query._id, (err, element) => {
            element==null ? reject(err) : resolve(element)
          });
        }).then((element) => {
          res.status(200).json(element);
        }).catch((err) => {
          res.status(404).send('Not Found');
        })
      } else if(req.query.idType == '_account'){
        new Promise((resolve, reject) => {
          User.findOne({_account: mongoose.Types.ObjectId(req.query._id)}, (err, element) => {
            element==null ? reject(err) : resolve(element)
          });
        }).then((element) => {
          res.status(200).json(element);
        }).catch((err) => {
          res.status(404).send('Not Found');
        }) 
      }

    }

    GET.apiDoc = {
      summary: 'Get a user from the Database.',
      tags: ['User'],
      operationId: 'getUser',
      parameters: [
          {
              in: 'query',
              name: '_id',
              required: true,
              type: 'string'
          },
          {
            in: 'query',
            name: 'idType',
            required: true,
            type: 'string'
          }
      ],
      responses: {
        200: {
          description: 'A user of the system.',
          schema: {
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
      new Promise((resolve, reject) => {
        let user = new User({
            _id: req.body._id,
            _account: req.body._account,
            _identity: req.body._identity,
            _memberType: req.body._memberType,
            loggedIn: req.body.loggedIn
        })
        user.save( (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        res.status(201).send('Created');
      }).catch( (err) => {
        console.log(err)
      })
    }

    POST.apiDoc = {
      summary: 'Create a user in the Database.',
      tags: ['User'],
      operationId: 'createUser',
      parameters: [
          {
              in: 'body',
              name: 'user',
              schema: {
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
        User.findByIdAndUpdate(req.body._id, {
            _account: req.body._account,
            _identity: req.body._identity,
            _memberType: req.body._memberType,
            loggedIn: req.body.loggedIn
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
      summary: 'Update a user in the Database.',
      tags: ['User'],
      operationId: 'updateUser',
      parameters: [
          {
              in: 'body',
              name: 'user',
              schema: {
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
        User.findByIdAndDelete(req.query._id, (err) => {
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
      summary: 'Delete a user from the Database.',
      tags: ['User'],
      operationId: 'deleteUser',
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