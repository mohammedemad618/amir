# Admin Feature Module

## Overview

The Admin feature handles administrative navigation and layout support.

## Structure

```
admin/
|-- components/          # Admin-specific components
|   |-- AdminSidebar.tsx     # Admin navigation sidebar
|   `-- index.ts
`-- index.ts             # Main export
```

## Components

### AdminSidebar
Navigation sidebar for the admin panel with links to all admin sections.

Features:
- Dashboard overview
- User management
- Admin management
- Course management
- Enrollment management
- Active route highlighting
- Return to user dashboard link

Usage:
```tsx
import { AdminSidebar } from '@/features/admin';

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Navigation Items

1. Dashboard (/admin)
2. Users (/admin/users)
3. Admins (/admin/admins)
4. Courses (/admin/courses)
5. Enrollments (/admin/enrollments)

## Styling

- Fixed sidebar with sticky positioning
- Active route highlighting with accent color
- Hover effects on navigation items
- Icon-based navigation
- Responsive layout (sidebar hidden on mobile by default)

## Future Enhancements

- Add mobile menu toggle
- Add notification badges
- Add quick stats in sidebar
- Add search functionality
- Add collapsible sidebar option
