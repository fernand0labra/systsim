var allowBlock = false;

var goAccounts = false;

/**
 * Updates the user's page for the manager with new information
 */
function updateUser(){
    var _manager = document.getElementById('_id').textContent

    let rows = document.getElementsByTagName('table')[0].getElementsByTagName('tr')
    let header = rows[0].getElementsByTagName('th')[0].innerHTML
    var registered = header=='Username'
    
    if(registered){ // If the user is registered
        var fullName = document.getElementsByTagName('h3')[0].innerHTML;
        var username = rows[0].getElementsByTagName('td')[0].innerHTML;
        var _id = rows[1].getElementsByTagName('td')[0].innerHTML;
        var fullAddress = rows[2].getElementsByTagName('td')[0].innerHTML;
        var memberType = rows[3].getElementsByTagName('td')[0].innerHTML;
    } else{
        var fullName = '';
        var username = '';
        var _id = rows[0].getElementsByTagName('td')[0].innerHTML;
        var fullAddress = rows[1].getElementsByTagName('td')[0].innerHTML;
        var memberType = rows[2].getElementsByTagName('td')[0].innerHTML;
    }

    // Fill the fields of the form
    document.getElementById('getUser').getElementsByTagName('input')[0].value=registered
    document.getElementById('getUser').getElementsByTagName('input')[1].value=fullName;
    document.getElementById('getUser').getElementsByTagName('input')[2].value=username;
    document.getElementById('getUser').getElementsByTagName('input')[3].value=_id;
    document.getElementById('getUser').getElementsByTagName('input')[4].value=fullAddress;
    document.getElementById('getUser').getElementsByTagName('input')[5].value=memberType;
    document.getElementById('getUser').getElementsByTagName('input')[6].value=_manager;

    (async function() {
        setTimeout(() => { // After 4 seconds refresh page 
            document.getElementById('getUser').submit()
        },4000)
    }());
}

/**
 * Block a user from selling to the market
 * 
 * @param {Event} event 
 */
function blockUser(event) {
    if(!allowBlock){
        event.preventDefault(); // Stop event
        allowUpdate = true;

        var _manager = document.getElementById('_id').textContent

        let rows = event.target.parentElement.querySelector('table').getElementsByTagName('tr')
        let header = rows[0].getElementsByTagName('th')[0].innerHTML
        var registered = header=='Username'
        
        if(registered){ // If the user is registered
            var fullName = event.target.parentElement.querySelector('h3').innerHTML;
            var username = rows[0].getElementsByTagName('td')[0].innerHTML;
            var _id = rows[1].getElementsByTagName('td')[0].innerHTML;
            var fullAddress = rows[2].getElementsByTagName('td')[0].innerHTML;
            var memberType = rows[3].getElementsByTagName('td')[0].innerHTML;
        } else{
            var fullName = '';
            var username = '';
            var _id = rows[0].getElementsByTagName('td')[0].innerHTML;
            var fullAddress = rows[1].getElementsByTagName('td')[0].innerHTML;
            var memberType = rows[2].getElementsByTagName('td')[0].innerHTML;
        }

        // Fill the fields of the form
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[0].value=registered
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[1].value=fullName;
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[2].value=username;
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[3].value=_id;
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[4].value=fullAddress;
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[5].value=memberType;
        event.target.parentElement.querySelector('form').getElementsByTagName('input')[6].value=_manager;

        // Submit the form
        document.getElementById('block').submit()
    } else{
        allowBlock=false;
    }
}

/**
 * Routes to the user account's page
 * 
 * @param {Event} event 
 */
function toAccounts(event){
    if(!goAccounts){
        event.preventDefault() // Stop event
        goAccounts = true;

        // Fill the fields of the form
        var _id = document.getElementById('_id').textContent  
        document.getElementsByName('_id')[1].value = _id

        // Submit the form
        document.getElementById('backManager').submit()
    } else{
        goAccounts=false;
    }
}