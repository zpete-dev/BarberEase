import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ServiceAndProviderForm from './ServiceAndProviderForm';
import DateAndTimeForm from './DateAndTimeForm';
import ConfirmForm from './ConfirmForm';
import { providers } from '../data/data';
import { BookingFormHelper } from './BookingFormHelper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import '../Styles.css';

const BookAppointment = () => {
    const [sessionToken, setSessionToken] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const [barbers, setBarbers] = useState([]);

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(DateTime.now().setZone('America/Denver').toJSDate());
    const [subtotal, setSubtotal] = useState(0);
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const skeletonTimeout = 500; // timeout in ms

    useEffect(() => {
        console.log("Running useEffect.");

        const handleScroll = () => {
            // Set isScrolledDown to true if scrolled down from top, otherwise false
            setIsScrolledDown(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);

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

        const loadData = async () => {
            // Start loading and fetch data
            setIsLoading(true);
            
            const fetchBarbersPromise = fetchBarbers();
            const fetchSessionTokenPromise = aquireSessionToken();
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, skeletonTimeout));
    
            // Wait for both data fetching and timeout to complete
            await Promise.all([fetchBarbersPromise, fetchSessionTokenPromise, timeoutPromise]);
            setIsLoading(false);
        };
        loadData();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            console.log("Cleaning up BookAppointment Component.");
        };
    }, []);

    const goToStep = (step) => {
        if (currentStep >= step) {
            setCurrentStep(step);
        }
    };

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

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
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

    const summaryBox = () => {
        return (
            <div className='flex flex-col w-full mx-auto h-fit px-4 pt-2 pb-8 border border-black rounded shadow-lg text-[15px] bg-[#F4E1CD]'>
                <h3 className='text-[24px] font-bold underline mb-3 text-center'>Summary</h3>
                {/* Services Section lg */}
                <div className='text-start'>
                    <p className='font-bold text-[20px] mt-1'>Service(s)</p>
                    <hr className='border-gray-400 w-1/2 mb-3' />
                    <div className='mx-3 overflow-hidden'>
                        <div className={`${selectedServices.length === 0 ? 'max-h-7' : 'max-h-0'} delay-200 transition-[max-height] duration-500 ease-in-out overflow-hidden
                text-red-500 font-semibold text-[18px] text-center`}>
                            {"* Select 1 or more services *"}
                        </div>
                        <TransitionGroup className='service-summary'>
                            {selectedServices.map(serviceId => (
                                <CSSTransition
                                    key={serviceId}
                                    timeout={500}
                                    classNames="service-item">
                                    <div className={`flex justify-between mb-0.5 text-[18px] overflow-hidden`}>
                                        <p className=''>{BookingFormHelper(providers).getServiceNameById(serviceId)}</p>
                                        <p className='w-1/6 text-center'>{BookingFormHelper(providers).getServicePriceById(serviceId)}</p>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>
                    <div className='flex flex-col mt-3 mx-4 items-end'>
                        <hr className='border-gray-400 w-2/3' />
                        <div className='flex flex-row w-full mt-1 font-bold text-[18px] justify-end'>
                            <p className='w-fit mr-8'>Subtotal:</p>
                            <p className='flex w-1/6 justify-center'>${subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Providers Section lg */}
                <div className='text-start'>
                    <p className='font-bold text-[20px] mt-4'>Provider(s)</p>
                    <hr className='border-gray-400 w-1/2 mb-1.5' />
                    <div className='overflow-hidden'>
                        <div className={`${selectedProviders.length === 0 ? 'max-h-28' : 'max-h-0'} delay-200 transition-[max-height] duration-500 ease-in-out overflow-hidden
                text-red-500 font-semibold text-[18px] text-center flex flex-col `}>
                            {"* Select 1 or more providers *"}
                            {/* Top of Page */}
                            <button
                                onClick={scrollToBottom}
                                className={`${currentStep === 0 ? '' : 'hidden'} h-7 w-7 rounded-full text-white bg-licorice self-center mt-4 animate-bounce`}>
                                &#x2193; {/* Down Arrow */}
                            </button>
                        </div>
                        <TransitionGroup className='provider-summary'>
                            {selectedProviders.map(providerId => (
                                <CSSTransition
                                    key={providerId}
                                    timeout={300}
                                    classNames="provider-item">
                                    <div className='flex flex-row ml-3 mb-1 items-center overflow-hidden'>
                                        <img src={BookingFormHelper(barbers).getProviderPictureById(providerId)} alt={BookingFormHelper(providers).getProviderNameById(providerId)}
                                            className='h-[30px] w-[30px] rounded-full object-cover' />
                                        <p key={providerId} className='ml-2 text-[17px]'>
                                            {BookingFormHelper(barbers).getProviderNameById(providerId)}
                                        </p>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>
                </div>
                {/* When Section lg */}
                <div className={`text-start mt-4 ${(currentStep === 0 && selectedTime === null) ? 'max-h-0' : 'max-h-36'} transition-[max-height] duration-500 ease-in-out overflow-hidden`}>
                    <p className='font-bold text-[20px] mt-2'>When</p>
                    <hr className='border-gray-400 w-1/2 mb-1' />
                    <div className='flex ml-3'>
                        <img src='/images/calendar_icon.png' alt='Calendar Icon'
                            className='h-[30px] w-[30px] rounded-full object-cover mr-2' />
                        <div className='flex flex-col text-[17px] items-start'>
                            <div className='w-fit text-center'>
                                {selectedDate !== null ? (
                                    <p className='text-black underline'>
                                        <span>{selectedDate.toLocaleString(undefined, { weekday: "long" })} ~ </span>
                                        {/* <br /> */}
                                        <span>{selectedDate.toLocaleString(undefined, { month: "2-digit", day: "2-digit" })}</span>
                                    </p>
                                ) : (
                                    <p className='text-barberRed mt-2 text-center'>Select a date.</p>
                                )}
                                <p className={`text-black ${selectedTime !== null ? 'max-h-14' : 'max-h-0'} transition-[max-height] duration-300 ease-in-out overflow-hidden`}>
                                    <span>@</span>
                                    <br />
                                    <span className={`underline`}>{selectedTime !== null ? selectedTime : '00:00'}</span>
                                </p>
                            </div>
                            <p className={`text-barberRed mt-2 text-center font-semibold ${selectedTime !== null ? 'max-h-0' : 'max-h-10'} transition-[max-height] delay-100 duration-300 ease-in-out overflow-hidden`}>Select a time for your appointment.</p>
                        </div>
                    </div>
                </div>

                {/* Where Section lg */}
                <div className={`text-start mt-4 ${(currentStep === 2) ? 'max-h-36' : 'max-h-0'} transition-[max-height] duration-500 ease-in-out overflow-hidden`}>
                    <p className='font-bold text-[20px] mt-1'>Where</p>
                    <hr className='border-gray-400 w-1/2 mb-1' />
                    <div className='flex ml-3'>
                        <img src='/images/pin_icon.png' alt='Calendar Icon'
                            className='h-[30px] w-[30px] rounded-full object-cover mr-2' />
                        <div className='flex flex-col w-fit text-[17px]'>
                            <p className='text-md text-center'>12345 W Main St. STE 1000</p>
                            <p className='text-md text-center'>Denver, CO 80246</p>
                        </div>
                    </div>

                </div>
            </div>
        );
    };
    const renderSummaryBar = () => {
        if (isLoading) {
            return (
                <div className='flex items-center w-full justify-around text-[14px] sm:text-[16px]'>
                    {/* Back Button */}
                    <div className='flex flex-col'>
                        <p className='w-[56px] h-[36px] sm:w-[64px] sm:h-[44px] md:w-[80px] md:h-[50px]'>
                            <Skeleton circle className='z-0 h-full animate-pulse' />
                        </p>
                    </div>
                    {/* Service and Provider Count < md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : ''} ml-0.5 md:hidden`}>
                        {/* Validation Messages */}
                        <p className='w-[100px] sm:w-[140px]'>
                            <Skeleton className='z-0 animate-pulse' />
                        </p>
                        <p className="w-[100px] sm:w-[140px]">
                            <Skeleton className='z-0 animate-pulse' />
                        </p>
                    </div>
                    {/* Subtotal / Date & Time Display < md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'mr-0.5'} md:hidden text-center`}>
                        <p className="w-[100px] sm:w-[160px]">
                            <Skeleton className='z-0 animate-pulse' />
                        </p>
                    </div>
                    {/* Provider Summary = md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden h-[100px]`}>
                        <div className='flex flex-col items-center mt-1'>
                            <p className='w-[100px]'>
                                <Skeleton className='z-0 animate-pulse' />
                            </p>
                            <p className="w-[160px] h-[32px] mt-3">
                                <Skeleton className='z-0 h-full animate-pulse' />
                            </p>
                        </div>
                    </div>
                    {/* Vertical Break Line = md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden border-l-gray-300 border mx-1 h-[80px]`} />
                    {/* Service Summary = md*/}
                    <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden h-[100px]`}>
                        <div className='flex flex-col items-center mt-1'>
                            <p className='w-[100px]'>
                                <Skeleton className='z-0 animate-pulse' />
                            </p>
                            <p className="w-[160px] h-[32px] mt-3">
                                <Skeleton className='z-0 h-full animate-pulse' />
                            </p>
                        </div>
                    </div>
                    {/* Continue Button = md */}
                    <div className='flex flex-col'>
                        <p className='w-[56px] h-[36px] sm:w-[64px] sm:h-[44px] md:w-[80px] md:h-[50px]'>
                            <Skeleton circle className='z-0 h-full animate-pulse' />
                        </p>
                    </div>
                </div>
            );
        }
        return (
            <div className='flex items-center w-full justify-around text-[14px] sm:text-[16px]'>
                {/* Back Button */}
                <button className='flex bg-licorice text-carrotOrange px-2 py-2 rounded-2xl md:px-4' onClick={prevStep}>Back</button>
                {/* Service and Provider Count  < md*/}
                <div className={`${currentStep === 2 ? 'hidden' : ''} ml-0.5 md:hidden`}>
                    {/* Validation Messages */}
                    <CSSTransition
                        in={(selectedServices.length === 0)}
                        timeout={500}
                        unmountOnExit
                        classNames="md-summary-message">
                        <p className="text-red-500 overflow-hidden whitespace-nowrap">
                            {"Select 1 or more services"}
                        </p>
                    </CSSTransition>
                    <CSSTransition
                        in={selectedServices.length > 0}
                        timeout={500}
                        unmountOnExit
                        classNames="md-summary-message">
                        <p className='text-black overflow-hidden whitespace-nowrap'>
                            Service(s) - {selectedServices.length} Selected
                        </p>
                    </CSSTransition>
                    <CSSTransition
                        in={(selectedProviders.length === 0)}
                        timeout={500}
                        unmountOnExit
                        classNames="md-summary-message">
                        <p className="text-red-500 overflow-hidden">
                            {"Select 1 or more providers"}
                        </p>
                    </CSSTransition>
                    <CSSTransition
                        in={(selectedProviders.length > 0)}
                        timeout={500}
                        unmountOnExit
                        classNames="md-summary-message">
                        {selectedProviders.includes("Any") ? <p className='text-black overflow-hidden'>Provider(s) - Any Provider</p>
                            : <p className='text-black overflow-hidden'>Provider(s) - {selectedProviders.length} Selected</p>}
                    </CSSTransition>
                </div>
                {/* Subtotal / Date & Time Display < md*/}
                <div className={`${currentStep === 2 ? 'hidden' : 'mr-0.5'} md:hidden text-center`}>
                    <p className='text-black font-bold'>Subtotal: ${subtotal.toFixed(2)}</p>
                    <CSSTransition
                        in={(selectedTime !== null)}
                        timeout={500}
                        unmountOnExit
                        classNames="summary-date-time">
                        <p className='text-black overflow-hidden underline'>
                            {selectedDate.toLocaleString(undefined, { month: "2-digit", day: "2-digit" })} @
                            {selectedTime === null ? '12:00 AM' : selectedTime}
                        </p>
                    </CSSTransition>
                    <CSSTransition
                        in={(selectedTime === null && currentStep > 0)}
                        timeout={500}
                        unmountOnExit
                        classNames="summary-date-time">
                        <p className='text-barberRed overflow-hidden'>
                            Select a date & time
                        </p>
                    </CSSTransition>
                </div>
                {/* Provider Summary md*/}
                <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden h-[100px]`}>
                    <div className='flex flex-col text-center'>
                        <p className='font-semibold underline text-[17px] mb-0.5 '>Provider(s)</p>
                        <CSSTransition
                            in={(selectedProviders.length === 0)}
                            timeout={500}
                            unmountOnExit
                            classNames="md-summary-message">
                            <p className="text-red-500 overflow-hidden whitespace-nowrap">
                                {"*Select 1 or more providers*"}
                            </p>
                        </CSSTransition>
                        <TransitionGroup className='md-provider-summary'>
                            {selectedProviders.map(providerId => (
                                <CSSTransition
                                    key={providerId}
                                    timeout={400}
                                    classNames="md-provider-item">
                                    <div className='flex flex-row mb-1 overflow-hidden'>
                                        <img src={BookingFormHelper(barbers).getProviderPictureById(providerId)} alt={BookingFormHelper(barbers).getProviderNameById(providerId)}
                                            className='h-[24px] w-[24px] rounded-full object-cover' />
                                        <p key={providerId} className='ml-1.5 text-[15px]'>
                                            {BookingFormHelper(barbers).getProviderNameById(providerId)}
                                        </p>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>
                </div>
                {/* Vertical Break Line >= md*/}
                <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden border-l-gray-300 border mx-1 h-[80px]`} />
                {/* Service Summary >= md*/}
                <div className={`${currentStep === 2 ? 'hidden' : 'md:flex'} hidden h-[100px]`}>
                    <div className='flex flex-col text-center'>
                        <p className='underline font-semibold text-[17px] mb-0.5'>Service(s)</p>
                        <CSSTransition
                            in={(selectedServices.length === 0)}
                            timeout={500}
                            unmountOnExit
                            classNames="md-summary-message">
                            <p className="text-red-500 overflow-hidden whitespace-nowrap">
                                {"*Select 1 or more services*"}
                            </p>
                        </CSSTransition>
                        <TransitionGroup className='service-summary'>
                            {selectedServices.length <= 3 ?
                                selectedServices.map(serviceId => (
                                    <CSSTransition
                                        key={serviceId}
                                        timeout={500}
                                        classNames="service-item">
                                        <div key={serviceId} className='flex justify-around text-[15px] leading-[18px] overflow-hidden whitespace-nowrap'>
                                            <p className=''>{BookingFormHelper(barbers).getServiceNameById(serviceId)}</p>
                                            <p className='mx-1'>-</p>
                                            <p className='w-fit text-center'>{BookingFormHelper(barbers).getServicePriceById(serviceId)}</p>
                                        </div>
                                    </CSSTransition>
                                )) :
                                selectedServices.slice(0, 2).map(serviceId => (
                                    <CSSTransition
                                        key={serviceId}
                                        timeout={500}
                                        classNames="service-item">
                                        <div key={serviceId} className='flex justify-around text-[15px] leading-[18px] overflow-hidden whitespace-nowrap'>
                                            <p className=''>{BookingFormHelper(barbers).getServiceNameById(serviceId)}</p>
                                            <p className='mx-1'>-</p>
                                            <p className='w-fit text-center'>{BookingFormHelper(barbers).getServicePriceById(serviceId)}</p>
                                        </div>
                                    </CSSTransition>
                                ))
                            }
                        </TransitionGroup>
                        <CSSTransition
                            timeout={500}
                            in={selectedServices.length > 3}
                            unmountOnExit
                            classNames="service-item">
                            <div className='flex justify-around text-[15px] leading-[18px] overflow-hidden whitespace-nowrap'>
                                <p className=''>+{`${selectedServices.length - 2} More Services`}</p>
                                <p className='mx-1'>-</p>
                                <p className='w-fit text-center'>
                                    ${selectedServices.slice(2).reduce((acc, serviceId) => acc + parseFloat(BookingFormHelper(barbers).getServicePriceById(serviceId).replace(/[^0-9.-]+/g, "")), 0).toFixed(2)}
                                </p>
                            </div>
                        </CSSTransition>
                    </div>
                </div>

                {/* Vertical Break Line >= md*/}
                <div className={`${currentStep === 2 || (currentStep === 0 && selectedTime === null) ? 'hidden' :
                    'md:flex hidden border-l-gray-300 border mx-1 h-[80px]'}`}>
                </div>
                {/* Date & Time Summary >= md*/}
                <div className={`${currentStep === 2 || (currentStep === 0 && selectedTime === null) ? 'hidden' : 'md:flex hidden'} h-[100px]`}>
                    <div className='flex flex-col text-center'>
                        <p className='underline font-semibold text-[17px] mb-0.5 w-[152px]'>Date & Time</p>
                        <CSSTransition
                            in={(selectedTime !== null)}
                            timeout={500}
                            unmountOnExit
                            classNames="summary-date-time">
                            <p className='text-black text-center leading-[20px] overflow-hidden whitespace-nowrap'>
                                <u>{selectedDate.toLocaleString(undefined, { weekday: "long", month: "2-digit", day: "2-digit" })}</u>
                                <br />
                                <span>@</span>
                                <br />
                                <u>{selectedTime}</u>
                            </p>
                        </CSSTransition>
                        <CSSTransition
                            in={(selectedTime === null)}
                            timeout={500}
                            unmountOnExit
                            classNames="summary-date-time">
                            <p className='text-barberRed mt-2 text-center overflow-hidden whitespace-nowrap'>
                                Select a date & time.
                            </p>
                        </CSSTransition>
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
                    className={`${currentStep === 2 ? '' : 'hidden'} h-8 w-8 rounded-full text-white bg-licorice ${isScrolledDown ? 'animate-bounce' : ''}`}>
                    &#x2191; {/* Up Arrow */}
                </button>
            </div>
        );
    };

    const renderMainContentSection = () => {
        if (isLoading) {
            return (
                <div className='flex w-full justify-center'>
                    <div className='flex flex-col w-full lg:w-[58%] lg:px-5 lg:max-w-[900px] lg:mr-auto'>
                        {renderStep()}
                    </div>
                    <div className='hidden lg:flex flex-col w-[40%] h-[vmax]'>
                        {/* Summary Box lg */}
                        <div className='flex flex-col w-full mx-auto h-fit px-4 pt-2 pb-8 border border-black rounded shadow-lg bg-[#F4E1CD]'>
                            <h3 className='h-[32px] w-[150px] z-0 mb-3 self-center'>
                                <Skeleton className='z-0 h-full animate-pulse' />
                            </h3>
                            {/* Services Section lg */}
                            <div className='flex flex-col items-start'>
                                <p className='h-[32px] w-[100px] z-0 mt-1 mb-2'>
                                    <Skeleton className='z-0 h-full animate-pulse' />
                                </p>
                                <div className='w-full items-center'>
                                    <div className='h-[40px] w-11/12 mx-auto z-0'>
                                        <Skeleton className='h-full w-full animate-pulse' />
                                    </div>
                                </div>
                                <div className='flex flex-col w-full mt-3 items-end'>
                                    <div className='h-[32px] w-1/3 z-0'>
                                        <Skeleton className='h-full w-full animate-pulse' />
                                    </div>
                                </div>
                            </div>
                            {/* Providers Section lg */}
                            <div className='items-start mt-4'>
                                <p className='h-[32px] w-[100px] z-0 mt-1 mb-2'>
                                    <Skeleton className='z-0 h-full animate-pulse' />
                                </p>
                                <div className='flex flex-col mb-4'>
                                    <div className='w-full items-center'>
                                        <div className='h-[40px] w-11/12 mx-auto z-0'>
                                            <Skeleton className='h-full w-full animate-pulse' />
                                        </div>
                                    </div>
                                    {/* Bottom of Page */}
                                    <p className='w-[36px] h-[36px] mt-4 self-center'>
                                        <Skeleton circle className='z-0 h-full animate-pulse' />
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Continue Button lg */}
                        <div className='flex w-5/6 items-center mx-auto mt-10'>
                            <div className='w-full h-[60px] self-center'>
                                <Skeleton className='z-0 h-full rounded-3xl animate-pulse' />
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
        return (
            <div className='flex w-full justify-center'>
                <div className='flex flex-col w-full lg:w-[58%] lg:px-5 lg:max-w-[900px] lg:mr-auto'>
                    {renderStep()}
                    <div className={`${currentStep === 2 ? 'flex lg:hidden mt-8 md:max-w-[640px] md:mx-auto w-full' : 'hidden'}`}>
                        {summaryBox()}
                    </div>
                </div>
                <div className='hidden lg:flex flex-col w-[40%] h-[vmax]'>
                    {/* Summary Box lg */}
                    {summaryBox()}
                    {/* Continue Button lg */}
                    <div className='flex w-5/6 items-center mx-auto mt-10'>
                        <button
                            onClick={nextStep}
                            disabled={!allowContinue()}
                            className={`${currentStep === 2 ? 'hidden' : ''} w-full px-2 py-4 rounded-lg text-white text-[18px]  shadow-lg
                            ${allowContinue() ? 'bg-barberRed hover:bg-hoverRed' : 'bg-gray-500 hover:bg-gray-400 cursor-not-allowed'}`}>
                            Continue
                        </button>
                    </div>
                    {/* Top of Page */}
                    <button
                        onClick={scrollToTop}
                        className={`${currentStep === 0 ? '' : 'hidden'} h-7 w-7 rounded-full text-white bg-licorice self-center content-center mt-auto`}>
                        &#x2191; {/* Up Arrow */}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className=''>
            <div className='flex flex-col mx-auto p-4 mb-[80px] font-serif w-full
                            md:mb-[120px]
                            lg:mb-[20px]
                            xl:max-w-[1760px]'>
                <div className='flex flex-row h-fit
                                sm:items-center
                                md:w-[700px] md:relative md:self-center
                                lg:mx-auto lg:w-full lg:items-center'>
                    <div className='flex flex-row lg:w-[58%] lg:ml-auto'>
                        <button
                            onClick={prevStep}
                            className={`hidden sm:flex h-8 w-8 rounded-full text-white bg-licorice text-[20px] place-content-center mr-4`}>
                            &#x2190;{/* Left Arrow */}
                        </button>
                        <div className='flex justify-center space-x-1 text-[15px] items-center 
                        sm:text-[16px] sm:space-x-2
                        lg:text-[18px]'>
                            <div onClick={() => goToStep(0)} className={`${currentStep >= 0 ? 'cursor-pointer' : ''} ${currentStep === 0 ? 'text-black font-bold underline' : 'text-gray-400 underline'}`}>Service & Provider</div>
                            <div className='text-gray-400 font-bold'>{'>'}</div>
                            <div onClick={() => goToStep(1)} className={`${currentStep >= 1 ? 'cursor-pointer' : ''} ${currentStep === 1 ? 'text-black font-bold underline' : 'text-gray-400 underline'}`}>Date & Time</div>
                            <div className='text-gray-400 font-bold'>{'>'}</div>
                            <div onClick={() => goToStep(2)} className={`${currentStep >= 2 ? 'cursor-pointer' : ''} ${currentStep === 2 ? 'text-black font-bold underline' : 'text-gray-400 underline'}`}>Confirm</div>
                        </div>
                    </div>
                    <div className='ml-auto lg:w-[40%]'>
                        <Link to="/" className='flex bg-licorice relative ml-auto -top-4 -right-4 px-3 pb-3 pt-2 rounded-bl-2xl 
                                            sm:px-5 sm:py-4
                                            md:-top-4 md:ml-auto md:rounded-br-2xl md:pb-6
                                            lg:relative lg:right-[10%] lg:w-fit
                                            xl:px-8 xl:py-6'>
                            <div className='flex flex-col md:flex-row items-center'>
                                <img src='/images/BarberDogSymbol.png' alt='BarberDog Logo' className='h-[44px] w-[44px] sm:h-[56px] sm:w-[56px] md:mr-2 xl:h-[64px] xl:w-[64px] ' />
                                <div className=''>
                                    <span className='text-white text-xl font-serif text-justify'>Barber</span>
                                    <span className='text-barberRed text-xl font-serif'>Dog</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                {renderMainContentSection()}
            </div>

            <div className={`fixed bottom-0 left-0 right-0 bg-white h-[60px] flex lg:hidden items-center justify-around p-1 border-t-2 border-black 
                            md:mx-auto ${currentStep === 2 ? 'md:h-[72px]' : 'md:h-[100px]'} md:w-[720px] md:border-x-2 md:rounded-t-2xl z-50`}>
                {renderSummaryBar()}
            </div>
        </div >
    );
};

export default BookAppointment;
