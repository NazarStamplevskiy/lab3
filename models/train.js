const mongoose = require('mongoose')

const Schema = mongoose.Schema

const trainSchema = new Schema({
    number: { type: String, required: true, max: 50 },
    rout: { type: String, required: true, max: 50 },
    seats: { type: Number, required: true, unique: true, min: 1 },
})

module.exports = mongoose.model('Train', trainSchema)
