const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    customerPhone: {
        type: String,
        required: true
    },
    barberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    // Add more fields as necessary
});

module.exports = mongoose.model('Booking', BookingSchema);
