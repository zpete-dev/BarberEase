// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import {BarberSelection} from './components/BarberSelection';
import BookingForm from './components/BookingForm';
import ConfirmationBanner from './components/ConfirmationBanner'; // import ConfirmationBanner

const HomePage = () => {
    const location = useLocation(); // Hook to access the current location
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        // Check if the location state has the `bookingConfirmed` property set to true
        if (location.state?.bookingConfirmed) {
            setShowConfirmation(true);
        }
        // Cleanup function to reset the confirmation state when the component unmounts or user navigates away
        return () => {
            setShowConfirmation(false);
        };
    }, [location]);

    return (
        <div>
            {showConfirmation && <ConfirmationBanner />}
            <h1>Welcome to our Barber Shop</h1>
            {/* Other content for the homepage can go here */}
        </div>
    );
};

function App() {
    const [sessionToken, setSessionToken] = useState(null);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/book-appointment" element={<BarberSelection sessionToken={sessionToken} setSessionToken={setSessionToken} />} />
                    <Route path="/booking-form" element={<BookingForm sessionToken={sessionToken} setSessionToken={setSessionToken} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
