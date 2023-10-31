const express = require('express');
const Booking = require('../models/Booking');
const Barber = require('../models/Barber');
const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json({ success: true, bookings: bookings });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// POST - Create a new booking
router.post('/', async (req, res) => {
    const {
        customerName,
        customerEmail,
        customerPhone,
        barberId,
        date,
        slotTime,
        service
    } = req.body;

    try {
        successState = true;
        // Standardizing the date
        const standardizedDate = new Date(date);
        standardizedDate.setUTCHours(0, 0, 0, 0);

        const newBooking = new Booking({
            customerName,
            customerEmail,
            customerPhone,
            barberId,
            date: standardizedDate,
            slotTime,
            service
        });

        const savedBooking = await newBooking;
        //const savedBooking = await newBooking.save();

        // Update barber availability
        const barber = await Barber.findById(barberId);
        const availabilityForTheDay = barber.availability.find(avail => avail.date.toISOString() === standardizedDate.toISOString());

        if (availabilityForTheDay) {
            const slotIndex = availabilityForTheDay.slots.indexOf(slotTime);
            if (slotIndex > -1) {
                availabilityForTheDay.slots.splice(slotIndex, 1);
                await newBooking.save();
                await barber.save();
            } else {
                successState = false;
                // logic for booking request for a time already booked
            }
        } else {
            // Create a default slots array for 9 AM to 3 PM
            const defaultSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

            // Remove the booked slot from the default slots
            const bookedSlotIndex = defaultSlots.indexOf(slotTime);
            if (bookedSlotIndex > -1) {
                defaultSlots.splice(bookedSlotIndex, 1);
            }

            // Append the new availability object with the default slots (minus the booked slot) for that date
            barber.availability.push({
                date: standardizedDate,  // Assuming 'date' is a string in ISO format, we convert it to a Date object
                slots: defaultSlots
            });

            await newBooking.save();
            // Save the updated barber object to the database
            await barber.save();
        }

        res.json({ success: successState, booking: savedBooking });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// PUT - Update a booking by ID
router.put('/:id', async (req, res) => {
    const {
        customerName,
        customerEmail,
        customerPhone,
        barberId,
        date,
        slotTime,
        service
    } = req.body;

    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        booking.customerName = customerName;
        booking.customerEmail = customerEmail;
        booking.customerPhone = customerPhone;
        booking.barberId = barberId;
        booking.date = date;
        booking.slotTime = slotTime;
        booking.service = service;

        const updatedBooking = await booking.save();
        res.json({ success: true, booking: updatedBooking });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// DELETE - Remove a booking by ID
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        await booking.remove();
        res.json({ msg: 'Booking removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
