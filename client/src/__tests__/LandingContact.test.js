import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingContact from '../components/LandingContact';

describe('LandingContact Component', () => {
  // Test to check if the component displays the content after loading
  test('displays contact information after loading', async () => {
    render(<LandingContact />);

    // Wait for the async loading to finish
    await waitFor(() => {
      // Check for content that should be visible after loading
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    // Again, adjust selectors based on your actual implementation
  });

  test('iframe loads successfully', async () => {
    render(<LandingContact />);
    let iframe = null;
    await waitFor(() => {
      // Check for content that should be visible after loading
      iframe = screen.getByTitle('BarberDog Location');
    });

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src');
    // This confirms the iframe is in the document and has a src attribute
  });

});
