module.exports = class PowerPlant {
    buffer;
    production;
    consumption;
    plantStatus; // 0 stopped ;; 1 starting ;; 2 running

    coinBase;
    currentElectricityPrice; // €/MWh
    electricityRatio;

    constructor(production, consumption, bufferSize){
        this.buffer = new ArrayBuffer(bufferSize)
        this.production = production;
        this.consumption = consumption;
        this.plantStatus = 0;
        this.electricityRatio = 0.5;

        this.coinBase = 10;
        this.currentElectricityPrice = 45;
        this.modeledElectricityPrice = 40;
    }

    /**
     * Changes the status of the PowerPlant
     */
    changeStatus(){
        this.plantStatus += 1;
        if (this.plantStatus > 2) {
            this.plantStatus = 0;
        }
    }

    /**
     * Changes the current electricity price of the PowerPlant
     * 
     * @param {number} cep The current electricity price (CEP)
     */
    setCEP(cep){
        this.currentElectricityPrice = cep;
    }

    /**
     * Obtain the modeled electricity price of the PowerPlant
     * 
     * @returns The modeled electricity price (MEP)
     */
    getMEP(){
        return (this.production - this.consumption) * this.coinBase;
    }
}