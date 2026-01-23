'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '@/utils/validations';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LottieAnimation } from '@/components/ui/LottieAnimation';
import loginAnimation from '../../../../public/animations/login.json';
import { DecorativeCircles } from '@/components/ui/DecorativeCircles';
import { DotPattern } from '@/components/ui/DotPattern';

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
      <div className="relative overflow-hidden rounded-[40px] bg-hero-glow border border-primary-100 shadow-glow p-8 md:p-12 lg:p-16">
        <DecorativeCircles className="opacity-20" />
        <DotPattern className="opacity-10" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-16 items-center">
          <Card variant="glass" className="glass-card panel-pad shadow-2xl border-white/50">
            <h1 className="heading-2 text-center mb-8 bg-gradient-to-l from-primary-700 to-primary-500 bg-clip-text text-transparent italic">
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
                  className="bg-white/50 backdrop-blur-sm focus:bg-white transition-all"
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
                className="bg-white/50 backdrop-blur-sm focus:bg-white transition-all"
              />

              <Input
                id="password"
                type="password"
                label="كلمة المرور"
                {...register('password')}
                error={errors.password?.message as string}
                disabled={isSubmitting}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="bg-white/50 backdrop-blur-sm focus:bg-white transition-all"
              />

              <Button type="submit" variant="primary" className="w-full py-6 text-lg font-bold hover-shine shadow-xl shadow-primary-500/20" disabled={isSubmitting}>
                {isSubmitting
                  ? (mode === 'login' ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...')
                  : (mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب')}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-ink-600 border-t border-ink-100 pt-6">
              {mode === 'login' ? (
                <>
                  ليس لديك حساب؟{' '}
                  <button onClick={toggleMode} className="text-primary-700 font-bold hover:underline decoration-2 underline-offset-4">
                    إنشاء حساب جديد
                  </button>
                </>
              ) : (
                <>
                  لديك حساب بالفعل؟{' '}
                  <button onClick={toggleMode} className="text-primary-700 font-bold hover:underline decoration-2 underline-offset-4">
                    تسجيل الدخول
                  </button>
                </>
              )}
            </div>
          </Card>

          <div className="hidden lg:block space-y-8 animate-fade-in">
            <Card variant="glass" className="glass-card panel-pad-sm space-y-6 border-white/40">
              <h2 className="heading-3 bg-gradient-to-r from-primary-700 to-sky-600 bg-clip-text text-transparent font-black">
                {mode === 'login' ? 'مرحبًا بعودتك' : 'انضم إلينا اليوم'}
              </h2>
              <p className="body-md font-medium text-ink-700">
                {mode === 'login'
                  ? 'تابع تقدمك، استعرض شهاداتك، واستمر في تطوير مهاراتك السريرية.'
                  : 'ابدأ رحلة تعليمية متميزة في التغذية العلاجية والعلاج الوظيفي بأحدث الوسائل.'}
              </p>
              <ul className="space-y-3">
                {[
                  'لوحة متابعة شاملة للتقدم.',
                  'تقارير دقيقة لأداء الدورات.',
                  'شهادات رقمية قابلة للتحقق.',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-ink-700 font-semibold group/li">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover/li:scale-150 transition-transform" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <LottieAnimation
              animationData={loginAnimation}
              className="w-full max-w-md mx-auto drop-shadow-[0_20px_50px_rgba(8,145,178,0.3)] rounded-[32px] transition-transform duration-500"
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

