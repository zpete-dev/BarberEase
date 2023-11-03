const express = require('express');
const { body, param, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Barber = require('../models/Barber');
const router = express.Router();

// Apply Helmet to all routes in this router for security
router.use(helmet());

// Define API limitations
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all routes
router.use(apiLimiter);


// Get all barbers
router.get('/', async (req, res) => {
    try {
        const barbers = await Barber.find().exec(); // Use exec() to return a true Promise
        res.json({ success: true, barbers: barbers });
    } catch (err) {
        res.status(500).json({ msg: 'Server error occurred.' });
    }
});

// Get a specific barber's availability
router.get('/:barberId/availability', [
    param('barberId').isMongoId().withMessage('Invalid barber ID format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const barberId = sanitize(req.params.barberId);
        const barber = await Barber.findById(barberId).exec();
        if (!barber) {
            return res.status(404).json({ msg: 'Barber not found' });
        }
        res.json({ success: true, availability: barber.availability, barberName: barber.name });
    } catch (err) {
        res.status(500).json({ msg: 'Server error occurred.' });
    }
});

// POST - Add a new barber
router.post('/', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const sanitizedBody = sanitize(req.body);
        const newBarber = new Barber({
            name: sanitizedBody.name,
            availability: []  // Initially empty
        });

        const savedBarber = await newBarber.save();
        res.json({ success: true, barber: savedBarber });
    } catch (err) {
        res.status(500).json({ msg: 'Server error occurred.' });
    }
});

module.exports = router;
