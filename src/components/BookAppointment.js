import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';

import ServiceAndProviderForm from './ServiceAndProviderForm';
import DateAndTimeForm from './DateAndTimeForm';
import ConfirmForm from './ConfirmForm';
import { providers } from '../data/data';

const BookAppointment = () => {
    const [sessionToken, setSessionToken] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const [barbers, setBarbers] = useState([]);

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(DateTime.now().setZone('America/Denver').toJSDate());
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        console.log("Running useEffect.");
        async function fetchBarbers() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/barbers`, {
                    headers: {
                        'x-api-key': `${process.env.REACT_APP_API_KEY}`
                    }
                });
                const data = await response.json();
                if (data.success && data.barbers) {
                    const barbersMap = new Map(data.barbers.map(item => [item.name, item]));
                    const providersFull = providers.map(item => {
                        if (barbersMap.has(item.name)) {
                            return { ...item, ...barbersMap.get(item.name) };
                        }
                        return item;
                    });
                    setBarbers(providersFull);
                }
            } catch (error) {
                // Handle error (network error, server error, etc.)
                console.error('Error fetching barbers from backend.');
            }
        }

        async function aquireSessionToken() {

            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/sessions`, {}, {
                    headers: {
                        'x-api-key': `${process.env.REACT_APP_API_KEY}`
                    }
                });
                const data = response.data;
                // Check for success response and navigate with state
                if (data.success) {
                    await setSessionToken(data.token);
                } else {
                    console.error('Could not generate JWT token.');
                }
            } catch (error) {
                // Handle error (network error, server error, etc.)
                console.error('Error navigating to BookingForm.');
            }
        }

        fetchBarbers();
        aquireSessionToken();

        //TODO Function to check backend pulse check??

        return () => {
            console.log("Cleaning up BookAppointment Component.");
        };
    }, []);

    const allowContinue = () => {
        switch (currentStep) {
            case 0:
                return (selectedServices.length > 0 && selectedProviders.length > 0);
            case 1:
                return (selectedDate != null && selectedTime != null);
            case 2:
                return (selectedServices.length > 0 && selectedProviders.length > 0);
            default:
                return (selectedServices.length > 0 && selectedProviders.length > 0);
        }
    }
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes the scrolling smooth
        });
    };

    const nextStep = () => {
        setCurrentStep((currentStep + 1) % 3)
    };
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        //console.log("Running renderStep. Current step: " + currentStep);
        switch (currentStep) {
            case 0:
                return <ServiceAndProviderForm providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                    selectedProviders={selectedProviders} setSelectedProviders={setSelectedProviders}
                    setSubtotal={setSubtotal} />;
            case 1:
                return <DateAndTimeForm sessionToken={sessionToken}
                    selectedServices={selectedServices} selectedProviders={selectedProviders}
                    selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                    selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
            case 2:
                return <ConfirmForm providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} subtotal={subtotal} selectedProviders={selectedProviders}
                    selectedDate={selectedDate} selectedTime={selectedTime} />;
            default:
                setCurrentStep(1);
                return <ServiceAndProviderForm providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                    selectedProviders={selectedProviders} setSelectedProviders={setSelectedProviders}
                    setSubtotal={setSubtotal} />;
        }
    };

    return (
        <div className=''>
            <div className='container mx-auto py-4 px-6 font-serif'>
                <div className='flex flex-row'>
                    <div className='flex justify-center space-x-2 mb-10 text-[15px] pt-4'>
                        <div className={currentStep === 0 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Service & Provider</div>
                        <div className='text-gray-400 font-bold'>{'>'}</div>
                        <div className={currentStep === 1 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Date & Time</div>
                        <div className='text-gray-400 font-bold'>{'>'}</div>
                        <div className={currentStep === 2 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Confirm</div>

                    </div>
                    <Link to="/" className='flex bg-licorice absolute top-0 right-0 px-3 pb-3 pt-2 rounded-bl-2xl'>
                        <div className='flex flex-col items-center'>
                            <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[44px] w-[44px]'/>
                            <div className=''>
                                <span className='text-white text-xl font-serif text-justify'>Barber</span>
                                <span className='text-barberRed text-xl font-serif'>Dog</span>
                            </div>
                        </div>
                    </Link>
                </div>
                {renderStep()}
            </div>

            <div className={`fixed bottom-0 left-0 right-0 bg-white h-[60px] flex items-center ${currentStep === 2 ? 'justify-around' : 'justify-between'} px-1 border-t-2 border-black`}>
                <div className='flex items-center'>
                    {/* Back Button */}
                    <button className='bg-licorice text-carrotOrange px-2 py-1 rounded' onClick={prevStep}>Back</button>
                    {/* Service and Provider Count */}
                    <div className={`${currentStep === 2 ? 'hidden' : ''} text-sm ml-1`}>
                        {/* Validation Messages */}
                        {selectedServices.length === 0 ? (
                            <p className="text-red-500">
                                {"Select 1 or more services"}
                            </p>
                        ) : <p className='text-black'>Service(s) - {selectedServices.length} Selected</p>}
                        {selectedProviders.length === 0 ? (
                            <p className="text-red-500">
                                {"Select 1 or more providers"}
                            </p>
                        ) : selectedProviders.includes("Any") ?
                            <p className='text-black'>Provider(s) - Any Provider Available</p> :
                            <p className='text-black'>Provider(s) - {selectedProviders.length} Selected</p>
                        }
                    </div>
                </div>

                <div className='flex items-center'>
                    {/* Subtotal Display */}
                    <div className={`${currentStep === 2 ? 'hidden' : ''}`}>
                        <p className='text-black font-bold mr-1 text-end'>Subtotal: ${subtotal.toFixed(2)}</p>
                        <p className={`${selectedTime !== null ? 'text-black' : currentStep > 0 ? 'text-barberRed' : 'hidden'} mr-1 underline text-center text-sm`}>
                            {`${selectedTime !== null ? `${selectedDate.toLocaleString(undefined,
                                { month: "2-digit", day: "2-digit" })} @ ${selectedTime}` :
                                currentStep > 0 ? 'Please select a date & time.' : ''}`}

                        </p>
                    </div>
                    {/* Continue Button */}
                    <button
                        onClick={nextStep}
                        disabled={!allowContinue()}
                        className={`${currentStep === 2 ? 'hidden' : ''} px-2 py-1 rounded text-white
                    ${allowContinue() ? 'bg-barberRed hover:bg-hoverRed' : 'bg-gray-500 hover:bg-gray-400 cursor-not-allowed'}`}>
                        Continue</button>
                    {/* Top of Page */}
                    <button
                        onClick={scrollToTop}
                        className={`${currentStep === 2 ? '' : 'hidden'} h-10 w-10 rounded-full text-white bg-licorice`}>
                        &#x2191; {/* Unicode for Up Arrow */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
