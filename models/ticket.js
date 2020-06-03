const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ticketSchema = new Schema({
    number: { type: String, required: true, max: 50 },
    price: { type: Number, required: true, min: 0 },
    passengerId: { type: Schema.Types.ObjectId, ref: 'Passenger', required: false },
    trainId: { type: Schema.Types.ObjectId, ref: 'Train', required: false },
    numberSeats: { type: String, required: true, max: 50 },
})

module.exports = mongoose.model('Ticket', ticketSchema)
