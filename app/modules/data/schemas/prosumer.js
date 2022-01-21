const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Prosumer = new Schema({
    _id: Schema.Types.ObjectId,
    _consumer: Schema.Types.ObjectId,   
    production: Number,
    blocked: Number,
    underRatio: Number,
    excessiveRatio: Number
});

module.exports = mongoose.model('Prosumer', Prosumer);