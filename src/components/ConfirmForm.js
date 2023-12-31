import React, { useState } from 'react';

import { BookingFormHelper } from './BookingFormHelper';

const ConfirmForm = ({ sessionToken, providers, selectedServices, subtotal, selectedProviders, selectedDate, selectedTime }) => {
    // State for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Function to handle form submission
    const handleConfirmBooking = () => {
        // Implementation for booking confirmation goes here
        console.log('Booking confirmed with:', { firstName, lastName, email, phone });
    };

    return (
        <div className='text-center'>
            <h2 className='text-3xl font-bold underline mb-4'>Confirm Appointment</h2>

            {/* Personal Information Form Box */}
            <div className='mx-auto p-4 mb-4 border border-gray-300 rounded shadow-lg max-w-md'>
                <p className='text-center mb-4'>Complete the form below to <br /><strong>confirm your reservation.</strong></p>
                <div className='flex flex-wrap justify-between mb-4'>
                    <input
                        type='text'
                        placeholder='First Name'
                        className='p-2 border border-gray-300 rounded mb-2 w-full md:w-48'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Last Name'
                        className='p-2 border border-gray-300 rounded mb-2 w-full md:w-48'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <input
                    type='email'
                    placeholder='Email'
                    className='p-2 mb-4 border border-gray-300 rounded w-full'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='tel'
                    placeholder='Phone'
                    className='p-2 mb-4 border border-gray-300 rounded w-full'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button
                    onClick={handleConfirmBooking}
                    className='bg-barberRed text-white p-2 rounded hover:bg-hoverRed'
                >
                    Confirm Booking
                </button>
            </div>

            {/* Summary Box */}
            <div className='mx-auto p-4 mb-20 border-2 border-black rounded shadow-lg max-w-md text-[15px]'>
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
                        <p className='font-bold w-1/3 mt-1'>Subtotal: ${subtotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmForm;
