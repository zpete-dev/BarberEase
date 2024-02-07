import React from 'react';
import { render } from '@testing-library/react';
import BookAppointment from '../components/BookAppointment';
import { BrowserRouter as Router } from 'react-router-dom';


describe('BookAppointment Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <BookAppointment />
      </Router>);
  });

  /* it('makes a call to the backend when component mounts', () => {
    // Mock the backend function
    const mockBackendFunction = jest.fn();

    // Replace the actual backend function with the mock
    jest.mock(`https://localhost:5000/api/barbers`, () => ({
      __esModule: true,
      default: () => ({
        makeBackendCall: mockBackendFunction,
      }),
    }));

    // Render the component
    render(
      <Router>
        <BookAppointment />
      </Router>
    );

    // Assert that the mock function is called once
    expect(mockBackendFunction).toHaveBeenCalledTimes(1);
  }); */
});
