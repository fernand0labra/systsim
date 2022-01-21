const WindTurbine = require('../modules/WindTurbine')
const Consumer = require('./Consumer')

// PROSUMER OBJECT DEFINITION
module.exports = class Prosumer extends Consumer{
    windTurbine;

    constructor(consumer){
        super(consumer.identity, Math.random(), Math.random());
        this.windTurbine = new WindTurbine(40, 0.6);
    }

    /**
     * The production for a certain speed
     * 
     * @param {number} speed Speed of the wind
     * @returns The production of the wind turbine
     */
    production(speed){
        return this.windTurbine.production(speed);
    }

    /**
     * The buffer size of the wind turbine
     * 
     * @returns The size of the buffer
     */
    bufferSize(){
        return this.windTurbine.bufferSize();
    }
}