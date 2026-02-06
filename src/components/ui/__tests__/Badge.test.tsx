import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders content', () => {
    render(<Badge variant="success">?????</Badge>);

    expect(screen.getByText('?????')).toBeInTheDocument();
  });
});
