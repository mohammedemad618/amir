import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders label and error message', () => {
    render(
      <Input
        id="email"
        label="?????? ??????????"
        placeholder="name@example.com"
        error="??? ????? ?????"
      />
    );

    expect(screen.getByLabelText('?????? ??????????')).toBeInTheDocument();
    expect(screen.getByText('??? ????? ?????')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
  });
});
