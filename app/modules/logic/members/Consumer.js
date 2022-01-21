const Identity = require('./Identity')
const { default: NormalDistribution } = require('normal-distribution');

// CONSUMER OBJECT DEFINITION
module.exports = class Consumer {  
    baseConsumption;
    identity;
    gaussian;

    constructor(identity, gaussianMean, gaussianDev){
        this.baseConsumption = 30;
        this.identity = new Identity(identity)
        this.gaussian = new NormalDistribution(gaussianMean, gaussianDev);
    }

    /**
     * Consumption for a certain day
     * 
     * @param {number} day The day of the consumption
     * @returns The consumption
     */
    consumption(day) {
        return this.baseConsumption + this.baseConsumption * this.gaussian.pdf(day/30);
    }
}

