import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeachingResultsTable from './TeachingResultsTable';

describe('<TeachingResultsTable />', () => {
  test('it should mount', () => {
    render(<TeachingResultsTable />);
    
    const teachingResultsTable = screen.getByTestId('TeachingResultsTable');

    expect(teachingResultsTable).toBeInTheDocument();
  });
});