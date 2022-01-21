module.exports = function(title) {
    let operations = {
      GET
    };
  
    function GET(req, res, next) {
        res.render("home", { title: title }); 
    }

    GET.apiDoc = {
      summary: 'Show home page.',
      tags: ['Home'],
      operationId: 'getHomePage',
      responses: {
        200: {
          description: 'The HTML of the home page.',
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