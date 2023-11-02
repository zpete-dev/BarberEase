const mongoose = require('mongoose');

const BarberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    availability: [
        {
            date: Date,
            slots: [String] // e.g., ['9:00 AM', '10:00 AM', ...]
        }
    ]
});

module.exports = mongoose.model('Barber', BarberSchema);
