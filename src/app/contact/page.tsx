'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/utils/validations';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { MedicalIllustration } from '@/components/ui/MedicalIllustration';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconBadge } from '@/components/ui/IconBadge';
import { LottieAnimation } from '@/components/ui/LottieAnimation';
import chatAnimation from '../../../public/animations/chat-doctor.json';
import { DecorativeCircles } from '@/components/ui/DecorativeCircles';
import { DotPattern } from '@/components/ui/DotPattern';
import { Badge } from '@/components/ui/Badge';
import type { z } from 'zod';

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setError('');
      console.log('Contact form data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('تعذر إرسال الرسالة. يرجى المحاولة لاحقًا.');
    }
  };

  const phoneNumber = '+963985391696';
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="container section">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-hero-glow border border-primary-100 shadow-glow mb-16 p-12 text-center group">
        <DecorativeCircles className="opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
        <DotPattern className="opacity-10" />
        <div className="relative z-10">
          <Badge variant="primary" size="md" className="mb-6 py-2 px-5 shadow-lg shadow-primary-500/10">
            تواصل معنا
          </Badge>
          <SectionHeading
            title="تواصل معنا بسهولة"
            subtitle="نستقبل استفساراتك ونساعدك في اختيار المسار الأنسب لتخصصك المهني."
            align="center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div className="space-y-8">
          <Card variant="modern" className="p-8 space-y-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full -mr-16 -mt-16 group-hover:mr-0 group-hover:mt-0 transition-all duration-700" />

            <h2 className="heading-3 text-2xl group-hover:text-primary-600 transition-colors">معلومات الاتصال</h2>

            <div className="space-y-6 text-ink-700">
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-ink-100 hover:border-primary-200 hover:shadow-md transition-all group/item">
                <IconBadge tone="sky" className="w-12 h-12 shadow-sm group-hover/item:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M5 4h4l2 5-3 2a13 13 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                </IconBadge>
                <div>
                  <div className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-0.5">الهاتف مباشر</div>
                  <a href={`tel:${phoneNumber}`} className="text-lg font-black text-ink-900 hover:text-primary-600 transition-colors">
                    {phoneNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-ink-100 hover:border-mint-200 hover:shadow-md transition-all group/item">
                <IconBadge tone="mint" className="w-12 h-12 shadow-sm group-hover/item:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                </IconBadge>
                <div>
                  <div className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-0.5">دردشة سريعة</div>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-lg font-black text-ink-900 hover:text-primary-600 transition-colors flex items-center gap-2">
                    عبر واتساب
                    <span className="flex h-2 w-2 rounded-full bg-mint-500 animate-ping" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-ink-100 hover:border-sun-200 hover:shadow-md transition-all group/item">
                <IconBadge tone="sun" className="w-12 h-12 shadow-sm group-hover/item:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M12 22s7-5 7-12a7 7 0 0 0-14 0c0 7 7 12 7 12z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </IconBadge>
                <div>
                  <div className="text-xs text-ink-500 font-bold uppercase tracking-wider mb-0.5">الموقع</div>
                  <p className="text-lg font-black text-ink-900">سوريا - طرطوس</p>
                </div>
              </div>
            </div>

            <Button
              variant="accent"
              type="button"
              className="w-full py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all font-black text-lg gap-3"
              onClick={() => window.open(whatsappLink, '_blank', 'noopener,noreferrer')}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.539 2.016 2.126-.54c1.029.563 2.025.804 3.16.804 3.182 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.767-5.766-5.767zm3.393 8.35c-.146.411-.844.753-1.127.795-.285.042-.557.063-.781.063-.329 0-.649-.051-1.026-.142-.544-.131-1.156-.395-1.748-.769-.646-.407-1.119-.854-1.537-1.271-1.135-1.135-1.547-2.317-1.547-3.328 0-.441.136-.856.402-1.178.2-.244.512-.423.71-.423.196 0 .392.011.554.011.168.01.295.006.417.3.15.361.517 1.258.562 1.348.045.09.075.195.015.315-.061.121-.15.269-.241.375-.09.106-.181.18-.269.3-.087.12-.03.269.044.389.284.457.653.864 1.107 1.21.36.275.698.487 1.098.647.12.048.269.048.374-.044.106-.104.451-.527.572-.705.121-.179.269-.15.42-.09.15.06 2.04 1.02 2.04 1.02.15.06.24.12.3.24.06.12.06.69-.147 1.08zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.655 1.446 5.162L2 22l4.992-1.312C8.361 21.576 10.101 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.16-.475-4.444-1.294l-.32-.204-2.317.608.618-2.31-.225-.358C4.522 15.151 4 13.633 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
              </svg>
              حجز استشارة فورية
            </Button>
          </Card>

          <Card variant="modern" className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl group overflow-hidden relative text-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full translate-x-12 -translate-y-12" />
            <LottieAnimation
              animationData={chatAnimation}
              className="w-48 h-48 mx-auto -mb-6"
            />
            <div className="relative flex items-center justify-center gap-4 mb-4">
              <h3 className="text-xl font-black text-center">ساعات الاستجابة</h3>
            </div>
            <div className="space-y-2 opacity-90 font-bold">
              <p>نرد على كافة الاستفسارات خلال 24 ساعة.</p>
              <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                <span>السبت - الخميس</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg">9ص - 7م</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Card variant="modern" className="p-10 shadow-glow relative z-10">
            <h2 className="heading-3 mb-8 !text-2xl border-b border-ink-100 pb-4">أرسل رسالة مباشرة</h2>

            {submitted && (
              <Alert variant="success" className="mb-8" title="تم الإرسال بنجاح">
                تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.
              </Alert>
            )}

            {error && (
              <Alert variant="error" className="mb-8" title="خطأ في الإرسال">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  label="الاسم الكامل"
                  placeholder="أدخل اسمك هنا..."
                  {...register('name')}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                />

                <Input
                  id="email"
                  type="email"
                  label="البريد الإلكتروني"
                  placeholder="name@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                />
              </div>

              <Textarea
                id="message"
                label="رسالتك أو استفسارك"
                placeholder="كيف يمكننا مساعدتك اليوم؟"
                {...register('message')}
                error={errors.message?.message}
                disabled={isSubmitting}
                className="min-h-[180px]"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-6 rounded-2xl text-lg font-black gap-3 shadow-xl shadow-primary-500/10 active:scale-95 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <span>إرسال الرسالة الآن</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                      <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
                    </svg>
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Background Illustration Decor */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky-200/20 blur-3xl -z-10" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-200/20 blur-3xl -z-10" />
        </div>
      </div>

      <section className="mt-24 mb-16">
        <Card variant="glass" className="p-8 rounded-[2rem] border-primary-100/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-sky-500/5" />
          <div className="relative flex flex-col items-center text-center space-y-4">
            <Badge variant="modern" className="mb-2">انضم إلينا</Badge>
            <h2 className="heading-3">هل أنت مستعد لبدء مسارك التدريبي؟</h2>
            <p className="body-md max-w-xl text-ink-600">اكتشف قائمتنا الواسعة من الدورات المتخصصة التي صممت لتنقل مهاراتك إلى المستوى التالي.</p>
            <Button variant="primary" className="mt-4 px-10">تصفح كافة الدورات</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
