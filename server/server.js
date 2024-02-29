require('dotenv').config();
const fs = require('fs');
//const https = require('https');
const app = require('./app'); // Import the app from app.js
const SERVERPORT = process.env.SERVERPORT || 4000; // Use the PORT from environment or default to 5000

app.listen(SERVERPORT, () => {
  console.log(`Server is running at http://localhost:${SERVERPORT}`);
});