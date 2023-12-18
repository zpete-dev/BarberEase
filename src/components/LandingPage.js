import React, { useState, useEffect, useRef } from 'react';
import LandingHome from './LandingHome';
import LandingServices from './LandingServices';
import LandingGallery from './LandingGallery';
import LandingContact from './LandingContact';
import Navbar from './Navbar';

const LandingPage = () => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [currentSection, setCurrentSection] = useState('');


    const homeRef = useRef(null);
    const servicesRef = useRef(null);
    const galleryRef = useRef(null);
    const contactRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            //70 px offset for navbar thickness
            const positions = {
                home: homeRef.current.offsetTop,
                services: servicesRef.current.offsetTop,
                gallery: galleryRef.current.offsetTop,
                contact: contactRef.current.offsetTop,
            };
            const scrollPosition = window.scrollY;

            if (servicesRef.current) {
                setShowNavbar(scrollPosition >= positions.services);
            }

            let current;
            if (scrollPosition >= positions.contact) {
                current = "contact";
            } else if (scrollPosition >= positions.gallery) {
                current = "gallery";
            } else if (scrollPosition >= positions.services) {
                current = "services";
            } else {
                current = "home";
            }

            setCurrentSection(current || '');
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll, { passive: true });
        };
    }, []);

    return (
        <div>
            {showNavbar && <Navbar currentSection={currentSection} />}
            <div ref={homeRef} id='home'>
                <LandingHome />
            </div>
            <div id='services' ref={servicesRef}>
                <LandingServices />
            </div>
            <div ref={galleryRef} id='gallery'>
                <LandingGallery />
            </div>
            <div ref={contactRef} id='contact'>
                <LandingContact />
            </div>
        </div>
    );
};

export default LandingPage;
