const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bookingsRoutes = require('./routes/bookings');
const barbersRoutes = require('./routes/barbers');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
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
app.use('/api/users', usersRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello, BarberEase!');
});

module.exports = app;