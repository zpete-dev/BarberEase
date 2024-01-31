import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { DateTime } from 'luxon';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css'
import '../CalendarStyles.css';
import '../Styles.css';

const DateAndTimeForm = ({ providers, sessionToken, selectedServices, selectedProviders, selectedTime, setSelectedTime, selectedDate, setSelectedDate }) => {
    const [availability, setAvailability] = useState([]);
    const [amTimes, setAmTimes] = useState([]);
    const [pmTimes, setPmTimes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const skeletonTimeout = 500; // timeout in ms
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

        const loadData = async () => {
            // Start loading and fetch data
            setIsLoading(true);
            const fetchDataPromise = fetchAvailability();
            const timeoutPromise = new Promise(resolve => setTimeout(resolve, skeletonTimeout));
    
            // Wait for both data fetching and timeout to complete
            await Promise.all([fetchDataPromise, timeoutPromise]);
            setIsLoading(false);
        };
    
        if (selectedProviders.length > 0) {
            loadData();
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
            <TransitionGroup className='flex flex-wrap text-[13px] h-fit
            sm:text-[14px]
            md:text-[15px]
            lg:text-[16px]'>
                {times.map(time => (
                    <CSSTransition
                        key={time}
                        timeout={500}
                        unmountOnExit
                        classNames="time-button">
                        <button
                            key={time}
                            className={`h-fit mb-1 mr-4 md:mr-5 lg:mr-6 p-2 md:px-3 lg:px-4 lg:py-3 border border-[#381E02] shadow-md rounded transition duration-150 ease-in-out
                ${selectedTime === time ? 'bg-carrotOrangeHover text-black' : 'bg-carrotOrange text-black'}
                ${selectedTime === time ? 'scale-110 border-opacity-50' : 'hover:bg-carrotOrangeHover border-opacity-0 hover:border-opacity-50 hover:scale-110'}`}
                            onClick={() => handleTimeSelect(time)}>
                            {time}
                            <div className={`${selectedTime === time ? 'flex' : 'hidden'} absolute -right-2 -top-2 h-5 w-5 items-center justify-center 
                    bg-licorice text-carrotOrange rounded-full sm:text-lg sm:w-6 sm:h-6`}>
                                ✓
                            </div>
                        </button>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        );
    };

    const renderDateAndTimeForm = () => {
        if (isLoading) {
            return (
                <div className='flex flex-col w-full text-center'>
                    <h2 className='mb-3 lg:mb-1 lg:mt-0 lg:text-start'>
                        <Skeleton className='h-8 max-w-[200px] lg:h-[40px] animate-pulse z-0' />
                    </h2>
                    <hr className='hidden lg:flex border-black w-7/12 mb-8' />
                    {/* Calendar Element */}
                    <div className='mx-auto mb-6 h-[410px] w-5/6 
                    sm:mb-8 sm:h-[450px]
                    md:w-[640px]
                    lg:w-full lg:mb-6 lg:h-[375px]'>
                        <Skeleton className='w-full h-full animate-pulse z-0' />
                    </div>
                    {/* Date Selected Text */}
                    <div className='flex mx-auto mb-6 h-fit w-5/6 items-center
                md:w-[640px]
                lg:w-full lg:mx-0'>
                        <hr className='border-gray-500 w-full mx-4' />
                        <div className='h-[28px] w-[220px]'>
                            <Skeleton className='w-full h-full animate-pulse z-0' />
                        </div>
                        <hr className='border-gray-500 w-full mx-4' />
                    </div>
                    {/* AM Time Selection Buttons */}
                    <div className='mx-auto mb-4 lg:mb-2 h-fit w-5/6
                md:w-[640px]
                lg:w-full'>
                        <h3 className="text-left my-2">
                            <Skeleton className='h-[28px] max-w-[75px] lg:h-[40px] animate-pulse z-0' />
                        </h3>
                        <hr className='border-black w-7/12 mb-3' />
                        <div className='flex flex-row gap-4'>
                            <div className='h-[36px] w-[64px] sm:h-[40px] sm:w-[80px] md:w-[90px] lg:h-[50px] lg:w-[95px]'>
                                <Skeleton className='w-full h-full animate-pulse z-0' />
                            </div>
                            <div className='h-[36px] w-[64px] sm:h-[40px] sm:w-[80px] md:w-[90px] lg:h-[50px] lg:w-[95px]'>
                                <Skeleton className='w-full h-full animate-pulse z-0' />
                            </div>
                        </div>
                    </div>

                    {/* PM Time Selection Buttons */}
                    <div className='mx-auto mb-4 lg:mb-2 h-fit w-5/6
                md:w-[640px]
                lg:w-full'>
                        <h3 className="text-left my-2">
                            <Skeleton className='h-[28px] max-w-[75px] lg:h-[40px] animate-pulse z-0' />
                        </h3>
                        <hr className='border-black w-7/12 mb-3' />
                        <div className='flex flex-row gap-4'>
                            <div className='h-[36px] w-[64px] sm:h-[40px] sm:w-[80px] md:w-[90px] lg:h-[50px] lg:w-[95px]'>
                                <Skeleton className='w-full h-full animate-pulse' />
                            </div>
                            <div className='h-[36px] w-[64px] sm:h-[40px] sm:w-[80px] md:w-[90px] lg:h-[50px] lg:w-[95px]'>
                                <Skeleton className='w-full h-full animate-pulse' />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className='flex flex-col w-full text-center'>
                <h2 className='text-2xl font-bold underline mb-4
            lg:text-3xl lg:text-left lg:no-underline lg:mb-1 lg:mt-0'>
                    Select Date & Time</h2>
                <hr className='hidden lg:flex border-black w-7/12 mb-8' />
                {/* Calendar Element */}
                <div className='mx-auto mb-6 sm:mb-8 h-fit w-5/6
            md:w-[640px]
            lg:w-full lg:mb-6' >
                    <Calendar
                        onChange={handleDateChange}
                        minDate={DateTime.now().setZone('America/Denver').toJSDate()}
                        value={selectedDate}
                        showNeighboringMonth={false}
                        maxDetail="month"
                    />
                </div>
                {/* Date Selected Text */}
                <div className='flex mx-auto mb-6 h-fit w-5/6 items-center
            md:w-[640px]
            lg:w-full lg:mx-0'>
                    <hr className='border-gray-500 w-full mx-4' />
                    {selectedDate !== null ? (
                        <p className='text-black text-xl w-fit whitespace-nowrap'>
                            <span className=''>{selectedDate.toLocaleString(undefined, { weekday: "long" })}</span>
                            <span>, </span>
                            <span>{selectedDate.toLocaleString(undefined, { month: "long" })} </span>
                            <span>{selectedDate.toLocaleString(undefined, { day: "2-digit" })}</span>
                            <span>, </span>
                            <span>{selectedDate.toLocaleString(undefined, { year: "numeric" })}</span>
                        </p>
                    ) : (
                        <p className='text-barberRed mt-2 text-center'>Select a date.</p>
                    )}

                    <hr className='border-gray-500 w-full mx-4' />
                </div>
                {/* AM Time Selection Buttons */}
                <div className='mx-auto mb-4 lg:mb-2 h-fit w-5/6
            md:w-[640px]
            lg:w-full'>
                    <h3 className="text-left text-lg my-2 font-semibold">Morning</h3>
                    <hr className='border-black w-7/12 mb-3' />
                    <div className='flex flex-row'>
                        <div className='w-0 h-12 lg:h-16' />
                        <CSSTransition
                            in={(amTimes.length === 0)}
                            timeout={500}
                            unmountOnExit
                            classNames="time-button-empty">
                            <div className={`overflow-hidden whitespace-nowrap text-gray-400 font-semibold text-[16px] lg:text-[18px] text-center h-fit`}>
                                {"* No time slots available for morning *"}
                            </div>
                        </CSSTransition>
                        {renderTimeButtons(amTimes)}
                    </div>
                </div>

                {/* PM Time Selection Buttons */}
                <div className='mx-auto mb-4 lg:mb-2 h-fit w-5/6
            md:w-[640px]
            lg:w-full'>
                    <h3 className="text-left text-lg my-2 font-semibold">Afternoon</h3>
                    <hr className='border-black w-7/12 mb-3' />
                    <div className='flex flex-row'>
                        <div className='w-0 h-12 lg:h-16' />
                        <CSSTransition
                            in={(pmTimes.length === 0)}
                            timeout={500}
                            unmountOnExit
                            classNames="time-button-empty">
                            <div className={`overflow-hidden whitespace-nowrap text-gray-400 font-semibold text-[16px] lg:text-[18px] text-center h-fit`}>
                                {"* No time slots available for afternoon *"}
                            </div>
                        </CSSTransition>
                        {renderTimeButtons(pmTimes)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        renderDateAndTimeForm()
    );
};

export default DateAndTimeForm;
