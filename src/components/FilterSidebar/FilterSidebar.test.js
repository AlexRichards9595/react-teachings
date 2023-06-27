import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FilterSidebar from './FilterSidebar';

describe('<FilterSidebar />', () => {
  test('it should mount', () => {
    render(<FilterSidebar />);
    
    const filterSidebar = screen.getByTestId('FilterSidebar');

    expect(filterSidebar).toBeInTheDocument();
  });
});