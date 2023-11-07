// middleware/apiKeyAuth.js

const apiKeyAuth = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    
    if (!apiKey) {
      return res.status(401).json({ msg: 'No API key provided' });
    }
    
    if (apiKey !== process.env.API_KEY) {
      return res.status(403).json({ msg: 'Invalid API key' });
    }
  
    next();
  };
  
  module.exports = apiKeyAuth;
  