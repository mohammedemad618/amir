/**
 * Application Constants
 * Central location for all application-wide constants
 */

// Authentication
export const AUTH_CONSTANTS = {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    BCRYPT_SALT_ROUNDS: 10,
    COOKIE_NAME: 'refreshToken',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
} as const;

// Rate Limiting
export const RATE_LIMIT = {
    AUTH_WINDOW_MS: 10 * 60 * 1000, // 10 minutes
    AUTH_MAX_REQUESTS: 10,
} as const;

// User Roles
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
} as const;

// User Status
export const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    DELETED: 'DELETED',
} as const;

// Enrollment Status
export const ENROLLMENT_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    COMPLETED: 'COMPLETED',
} as const;

// Course Levels
export const COURSE_LEVELS = {
    BEGINNER: 'BEGINNER',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED',
} as const;

// Course Resource Types
export const RESOURCE_TYPES = {
    FILE: 'FILE',
    LINK: 'LINK',
    MEETING: 'MEETING',
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
} as const;

// Admin Permissions
export const PERMISSIONS = {
    MANAGE_USERS: 'manage_users',
    MANAGE_COURSES: 'manage_courses',
    MANAGE_ENROLLMENTS: 'manage_enrollments',
    VIEW_ANALYTICS: 'view_analytics',
    MANAGE_SETTINGS: 'manage_settings',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type EnrollmentStatus = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS];
export type CourseLevel = typeof COURSE_LEVELS[keyof typeof COURSE_LEVELS];
export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
