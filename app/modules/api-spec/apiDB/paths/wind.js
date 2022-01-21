const Wind = require('../../../data/schemas/wind')

module.exports = function() {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    function GET(req, res, next) {
      new Promise((resolve, reject) => {
        resolve(Wind.findOne({}))
      }).then((element) => {
        res.status(200).json(element);
      }).catch((err) => {
        res.status(404).send('Not Found');
        console.log(err)
      })
    }

    GET.apiDoc = {
      summary: 'Get the wind from the Database.',
      tags: ['Wind'],
      operationId: 'getWind',
      responses: {
        200: {
          description: 'The wind of the system.',
          schema: {
            type: 'object',
            properties: {
                _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  speed: {
                    description: 'Speed of the wind',
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
        let wind = new Wind({
            _id: req.body._id,
            speed: req.body.speed
        })
        wind.save( (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        res.status(201).send('Created');
      }).catch( (err) => {
        console.log(err)
      })
    }

    POST.apiDoc = {
      summary: 'Create the wind in the Database.',
      tags: ['Wind'],
      operationId: 'createWind',
      parameters: [
          {
              in: 'body',
              name: 'wind',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      speed: {
                        description: 'Speed of the wind',
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
        Wind.findByIdAndUpdate(req.body._id, {
            speed: req.body.speed
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
      summary: 'Update the wind in the Database.',
      tags: ['Wind'],
      operationId: 'updateWind',
      parameters: [
          {
              in: 'body',
              name: 'wind',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      speed: {
                        description: 'Speed of the wind',
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
        Wind.findByIdAndDelete(req.query._id, (err) => {
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
      summary: 'Delete the wind from the Database.',
      tags: ['Wind'],
      operationId: 'deleteWind',
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