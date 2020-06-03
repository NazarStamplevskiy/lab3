const mongoose = require('mongoose')

const Schema = mongoose.Schema

const passengerSchema = new Schema({
    name: { type: String, required: true, max: 50 },
    secondname: { type: String, required: true, max: 50 },
    passportNumber: { type: Number, required: true, unique: true, min: 1 },
})

module.exports = mongoose.model('Passenger', passengerSchema)
