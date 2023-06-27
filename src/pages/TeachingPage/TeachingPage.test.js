import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeachingPage from './TeachingPage';

describe('<TeachingPage />', () => {
  test('it should mount', () => {
    render(<TeachingPage />);
    
    const teachingPage = screen.getByTestId('TeachingPage');

    expect(teachingPage).toBeInTheDocument();
  });
});