import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

describe('Card', () => {
  it('renders header, title, and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>????? ???????</CardTitle>
        </CardHeader>
        <CardContent>
          <p>????? ???????</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('????? ???????')).toBeInTheDocument();
    expect(screen.getByText('????? ???????')).toBeInTheDocument();
  });
});
