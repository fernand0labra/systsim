var allowLogin = false;
var allowRegister = false;

/**
 * Login of a user
 * 
 * @param {Event} event 
 */
function login(event){
    if(!allowLogin){
        event.preventDefault() // Stop event
        allowLogin = true;

        let password = document.getElementsByName('password')[0].value // Obtain password
        let hashPwd = new Hashes.SHA1().b64(password) // Obtain hash
    
        document.getElementsByName('password')[0].value = '' // Reset password
        document.getElementsByName('hash')[0].value = hashPwd // Set hash

        // Submit form
        document.getElementById('loginForm').submit()
    } else{
        allowLogin=false;
    }
}   

/**
 * Registering of a user
 * 
 * @param {Event} event 
 */
function register(event){
    if(!allowRegister){
        event.preventDefault() // Stop event
        allowRegister = true;

        let password = document.getElementsByName('password')[0].value // Obtain password
        let hashPwd = new Hashes.SHA1().b64(password) // Obtain hash
    
        document.getElementsByName('password')[0].value = '' // Reset password
        document.getElementsByName('hash')[0].value = hashPwd // Set hash

        // Submit form
        document.getElementById('registerForm').submit()
    } else{
        allowRegister=false;
    }
};

