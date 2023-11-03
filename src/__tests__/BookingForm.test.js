import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import { BrowserRouter } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: {
      selectedBarberName: 'John Doe',
      selectedBarber: 'barber123',
      selectedDate: new Date('2023-10-30T14:00:00Z'),
      selectedSlot: '2:00 PM',
      selectedService: 'service123',
      selectedServiceName: 'Haircut',
    },
  }),
}));

// Mock axios
jest.mock('axios');

describe('BookingForm', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { success: true } });
  });

  test('renders BookingForm and submits with correct data', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    // Check if the BookingForm renders with the correct initial data
    expect(screen.getByText(/Haircut/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/name:/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number:/i), { target: { value: '1234567890' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /submit booking/i }));

    // Wait for the post call to resolve
    await expect(axios.post).toHaveBeenCalled();

    // Now check if the post was called with the right data
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/bookings', {
      customerName: 'Jane Doe',
      customerEmail: 'jane.doe@example.com',
      customerPhone: '1234567890',
      barberId: 'barber123',
      date: expect.any(String), // The date will be an ISO string
      slotTime: '2:00 PM',
      service: 'Haircut',
    });
  });

  // ... Additional tests to simulate and check unsuccessful submission, form validation, etc.
});
