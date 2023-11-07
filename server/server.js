require('dotenv').config();
const app = require('./app'); // Import the app from app.js
const PORT = process.env.PORT || 4000; // Use the PORT from environment or default to 5000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
