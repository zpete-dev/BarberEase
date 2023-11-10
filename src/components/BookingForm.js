import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation hook
import axios from 'axios'; // Make sure to install axios with npm install axios

const BookingForm = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const location = useLocation(); // Access the location object
    const { selectedBarberName, selectedBarber, selectedDate, selectedSlot, selectedService, selectedServiceName } = location.state || {};
    const [selectedDateString, setSelectedDateString] = useState('');

    useEffect(() => {
        if (selectedDate && selectedDate instanceof Date) {
            const dateString = selectedDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            setSelectedDateString(dateString);
        }
    }, [selectedBarberName, selectedBarber, selectedDate, selectedSlot, selectedService, selectedServiceName]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bookingData = {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phoneNumber,
            barberId: selectedBarber, // Ensure this is the ID, not the name
            date: selectedDate.toISOString(), // Ensure selectedDate is a Date object
            slotTime: selectedSlot,
            service: selectedServiceName
        };
        // Define the base URL for your backend server
        const BASE_URL = 'https://localhost:5000/api';

        try {
            const response = await axios.post(`${BASE_URL}/bookings`, bookingData, {
                headers: {
                    'x-api-key': `${process.env.REACT_APP_API_KEY}`
                }
            });
            // Check for success response and navigate with state
            if (response.data.success) {
                //console.log(`Booking created for ${bookingData.customerName} on ${bookingData.date.split('T')[0]} at ${bookingData.slotTime}.`);
                navigate('/', { state: { bookingConfirmed: true } });
            } else {
                // Handle unsuccessful booking attempt
            }
        } catch (error) {
            // Handle error (network error, server error, etc.)
        }
    };

    return (
        <div className="booking-layout">
            <div className="booking-info">
                <p>Booking your <strong>{selectedServiceName}</strong> with <strong>{selectedBarberName}</strong> on <strong>{selectedDateString}</strong> at <strong>{selectedSlot}</strong>.</p>
            </div>
            <div className="booking-form">
                <h2>Fill in your booking details</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </label>
                    <br />
                    <label>
                        Phone Number:
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                    </label>
                    <br />
                    <button type="submit">Submit Booking</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
