import React, { useState } from 'react';

const ConfirmationBanner = () => {
    // State to control the visibility of the banner
    const [isVisible, setIsVisible] = useState(true);

    // Function to hide the banner
    const handleClose = () => {
        setIsVisible(false);
    };

    // If the banner is not visible, don't render it
    if (!isVisible) {
        return null;
    }

    return (
        <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Your appointment has been successfully booked!
            <button onClick={handleClose} style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                X
            </button>
        </div>
    );
};

export default ConfirmationBanner;
