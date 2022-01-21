const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Identity = new Schema({
    _id: Schema.Types.ObjectId,
    address: String,
    port: Number
});

module.exports = mongoose.model('Identity', Identity);