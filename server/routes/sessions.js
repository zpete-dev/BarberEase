const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
//Middleware Imports
const apiLimiter = require('../middleware/rateLimit.js');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Apply Helmet to all routes in this router for security
router.use(helmet());
// Apply the rate limiting middleware to all routes
router.use(apiLimiter(10));// max of 10 request every 15 minutes
// All routes require API Key
router.use(apiKeyAuth);

// POST - Gives Users a timelimit to make a valid booking
router.post('/', async (req, res) => {
    try {
        const token = jwt.sign(
            {}, // Payload is empty as you are not using any request data
            process.env.JWT_SECRET, // Secret is stored in an environment variable
            { expiresIn: '10m' } // Token validity
        );

        res.json({ success : true, token : token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error Generating Session Token');
    }
});

module.exports = router;
