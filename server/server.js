require('dotenv').config();
const fs = require('fs');
const https = require('https');
const app = require('./app'); // Import the app from app.js
const PORT = process.env.PORT || 4000; // Use the PORT from environment or default to 5000

const sslServer = https.createServer({
  key: fs.readFileSync('./ssl/barberease.key'),
  cert: fs.readFileSync('./ssl/barberease.crt'),
  ca: fs.readFileSync('./ssl/zpca.pem'), // CA certificate
  requestCert: true, // Request a certificate from clients
  //rejectUnauthorized: true // Only accept clients with valid certificates
}, app);

sslServer.listen(PORT, () => console.log(`Secure server on https://localhost:${PORT}`));