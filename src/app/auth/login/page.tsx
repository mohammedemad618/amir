'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '@/utils/validations';
import { Alert, Button, Card, Input, LottieAnimation } from '@/components/ui';
import loginAnimation from '../../../../public/animations/login.json';
import { DecorativeCircles, DotPattern } from '@/components/ui';

type FormMode = 'login' | 'register';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<FormMode>(initialMode);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<any>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
  });

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      setError('');
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || (mode === 'login' ? 'تعذر تسجيل الدخول.' : 'تعذر إنشاء الحساب.'));
        return;
      }

      window.dispatchEvent(new Event('auth-change'));
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(mode === 'login' ? 'تعذر تسجيل الدخول. يرجى المحاولة لاحقًا.' : 'تعذر إنشاء الحساب. يرجى المحاولة لاحقًا.');
    }
  };

  return (
    <div className="container section">
      <div className="relative overflow-hidden rounded-[40px] bg-hero-glow border border-accent-sun/25 shadow-soft p-8 md:p-12 lg:p-16 lux-aurora lux-aurora-lite">
        <DecorativeCircles className="opacity-20" />
        <DotPattern className="opacity-10" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-16 items-center">
          <Card variant="glass" className="glass-card panel-pad shadow-soft border-accent-sun/25">
            <h1 className="heading-2 text-center mb-8 text-ink-900">
              {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h1>

            {error && (
              <Alert variant="error" className="mb-6 shadow-sm">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {mode === 'register' && (
                <Input
                  id="name"
                  label="الاسم الكامل"
                  {...register('name')}
                  error={errors.name?.message as string}
                  disabled={isSubmitting}
                  autoComplete="name"
                  className="bg-white focus:bg-white transition-all"
                />
              )}

              <Input
                id="email"
                type="email"
                label="البريد الإلكتروني"
                {...register('email')}
                error={errors.email?.message as string}
                disabled={isSubmitting}
                autoComplete="email"
                className="bg-white focus:bg-white transition-all"
              />

              <Input
                id="password"
                type="password"
                label="كلمة المرور"
                {...register('password')}
                error={errors.password?.message as string}
                disabled={isSubmitting}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="bg-white focus:bg-white transition-all"
              />

              <Button type="submit" variant="primary" className="w-full py-6 text-base font-semibold shadow-soft" disabled={isSubmitting}>
                {isSubmitting
                  ? (mode === 'login' ? 'جارٍ تسجيل الدخول...' : 'جارٍ إنشاء الحساب...')
                  : (mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب')}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-ink-600 border-t border-accent-sun/25 pt-6">
              {mode === 'login' ? (
                <>
                  لا تملك حسابًا؟{' '}
                  <button onClick={toggleMode} className="text-accent-sun font-semibold hover:underline decoration-2 underline-offset-4">
                    أنشئ حسابًا جديدًا
                  </button>
                </>
              ) : (
                <>
                  لديك حساب بالفعل؟{' '}
                  <button onClick={toggleMode} className="text-accent-sun font-semibold hover:underline decoration-2 underline-offset-4">
                    تسجيل الدخول
                  </button>
                </>
              )}
            </div>
          </Card>

          <div className="hidden lg:block space-y-8 animate-fade-in">
            <Card variant="glass" className="glass-card panel-pad-sm space-y-6 border-accent-sun/25">
              <h2 className="heading-3 text-ink-900 font-semibold">
                {mode === 'login' ? 'مرحبًا بعودتك' : 'ابدأ رحلتك المهنية'}
              </h2>
              <p className="body-md font-medium text-ink-700">
                {mode === 'login'
                  ? 'ادخل إلى منصتك الراقية لمتابعة المسارات التدريبية وتحقيق أهدافك بثبات.'
                  : 'أنشئ حسابك للوصول إلى برامج تدريبية مصممة بعناية لممارسي الرعاية الصحية.'}
              </p>
              <ul className="space-y-3">
                {[
                  'مسارات تخصصية بتجربة أنيقة وواضحة.',
                  'شهادات موثوقة تعكس تطورك المهني.',
                  'متابعة مستمرة مع تقارير تقدم دقيقة.',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-ink-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-sun/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <LottieAnimation
              animationData={loginAnimation}
              className="w-full max-w-md mx-auto drop-shadow-lg rounded-[32px] transition-transform duration-500 lottie-luxe"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container section flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-sun"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
