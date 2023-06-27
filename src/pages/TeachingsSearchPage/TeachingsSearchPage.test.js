import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeachingsSearchPage from './TeachingsSearchPage';

describe('<TeachingsSearchPage />', () => {
  test('it should mount', () => {
    render(<TeachingsSearchPage />);
    
    const teachingsSearchPage = screen.getByTestId('TeachingsSearchPage');

    expect(teachingsSearchPage).toBeInTheDocument();
  });
});