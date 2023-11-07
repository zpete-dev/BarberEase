const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

const BarberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Trims whitespace
        minlength: 2, // Minimum length
        set: v => sanitize(v) // Sanitize to prevent injection attacks
    },
    availability: [
        {
            date: {
                type: Date,
                required: true
            },
            slots: [{
                type: String,
                trim: true,
                set: v => sanitize(v)
            }]
        }
    ]
});

module.exports = mongoose.model('Barber', BarberSchema);
