import React from 'react';

const ConfirmForm = ({ prevStep }) => {
    return (
        <div>
            <h2>Confirm Details</h2>
            {/* Display summary of selected options */}
            <button onClick={prevStep}>Back</button>
            <button>Confirm Booking</button>
        </div>
    );
};

export default ConfirmForm;
