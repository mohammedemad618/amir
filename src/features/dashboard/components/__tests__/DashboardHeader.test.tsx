import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '../DashboardHeader';
import type { DashboardStat } from '../../types';

describe('DashboardHeader', () => {
  it('renders greeting and stats', () => {
    const stats: DashboardStat[] = [
      { tone: 'sun', label: '????????', value: 3, icon: <span>+</span> },
      { tone: 'mint', label: '????????', value: 1, icon: <span>?</span> },
      { tone: 'sky', label: '??????', value: '80%', icon: <span>%</span> },
    ];

    render(<DashboardHeader userName="????" stats={stats} />);

    expect(screen.getByText('???? ??????')).toBeInTheDocument();
    expect(screen.getByText('?????? ??????? ????')).toBeInTheDocument();
    expect(screen.getByText('????????')).toBeInTheDocument();
    expect(screen.getByText('????????')).toBeInTheDocument();
    expect(screen.getByText('??????')).toBeInTheDocument();
  });
});
