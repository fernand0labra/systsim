const Consumer = require('../../../data/schemas/consumer')

module.exports = function() {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE
    };
  
    function GET(req, res, next) {
      new Promise((resolve, reject) => {
        Consumer.findById(req.query._id, (err, element) => {
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
      summary: 'Get a consumer from the Database.',
      tags: ['Consumer'],
      operationId: 'getConsumer',
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
          description: 'A consumer of the system.',
          schema: {
            type: 'object',
            properties: {
              _id: {
                description: 'ID',
                type: 'string'
              },
              consumption: {
                description: 'Consumption of the consumer',
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
        let consumer = new Consumer({
          _id: req.body._id,
          consumption: req.body.consumption
        })
        consumer.save( (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        res.status(201).send('Created');
      }).catch( (err) => {
        console.log(err)
      })
    }

    POST.apiDoc = {
      summary: 'Create a consumer in the Database.',
      tags: ['Consumer'],
      operationId: 'createConsumer',
      parameters: [
          {
              in: 'body',
              name: 'consumer',
              schema: {
                type: 'object',
                properties: {
                  _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  consumption: {
                    description: 'Consumption of the consumer',
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
        Consumer.findByIdAndUpdate(req.body._id, {
          consumption: req.body.consumption
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
      summary: 'Update a consumer in the Database.',
      tags: ['Consumer'],
      operationId: 'updateConsumer',
      parameters: [
          {
              in: 'body',
              name: 'consumer',
              schema: {
                type: 'object',
                properties: {
                  _id: {
                    description: 'ID',
                    type: 'string'
                  },
                  consumption: {
                    description: 'Consumption of the consumer',
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
        Consumer.findByIdAndDelete(req.query._id, (err) => {
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
      summary: 'Delete a consumer from the Database.',
      tags: ['Consumer'],
      operationId: 'deleteConsumer',
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