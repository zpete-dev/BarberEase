import React, { useState } from 'react';

const AddBooking = () => {
    const [booking, setBooking] = useState({ customerName: '', date: '', service: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooking(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(booking)
            });

            const data = await response.json();
            if (data.success) {
                // Reset the form or give some other indication of success
                setBooking({ customerName: '', date: '', service: '' });
                alert('Booking added successfully!');
            } else {
                alert(data.message || 'Something went wrong with AddBooking.');
            }
        } catch (error) {
            console.error("There was an error saving the booking", error);
        }
    }

    return (
        <div>
            <h2>Add Booking</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="customerName" value={booking.customerName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={booking.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Service:</label>
                    <input type="text" name="service" value={booking.service} onChange={handleChange} required />
                </div>
                <button type="submit">Add Booking</button>
            </form>
        </div>
    );
}

export default AddBooking;
