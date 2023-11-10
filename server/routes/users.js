const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const helmet = require('helmet');
//Middleware Imports
const apiLimiter = require('../middleware/rateLimit.js');

// Apply Helmet to all routes in this router for security
router.use(helmet());
// Apply the rate limiting middleware to all routes
router.use(apiLimiter(5));// max of 5 request every 15 minutes

const adminApiKeyAuth = (req, res, next) => {
    const apiKey = req.header('x-api-admin-key');
    if (!apiKey) {
        return res.status(401).json({ msg: 'No API key provided' });
    }
    if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ msg: 'Invalid API key' });
    }
    next();
};
router.use(adminApiKeyAuth);

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id // Use user._id.toString() if your DB uses ObjectId
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET_ADMIN, // Secret is stored in an environment variable
            { expiresIn: '1h' }, // Token validity
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// POST - Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id // Use user._id.toString() if your DB uses ObjectId
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET_ADMIN, // Secret is stored in an environment variable
            { expiresIn: '1h' }, // Token validity
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
