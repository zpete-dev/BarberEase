import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { DateTime } from 'luxon';

import '../CalendarStyles.css';

const DateAndTimeForm = ({ providers, sessionToken, selectedServices, selectedProviders, selectedTime, setSelectedTime, selectedDate, setSelectedDate }) => {
    const [availability, setAvailability] = useState([]);
    const [amTimes, setAmTimes] = useState([]);
    const [pmTimes, setPmTimes] = useState([]);

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
            for (let i = 0; i < 2; i++) {
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

                            //console.log(fullAvailability);
                            let asdfasdf = [];
                            //console.log(data.availability);
                            for (const myAvailability in data.availability) {
                                asdfasdf.push(data.availability[myAvailability].date);
                            }
                            //console.log(asdfasdf);
                            for (const myDate in fullAvailability) {
                                //console.log(`Date: ${myDate}`);
                                if (asdfasdf.indexOf(myDate) === -1) {
                                    fullAvailability[myDate] = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
                                }

                            }
                        }
                    }
                }
            }
            setAvailability(fullAvailability);

            const dstOffset = (DateTime.fromJSDate(selectedDate).toJSDate().getTimezoneOffset()) / 60;
            const selectedDateMST = DateTime.fromJSDate(selectedDate).minus({ hours: dstOffset }).toJSDate().toISOString().split('T')[0] + 'T00:00:00.000Z';
            setTimeButtonsByTimeArray(fullAvailability[selectedDateMST]);
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
        //console.log(newDate);

        setTimeButtonsByTimeArray(availability[selectedDateMST]);
    };

    const setTimeButtonsByTimeArray = (availabilityForTheDay) => {
        //console.log(availabilityForTheDay);
        let myTimesForSelectedDate = [];
        if (availabilityForTheDay) {
            // If the day exists in the barber's availability
            myTimesForSelectedDate = availabilityForTheDay;
        } else {
            // If the day doesn't exist in the barber's availability, assume full availability (e.g., 9 AM - 3 PM)
            myTimesForSelectedDate = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
        }
        const sortedTimes = myTimesForSelectedDate.sort((a, b) => DateTime.fromFormat(a, "h:mm a").toMillis() - DateTime.fromFormat(b, "h:mm a").toMillis());
        setAmTimes(sortedTimes.filter(time => time.includes("AM")));
        setPmTimes(sortedTimes.filter(time => time.includes("PM")));
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const renderTimeButtons = (times) => {
        return (
            <div className='flex flex-wrap gap-4'>
                {times.map(time => (
                    <button
                        key={time}
                        className={`shadow-md p-2 border border-[#381E02] rounded transform transition duration-150 ease-in-out text-[13px] sm:text-[14px]
                ${selectedTime === time ? 'bg-carrotOrangeHover text-black' : 'bg-carrotOrange text-black'}
                ${selectedTime === time ? 'scale-110 border-opacity-50' : 'hover:bg-carrotOrangeHover border-opacity-0 hover:border-opacity-50 hover:scale-110'}`}
                        onClick={() => handleTimeSelect(time)}>
                        {time}
                        <div className={`${selectedTime === time ? 'flex' : 'hidden'} absolute -right-2 -top-2 h-5 w-5 items-center justify-center
                    bg-licorice text-carrotOrange rounded-full sm:text-lg sm:w-6 sm:h-6`}>
                            ✓
                        </div>
                    </button>
                ))}
            </div>);
    };

    return (
        <div className='flex flex-col w-full text-center'>
            <h2 className='text-2xl font-bold underline mb-4'>Select Date & Time</h2>

            {/* Calendar Element */}
            <div className='mx-auto mb-6 sm:mb-10 h-fit w-5/6
            md:w-[640px]
            lg:w-full' >
                <Calendar
                    onChange={handleDateChange}
                    minDate={DateTime.now().setZone('America/Denver').toJSDate()}
                    value={selectedDate}
                    showNeighboringMonth={false}
                    maxDetail="month"
                />
            </div>
            {/* AM Time Selection Buttons */}
            <div className="time-selection-container">
                <h3 className="time-selection-header">Morning</h3>
                {renderTimeButtons(amTimes)}
            </div>

            {/* PM Time Selection Buttons */}
            <div className="time-selection-container">
                <h3 className="time-selection-header">Afternoon</h3>
                {renderTimeButtons(pmTimes)}
            </div>
        </div>
    );
};

export default DateAndTimeForm;
