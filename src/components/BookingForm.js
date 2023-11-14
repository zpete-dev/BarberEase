import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation hook
import axios from 'axios';
import Popup from './Popup';

const BookingForm = ({ sessionToken, setSessionToken }) => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const location = useLocation(); // Access the location object
    const { selectedBarberName, selectedBarber, selectedDate, selectedSlot, selectedServiceName } = location.state || {};
    const [selectedDateString, setSelectedDateString] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [timeoutId, setTimeoutId] = useState();

    useEffect(() => {
        //let timeoutId;
        if (!location.state) {
            setSessionToken(null);
            navigate('/', { state: { bookingConfirmed: false } });
            return;
        }
        if (selectedDate && selectedDate instanceof Date) {
            const dateString = selectedDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            setSelectedDateString(dateString);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            console.log("Cleaning up BookingForm Component.");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/bookings`, bookingData, {
                headers: {
                    'x-api-key': `${process.env.REACT_APP_API_KEY}`,
                    'x-auth-token': sessionToken
                }
            });

            // Check for success response and navigate with state
            if (response.data.success) {
                console.log("Expiring token.");
                setSessionToken(null);
                navigate('/', { state: { bookingConfirmed: true } });
            } else {
                // Handle unsuccessful booking attempt
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setShowPopup(true);
                // Set a timeout to redirect after 5 seconds
                if (!timeoutId) {
                    const newTimeoutId = setTimeout(() => {
                        setShowPopup(false);
                        navigate('/');
                    }, 5000);
                    setTimeoutId(newTimeoutId); // Update the timeoutId state
                }
            } else {
                // Handle other types of errors (network error, server error, etc.)
                console.error("Error during booking:", error.message);
            }
        }
    };

    return (
        <div className="booking-layout">
            {showPopup && <Popup message="Invalid session, redirecting to homepage" onClose={() => setShowPopup(false)} />}
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
