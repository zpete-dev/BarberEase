const express = require('express');
const Barber = require('../models/Barber');
const router = express.Router();

// Get all barbers
router.get('/', async (req, res) => {
    try {
        const barbers = await Barber.find();
        res.json({ success: true, barbers: barbers });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get a specific barber's availability
router.get('/:barberId/availability', async (req, res) => {
    try {
        const barber = await Barber.findById(req.params.barberId);
        if (!barber) {
            return res.status(404).json({ msg: 'Barber not found' });
        }
        res.json({ success: true, availability: barber.availability });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// POST - Add a new barber
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        const newBarber = new Barber({
            name,
            availability: []  // Initially empty
        });

        const savedBarber = await newBarber.save();
        res.json({ success: true, barber: savedBarber });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
