# Project Structure Guide

## Overview

This project follows a feature-based architecture for better scalability, maintainability, and developer experience.

## Directory Structure

```
src/
|-- config/              # Configuration & Constants
|-- types/               # Shared TypeScript Types
|-- features/            # Feature Modules (Auth, Courses, Admin)
|-- components/          # Shared UI Components
|-- lib/                 # Core Utilities
|-- styles/              # Theme & Global Styles
|-- hooks/               # Shared Custom Hooks
|-- utils/               # Utility Functions
|-- content/             # Static Content
`-- app/                 # Next.js App Router
```

## Key Directories

### config/
Centralized configuration files:
- `site.config.ts` - Site metadata and settings
- `routes.config.ts` - Type-safe route definitions
- `constants.ts` - Application constants (roles, statuses, etc.)

Usage:
```typescript
import { routes, USER_ROLES, siteConfig } from '@/config';
```

### types/
Shared TypeScript interfaces and types:
- API response types
- Common data models
- UI component types

Usage:
```typescript
import { ApiResponse, UserProfile } from '@/types';
```

### features/
Feature-based modules, each containing:
- components/ - Feature-specific components
- hooks/ - Feature-specific hooks
- utils/ - Feature utilities
- types/ - Feature types

Current Features:
- auth/ - Authentication (RequireAuth, useAuth, etc.)
- courses/ - Course management (CourseCard, etc.)
- admin/ - Admin panel (AdminSidebar, etc.)

Usage:
```typescript
import { useAuth, RequireAuth } from '@/features/auth';
import { CourseCard } from '@/features/courses';
```

### components/
Shared components used across features:
- ui/ - Base UI components (Button, Card, Input, etc.)
- layout/ - Layout components (Navbar, Footer)
- common/ - Common reusable components

Usage:
```typescript
import { Button, Card } from '@/components/ui';
import { Navbar } from '@/components/layout';
```

### lib/
Core utilities and configurations:
- auth/ - JWT, cookies, guards
- db/ - Prisma client
- security/ - Rate limiting, security utilities
- validations/ - Shared validation schemas

### styles/
Theme and global styles:
- theme/tokens.ts - Design tokens (colors, spacing, etc.)
- globals.css - Global CSS

## Import Patterns

### Recommended Imports

```typescript
// Config
import { routes, USER_ROLES } from '@/config';

// Features
import { useAuth } from '@/features/auth';
import { CourseCard } from '@/features/courses';

// Shared Components
import { Button, Card } from '@/components/ui';
import { Navbar } from '@/components/layout';

// Types
import { ApiResponse } from '@/types';

// Lib
import { prisma } from '@/lib/db/prisma';
```

### Avoid Deep Imports

```typescript
// Don't do this
import { Button } from '@/components/ui/Button';

// Do this instead
import { Button } from '@/components/ui';
```

## Adding New Features

1. Create feature directory: `src/features/my-feature/`
2. Add subdirectories: `components/`, `hooks/`, `utils/`, `types/`
3. Create barrel export: `index.ts`
4. Import from: `@/features/my-feature`

Example structure:
```
features/
`-- my-feature/
    |-- components/
    |   |-- MyComponent.tsx
    |   `-- index.ts
    |-- hooks/
    |   `-- useMyHook.ts
    |-- utils/
    |   `-- helpers.ts
    |-- types/
    |   `-- index.ts
    `-- index.ts
```

## Benefits

- Clear Organization - Easy to find related code
- Scalability - Add features without cluttering
- Type Safety - Centralized types and constants
- Maintainability - Self-contained feature modules
- Developer Experience - Intuitive structure

## Migration from Old Structure

Old imports still work through barrel exports for backward compatibility:

```typescript
// Old (still works)
import { useAuth } from '@/hooks/useAuth';

// New (recommended)
import { useAuth } from '@/features/auth';
```

## Next Steps

1. Gradually update imports to use new paths
2. Add more feature modules as needed
3. Enhance documentation per feature
4. Add tests co-located with components
