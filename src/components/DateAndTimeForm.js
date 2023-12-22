import React, { useState } from 'react';
import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import '../CalendarStyles.css';

const DateAndTimeForm = ({ nextStep, prevStep }) => {
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);



    const times = ["10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm"];

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    return (
        <div className='text-center'>
            <h2 className='text-2xl font-bold underline mb-4'>Select Date & Time</h2>

            {/* Calendar Element */}
            <div className='mx-auto mb-4' style={{ width: '424px', height: '324px' }}>
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    showNeighboringMonth={false}
                    maxDetail="month"
                />
            </div>

            {/* Time Selection Buttons */}
            <div className='grid grid-cols-4 gap-2 mb-4'>
                {times.map(time => (
                    <button
                        key={time}
                        className={`p-2 border rounded ${selectedTime === time ? 'bg-licorice text-white' : 'bg-carrotOrange text-black'}`}
                        onClick={() => handleTimeSelect(time)}>
                        {time}
                    </button>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button onClick={prevStep} className='mr-2'>Back</button>
            <button onClick={nextStep} disabled={!selectedTime} className='ml-2'>Next</button>
        </div>
    );
};

export default DateAndTimeForm;
