const Identity = require('../../../data/schemas/identity')

module.exports = function() {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    function GET(req, res, next) {
      new Promise((resolve, reject) => {
        Identity.findById(req.query._id, (err, element) => {
          element==null ? reject(err) : resolve(element)
        });
      }).then((element) => {
        res.status(200).json(element);
      }).catch((err) => {
        res.status(404).send('Not Found');
        console.log(err)
      })
    }

    GET.apiDoc = {
      summary: 'Get an identity from the Database.',
      tags: ['Identity'],
      operationId: 'getIdentity',
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
          description: 'An identity of the system.',
          schema: {
            type: 'object',
            properties: {
                _id: {
                    description: 'ID',
                    type: 'string'
                },
                address: {
                    description: 'IP address of the house device monitor',
                    type: 'string'
                },
                port: {
                    description: 'Port used in the house device monitor',
                    type: 'number'
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
        let identity = new Identity({
            _id: req.body._id,
            address: req.body.address,
            port: req.body.port
        })
        identity.save( (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        res.status(201).send('Created');
      }).catch( (err) => {
        console.log(err)
      })
    }

    POST.apiDoc = {
      summary: 'Create an identity in the Database.',
      tags: ['Identity'],
      operationId: 'createIdentity',
      parameters: [
          {
              in: 'body',
              name: 'identity',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                    },
                    address: {
                        description: 'IP address of the house device monitor',
                        type: 'string'
                    },
                    port: {
                        description: 'Port used in the house device monitor',
                        type: 'number'
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
        Identity.findByIdAndUpdate(req.body._id, {
            address: req.body.address,
            port: req.body.port        
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
      summary: 'Update an identity in the Database.',
      tags: ['Identity'],
      operationId: 'updateIdentity',
      parameters: [
          {
              in: 'body',
              name: 'identity',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                    },
                    address: {
                        description: 'IP address of the house device monitor',
                        type: 'string'
                    },
                    port: {
                        description: 'Port used in the house device monitor',
                        type: 'number'
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
        Identity.findByIdAndDelete(req.query._id, (err) => {
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
      summary: 'Delete an identity from the Database.',
      tags: ['Identity'],
      operationId: 'deleteIdentity',
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