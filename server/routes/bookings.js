const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Booking = require('../models/Booking');
const Barber = require('../models/Barber');
const sanitize = require('mongo-sanitize');
const helmet = require('helmet');
const router = express.Router();

//Middleware Imports
const auth = require('../middleware/auth');
const apiLimiter = require('../middleware/rateLimit.js');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Apply Helmet to all routes in this router for security
router.use(helmet());
// Apply the rate limiting middleware to all routes
router.use(apiLimiter);
// All routes require API Key
router.use(apiKeyAuth);

// Define a reusable validation middleware for bookings
const validateBooking = [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Invalid email format'),
    body('customerPhone').trim().isMobilePhone('any', {strictMode: false}).withMessage('Invalid phone number format'),
    body('barberId').trim().notEmpty().withMessage('Barber ID is required'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('slotTime').trim().notEmpty().withMessage('Slot time is required'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateBookingId = [
    param('id').trim().isMongoId().withMessage('Invalid booking ID'),
];

// Get all bookings
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json({ success: true, bookings: bookings });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// POST - Create a new booking
router.post('/', validateBooking, async (req, res) => {
    // Sanitize input to prevent NoSQL injection
    const sanitizedBody = sanitize(req.body);

    const {
        customerName,
        customerEmail,
        customerPhone,
        barberId,
        date,
        slotTime,
        service
    } = sanitizedBody;

    // Validate input data (basic validation)
    if (!customerName || !customerEmail || !customerPhone || !barberId || !date || !slotTime || !service) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        successState = true;

        // Standardizing the date
        const standardizedDate = new Date(date);
        standardizedDate.setUTCHours(0, 0, 0, 0);

        const newBooking = new Booking({
            customerName,
            customerEmail,
            customerPhone,
            barberId,
            date: standardizedDate,
            slotTime,
            service
        });

        const savedBooking = newBooking;

        // Update barber availability
        const barber = await Barber.findById(barberId);
        const availabilityForTheDay = barber.availability.find(avail => avail.date.toISOString() === standardizedDate.toISOString());

        if (availabilityForTheDay) {
            const slotIndex = availabilityForTheDay.slots.indexOf(slotTime);
            if (slotIndex > -1) {
                availabilityForTheDay.slots.splice(slotIndex, 1);
                await newBooking.save();
                await barber.save();
            } else {
                successState = false;
                // logic for booking request for a time already booked
            }
        } else {
            // Create a default slots array for 9 AM to 3 PM
            const defaultSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

            // Remove the booked slot from the default slots
            const bookedSlotIndex = defaultSlots.indexOf(slotTime);
            if (bookedSlotIndex > -1) {
                defaultSlots.splice(bookedSlotIndex, 1);
            }

            // Append the new availability object with the default slots (minus the booked slot) for that date
            barber.availability.push({
                date: standardizedDate,  // Assuming 'date' is a string in ISO format, we convert it to a Date object
                slots: defaultSlots
            });

            await newBooking.save();
            // Save the updated barber object to the database
            await barber.save();
        }

        res.json({ success: successState, booking: savedBooking });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// PUT - Update a booking by ID
router.put('/:id', validateBookingId, auth, async (req, res) => {

    const sanitizedBody = sanitize(req.body);

    const {
        customerName,
        customerEmail,
        customerPhone,
        barberId,
        date,
        slotTime,
        service
    } = sanitizedBody;


    try {
        let booking = await Booking.findById(barberId);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        booking.customerName = customerName;
        booking.customerEmail = customerEmail;
        booking.customerPhone = customerPhone;
        booking.barberId = barberId;
        booking.date = date;
        booking.slotTime = slotTime;
        booking.service = service;

        const updatedBooking = await booking.save();
        res.json({ success: true, booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// DELETE - Remove a booking by ID
router.delete('/:id', validateBookingId, auth, async (req, res) => {
    try {
        const booking = await Booking.findById(barberId);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        await booking.remove();
        res.json({ msg: 'Booking removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
