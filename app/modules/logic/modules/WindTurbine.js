module.exports = class WindTurbine {
    bufferSize;
    efficiency;
    bias;

    constructor(bufferSize, efficiency){
        this.bufferSize = bufferSize;
        this.efficiency = efficiency;
        this.bias = 3;
    }

    /**
     * Obtain the production of the wind turbine
     * 
     * @param {number} speed Speed of the wind
     * @returns Production of the wind turbine
     */
    production(speed){
        return speed * this.efficiency + this.bias;
    }

    /**
     * Obtain the buffer size of the wind turbine
     * 
     * @returns Buffer Size of the wind turbine
     */
    bufferSize(){
        return this.bufferSize;
    }

}