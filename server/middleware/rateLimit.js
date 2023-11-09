const rateLimit = require('express-rate-limit');

const getApiLimiter = (maxRequests) => rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: maxRequests,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = getApiLimiter;