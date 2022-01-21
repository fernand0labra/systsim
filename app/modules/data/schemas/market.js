const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Market = new Schema({
    _id: Schema.Types.ObjectId,
    demand: Number,
    cep: Number
});

module.exports = mongoose.model('Market', Market);