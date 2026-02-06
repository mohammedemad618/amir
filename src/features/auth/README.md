# Auth Feature Module

## Overview

The Auth feature handles all authentication-related functionality including login, registration, and access control.

## Structure

```
auth/
├── components/          # Auth-specific components
│   ├── RequireAuth.tsx      # Protects routes requiring authentication
│   ├── RequireRole.tsx      # Protects routes requiring specific role
│   ├── RequirePermission.tsx # Protects routes requiring permission
│   └── index.ts
├── hooks/               # Auth hooks
│   └── useAuth.tsx          # Main authentication hook
├── utils/               # Auth utilities
│   └── validations.ts       # Login/Register validation schemas
├── types/               # Auth types
│   └── index.ts             # User, AuthTokens, etc.
└── index.ts             # Main export
```

## Components

### RequireAuth
Protects routes by requiring authentication.

```tsx
import { RequireAuth } from '@/features/auth';

<RequireAuth>
  <ProtectedContent />
</RequireAuth>
```

### RequireRole
Protects routes by requiring a specific role.

```tsx
import { RequireRole } from '@/features/auth';

<RequireRole role="ADMIN">
  <AdminContent />
</RequireRole>
```

### RequirePermission
Protects routes by requiring a specific permission.

```tsx
import { RequirePermission } from '@/features/auth';

<RequirePermission permission="manage_users">
  <UserManagement />
</RequirePermission>
```

## Hooks

### useAuth
Main authentication hook providing user state and utilities.

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { 
    user,           // Current user or null
    loading,        // Loading state
    isAuthenticated,// Boolean
    isAdmin,        // Boolean
    hasPermission,  // Function
    hasRole,        // Function
    refetch         // Refetch user data
  } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome {user.name}</div>;
}
```

## Validation Schemas

### Login Schema
```typescript
import { loginSchema } from '@/features/auth';

// Validates: email, password
const result = loginSchema.parse(formData);
```

### Register Schema
```typescript
import { registerSchema } from '@/features/auth';

// Validates: name, email, password
const result = registerSchema.parse(formData);
```

## Types

```typescript
import type { User, AuthTokens, LoginCredentials } from '@/features/auth';
```

## Usage Examples

### Protected Page
```tsx
'use client';

import { RequireAuth } from '@/features/auth';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div>Dashboard Content</div>
    </RequireAuth>
  );
}
```

### Admin-Only Page
```tsx
'use client';

import { RequireRole } from '@/features/auth';

export default function AdminPage() {
  return (
    <RequireRole role="ADMIN">
      <div>Admin Panel</div>
    </RequireRole>
  );
}
```

### Conditional Rendering
```tsx
'use client';

import { useAuth } from '@/features/auth';

export default function MyComponent() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Logged in</p>}
      {isAdmin && <button>Admin Action</button>}
    </div>
  );
}
```
