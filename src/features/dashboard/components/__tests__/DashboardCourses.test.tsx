import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardCourses } from '../DashboardCourses';
import type { Enrollment } from '../../types';

describe('DashboardCourses', () => {
  it('shows empty state when there are no enrollments', () => {
    render(<DashboardCourses enrollments={[]} />);

    expect(screen.getByText('??????? ???????')).toBeInTheDocument();
    expect(screen.getByText('?? ???? ????? ???? ??? ????')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '?????? ???????' })).toHaveAttribute('href', '/courses');
  });

  it('renders enrolled courses list', () => {
    const enrollments: Enrollment[] = [
      {
        id: 'enr-1',
        courseId: 'course-1',
        status: 'IN_PROGRESS',
        progressPercent: 45,
        course: {
          id: 'course-1',
          title: '??????? ??????? ????????',
          category: 'nutrition',
        },
      },
    ];

    render(<DashboardCourses enrollments={enrollments} />);

    expect(screen.getByText('??????? ??????? ????????')).toBeInTheDocument();
    expect(screen.getByText('??? ??????')).toBeInTheDocument();
    expect(screen.getByText('???? ???????')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '?????? ??????' })).toHaveAttribute(
      'href',
      '/courses/course-1'
    );
  });
});
