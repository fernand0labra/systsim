// IDENTITY OBJECT DEFINITION
module.exports = class Identity {
    userID;
    userAddress;
    userPort;
    
    constructor(userID, userAddress, userPort) {
        this.userID = userID; // DB
        this.userAddress = userAddress;
        this.userPort = userPort;
    }
}


