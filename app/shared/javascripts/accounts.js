var allowDelete = false;
var allowCreate = false;

var goUser = false;
var goManager = false;

/**
 * Creates a member of the system
 * 
 * @param {Event} event 
 */
function createUser(event){
    if(!allowCreate){
        event.preventDefault() // Stop event
        allowCreate = true;

        var _manager = document.getElementById('_id').textContent
        
        var memberType = prompt("Introduce the type you want to create: 1 {Consumer} or 2 {Consumer & Producer}");
        if(memberType>0 && memberType<3){
            // Fill the fields of the form
            event.target.getElementsByTagName('input')[0].value = memberType
            event.target.getElementsByTagName('input')[1].value = _manager

            // Submit the form
            document.getElementById('createUser').submit()
        } else {
            alert('The value introduced is not correct')
            allowCreate = false;
        }
    } else{
        allowCreate=false;
    }
}

/**
 * Deletes a member of the system
 * 
 * @param {Event} event 
 */
function deleteUser(event){
    if(!allowDelete){
        event.preventDefault() // Stop event
        allowDelete = true;

        var _manager = document.getElementById('_id').textContent

        let rows = event.target.parentElement.querySelector('table').getElementsByTagName('tr')
        let header = rows[0].getElementsByTagName('th')[0].innerHTML
        var registered = header=='Username'

        if(registered){ // If the user is registered
            var _id = rows[1].getElementsByTagName('td')[0].innerHTML;
            var fullAddress = rows[2].getElementsByTagName('td')[0].innerHTML;
            var port = fullAddress.split(':')[1]
            var memberType = rows[3].getElementsByTagName('td')[0].innerHTML;
        } else{
            var _id = rows[0].getElementsByTagName('td')[0].innerHTML;
            var fullAddress = rows[1].getElementsByTagName('td')[0].innerHTML;
            var port = fullAddress.split(':')[1]
            var memberType = rows[2].getElementsByTagName('td')[0].innerHTML;
        }

        // Fill the fields of the form
        event.target.parentElement.getElementsByTagName('form')[1].getElementsByTagName('input')[0].value=memberType;
        event.target.parentElement.getElementsByTagName('form')[1].getElementsByTagName('input')[1].value=port;
        event.target.parentElement.getElementsByTagName('form')[1].getElementsByTagName('input')[2].value=_id;
        event.target.parentElement.getElementsByTagName('form')[1].getElementsByTagName('input')[3].value=_manager;

        // Submit the form
        event.target.parentElement.getElementsByTagName('form')[1].submit()
    } else{
        allowDelete=false;
    }
}

/**
 * Routes to the user's page for the manager
 * 
 * @param {Event} event
 */
 function toUser(event){
    if(!goUser){
        event.preventDefault(); // Stop event
        goUser = true;

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
        document.getElementById('getUpdate'+_id).submit()
    } else {
        goUser = false;
    }
}

/**
 * Routes to the manager's main page
 * 
 * @param {Event} event 
 */
function toManager(event){
    if(!goManager){
        event.preventDefault()
        goManager = true;

        var _id = document.getElementById('_id').textContent  
        var userSize = document.getElementById('userSize').textContent
        document.getElementsByName('_id')[userSize*2].value = _id

        document.getElementById('backManager').submit()
    } else{
        goManager=false;
    }
}