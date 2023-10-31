import React, { useState, useEffect } from 'react';

const EditBooking = ({ bookingId }) => {
    const [booking, setBooking] = useState({ name: '', date: '', service: '' });

    useEffect(() => {
        // Fetch the booking details when the component mounts
        const fetchBooking = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
                const data = await response.json();
                if (data.success) {
                    setBooking(data.booking);
                } else {
                    alert(data.message || 'Failed to fetch booking.');
                }
            } catch (error) {
                console.error("Error fetching the booking", error);
            }
        }

        fetchBooking();
    }, [bookingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBooking(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(booking)
            });

            const data = await response.json();
            if (data.success) {
                alert('Booking updated successfully!');
            } else {
                alert(data.message || 'Something went wrong with EditBooking.');
            }
        } catch (error) {
            console.error("There was an error updating the booking", error);
        }
    }

    return (
        <div>
            <h2>Edit Booking</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={booking.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={booking.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Service:</label>
                    <input type="text" name="service" value={booking.service} onChange={handleChange} required />
                </div>
                <button type="submit">Update Booking</button>
            </form>
        </div>
    );
}

export default EditBooking;
