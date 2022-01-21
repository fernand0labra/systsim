const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: Schema.Types.ObjectId,
    _account: Schema.Types.ObjectId,
    _identity: Schema.Types.ObjectId,
    _memberType: Schema.Types.ObjectId,
    loggedIn: Number
});

module.exports = mongoose.model('User', User);
