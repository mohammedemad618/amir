/**
 * Permission-based access control system
 * Defines granular permissions and role-permission mappings
 */

export enum Permission {
    // User Management
    MANAGE_USERS = 'MANAGE_USERS',
    VIEW_USERS = 'VIEW_USERS',

    // Admin Management
    MANAGE_ADMINS = 'MANAGE_ADMINS',

    // Course Management
    MANAGE_COURSES = 'MANAGE_COURSES',
    VIEW_COURSES = 'VIEW_COURSES',

    // Enrollment Management
    MANAGE_ENROLLMENTS = 'MANAGE_ENROLLMENTS',
    VIEW_ENROLLMENTS = 'VIEW_ENROLLMENTS',

    // Analytics
    VIEW_ANALYTICS = 'VIEW_ANALYTICS',
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

/**
 * Maps roles to their allowed permissions
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.USER]: [
        Permission.VIEW_COURSES,
        Permission.VIEW_ENROLLMENTS,
    ],
    [Role.ADMIN]: [
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.MANAGE_ADMINS,
        Permission.MANAGE_COURSES,
        Permission.VIEW_COURSES,
        Permission.MANAGE_ENROLLMENTS,
        Permission.VIEW_ENROLLMENTS,
        Permission.VIEW_ANALYTICS,
    ],
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: string, permission: Permission): boolean {
    const roleEnum = role as Role;
    const permissions = ROLE_PERMISSIONS[roleEnum];

    if (!permissions) {
        return false;
    }

    return permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): Permission[] {
    const roleEnum = role as Role;
    return ROLE_PERMISSIONS[roleEnum] || [];
}

/**
 * Check if user has permission based on their role
 */
export function hasPermission(userRole: string, permission: Permission): boolean {
    return roleHasPermission(userRole, permission);
}
