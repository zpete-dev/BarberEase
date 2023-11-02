import React, { useState, useEffect } from 'react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/bookings');
                const data = await response.json();
                if (data.success) {
                    setBookings(data.bookings);
                } else {
                    alert(data.message || 'Failed to fetch bookings.');
                }
            } catch (error) {
                console.error("Error fetching the bookings", error);
            }
        }

        fetchBookings();
    }, []);

    return (
        <div>
            <h2>All Bookings</h2>
            <ul>
                {bookings.map(booking => (
                    <li key={booking._id}>
                        <strong>Name:</strong> {booking.customerName} <strong>Date:</strong> {booking.date} <strong>Service:</strong> {booking.service}
                        {/* Here, you can also add Edit and Delete buttons for each booking */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookingList;
