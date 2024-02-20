const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bookingsRoutes = require('./routes/bookings');
const barbersRoutes = require('./routes/barbers');
const sessionsRoutes = require('./routes/sessions');
const usersRoutes = require('./routes/users');

const app = express();

app.use(helmet());

// Define CORS options
const corsOptions = {
  origin: function (origin, callback) {
    //console.log("Origin received:", origin);  // This will print the origin received in the request
    const allowedOrigins = ['http://localhost:3000'];
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allowed HTTP methods
  allowedHeaders: ['x-auth-token', 'x-api-key', 'Content-Type'], // Allowed custom headers
  credentials: true, // Credentials are supported
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  maxAge: 1000, // Cache pre-flight response for 1 second
};

// Enable CORS pre-flight across all routes
app.options('*', cors(corsOptions));

// Apply CORS for all other requests
app.use(cors(corsOptions));

app.use(express.json());

const fs = require('node:fs');
let DB_PASSWORD = "";
try {
  const data = fs.readFileSync(process.env.DB_PASSWORD, 'utf8');
  DB_PASSWORD = data;
} catch (err) {
  console.error("Error loading Secret file");
}

const DB_USER = process.env.DB_USER;
//const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_OPTIONS = process.env.DB_OPTIONS;

const DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_OPTIONS}`;

//console.log(DB_URL);
//TODO - CHANGE ALL HARD CODED ADDRESS REFERENCES
// Connect to MongoDB
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// API routes
app.use('/api/bookings', bookingsRoutes);
app.use('/api/barbers', barbersRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/users', usersRoutes); //This route is intentionally not always on

// Root route
app.get('/', (req, res) => {
  res.send('Hello, BarberEase!');
});

module.exports = app;