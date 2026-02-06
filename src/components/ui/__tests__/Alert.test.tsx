import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert', () => {
  it('renders title and body with alert role', () => {
    render(
      <Alert variant="success" title="?? ?????">
        ??? ??????? ?????.
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('?? ?????')).toBeInTheDocument();
    expect(screen.getByText('??? ??????? ?????.')).toBeInTheDocument();
  });
});
