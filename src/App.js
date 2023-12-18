// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
//import Navbar from './components/Navbar';
//import { BarberSelection } from './components/BarberSelection';
//import BookingForm from './components/BookingForm';
import BookAppointment from './components/BookAppointment';
import ConfirmationBanner from './components/ConfirmationBanner'; // import ConfirmationBanner
import LandingPage from './components/LandingPage';

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
        <>
            {showConfirmation && <ConfirmationBanner />}
            <LandingPage />
        </>
    )
};

function App() {
    const [sessionToken, setSessionToken] = useState(null);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
            </Routes>
        </Router>
    );

    /*return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book-appointment" element={<BarberSelection sessionToken={sessionToken} setSessionToken={setSessionToken} />} />
                <Route path="/booking-form" element={<BookingForm sessionToken={sessionToken} setSessionToken={setSessionToken} />} />
            </Routes>
        </Router>
    );*/
}

export default App;
