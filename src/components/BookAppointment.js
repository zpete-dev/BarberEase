import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ServiceAndProviderForm from './ServiceAndProviderForm';
import DateAndTimeForm from './DateAndTimeForm';
import ConfirmForm from './ConfirmForm';
import { providers } from '../data/data';

const BookAppointment = () => {
    const [sessionToken, setSessionToken] = useState(null);
    const [barbers, setBarbers] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([]);

    useEffect(() => {
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



    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ServiceAndProviderForm nextStep={nextStep} providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                    selectedProviders={selectedProviders} setSelectedProviders={setSelectedProviders} />;
            case 2:
                return <DateAndTimeForm nextStep={nextStep} prevStep={prevStep} sessionToken={sessionToken}
                    selectedServices={selectedServices} selectedProviders={selectedProviders} />;
            case 3:
                return <ConfirmForm prevStep={prevStep} sessionToken={sessionToken}
                    selectedServices={selectedServices} selectedProviders={selectedProviders} />;
            default:
                return <ServiceAndProviderForm nextStep={nextStep} providers={barbers} sessionToken={sessionToken}
                    selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                    selectedProviders={selectedProviders} setSelectedProviders={setSelectedProviders} />;
        }
    };

    return (
        <div className=''>
            <div className='container mx-auto p-4 font-serif'>
                <div className='flex justify-center space-x-2 mb-6'>
                    <div className={currentStep === 1 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Service & Provider</div>
                    <div className='text-gray-400 font-bold'>{'>'}</div>
                    <div className={currentStep === 2 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Date & Time</div>
                    <div className='text-gray-400 font-bold'>{'>'}</div>
                    <div className={currentStep === 3 ? 'text-black font-bold underline' : 'text-gray-400 underline'}>Confirm</div>
                </div>
                {renderStep()}
            </div>
        </div>
    );
};

export default BookAppointment;
