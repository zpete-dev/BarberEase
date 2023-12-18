import React, { useState } from 'react';
import ServiceAndProviderForm from './ServiceAndProviderForm';
import DateAndTimeForm from './DateAndTimeForm';
import ConfirmForm from './ConfirmForm';

const BookAppointment = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ServiceAndProviderForm nextStep={nextStep} />;
            case 2:
                return <DateAndTimeForm nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <ConfirmForm prevStep={prevStep} />;
            default:
                return <ServiceAndProviderForm nextStep={nextStep} />;
        }
    };

    return (
        <div className='container mx-auto p-4 font-serif'>
            <div className='flex justify-center space-x-2 mb-6'>
                <div className={currentStep >= 1 ? 'text-blue-500' : ''}>Service & Provider</div>
                <div className={currentStep >= 2 ? 'text-blue-500' : ''}>Date & Time</div>
                <div className={currentStep >= 3 ? 'text-blue-500' : ''}>Confirm</div>
            </div>
            {renderStep()}
        </div>
    );
};

export default BookAppointment;
