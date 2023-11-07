const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');

const BookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    customerEmail: {
        type: String,
        required: [true, 'Customer email is required'],
        match: [/.+@.+\..+/, 'Please enter a valid email'],
        trim: true,
        lowercase: true
    },
    customerPhone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'], // E.164 format
        trim: true
    },
    barberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barber',
        required: [true, 'Barber ID is required']
    },
    date: {
        type: Date,
        required: [true, 'Date of the booking is required']
    },
    slotTime: {
        type: String,
        required: [true, 'Time slot for the booking is required']
    },
    service: {
        type: String,
        required: [true, 'Service type is required'],
        trim: true
    }
});

// Data sanitization using mongo-sanitize
BookingSchema.pre('save', function (next) {
    const booking = this;
    Object.keys(booking.toObject()).forEach((key) => {
        booking[key] = sanitize(booking[key]);
    });
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
