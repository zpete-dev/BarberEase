import React, { useState } from 'react';

export const BookingForm = ({ selectedBarber, availability }) => {
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleBooking = async () => {
        // Send booking details to the server
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                barberId: selectedBarber,
                date: /* selected date from the calendar */,
                slotTime: selectedTimeSlot,
                customerEmail: email,
                customerPhone: phone,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Booking successful!');
            // Send email and text confirmation here, or better, have the backend handle this
        } else {
            alert('Error booking slot.');
        }
    };

    return (
        <div>
            {/* Display available time slots from 'availability' here for the selected date */}
            {/* ... */}
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
            />
            <button onClick={handleBooking}>Book</button>
        </div>
    );
};
