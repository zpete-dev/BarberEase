import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { DateTime } from 'luxon';

import '../CalendarStyles.css';

const DateAndTimeForm = ({ providers, sessionToken, selectedServices, selectedProviders, selectedTime, setSelectedTime, selectedDate, setSelectedDate }) => {
    const [availability, setAvailability] = useState([]);
    const [timesForSelectedDate, setTimesForSelectedDate] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            let fullAvailability = [];
            let providerList = [];
            if (selectedProviders.includes("Any")) {
                for (const aProvider in providers) {
                    if (!(providers[aProvider]._id === "Any")) {
                        providerList.push(providers[aProvider]._id);
                    }
                }
            } else {
                providerList = selectedProviders;
            }
            for (const provider of providerList) {
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
            setAvailability(fullAvailability);

            const dstOffset = (DateTime.fromJSDate(selectedDate).toJSDate().getTimezoneOffset()) / 60;
            const selectedDateMST = DateTime.fromJSDate(selectedDate).minus({ hours: dstOffset }).toJSDate().toISOString().split('T')[0] + 'T00:00:00.000Z';
            const availabilityForTheDay = fullAvailability[selectedDateMST];
            if (availabilityForTheDay) {
                // If the day exists in the barber's availability
                setTimesForSelectedDate(availabilityForTheDay);
            } else {
                // If the day doesn't exist in the barber's availability, assume full availability (e.g., 9 AM - 3 PM)
                setTimesForSelectedDate(['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']);
            }
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
        const dstOffset = (DateTime.fromJSDate(newDate).toJSDate().getTimezoneOffset()) / 60;
        const selectedDateMST = DateTime.fromJSDate(newDate).minus({ hours: dstOffset }).toJSDate().toISOString().split('T')[0] + 'T00:00:00.000Z';
        console.log(newDate);


        setAvailabilityForTheDay(selectedDateMST);
    };

    const setAvailabilityForTheDay = (availabilityDate) => {
        const availabilityForTheDay = availability[availabilityDate];
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
            <div className='mx-auto mb-6 sm:mb-10 h-fit w-5/6 md:w-[640px]' >
                <Calendar
                    onChange={handleDateChange}
                    /* tileContent={tileContent} */
                    minDate={DateTime.now().setZone('America/Denver').toJSDate()}
                    value={selectedDate}
                    showNeighboringMonth={false}
                    maxDetail="month"
                />
            </div>

            {/* Time Selection Buttons */}
            <div className='grid grid-cols-4 gap-3 mb-4 w-5/6 mx-auto md:w-[640px]'>
                {timesForSelectedDate.length > 0 ? (
                    timesForSelectedDate.map(time => (
                        <button
                            key={time}
                            className={`shadow-md p-2 border rounded transform transition duration-150 ease-in-out text-[13px] sm:text-[14px]
                            ${selectedTime === time ? 'bg-carrotOrangeHover text-black' : 'bg-carrotOrange text-black'}
                            ${selectedTime === time ? 'scale-105' : 'hover:bg-carrotOrangeHover hover:scale-105'}`}
                            onClick={() => handleTimeSelect(time)}>
                            {time}
                            <div className={`${selectedTime === time ? 'flex' : 'hidden'} absolute -right-2 -top-2 h-5 w-5 items-center justify-center
                    bg-licorice text-carrotOrange rounded-full sm:text-lg sm:w-6 sm:h-6`}>
                                ✓
                            </div>
                        </button>
                    ))
                ) : selectedDate ? (
                    <h3>No available time slots for {selectedDate.toDateString()}.</h3>
                ) :
                    <h3>Please select a date.</h3>
                }
            </div>
        </div>
    );
};

export default DateAndTimeForm;
