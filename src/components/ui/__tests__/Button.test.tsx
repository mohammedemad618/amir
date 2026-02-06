import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders text and responds to clicks', () => {
    const handleClick = vi.fn();

    render(
      <Button type="button" onClick={handleClick}>
        ???? ???
      </Button>
    );

    const button = screen.getByRole('button', { name: '???? ???' });
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
