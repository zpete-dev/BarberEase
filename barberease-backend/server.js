const express = require('express');
const cors = require('cors');
const bookingsRoutes = require('./routes/bookings');
const barbersRoutes = require('./routes/barbers');

const app = express();
const PORT = 5000;
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/barberease', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use('/api/bookings', bookingsRoutes);
app.use('/api/barbers', barbersRoutes);

app.get('/', (req, res) => {
    res.send('Hello, BarberEase!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
