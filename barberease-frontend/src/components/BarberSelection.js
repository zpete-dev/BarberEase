import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const BarberSelection = () => {
    const [barbers, setBarbers] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slotsForSelectedDate, setSlotsForSelectedDate] = useState([]);


    useEffect(() => {
        // Fetch barbers from the backend (assuming an endpoint exists for this)
        async function fetchBarbers() {
            const response = await fetch('http://localhost:5000/api/barbers');
            const data = await response.json();
            console.log(data);
            if (data.success && data.barbers) {
                setBarbers(data.barbers);
            }
        }
        fetchBarbers();
    }, []);

    const handleBarberSelection = async (event) => {
        const barberId = event.target.value;
        if (barberId) {
            // Fetch barber's availability (assuming an endpoint exists for this)
            const response = await fetch(`http://localhost:5000/api/barbers/${barberId}/availability`);
            const data = await response.json();
            setSelectedBarber(barberId);
            setAvailability(data.availability);
        } else {
            setSelectedBarber(null);
            setAvailability([]);
        }
        setSelectedDate(null); // Reset selected date when changing barber
    };

    const handleDateSelection = (date) => {

        setSelectedDate(date);
        const poopopy = new Date("2023-10-31T00:00:00.000+00:00");
        console.log(poopopy);
        console.log(poopopy.toLocaleDateString().split('T')[0]);
        console.log(poopopy.toISOString().split('T')[0]);
        console.log(date);
        const availabilityForTheDay = availability.find(avail =>
            new Date(avail.date).toISOString().split('T')[0] === date.toLocaleDateString().split('T')[0]// Make this works so it runs in any timezone
        );
        console.log(availabilityForTheDay);

        if (availabilityForTheDay) {
            // If the day exists in the barber's availability
            setSlotsForSelectedDate(availabilityForTheDay.slots);
            
        } else {
            // If the day doesn't exist in the barber's availability, assume full availability (e.g., 9 AM - 3 PM)
            setSlotsForSelectedDate(['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']);
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && date > new Date()) {
            const dayAvailability = availability.find(avail => new Date(avail.date).toDateString() === date.toDateString());

            if (!dayAvailability) return <div style={{ backgroundColor: 'blue' }}></div>; // full availability
            if (dayAvailability && dayAvailability.slots.length > 0) return <div style={{ backgroundColor: 'blue' }}></div>; // partial availability
            if (dayAvailability && dayAvailability.slots.length === 0) return <div style={{ backgroundColor: 'red' }}></div>; // no availability
        }
    };

    return (
        <div>
            <h2>Select a Barber</h2>
            <select onChange={handleBarberSelection} value={selectedBarber || ''}>
                <option value="">Select a barber</option>
                {barbers.map(barber => (
                    <option key={barber._id} value={barber._id}>
                        {barber.name}
                    </option>
                ))}
            </select>

            {selectedBarber && (
                <div>
                    <Calendar
                        onChange={handleDateSelection}
                        tileContent={tileContent}
                        minDate={new Date()} /* TODO: Have this create a date using the barbershop's local time*/
                    />

                    {selectedDate && (
                        <div>
                            {slotsForSelectedDate.length > 0 ? (
                                <div>
                                    <h3>Available time slots for {selectedDate.toDateString()}:</h3>
                                    <ul>
                                        {slotsForSelectedDate.map((slot, index) => (
                                            <li key={index}>{slot}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <h3>No available time slots for {selectedDate.toDateString()}.</h3>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};
