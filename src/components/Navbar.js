import React, { useState } from 'react';

const Navbar = ({ currentSection }) => {
    const linkStyle = (section) => `rounded-lg px-2 py-1 transition-all ${currentSection === section ? 'bg-carrotOrange text-black' : 'hover:text-barberRed text-gray-300'
        }`;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            {/* Main Navbar for larger screens */}
            <div className={`hidden fixed top-0 left-0 right-0 bg-black md:opacity-95 text-white md:flex items-center justify-between px-4 py-1 z-50`}>
                <div className='flex items-center'>
                    <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[60px] w-[60px]' />
                    <span className='text-white text-xl font-serif font-bold'>Barber</span>
                    <span className='text-barberRed text-xl font-serif font-bold'>Dog</span>
                </div>
                <div className='flex flex-col md:flex-row gap-3 lg:gap-6 items-center text-gray-300'>
                    <a href="#home" className={linkStyle('home')}>Home</a>
                    <a href="#services" className={linkStyle('services')}>Services</a>
                    <a href="#gallery" className={linkStyle('gallery')}>Gallery</a>
                    <a href="#contact" className={linkStyle('contact')}>Contact</a>
                    <button className="bg-barberRed text-white hover:bg-hoverRed px-3 py-1 rounded">Book Now</button>
                </div>
            </div>

            <button className="md:hidden fixed top-4 left-4 w-14 h-14 bg-black opacity-95 z-50 rounded-2xl flex items-center justify-center" onClick={toggleMenu}>
                <span className="text-white text-3xl">☰</span>
                <div className={`${isMenuOpen ? 'flex' : 'hidden'} fixed top-0 left-0 bg-black md:opacity-95 text-white items-center justify-between px-4 py-1 z-50 gap-10`}>
                    <div className='flex flex-col items-center h-[360px] w-[360px]'>
                        <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[60px] w-[60px]' />
                        <div>
                            <span className='text-white text-2xl font-serif font-bold'>Barber</span>
                            <span className='text-barberRed text-2xl font-serif font-bold'>Dog</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 lg:gap-6 items-center text-gray-300'>
                        <a href="#home" className='hover:text-barberRed'>Home</a>
                        <a href="#services" className='hover:text-barberRed'>Services</a>
                        <a href="#gallery" className='hover:text-barberRed'>Gallery</a>
                        <a href="#contact" className='hover:text-barberRed'>Contact</a>
                        <button className="bg-barberRed text-white hover:bg-hoverRed px-3 py-1 rounded">Book Now</button>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default Navbar;
