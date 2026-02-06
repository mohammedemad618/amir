/**
 * Auth Feature - Validation Schemas
 * Zod schemas for auth-related forms
 */

import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
});

export const loginSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
