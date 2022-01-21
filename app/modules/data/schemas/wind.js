const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Wind = new Schema({
    _id: Schema.Types.ObjectId,
    speed: Number,
});

module.exports = mongoose.model('Wind', Wind);