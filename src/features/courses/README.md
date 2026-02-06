# Courses Feature Module

## Overview

The Courses feature handles course display and management UI.

## Structure

```
courses/
|-- components/          # Course-specific components
|   |-- CourseCard.tsx       # Course card component
|   `-- index.ts
`-- index.ts             # Main export
```

## Components

### CourseCard
Displays course information in a card format with enrollment status and progress.

Props:
```typescript
interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  hours: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
  isEnrolled?: boolean;
  progressPercent?: number;
}
```

Usage:
```tsx
import { CourseCard } from '@/features/courses';

<CourseCard
  id="course-1"
  title="Advanced Clinical Nutrition"
  category="nutrition"
  description="Comprehensive clinical nutrition training"
  hours={40}
  price={5000}
  level="ADVANCED"
  thumbnail="/images/course.jpg"
  isEnrolled={true}
  progressPercent={65}
/>
```

## Features

- Responsive design for all screen sizes
- Enrollment status and progress indicator
- Level badges for course difficulty
- Category tags
- Optional thumbnails
- Hover transitions

## Styling

The component uses TailwindCSS for layout, gradients, and shadows, plus shared UI components.

## Future Enhancements

- Add course rating display
- Add instructor information
- Add duration breakdown
- Add prerequisites display
