'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validations';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { MedicalIllustration } from '@/components/ui/MedicalIllustration';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'تعذر تسجيل الدخول.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('تعذر تسجيل الدخول. يرجى المحاولة لاحقًا.');
    }
  };

  return (
    <div className="container section">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-10 items-center">
        <Card variant="glass" className="panel-pad">
          <h1 className="heading-2 text-center mb-6">تسجيل الدخول</h1>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-primary-700 font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </div>
        </Card>

        <div className="hidden lg:block space-y-6">
          <Card variant="glass" className="panel-pad-sm space-y-4">
            <h2 className="heading-3">مرحبًا بعودتك</h2>
            <p className="body-md">
              تابع تقدمك، استعرض شهاداتك، واستمر في تطوير مهاراتك السريرية.
            </p>
            <ul className="space-y-2 text-ink-700">
              <li>لوحة متابعة شاملة للتقدم.</li>
              <li>تقارير دقيقة لأداء الدورات.</li>
              <li>شهادات رقمية قابلة للتحقق.</li>
            </ul>
          </Card>
          <MedicalIllustration id="consultationScene" alt="تسجيل الدخول" className="w-full" />
        </div>
      </div>
    </div>
  );
}

