/**
 * Route Configuration
 * Central definition of all application routes
 */

export const routes = {
    // Public routes
    home: '/',
    about: '/about',
    contact: '/contact',
    courses: '/courses',
    courseDetail: (id: string) => `/courses/${id}`,
    booking: '/booking',

    // Auth routes
    login: '/auth/login',
    register: '/auth/register',

    // Protected routes
    dashboard: '/dashboard',

    // Admin routes
    admin: {
        root: '/admin',
        users: '/admin/users',
        courses: '/admin/courses',
        enrollments: '/admin/enrollments',
        bookings: '/admin/bookings',
        settings: '/admin/settings',
    },

    // API routes
    api: {
        auth: {
            login: '/api/auth/login',
            register: '/api/auth/register',
            logout: '/api/auth/logout',
            refresh: '/api/auth/refresh',
            me: '/api/auth/me',
        },
        courses: {
            list: '/api/courses',
            detail: (id: string) => `/api/courses/${id}`,
            modules: (id: string) => `/api/courses/${id}/modules`,
        },
        booking: {
            slots: '/api/booking/slots',
            create: '/api/booking',
            cancel: (id: string) => `/api/booking/${id}`,
        },
        enrollments: {
            create: '/api/enroll',
            list: '/api/enrollments',
            update: (id: string) => `/api/enrollments/${id}`,
        },
        admin: {
            users: '/api/admin/users',
            courses: '/api/admin/courses',
            enrollments: '/api/admin/enrollments',
            bookingSchedule: '/api/admin/booking-schedule',
            bookings: '/api/admin/bookings',
            slots: '/api/admin/slots',
            stats: '/api/admin/stats',
        },
    },
} as const;

export type Routes = typeof routes;
