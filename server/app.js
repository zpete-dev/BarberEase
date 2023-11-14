const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookingsRoutes = require('./routes/bookings');
const barbersRoutes = require('./routes/barbers');
const sessionsRoutes = require('./routes/sessions');
const usersRoutes = require('./routes/users');

const app = express();

//app.use(cors());
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

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/barberease', {
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