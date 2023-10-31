import React from 'react';

const Navbar = () => {
    return (
        <div className="navbar">
            <h1>BarberEase Admin</h1>
            <nav>
                <a href="/">Home</a> | <a href="/add">Add Booking</a>
            </nav>
        </div>
    );
}

export default Navbar;
