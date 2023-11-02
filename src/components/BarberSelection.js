import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

export const BarberSelection = () => {
    const [barbers, setBarbers] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedBarberName, setSelectedBarberName] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slotsForSelectedDate, setSlotsForSelectedDate] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedService, setSelectedService] = useState('');

    const services = [
        { id: 'cut', name: 'Hair Cut' },
        { id: 'shave', name: 'Shave' },
        // ... other services
    ];

    const navigate = useNavigate();

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
            setSelectedBarberName(data.barberName);
            setAvailability(data.availability);
        } else {
            setSelectedBarber(null);
            setSelectedBarberName(null);
            setAvailability([]);
        }
        setSelectedSlot(null);
        setSelectedDate(null); // Reset selected date when changing barber
    };

    const handleDateSelection = (date) => {
        setSelectedSlot(null); // Add logic to not clear selected slot when clicking the same date
        setSelectedDate(date);

        //Finding availability keeping everything in America/Denver Time Zone
        const availabilityForTheDay = availability.find(avail =>
            new Date(avail.date).toISOString().split('T')[0] === 
            DateTime.fromJSDate(date).minus({ hours: 6 }).toJSDate().toISOString().split('T')[0]);


        if (availabilityForTheDay) {
            // If the day exists in the barber's availability
            setSlotsForSelectedDate(availabilityForTheDay.slots);
            
        } else {
            // If the day doesn't exist in the barber's availability, assume full availability (e.g., 9 AM - 3 PM)
            setSlotsForSelectedDate(['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']);
        }
    };

    const handleBooking = (slot) => {
        setSelectedSlot(slot);
    };

    const confirmBooking = async () => {
        // Find the service object by its id
        const serviceObject = services.find(service => service.id === selectedService);
    
        // Check if the service was found
        if (serviceObject) {
            // If found, navigate to the BookingForm page with state including the service name
            navigate('/booking-form', {
                state: {
                    selectedBarberName,
                    selectedBarber,
                    selectedDate,
                    selectedSlot,
                    selectedService: serviceObject.id, // This is the id of the service
                    selectedServiceName: serviceObject.name // This is the name of the service
                }
            });
        } else {
            // Handle the error in case the service ID does not match any service
            console.error('Selected service not found.');
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
        <div className="barberSelection-container">
            <div className="calendar-container">
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
                            minDate={DateTime.now().setZone('America/Denver').toJSDate()}
                        />
                    </div>
                )}
            </div>
    
            {selectedDate && (
                <div className="timeslots-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {slotsForSelectedDate.length > 0 ? (
                            <div>
                                <h3>Available time slots for {selectedDate.toDateString()}:</h3>
                                {slotsForSelectedDate.map((slot, index) => (
                                    <button key={index} className="time-slot-button" onClick={() => handleBooking(slot)}>
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <h3>No available time slots for {selectedDate.toDateString()}.</h3>
                            </div>
                        )}
                    </div>
                    <div className="service-selection-container">
                        <label htmlFor="service">Select a Service:</label>
                        <select id="service" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                            <option value="">Select a service</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {selectedSlot && (
                <div className="confirmation-container">
                    <p>You have selected: {selectedSlot}</p>
                    {/* Add a confirm booking button or something similar */}
                    <button onClick={() => confirmBooking()}>Confirm Booking</button>
                </div>
            )}
        </div>
    );
};
