import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IconBadge } from '@/components/ui/IconBadge';
import { ButterfliesBackground } from '@/components/ButterfliesBackground';
import { DecorativeCircles } from '@/components/ui/DecorativeCircles';
import { DotPattern } from '@/components/ui/DotPattern';
import { LottieAnimation } from '@/components/ui/LottieAnimation';
import doctorAnimation from '../../public/animations/doctor.json';

const stats = [
  { value: '20+', label: 'سنة خبرة' },
  { value: '1200+', label: 'متدرب' },
  { value: '30+', label: 'دورة تخصصية' },
  { value: '95%', label: 'رضا المتدربين' },
];

const highlights = [
  {
    tone: 'sky' as const,
    title: 'منهج مبني على الحالات',
    description: 'نقدّم محتوى عمليًا مرتبطًا بالواقع السريري مع خطوات واضحة للتطبيق.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <rect x="7" y="4" width="10" height="16" rx="2" />
        <path d="M9 4h6v3H9z" />
        <path d="M9.5 11h5" />
        <path d="M9.5 14h4" />
      </svg>
    ),
  },
  {
    tone: 'mint' as const,
    title: 'تجربة تعلم مرنة',
    description: 'وحدات قصيرة ومسارات مركزة تساعدك على التقدم بثبات دون تشتيت.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
  {
    tone: 'coral' as const,
    title: 'شهادات موثوقة',
    description: 'توثيق إنجازك بشهادات قابلة للتحقق تعزز ثقتك لدى المرضى.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="3" />
        <path d="M7 21l5-4 5 4v-6H7z" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: '01',
    title: 'اختيار المسار',
    description: 'ابدأ بتقييم سريع لتحديد المسار الأنسب لتخصصك وهدفك.',
  },
  {
    step: '02',
    title: 'تعلم تطبيقي',
    description: 'محتوى مركّز مع أدوات عملية وتمارين تساعدك على الفهم العميق.',
  },
  {
    step: '03',
    title: 'شهادة وإنجاز',
    description: 'بعد الإكمال تحصل على شهادة موثوقة ودعم لمتابعة التطور.',
  },
];

const trustBadges = ['إشراف متخصص', 'محتوى محدث', 'دعم مباشر', 'نتائج قابلة للقياس'];

export default function HomePage() {
  return (
    <>
      <ButterfliesBackground />
      {/* Hero Section */}
      <section className="container section">
        <div className="relative overflow-hidden rounded-[32px] bg-hero-glow border-2 border-primary-100 shadow-glow">
          <DecorativeCircles />
          <DotPattern className="opacity-20" />
          <div className="relative hero-pad grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-50 to-sky-50 border-2 border-primary-200 text-sm font-bold text-primary-700 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                منصة تدريب طبية معتمدة
              </span>
              <h1 className="heading-1 bg-gradient-to-l from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">تجربة تدريب احترافية تبني ثقتك وتسرّع تقدمك السريري</h1>
              <p className="body-lg max-w-2xl text-ink-700">
                تعلم بإيقاعك مع محتوى عملي، مسارات تخصصية، وإشراف واضح يركز على النتائج.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/courses">
                  <Button variant="primary" size="lg" className="hover-shine shadow-lg shadow-primary-500/20 px-8">
                    ابدأ المسار الآن
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="px-8 border-2 hover:bg-white/50 backdrop-blur-sm">
                    تحدث مع فريقنا
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {stats.map((item, idx) => (
                  <Card key={item.label} variant="modern" className="glass-card panel-pad-sm min-h-[96px] animate-scale-in group hover:scale-105 transition-all duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:to-sky-400 transition-colors uppercase">{item.value}</div>
                    <div className="text-sm font-semibold text-ink-600 group-hover:text-primary-700 transition-colors">{item.label}</div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in lg:mt-0 mt-8">
              <div
                className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-primary-400/20 to-sky-400/20 blur-3xl animate-pulse-slow"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-gradient-to-tr from-mint-300/10 to-primary-300/10 blur-3xl animate-pulse-slow"
                style={{ animationDelay: '2s' }}
                aria-hidden="true"
              />
              <LottieAnimation
                animationData={doctorAnimation}
                className="w-full max-w-xl mx-auto drop-shadow-2xl rounded-[28px] -scale-x-100"
              />
              <Card
                variant="featured"
                className="absolute -bottom-8 right-6 hidden md:block panel-pad-sm w-60 animate-slide-in-left shadow-2xl border-white/50 bg-white/90 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">متابعة تقدمك لحظة بلحظة</p>
                    <p className="text-xs text-ink-600 mt-1">تقارير واضحة تساعدك على التطور بثقة.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="container section-compact">
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {trustBadges.map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-full border border-ink-200 bg-white/70 text-sm font-semibold text-ink-600"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="container section">
        <div className="mb-12">
          <SectionHeading
            eyebrow="مميزات المنصة"
            title="لماذا تختار منصتنا؟"
            subtitle="كل تفصيلة مصممة لتجربة تعلم عملية، واضحة، وموجهة للنتائج."
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <Card
              key={item.title}
              variant="modern"
              className="text-right animate-fade-up h-full space-y-4 group hover-shine"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-sky-100 opacity-50 group-hover:opacity-70 transition-opacity" />
                <IconBadge tone={item.tone} className="mb-2 relative z-10">
                  {item.icon}
                </IconBadge>
              </div>
              <h3 className="heading-3 group-hover:text-primary-600 transition-colors">{item.title}</h3>
              <p className="body-md">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning Journey */}
      <section className="container section">
        <div className="section-frame panel-pad">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-center">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="الرحلة التعليمية"
                title="رحلة تعلم واضحة الخطوات"
                subtitle="نرافقك من اختيار المسار حتى الحصول على الشهادة بثقة."
                align="right"
              />
              <div className="space-y-4">
                {steps.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-ink-900 text-white flex items-center justify-center font-semibold">
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-ink-900">{item.title}</h4>
                      <p className="body-md">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card variant="glass" className="p-8 space-y-6">
              <h3 className="heading-3">ماذا ستحصل؟</h3>
              <ul className="space-y-4 text-ink-700">
                {[
                  'خطة تعلم مخصصة لتخصصك وأهدافك.',
                  'جلسات مراجعة وتوجيه عند الحاجة.',
                  'أدوات قابلة للتطبيق مباشرة في العمل السريري.',
                  'شهادة موثوقة مع سجل إنجازات مفصل.',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 font-semibold group cursor-default">
                    <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/courses">
                <Button variant="secondary" size="md" className="w-full h-14 rounded-2xl">
                  استكشف المسارات
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="container section">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center">
          <Card variant="glass" className="panel-pad space-y-6">
            <span className="text-sm font-semibold text-primary-700">قصة نجاح</span>
            <h3 className="heading-3">&quot;التجربة ساعدتني على تنظيم معرفتي وتطبيقها بثقة أعلى&quot;</h3>
            <p className="body-md">
              خلال أسابيع قليلة أصبحت أمتلك خطة عملية واضحة للتعامل مع الحالات المعقدة، مع متابعة دقيقة لنتائجي.
            </p>
            <div className="flex items-center gap-3">
              <IconBadge tone="sun" className="rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M4 20c1.6-3 4.6-5 8-5s6.4 2 8 5" />
                </svg>
              </IconBadge>
              <div>
                <div className="font-semibold text-ink-900">متدربة متقدمة</div>
                <div className="text-sm text-ink-500">تغذية علاجية</div>
              </div>
            </div>
          </Card>
          <div className="space-y-4">
            {['تحسن ملحوظ في تقييم الحالات', 'تقدم ثابت وفق خطة واضحة', 'تحقيق أهداف التعلم بسرعة'].map(
              (item) => (
                <div key={item} className="glass-panel panel-pad-sm text-ink-700 font-semibold">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container section">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white shadow-glow-lg">
          <DotPattern className="opacity-10" />
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white/20" aria-hidden="true" />
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full border-4 border-white/15" aria-hidden="true" />
          <div className="relative hero-pad grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center">
            <div className="space-y-4">
              <h2 className="heading-2 text-white drop-shadow-lg">جاهز لتطوير مهاراتك السريرية؟</h2>
              <p className="text-lg text-white/90 font-medium">
                انضم لمسار واضح ومدروس يرافقك حتى تحقيق نتائج ملموسة.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {['تقييم مستوى', 'متابعة دورية', 'محتوى محدث', 'دعم مستمر'].map((item) => (
                  <span
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-full bg-ink-950/20 backdrop-blur-md border border-white/20 px-4 py-3 text-center font-bold hover:bg-ink-950/40 transition-colors"
                  >
                    <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
              <Link href="/courses">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-primary-900 border-2 border-white hover:bg-primary-50 hover:scale-105 w-full font-black shadow-xl"
                >
                  ابدأ الآن
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

