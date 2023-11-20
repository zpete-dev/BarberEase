import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <div className="flex max-w-screen-xl mx-auto items-center p-2 sm:p-4 justify-between">
                <div className="home-link">
                    <Link to="/" className='font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl mr-2'>
                        BarberEase</Link>
                </div>
                <div className="book-link">
                    <a href="/book-appointment">
                        <button className='bg-black text-white px-1 sm:px-3 py-1 sm:py-2 h-10 w-[170px] rounded-md'>
                            Book Appointment</button>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
