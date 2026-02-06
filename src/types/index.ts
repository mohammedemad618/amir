/**
 * Shared TypeScript Types
 * Common types used across the application
 */

import { User, Course, Enrollment, Module, Lesson, CourseResource } from '@prisma/client';

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// Auth Types
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

// User Types
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

export interface UserProfile extends UserWithoutPassword {
    enrollmentCount?: number;
    completedCourses?: number;
}

// Course Types
export interface CourseWithDetails extends Course {
    modules?: ModuleWithLessons[];
    resources?: CourseResource[];
    enrollmentCount?: number;
    _count?: {
        enrollments: number;
        modules: number;
    };
}

export interface ModuleWithLessons extends Module {
    lessons: Lesson[];
}

// Enrollment Types
export interface EnrollmentWithDetails extends Enrollment {
    user?: UserWithoutPassword;
    course?: Course;
}

export interface EnrollmentProgress {
    enrollmentId: string;
    courseId: string;
    progressPercent: number;
    completedLessons: string[];
    totalLessons: number;
}

// Form Types
export interface CourseFilters {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface AdminStats {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    pendingEnrollments: number;
    activeUsers: number;
    completedCourses: number;
}

// Common UI Types
export interface SelectOption {
    label: string;
    value: string;
}

export interface TableColumn<T = any> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}
