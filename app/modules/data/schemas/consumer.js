const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Consumer = new Schema({
    _id: Schema.Types.ObjectId,
    consumption: Number
});

module.exports = mongoose.model('Consumer', Consumer);