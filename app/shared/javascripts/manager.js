/**
 * Update the manager's page with new information
 */
function updateManager() {
    let updating = document.getElementById('updating').textContent

    if(updating=='0'){ // If the user does not want to update a value in the system
        let _id = document.getElementById('_id').innerHTML  
        document.getElementsByName('_id')[0].value = _id
        document.getElementsByName('_id')[1].value = _id
        document.getElementsByName('_id')[2].value = _id   
        document.getElementsByName('_id')[3].value = _id   

        document.getElementsByName('updating')[0].value = updating

        setTimeout(() => { // After 4 seconds refresh page  
            document.getElementById('getManager').submit()
        },4000)
    }
    else if(updating=='1'){ // If the user wants to update the ratio
        document.getElementsByName('updating')[0].value = '0'
        changeRatio()
    } else{ // If the user wants to update the price
        document.getElementsByName('updating')[0].value = '0'
        changePrice()
    }
}

/**
 * Asks the new ratio to the user
 */
function askRatio() {
    let ratio = prompt("Introduce the new value for the market/buffer value");
    if(ratio!=null && !isNaN(ratio)){
        if(ratio<0 || ratio>1){
            alert('The value introduced is not correct')
        } else{
            document.getElementsByName('newRatio')[0].value = ratio
            document.getElementsByName('updating')[0].value = '1'
        }
    } else {
        alert('The value introduced is not correct')
    }
}

/**
 * Asks the new price to the user
 */
function askPrice() {
    let price = prompt("Introduce the new value for the current electrical price");
    if(price!=null && !isNaN(price)){
        document.getElementsByName('newPrice')[0].value = price
        document.getElementsByName('updating')[0].value = '2'
    } else {
        alert('The value introduced is not correct')
    }
}

/**
 * Change ratio of the Power Plant
 */
function changeRatio(){
    let _manager = document.getElementById('_id').textContent
    let ratio = document.getElementById('newRatio').textContent

    // Fill the fields of the form
    document.getElementById('updateRatio').getElementsByTagName('input')[0].value = _manager
    document.getElementById('updateRatio').getElementsByTagName('input')[1].value = ratio

    // Submit the form
    document.getElementById('updateRatio').submit()
}

/**
 * Change the Current Electricity Price
 */
function changePrice(){
    let _manager = document.getElementById('_id').textContent
    let price = document.getElementById('newPrice').textContent

    // Fill the fields of the form
    document.getElementById('updatePrice').getElementsByTagName('input')[0].value = _manager
    document.getElementById('updatePrice').getElementsByTagName('input')[1].value = price

    // Submit the form
    document.getElementById('updatePrice').submit()
}