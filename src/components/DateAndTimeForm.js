import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { DateTime } from 'luxon';

import '../CalendarStyles.css';

const DateAndTimeForm = ({ nextStep, prevStep, sessionToken, selectedServices, selectedProviders }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const [timesForSelectedDate, setTimesForSelectedDate] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    //const times = ["10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm"];

    useEffect(() => {
        const fetchAvailability = async () => {
            let fullAvailability = [];
            for (const provider of selectedProviders) {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/barbers/${provider}/availability`, {
                    headers: {
                        'x-api-key': `${process.env.REACT_APP_API_KEY}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        data.availability.map(availability => {
                            if (availability.date in fullAvailability) {
                                availability.slots.map(timeSlot => {
                                    if (fullAvailability[availability.date].indexOf(timeSlot) === -1) {
                                        fullAvailability[availability.date].push(timeSlot);
                                    }
                                });
                            } else {
                                fullAvailability[availability.date] = availability.slots;
                            }
                        });
                    }
                }
            }
            console.log(fullAvailability);
            setAvailability(fullAvailability);
        };

        if (selectedProviders.length > 0) {
            fetchAvailability();
        }
        return () => {
            console.log("Cleaning up DateAndTimeForm Component.");
        };
    }, [selectedProviders]);

    const handleDateChange = (newDate) => {
        setSelectedTime(null);
        setSelectedDate(newDate);

        const dstOffset = (DateTime.fromJSDate(newDate).toJSDate().getTimezoneOffset())/60;
        const selectedDateMST = DateTime.fromJSDate(newDate).minus({ hours: dstOffset }).toJSDate().toISOString().split('T')[0] + 'T00:00:00.000Z';

        const availabilityForTheDay = availability[selectedDateMST];
        //console.log(availabilityForTheDay);
        if (availabilityForTheDay) {
            // If the day exists in the barber's availability
            setTimesForSelectedDate(availabilityForTheDay);

        } else {
            // If the day doesn't exist in the barber's availability, assume full availability (e.g., 9 AM - 3 PM)
            setTimesForSelectedDate(['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']);
        }
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && date > new Date()) {
            const dayAvailability = availability.find(avail => new Date(avail.date).toDateString() === date.toDateString());

            if (!dayAvailability) return <div style={{ backgroundColor: 'blue' }}></div>;
            if (dayAvailability && dayAvailability.slots.length > 0) return <div style={{ backgroundColor: 'blue' }}></div>;
            if (dayAvailability && dayAvailability.slots.length === 0) return <div style={{ backgroundColor: 'red' }}></div>;
        }
    };

    return (
        <div className='text-center'>
            <h2 className='text-2xl font-bold underline mb-4'>Select Date & Time</h2>

            {/* Calendar Element */}
            <div className='mx-auto mb-4' style={{ width: '424px', height: '324px' }}>
                <Calendar
                    onChange={handleDateChange}
                    tileContent={tileContent}
                    minDate={DateTime.now().setZone('America/Denver').toJSDate()}
                    value={selectedDate}
                    showNeighboringMonth={false}
                    maxDetail="month"
                />
            </div>

            {/* Time Selection Buttons */}
            <div className='grid grid-cols-4 gap-2 mb-4'>
                {timesForSelectedDate.length > 0 ? (
                    timesForSelectedDate.map(time => (
                        <button
                            key={time}
                            className={`p-2 border rounded ${selectedTime === time ? 'bg-licorice text-white' : 'bg-carrotOrange text-black'}`}
                            onClick={() => handleTimeSelect(time)}>
                            {time}
                        </button>
                    ))
                ) : selectedDate ? (
                    <h3>No available time slots for {selectedDate.toDateString()}.</h3>
                ) :
                    <h3>Please select a date.</h3>
                }

                {/*timesForSelectedDate.map(time => (
                    <button
                        key={time}
                        className={`p-2 border rounded ${selectedTime === time ? 'bg-licorice text-white' : 'bg-carrotOrange text-black'}`}
                        onClick={() => handleTimeSelect(time)}>
                        {time}
                    </button>
                ))*/}
            </div>

            {/* Navigation Buttons */}
            <button onClick={prevStep} className='mr-2'>Back</button>
            <button onClick={nextStep} disabled={!selectedTime} className='ml-2'>Next</button>
        </div>
    );
};

export default DateAndTimeForm;
