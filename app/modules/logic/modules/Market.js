const axios = require('axios')

module.exports = class Market {
    demand;
    coinBase;
    currentElectricityPrice; // €/MWh

    constructor(){
        this.demand = 0;
        this.coinBase = 10;
        this.currentElectricityPrice = 0;
    }

    /**
     * Fills the demand attribute by summing the consumption of all the consumers
     */
    async fillDemand(){
      try {
          this.demand = 0;
          // Obtain consumers in the DB
          const res = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allConsumers')
          res.data.forEach( (consumer) => {
            this.demand = this.demand + consumer.consumption
          })
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Fills the cep attribute by operating over the production of all the prosumers
     */
    async calculateCEP(){
      try {
        let production = 0;
        // Obtain consumers in the DB
        const res = await axios.get('http://' + process.env.npm_package_config_ip + ':10001/allProsumers')
        res.data.forEach( (prosumer) => {
          console.log(prosumer)
          production = production + prosumer.production
        })
        this.currentElectricityPrice = (this.demand - production) * this.coinBase;
      } catch (err) {
          console.log(err);
      }
    }
}