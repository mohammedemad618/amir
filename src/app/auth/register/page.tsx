'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/utils/validations';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { MedicalIllustration } from '@/components/ui/MedicalIllustration';
import type { z } from 'zod';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'تعذر إنشاء الحساب.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('تعذر إنشاء الحساب. يرجى المحاولة لاحقًا.');
    }
  };

  return (
    <div className="container section">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-10 items-center">
        <Card variant="glass" className="panel-pad">
          <h1 className="heading-2 text-center mb-6">إنشاء حساب جديد</h1>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="name"
              label="الاسم الكامل"
              {...register('name')}
              error={errors.name?.message}
              disabled={isSubmitting}
              autoComplete="name"
            />

            <Input
              id="email"
              type="email"
              label="البريد الإلكتروني"
              {...register('email')}
              error={errors.email?.message}
              disabled={isSubmitting}
              autoComplete="email"
            />

            <Input
              id="password"
              type="password"
              label="كلمة المرور"
              {...register('password')}
              error={errors.password?.message}
              disabled={isSubmitting}
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-primary-700 font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </Card>

        <div className="hidden lg:block space-y-6">
          <Card variant="glass" className="panel-pad-sm space-y-4">
            <h2 className="heading-3">ابدأ رحلتك الآن</h2>
            <p className="body-md">
              احصل على مسار تعلم واضح وتواصل مباشر مع خبراء المجال.
            </p>
            <ul className="space-y-2 text-ink-700">
              <li>تقييم احترافي لمستواك الحالي.</li>
              <li>مسارات تخصصية تناسب أهدافك.</li>
              <li>متابعة مستمرة حتى تحقيق النتائج.</li>
            </ul>
          </Card>
          <MedicalIllustration id="doctorClipboard" alt="إنشاء حساب" className="w-full" />
        </div>
      </div>
    </div>
  );
}

