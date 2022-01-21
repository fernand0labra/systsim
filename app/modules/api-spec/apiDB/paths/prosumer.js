const Prosumer = require('../../../data/schemas/prosumer')

module.exports = function() {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    function GET(req, res, next) {
      new Promise((resolve, reject) => {
        Prosumer.findById(req.query._id, (err, element) => {
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
      summary: 'Get a prosumer from the Database.',
      tags: ['Prosumer'],
      operationId: 'getProsumer',
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
          description: 'A prosumer of the system.',
          schema: {
            type: 'object',
            properties: {
                _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  _consumer: {
                    description: 'consumerID',
                    type: 'string'
                  },
                  production: {
                    description: 'Production of the prosumer',
                    type: 'number',
                    format: 'float'
                  },
                  blocked: {
                    description: 'The prosumer is blocked from selling',
                    type: 'number',
                    format: 'int32'                    
                  },
                  underRatio: {
                    description: 'Ratio of how much should be bought from the market and how much should be taken from the buffer',
                    type: 'number',
                    format: 'float'                    
                  },
                  excessiveRatio: {
                    description: 'Ratio of how much should be sold to the market and how much should be sent to the buffer',
                    type: 'number',
                    format: 'float'                    
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
        let prosumer = new Prosumer({
            _id: req.body._id,
            _consumer: req.body._consumer,   
            production: req.body.production,
            blocked: req.body.blocked,
            underRatio: req.body.underRatio,
            excessiveRatio: req.body.excessiveRatio
        })
        prosumer.save( (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        res.status(201).send('Created');
      }).catch( (err) => {
        console.log(err)
      })
    }

    POST.apiDoc = {
      summary: 'Create a prosumer in the Database.',
      tags: ['Prosumer'],
      operationId: 'createProsumer',
      parameters: [
          {
              in: 'body',
              name: 'prosumer',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      _consumer: {
                        description: 'consumerID',
                        type: 'string'
                      },
                      production: {
                        description: 'Production of the prosumer',
                        type: 'number',
                        format: 'float'
                      },
                      blocked: {
                        description: 'The prosumer is blocked from selling',
                        type: 'number',
                        format: 'int32'                    
                      },
                      underRatio: {
                        description: 'Ratio of how much should be bought from the market and how much should be taken from the buffer',
                        type: 'number',
                        format: 'float'                    
                      },
                      excessiveRatio: {
                        description: 'Ratio of how much should be sold to the market and how much should be sent to the buffer',
                        type: 'number',
                        format: 'float'                    
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
        Prosumer.findByIdAndUpdate(req.body._id, {
            _consumer: req.body._consumer,   
            production: req.body.production,
            blocked: req.body.blocked,
            underRatio: parseFloat(req.body.underRatio),
            excessiveRatio: parseFloat(req.body.excessiveRatio)
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
      summary: 'Update a prosumer in the Database.',
      tags: ['Prosumer'],
      operationId: 'updateProsumer',
      parameters: [
          {
              in: 'body',
              name: 'prosumer',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      _consumer: {
                        description: 'consumerID',
                        type: 'string'
                      },
                      production: {
                        description: 'Production of the prosumer',
                        type: 'number',
                        format: 'float'
                      },
                      blocked: {
                        description: 'The prosumer is blocked from selling',
                        type: 'number',
                        format: 'int32'                    
                      },
                      underRatio: {
                        description: 'Ratio of how much should be bought from the market and how much should be taken from the buffer',
                        type: 'number',
                        format: 'float'                    
                      },
                      excessiveRatio: {
                        description: 'Ratio of how much should be sold to the market and how much should be sent to the buffer',
                        type: 'number',
                        format: 'float'                    
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
        Prosumer.findByIdAndDelete(req.query._id, (err) => {
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
      summary: 'Delete a prosumer from the Database.',
      tags: ['Prosumer'],
      operationId: 'deleteProsumer',
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