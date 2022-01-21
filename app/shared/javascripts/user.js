/**
 * Updates the user's page with new information
 */
function updateUser(){
    let updating = document.getElementById('updating').textContent

    if(updating=='0'){ // If the user does not want to update a value in the system
        let _id = document.getElementById('_id').innerHTML  
        document.getElementsByName('_id')[0].value = _id
        document.getElementsByName('_id')[1].value = _id
        document.getElementsByName('_id')[2].value = _id   
        document.getElementsByName('_id')[3].value = _id   

        let fullName = document.getElementById('_fullName').innerHTML;
        document.getElementsByName('fullName')[0].value = fullName;

        let memberType = document.getElementById('_memberType').innerHTML;
        document.getElementsByName('memberType')[0].value = memberType;

        let fullAddress = document.getElementById('_fullAddress').innerHTML;
        document.getElementsByName('fullAddress')[0].value = fullAddress;

        let port = document.getElementById('_port').textContent;
        document.getElementsByName('port')[0].value = port;

        document.getElementsByName('updating')[0].value = updating

        setTimeout(() => { // After 4 seconds refresh page  
            document.getElementById('getUser').submit()
        }, 4000)
    }
    else if(updating=='1'){ // If the user wants to update the under-production ratio
        document.getElementsByName('updating')[0].value = '0'
        changeUnder()
    } else{ // If the user wants to update the excessive-production ratio
        document.getElementsByName('updating')[0].value = '0'
        changeExcessive()
    }
}

/**
 * Asks the new under-production ratio to the user
 */
function askUnder() {
    let under = prompt("Introduce the new value for the under-production ratio");
    if(under!=null && !isNaN(under)){
        if(under<0 || under>1){
            alert('The value introduced is not correct')
        } else{
            document.getElementsByName('newUnder')[0].value = under
            document.getElementsByName('updating')[0].value = '1'
        }
    } else {
        alert('The value introduced is not correct')
    }
}

/**
 * Asks the new excessive-production ratio to the user
 */
function askExcessive(){
    let excessive = prompt("Introduce the new value for the excessive-production ratio");
    if(excessive!=null && !isNaN(excessive)){
        if(excessive<0 || excessive>1){
            alert('The value introduced is not correct')
        } else{
            document.getElementsByName('newExcessive')[0].value = excessive
            document.getElementsByName('updating')[0].value = '2'
        }
    } else {
        alert('The value introduced is not correct')
    }
}

/**
 * Change under-production ratio of the Power Plant
 */
function changeUnder(){
    let _manager = document.getElementById('_id').textContent
    document.getElementById('updateUnder').getElementsByTagName('input')[0].value = _manager

    let under = document.getElementById('newUnder').textContent
    document.getElementById('updateUnder').getElementsByTagName('input')[1].value = under

    let fullName = document.getElementById('_fullName').innerHTML;
    document.getElementById('updateUnder').getElementsByTagName('input')[2].value = fullName;

    let memberType = document.getElementById('_memberType').innerHTML;
    document.getElementById('updateUnder').getElementsByTagName('input')[3].value = memberType;

    let fullAddress = document.getElementById('_fullAddress').innerHTML;
    document.getElementById('updateUnder').getElementsByTagName('input')[4].value = fullAddress;

    let port = document.getElementById('_port').textContent;
    document.getElementById('updateUnder').getElementsByTagName('input')[5].value = port;

    // Submit the form
    document.getElementById('updateUnder').submit()
}

/**
 * Change excessive-production ratio of the Power Plant
 */
function changeExcessive(){
    let _manager = document.getElementById('_id').textContent
    document.getElementById('updateExcessive').getElementsByTagName('input')[0].value = _manager

    let excessive = document.getElementById('newExcessive').textContent
    document.getElementById('updateExcessive').getElementsByTagName('input')[1].value = excessive

    let fullName = document.getElementById('_fullName').innerHTML;
    document.getElementById('updateExcessive').getElementsByTagName('input')[2].value = fullName;

    let memberType = document.getElementById('_memberType').innerHTML;
    document.getElementById('updateExcessive').getElementsByTagName('input')[3].value = memberType;

    let fullAddress = document.getElementById('_fullAddress').innerHTML;
    document.getElementById('updateExcessive').getElementsByTagName('input')[4].value = fullAddress;

    let port = document.getElementById('_port').textContent;
    document.getElementById('updateExcessive').getElementsByTagName('input')[5].value = port;

    // Submit the form
    document.getElementById('updateExcessive').submit()
}