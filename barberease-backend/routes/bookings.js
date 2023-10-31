const express = require('express');
const router = express.Router();

// Get all bookings (placeholder for now)
router.get('/', (req, res) => {
    res.json({ msg: 'List of all bookings' });
});

module.exports = router;
