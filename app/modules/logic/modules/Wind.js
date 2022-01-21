const { default: NormalDistribution } = require('normal-distribution');

module.exports = class Wind {
    // Gaussian variables for distribution definition
    gaussianMean;
    gaussianDev;
    speedBase;

    constructor(gaussianMean, gaussianDev){
        this.gaussianMean = gaussianMean;
        this.gaussianDev = gaussianDev;
        this.speedBase = 30;
    }

    /**
     * Obtain the speed for a certain hour in day/month/year 
     * 
     * @param {number} hour
     * @param {number} day 
     * @param {number} month 
     * @param {number} year 
     * @returns Speed of the wind
     */
    async speed(hour, day, month, year){
        let value = year/1000 - month/day        
        let wsMean = new NormalDistribution(this.gaussianMean, this.gaussianDev);

        value = (hour - value)/hour
        let wsDay = new NormalDistribution(wsMean.pdf(value), this.gaussianDev);

        return wsDay.pdf(value) * this.speedBase;;
    }
}