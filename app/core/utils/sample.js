var axios = require('axios');

/**
 * Updates the information from the network
 *
 * @param {number[]} date The date used [Hour, Day, Month, Year]
 * @param {number[]} wInfo Wind Module Info [speedW]
 * @param {number[]} mInfo Market Module Info [demandM, cepM]
 * @param {number[]} ppInfo Power Plant Module Info [productionPP, consumptionPP, statusPP, mep_PP, cep_PP]
 * @param {any[][]} cInfo Consumers Info [consumptionsC, consumersPort]
 * @param {any[][]} pInfo Prosumers Info [consumptionsP, productionsP, prosumersPort]
 */
async function sample(date, wInfo, mInfo, ppInfo, cInfo, pInfo){
  update(date);

  /* ** Fill Wind information ** */

  // Obtain speed
  var r = await axios.get('http://localhost:4001/speed', {params: {
    date: date
  }})
  wInfo[0] = r.data

  
  /* ** Fill Market information ** */

    // Obtain demand
  r = await axios.get('http://localhost:4002/demand')
  mInfo[0] = r.data
  
  // Obtain current electricity price
  r = await axios.get('http://localhost:4002/cep')
  mInfo[1] = r.data
  
  /* ** Fill Power Plant information ** */

  // Obtain production
  r = await axios.get('http://localhost:4003/production')
  ppInfo[0] = r.data

  // Obtain consumption
  r = await axios.get('http://localhost:4003/consumption')
  ppInfo[1] = r.data

  // Obtain status
  r = await axios.get('http://localhost:4003/status')
  ppInfo[2] = r.data

  // Obtain modeled electricity price
  r = await axios.get('http://localhost:4003/mep')
  ppInfo[3] = r.data

  // Obtain current electricity price
  r = await axios.get('http://localhost:4003/cep')
  ppInfo[4] = r.data

  // Obtain ratio
  r = await axios.get('http://localhost:4003/electricityRatio')
  ppInfo[5] = r.data

  /* ** Fill Consumers information ** */

  let length = cInfo[1].length
  var index = 0;

  while(index < length) {
    port = cInfo[1][index]

    // Obtain consumption
    r = await axios.get('http://localhost:' + port.toString() + '/consumption', {params: 
      {
        day: date[1]
      }
    })
    cInfo[0].push(r.data)

    // Obtain memberType ID
    r = await axios.get('http://localhost:' + port.toString() + '/_memberType')
    cInfo[2].push(r.data)

    index++;
  }

  /* ** Fill Prosumers information ** */

  length = pInfo[2].length
  index = 0

  while(index < length) {
    port = pInfo[2][index]

    // Obtain consumption
    r = await axios.get('http://localhost:' + port.toString() + '/consumption', {params: 
      {
        day: date[1]
      }
    })
    pInfo[0].push(r.data)

    // Obtain production
    r = await axios.get('http://localhost:' + port.toString() + '/production', {params: 
      {
        date: date
      }
    })
    pInfo[1].push(r.data)
    
    // Obtain memberType ID
    r = await axios.get('http://localhost:' + port.toString() + '/_memberType')
    pInfo[3].push(r.data)
 
    index++;
  }
}

/**
 * Updates the date by adding one hour
 * 
 * @param {number[]} date The date used [Hour, Day, Month, Year]
 */
function update(date){
  /* ** HOURS ** */
  if(date[0]==24){ // Start a new day
    date[0]=1;
    date[1]+=1;
  } else{date[0]+=1;} // Next hour

  /* ** DAYS ** */
  if(date[1]==30){ // Start new month
    date[1]=1;
    date[2]+=1;
  } else{date[1]+=1;} // Next day
  
  /* ** MONTHS ** */
  if(date[2]==12){ // Start new year
    date[2]=1;
    date[3]+=1;
  }
}

module.exports = sample;