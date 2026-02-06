import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders label and clamped value', () => {
    render(<ProgressBar value={120} label="???? ???????" showValue />);

    expect(screen.getByText('???? ???????')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
