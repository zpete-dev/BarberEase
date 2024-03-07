import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({ currentSection }) => {
    const linkStyle = (section) => `rounded-lg px-2 py-1 transition-all duration-200 ease-in-out ${currentSection === section ? 'scale-110 bg-carrotOrange text-black'
        : 'text-gray-300 hover:text-white hover:text-shadow-sm hover:shadow-white'}`;

    const mdLinkStyle = (section) => `rounded-lg px-1 py-0.5 transition-all duration-200 ease-in-out ${currentSection === section ? 'bg-carrotOrange text-black'
        : 'text-gray-300 hover:text-white hover:text-shadow-sm hover:shadow-white'}`;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navbarRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        // Add click event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Remove event listener on cleanup
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navbarRef]);

    return (
        <div ref={navbarRef}>
            {/* Main Navbar for md+*/}
            <div className={` hidden fixed top-0 left-0 right-0 bg-licorice md: opacity-[0.98] text-white md:flex items-center justify-between px-4 py-1 z-50`}>
                <div className='flex items-center'>
                    <img src='/images/BarberDemo.png' alt='BarberDemo Logo' className='h-[60px] w-[60px] mr-2' />
                    <span className='text-white text-xl font-serif font-bold'>Barber</span>
                    <span className='text-barberRed text-xl font-serif font-bold'>Demo</span>
                </div>
                <div className='flex flex-col md:flex-row gap-3 lg:gap-6 items-center'>
                    <a href="#home" className={linkStyle('home')}>Home</a>
                    <a href="#services" className={linkStyle('services')}>Services</a>
                    <a href="#gallery" className={linkStyle('gallery')}>Gallery</a>
                    <a href="#contact" className={linkStyle('contact')}>Contact</a>
                    <a href="/book-appointment" className="transition-all duration-150 text-white bg-barberRed/80 hover:bg-barberRed hover:scale-105 px-3 py-1 rounded">Book Now</a>
                </div>
            </div>
            {/* Main Navbar for sm and smaller*/}
            <button className={`${isMenuOpen ? 'w-[90vw]' : ''} md:hidden max-w-[90vw] xs:max-w-md fixed top-4 left-4 bg-licorice opacity-[0.99] z-50 rounded-2xl flex overflow-hidden`} onClick={toggleMenu}>
                <div className='px-3 py-3'>
                    <div className={`${isMenuOpen ? 'rotate-45 translate-y-1' : ''} transition-all duration-200 bg-white w-6 h-[3px] mb-[6px]`} />
                    <div className={`${isMenuOpen ? 'opacity-0' : ''} transition-opacity duration-200 bg-white w-6 h-[3px] mb-[6px]`} />
                    <div className={`${isMenuOpen ? '-rotate-45 -translate-y-3.5' : ''} transition-all duration-200 bg-white w-6 h-[3px]`} />
                </div>
                <div className={`bg-licorice md:opacity-[0.98] text-white self-stretch w-screen rounded-2xl transition-all overflow-hidden whitespace-nowrap duration-300 ease-in-out
                ${isMenuOpen ? 'flex flex-col max-h-[400px] max-w-[416px] pt-2 pb-4 pr-6'
                        : 'max-h-0 max-w-0 p-0 m-0'} `}>
                    <div className={`flex flex-col items-center ${isMenuOpen ? 'mb-4' : 'mb-0'} transition-all duration-300`}>
                        <img src='/images/BarberDemo.png' alt='BarberDemo Logo' className='h-[60px] w-[60px]' />
                        <div>
                            <span className='text-white text-2xl font-serif font-bold'>Barber</span>
                            <span className='text-barberRed text-2xl font-serif font-bold'>Demo</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 lg:gap-6 items-center text-gray-300'>
                        <a href="#home" onClick={(e) => e.stopPropagation()} className={mdLinkStyle('home')}>Home</a>
                        <a href="#services" onClick={(e) => e.stopPropagation()} className={mdLinkStyle('services')}>Services</a>
                        <a href="#gallery" onClick={(e) => e.stopPropagation()} className={mdLinkStyle('gallery')}>Gallery</a>
                        <a href="#contact" onClick={(e) => e.stopPropagation()} className={mdLinkStyle('contact')}>Contact</a>
                        <a href="/book-appointment" className="text-white bg-barberRed/80 hover:bg-barberRed hover:scale-105 transition-all duration-150 px-3 py-1 rounded mt-2">Book Now</a>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default Navbar;
