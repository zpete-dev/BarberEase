import React, { useState, useEffect } from 'react';

import { BookingFormHelper } from './BookingFormHelper';

const ConfirmForm = ({ sessionToken, providers, selectedServices, subtotal, selectedProviders, selectedDate, selectedTime }) => {
    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [formattedPhone, setFormattedPhone] = useState('');

    // Email and phone validation functions
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        const regex = /^[0-9]{10}$/; // Simple validation for 10 digit number
        return regex.test(phone);
    };

    // Function to format phone number
    const formatPhoneNumber = (input) => {
        // Remove all non-numeric characters
        const numbers = input.replace(/[^\d]/g, '');

        // Format phone number
        if (numbers.length <= 3) {
            return `${numbers}`;
        } else if (numbers.length <= 6) {
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        } else {
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        }
    };

    useEffect(() => {
        const isValid = firstName.trim() !== '' && lastName.trim() !== '' &&
            validateEmail(email) && validatePhone(phone);
        setIsFormValid(isValid);
    }, [firstName, lastName, email, phone]);


    // Function to handle form submission
    const handleConfirmBooking = () => {
        if (!isFormValid) {
            setShowErrorMessage(true);
            return;
        }
        // Implementation for booking confirmation goes here
        console.log('Booking confirmed with:', { firstName, lastName, email, phone });
    };

    const handlePhoneChange = (e) => {
        const formattedInput = formatPhoneNumber(e.target.value);
        setPhone(formattedInput.replace(/[^\d]/g, '')); // Update original phone state with numbers only
        setFormattedPhone(formattedInput); // Update formatted phone state with formatted number
    };

    const inputBorderColor = (value) => {
        if (showErrorMessage) {
            switch (value) {
                case 0:
                    return firstName.length >= 2 ? 'border-gray-300' : 'border-red-500';
                case 1:
                    return lastName.length >= 2 ? 'border-gray-300' : 'border-red-500';
                case 2:
                    return validateEmail(email) ? 'border-gray-300' : 'border-red-500';
                case 3:
                    return validatePhone(phone) ? 'border-gray-300' : 'border-red-500';
                default:
                    return 'border-red-500';
            }
        }
        return 'border-gray-300';
    };

    return (
        <div className='text-center w-full'>
            <h2 className='text-3xl font-bold underline mb-4'>Confirm Appointment</h2>

            <div className='flex flex-col mx-auto w-full'>
                {/* Personal Information Form Box */}
                <div className='mx-auto w-full p-4 mb-4 border border-gray-300 rounded shadow-lg'>
                    <p className='text-center mb-3'>Complete the form below to <br /><strong>confirm your reservation.</strong></p>
                    <span className={`${showErrorMessage && (firstName.length < 2 || lastName.length < 2) ? '' : 'invisible'} 
                    text-red-500 text-sm text-left`}>- Please enter 2 or more characters</span>
                    <div className='flex flex-wrap justify-between mb-2'>
                        <label className='block w-[48%]'>
                            <span className="block text-left">First Name</span>
                            <input
                                type='text'
                                placeholder='First'
                                className={`p-2 sm:p-3 border ${inputBorderColor(0)} rounded mb-2 w-full`}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        <label className='block w-[48%]'>
                            <span className="block text-left">Last Name</span>
                            <input
                                type='text'
                                placeholder='Surname'
                                className={`p-2 sm:p-3 border ${inputBorderColor(1)} rounded mb-2 w-full`}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                    </div>
                    <label className='block w-full mb-2'>
                        <div className="flex items-center">
                            <span className="block text-left">Email</span>
                            {showErrorMessage && !validateEmail(email) && (
                                <span className="text-red-500 text-sm ml-2">- Please enter a valid email address</span>
                            )}
                        </div>
                        <input
                            type='email'
                            placeholder='you@example.com'
                            className={`p-2 sm:p-3 border ${inputBorderColor(2)} rounded w-full`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label className='block w-full mb-2'>
                        <div className="flex items-center">
                            <span className="block text-left">Phone</span>
                            {showErrorMessage && !validatePhone(phone) && (
                                <span className="text-red-500 text-sm ml-2">- Please enter a valid phone number</span>
                            )}
                        </div>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <span className='text-gray-500 text-sm'>+1</span>
                            </div>
                            <input
                                type='text'
                                placeholder='(xxx) xxx-xxxx'
                                className={`pl-10 p-2 sm:p-3 sm:pl-10 border ${inputBorderColor(3)} rounded w-full`}
                                value={formattedPhone}
                                onChange={handlePhoneChange}
                                maxLength={14}
                            />
                        </div>
                    </label>
                    {/* Error Message */}
                    {showErrorMessage && !isFormValid && (
                        <p className="text-red-500 mt-4">Please complete the form above.</p>
                    )}

                    <button
                        onClick={handleConfirmBooking}
                        className={`bg-barberRed text-white p-2 rounded mt-2
                                ${!isFormValid ? 'bg-red-400 hover:bg-red-300' : 'hover:bg-hoverRed shadow-lg shadow-carrotOrangeHover/90'}`}>
                        Confirm Booking
                    </button>
                </div>

                {/* Summary Box */}
                <div className='hidden mx-auto p-4 border border-black rounded shadow-lg w-5/6 lg md:w-[640px] text-[15px] xl:w-[40%]'>
                    <h3 className='text-xl font-bold underline mb-4'>Summary</h3>

                    {/* Providers Section */}
                    <div className='text-start'>
                        <p className='font-bold text-lg my-1'>Provider(s):</p>

                        {selectedProviders.map(providerId => (
                            <div className='flex flex-row ml-4 mb-1'>
                                <img src={BookingFormHelper(providers).getProviderPictureById(providerId)} alt={BookingFormHelper(providers).getProviderNameById(providerId)}
                                    className='h-[24px] w-[24px] rounded-full object-cover' />
                                <p key={providerId} className='ml-1 text-md'>
                                    {BookingFormHelper(providers).getProviderNameById(providerId)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* When Section */}
                    <div className='text-start mt-4'>
                        <p className='font-bold text-lg my-1'>When:</p>
                        <div className='flex flex-row ml-4'>
                            <p className=''>{selectedDate.toLocaleDateString()} at {selectedTime}</p>
                        </div>
                    </div>

                    {/* Where Section */}
                    <div className='text-start mt-4'>
                        <p className='font-bold text-lg my-1'>Where:</p>
                        <div className='flex flex-col ml-4 w-fit'>
                            <p className='text-md text-center'>12345 W Main St. STE 1000</p>
                            <p className='text-md text-center'>Denver, CO 80246</p>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className='text-start mt-4'>
                        <p className='font-bold text-lg my-1'>Service(s):</p>
                        <div className='mx-4'>
                            {selectedServices.map(serviceId => (
                                <div key={serviceId} className='flex justify-between my-1'>
                                    <p className='text-md'>{BookingFormHelper(providers).getServiceNameById(serviceId)}</p>
                                    <p className='w-1/6 text-center text-md'>{BookingFormHelper(providers).getServicePriceById(serviceId)}</p>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col mt-3 mx-4 items-end'>
                            <hr className='border-gray-300 w-1/6' />
                            <div className='flex flex-row w-full mt-1 font-bold justify-end'>
                                <p className='w-fit mr-2'>Subtotal:</p>
                                <p className='flex w-1/6 justify-center'>${subtotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmForm;
