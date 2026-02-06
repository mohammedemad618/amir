import type { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  progressPercent: number;
  certificateUrl?: string;
  course: {
    id: string;
    title: string;
    category: string;
  };
}

export interface Course {
  id: string;
  title: string;
  category: string;
  thumbnail?: string;
  level: string;
}

export interface DashboardStat {
  tone: 'sky' | 'mint' | 'sun' | 'coral' | 'ink' | 'primary';
  label: string;
  value: string | number;
  icon: ReactNode;
}
