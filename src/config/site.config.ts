/**
 * Site Configuration
 * Central configuration for site metadata and settings
 */

export const siteConfig = {
    name: 'منصة الدكتور عامر سلمان عرابي',
    nameEn: 'Dr. Amer Salman Arabi Platform',
    description: 'منصة تعليم طبي احترافية في التغذية العلاجية والعلاج الوظيفي',
    descriptionEn: 'Professional medical education platform in therapeutic nutrition and occupational therapy',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

    author: {
        name: 'الدكتور عامر سلمان عرابي',
        nameEn: 'Dr. Amer Salman Arabi',
        title: 'دكتوراه بعلوم التغذية العلاجية والعلاج الوظيفي',
        titleEn: 'PhD in Therapeutic Nutrition and Occupational Therapy',
        phone: '+00963985391696',
        location: 'سوريا – اللاذقية',
        locationEn: 'Syria - Lattakia',
    },

    social: {
        facebook: '',
        twitter: '',
        linkedin: '',
        youtube: '',
    },

    features: {
        enableCertificates: true,
        enableEnrollmentApproval: true,
        enableProgressTracking: true,
        enableAdminPanel: true,
    },
} as const;

export type SiteConfig = typeof siteConfig;
