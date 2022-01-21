var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    first_name: String,
    last_name: String,
    mail: String,
    admin: Number,
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

