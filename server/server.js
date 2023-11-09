require('dotenv').config();
const fs = require('fs');
const https = require('https');
const app = require('./app'); // Import the app from app.js
const PORT = process.env.PORT || 4000; // Use the PORT from environment or default to 5000

const sslServer = https.createServer({
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.cert'),
}, app);

sslServer.listen(PORT, () => console.log(`Secure server on https://localhost:${PORT}`));