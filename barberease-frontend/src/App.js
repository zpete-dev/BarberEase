import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import BookingList from './components/BookingList';
import AddBooking from './components/AddBooking';
import { BarberSelection } from './components/BarberSelection';

function App() {
    return (
        <div className="App">
            <Navbar />
            {/* <BookingList /> */}
            <AddBooking />
            <BarberSelection />
            {/* <EditBooking bookingId={someBookingId} /> */}
            {/* Uncomment and provide a bookingId if you want to use the EditBooking component directly here. */}
        </div>
    );
}

export default App;
