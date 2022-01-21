const Identity = require('./Identity')

module.exports = class manager {
    identity;

    constructor(identity){
        this.identity = new Identity(identity);
    }
}