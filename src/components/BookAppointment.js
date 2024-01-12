import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';

import ServiceAndProviderForm from './ServiceAndProviderForm';
import DateAndTimeForm from './DateAndTimeForm';
import ConfirmForm from './ConfirmForm';
import { providers } from '../data/data';
import { BookingFormHelper } from './BookingFormHelper';

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
                    setSelectedTime={setSelectedTime} setSelectedDate={setSelectedDate}
                    setSubtotal={setSubtotal} />;
            case 1:
                return <DateAndTimeForm providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} selectedProviders={selectedProviders}
                    selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                    selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
            case 2:
                return <ConfirmForm providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} subtotal={subtotal} selectedProviders={selectedProviders}
                    selectedDate={selectedDate} selectedTime={selectedTime} />;
            default:
                setCurrentStep(0);
                return <ServiceAndProviderForm providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                    selectedProviders={selectedProviders} setSelectedProviders={setSelectedProviders}
                    setSelectedTime={setSelectedTime} setSelectedDate={setSelectedDate}
                    setSubtotal={setSubtotal} />;
        }
    };

    return (
        <div className=''>
            <div className='flex flex-col mx-auto py-4 px-2  mb-[80px] md:mb-[120px] font-serif w-full'>
                <div className='flex flex-row sm:ml-4 md:self-center md:w-[700px] xl:w-[900px] md:relative'>
                    <div className='flex justify-center space-x-2 mb-10 mt-4 sm:mb-16 text-[15px] sm:text-[16px]'>
                        <div className={currentStep === 0 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Service & Provider</div>
                        <div className='text-gray-400 font-bold'>{'>'}</div>
                        <div className={currentStep === 1 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Date & Time</div>
                        <div className='text-gray-400 font-bold'>{'>'}</div>
                        <div className={currentStep === 2 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Confirm</div>

                    </div>
                    <Link to="/" className='flex bg-licorice absolute top-0 right-0 px-3 pb-3 pt-2 rounded-bl-2xl 
                                            sm:px-5 sm:py-4
                                            md:-top-4 md:rounded-br-2xl'>
                        <div className='flex flex-col md:flex-row items-center'>
                            <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[44px] w-[44px] sm:h-[56px] sm:w-[56px] md:mr-2' />
                            <div className=''>
                                <span className='text-white text-xl font-serif text-justify'>Barber</span>
                                <span className='text-barberRed text-xl font-serif'>Dog</span>
                            </div>
                        </div>
                    </Link>
                </div>
                {renderStep()}
            </div>

            <div className={`fixed bottom-0 left-0 right-0 bg-white h-[60px] flex items-center justify-around p-1 border-t-2 border-black 
                            md:mx-auto ${currentStep === 2 ? 'md:h-[72px]' : 'md:h-[100px]'} md:w-[720px] lg:w-[900px] md:border-x-2 md:rounded-t-2xl`}>
                <div className='flex items-center w-full justify-around text-[14px] sm:text-[16px]'>
                    {/* Back Button */}
                    <button className='flex bg-licorice text-carrotOrange px-2 py-2 rounded-2xl md:px-4' onClick={prevStep}>Back</button>
                    {/* Service and Provider Count  < md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : ''} ml-0.5 md:hidden`}>
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
                            <p className='text-black'>Provider(s) - Any Provider</p> :
                            <p className='text-black'>Provider(s) - {selectedProviders.length} Selected</p>
                        }
                    </div>
                    {/* Subtotal Display < md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'mr-0.5'} md:hidden`}>
                        <p className='text-black font-bold text-end'>Subtotal: ${subtotal.toFixed(2)}</p>
                        <p className={`${selectedTime !== null ? 'text-black' : currentStep > 0 ? 'text-barberRed' : 'hidden'} underline text-center`}>
                            {`${selectedTime !== null ? `${selectedDate.toLocaleString(undefined,
                                { month: "2-digit", day: "2-digit" })} @ ${selectedTime}` :
                                currentStep > 0 ? 'Select a date & time' : ''}`}

                        </p>
                    </div>
                    {/* Provider Summary >= md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden h-[100px]`}>
                        <div className='flex flex-col text-center'>
                            <p className='font-semibold underline text-[17px] mb-0.5'>Provider(s)</p>
                            {selectedProviders.map(providerId => (
                                <div className='flex flex-row  mb-1 text-[15px] leading-[18px]'>
                                    <img src={BookingFormHelper(barbers).getProviderPictureById(providerId)} alt={BookingFormHelper(barbers).getProviderNameById(providerId)}
                                        className='h-[24px] w-[24px] rounded-full object-cover' />
                                    <p key={providerId} className='ml-1.5 self-center'>
                                        {BookingFormHelper(barbers).getProviderNameById(providerId)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Vertical Break Line >= md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden border-l-gray-300 border mx-2 h-[80px]`} />
                    {/* Service Summary >= md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden h-[100px]`}>
                        <div className='flex flex-col text-center'>
                            <p className='underline font-semibold text-[17px] mb-0.5'>Service(s)</p>
                            {selectedServices.length <= 3 ?
                                selectedServices.map(serviceId => (
                                    <div key={serviceId} className='flex justify-around text-[15px] leading-[18px]'>
                                        <p className=''>+ {BookingFormHelper(barbers).getServiceNameById(serviceId)}</p>
                                        <p className='mx-1'>-</p>
                                        <p className='w-fit text-center'>{BookingFormHelper(barbers).getServicePriceById(serviceId)}</p>
                                    </div>
                                )) :
                                <>
                                    {selectedServices.slice(0, 2).map(serviceId => (
                                        <div key={serviceId} className='flex justify-around text-[15px] leading-[18px]'>
                                            <p className=''>+ {BookingFormHelper(barbers).getServiceNameById(serviceId)}</p>
                                            <p className='mx-1'>-</p>
                                            <p className='w-fit text-center'>{BookingFormHelper(barbers).getServicePriceById(serviceId)}</p>
                                        </div>
                                    ))}
                                    <div className='flex justify-around text-[15px] leading-[18px]'>
                                        <p className=''>+ {`${selectedServices.length - 2} More Services`}</p>
                                        <p className='mx-1'>-</p>
                                        <p className='w-fit text-center'>
                                            ${selectedServices.slice(2).reduce((acc, serviceId) => acc + parseFloat(BookingFormHelper(barbers).getServicePriceById(serviceId).replace(/[^0-9.-]+/g, "")), 0).toFixed(2)}
                                        </p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    {/* Vertical Break Line >= md*/}
                    <div className={`${currentStep === 2 || (currentStep === 0 && selectedTime === null) ? 'hidden' :
                        'md:flex hidden border-l-gray-300 border mx-2 h-[80px]'}`}>
                    </div>
                    {/* Date & Time Summary >= md*/}
                    <div className={`${currentStep === 2 || (currentStep === 0 && selectedTime === null) ? 'hidden' : 'md:flex hidden'} h-[100px]`}>
                        <div className='flex flex-col text-center'>
                            <p className='underline font-semibold text-[17px] mb-0.5'>Date & Time</p>
                            {selectedTime !== null ? (
                                <p className='text-black text-center'>
                                    <span>{selectedDate.toLocaleString(undefined, { weekday: "long" })}</span>
                                    <br />
                                    <span>{selectedDate.toLocaleString(undefined, { month: "2-digit", day: "2-digit" })} @ {selectedTime}</span>
                                </p>
                            ) : (
                                <p className='text-barberRed mt-2 text-center'>Select a date & time.</p>
                            )}
                        </div>
                    </div>

                    {/* Continue Button & Subtotal >= md */}
                    <div className='flex flex-col'>
                        <div className={`${currentStep === 2 ? 'hidden' : 'hidden md:flex'}  mb-3`}>
                            <p className='text-black font-bold text-end'>Subtotal: ${subtotal.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={nextStep}
                            disabled={!allowContinue()}
                            className={`${currentStep === 2 ? 'hidden' : ''} px-2 py-2 rounded text-white
                            ${allowContinue() ? 'bg-barberRed hover:bg-hoverRed' : 'bg-gray-500 hover:bg-gray-400 cursor-not-allowed'}`}>
                            Continue
                        </button>
                    </div>
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
