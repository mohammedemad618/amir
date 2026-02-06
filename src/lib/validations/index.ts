/**
 * Shared Validation Schemas
 * Common validation schemas used across features
 */

import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    message: z.string().min(10, 'الرسالة يجب أن تكون على الأقل 10 أحرف'),
});

export const progressSchema = z.object({
    courseId: z.string().min(1),
    progressPercent: z.number().min(0).max(100),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ProgressFormData = z.infer<typeof progressSchema>;
