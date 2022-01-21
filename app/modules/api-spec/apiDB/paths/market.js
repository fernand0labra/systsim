const Market = require('../../../data/schemas/market')

module.exports = function() {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    function GET(req, res, next) {
      new Promise((resolve, reject) => {
        resolve(Market.findOne({}))
      }).then((element) => {
        res.status(200).json(element);
      }).catch((err) => {
        res.status(404).send('Not Found');
        console.log(err)
      })
    }

    GET.apiDoc = {
      summary: 'Get the market from the Database.',
      tags: ['Market'],
      operationId: 'getMarket',
      responses: {
        200: {
          description: 'The market of the system.',
          schema: {
            type: 'object',
            properties: {
                _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  demand: {
                    description: 'Demand of the market',
                    type: 'number',
                    format: 'float'
                  },
                  cep: {
                    description: 'Current Electricity Price of the market',
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
        let market = new Market({
            _id: req.body._id,
            demand: req.body.demand,
            cep: req.body.cep
        })
        market.save( (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        res.status(201).send('Created');
      }).catch( (err) => {
        console.log(err)
      })
    }

    POST.apiDoc = {
      summary: 'Create the market in the Database.',
      tags: ['Market'],
      operationId: 'createMarket',
      parameters: [
          {
              in: 'body',
              name: 'market',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      demand: {
                        description: 'Demand of the market',
                        type: 'number',
                        format: 'float'
                      },
                      cep: {
                        description: 'Current Electricity Price of the market',
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
        Market.findByIdAndUpdate(req.body._id, {
            demand: req.body.demand,
            cep: req.body.cep
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
      summary: 'Update the market in the Database.',
      tags: ['Market'],
      operationId: 'udpateMarket',
      parameters: [
          {
              in: 'body',
              name: 'market',
              schema: {
                type: 'object',
                properties: {
                    _id: {
                        description: 'ID',
                        type: 'string'
                      },
                      demand: {
                        description: 'Demand of the market',
                        type: 'number',
                        format: 'float'
                      },
                      cep: {
                        description: 'Current Electricity Price of the market',
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
        Market.findByIdAndDelete(req.query._id, (err) => {
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
      summary: 'Delete the market from the Database.',
      tags: ['Market'],
      operationId: 'deleteMarket',
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