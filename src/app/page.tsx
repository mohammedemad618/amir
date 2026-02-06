import React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  DecorativeCircles,
  DotPattern,
  IconBadge,
  LottieAnimation,
  SectionHeading,
} from '@/components/ui';
import doctorAnimation from '../../public/animations/doctor.json';

const stats = [
  { value: '20+', label: 'سنة خبرة' },
  { value: '1200+', label: 'متدرب' },
  { value: '30+', label: 'برنامج تخصصي' },
  { value: '95%', label: 'رضا المتدربين' },
];

const highlights = [
  {
    tone: 'sky' as const,
    title: 'منهج متقن قائم على الحالات',
    description: 'محتوى سريري عملي ومركّز يعكس الواقع ويقود لنتائج قابلة للقياس.',
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
    title: 'تجربة تعلم أنيقة ومرنة',
    description: 'مسارات واضحة بإيقاع متوازن، لتتعلم بثقة دون تشتيت.',
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
    title: 'شهادات موثوقة بهوية راقية',
    description: 'توثيق إنجازك بشهادات معتمدة تمنحك حضورًا مهنيًا أقوى.',
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
    description: 'تقييم سريع لتحديد البرنامج الأنسب لتخصصك وأهدافك.',
  },
  {
    step: '02',
    title: 'تعلم تطبيقي',
    description: 'محتوى مركّز وأدوات عملية تعزز الفهم العميق.',
  },
  {
    step: '03',
    title: 'شهادة وإنجاز',
    description: 'توثيق احترافي لمسارك ودعم مستمر للتطور.',
  },
];

const trustBadges = ['إشراف متخصص', 'منهجيات معتمدة', 'متابعة شخصية', 'نتائج قابلة للقياس'];

export default function HomePage() {
  return (
    <>
      <section className="container section">
        <div className="relative overflow-hidden rounded-[32px] bg-hero-glow border border-accent-sun/25 shadow-soft lux-aurora">
          <DecorativeCircles />
          <DotPattern className="opacity-20" />
          <div className="relative hero-pad grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 border border-accent-sun/30 text-sm font-semibold text-ink-700 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-sun/80" />
                منصة تدريب طبي راقية
              </span>
              <h1 className="heading-1 text-ink-900">
                تجربة تدريب فاخرة تُصقل خبرتك وتُسرّع تقدمك المهني
              </h1>
              <p className="body-lg max-w-2xl text-ink-700">
                مسارات مصمّمة بدقّة، إشراف متخصص، وتطبيقات عملية تعكس الواقع السريري.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/courses">
                  <Button variant="primary" size="lg" className="px-8">
                    ابدأ رحلتك
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="px-8 border border-accent-sun/40">
                    تحدث مع مستشار
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {stats.map((item, idx) => (
                  <Card
                    key={item.label}
                    variant="modern"
                    className="panel-pad-sm min-h-[96px] bg-white/90 border border-accent-sun/20"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="text-3xl font-display font-semibold text-ink-900 uppercase">{item.value}</div>
                    <div className="text-sm font-semibold text-ink-600">{item.label}</div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in lg:mt-0 mt-8">
              <div
                className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-accent-sun/15 to-primary-500/10 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-gradient-to-tr from-accent-mint/10 to-primary-300/10 blur-3xl"
                aria-hidden="true"
              />
              <LottieAnimation
                animationData={doctorAnimation}
                className="w-full max-w-xl mx-auto drop-shadow-lg rounded-[28px] -scale-x-100 lottie-luxe"
              />
              <Card
                variant="featured"
                className="absolute -bottom-8 right-6 hidden md:block panel-pad-sm w-60 shadow-soft border-accent-sun/25 bg-white/90"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-900 flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">متابعة دقيقة لتقدمك</p>
                    <p className="text-xs text-ink-600 mt-1">تقارير واضحة تعزز ثقتك المهنية.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-compact">
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {trustBadges.map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-full border border-accent-sun/25 bg-white/80 text-sm font-semibold text-ink-600"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="mb-12">
          <SectionHeading
            eyebrow="مميزات المنصة"
            title="تجربة تدريب تُشبه النخبة"
            subtitle="كل تفصيلة مصممة بعناية لتجربة تعلم راقية وموجهة للنتائج."
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <Card
              key={item.title}
              variant="modern"
              className="text-right h-full space-y-4 group"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-2xl bg-accent-sun/10 opacity-50 group-hover:opacity-70 transition-opacity" />
                <IconBadge tone={item.tone} className="mb-2 relative z-10">
                  {item.icon}
                </IconBadge>
              </div>
              <h3 className="heading-3 text-ink-900">{item.title}</h3>
              <p className="body-md">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-frame panel-pad">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-center">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="الرحلة التعليمية"
                title="مسار واضح بخطوات أنيقة"
                subtitle="نرافقك من الاختيار حتى الشهادة بثقة ووضوح."
                align="right"
              />
              <div className="space-y-4">
                {steps.map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-sun/15 text-ink-900 border border-accent-sun/30 flex items-center justify-center font-semibold">
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
                  'جلسات مراجعة وتوجيه احترافية.',
                  'أدوات قابلة للتطبيق مباشرة في العمل السريري.',
                  'شهادة موثوقة مع سجل إنجازات واضح.',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 font-semibold">
                    <span className="w-8 h-8 rounded-lg bg-accent-sun/10 text-accent-sun border border-accent-sun/30 flex items-center justify-center flex-shrink-0">
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

      <section className="container section">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center">
          <Card variant="glass" className="panel-pad space-y-6">
            <span className="text-sm font-semibold text-accent-sun">قصة نجاح</span>
            <h3 className="heading-3">&ldquo;التجربة رفعت جودة عملي ووضوح قراراتي السريرية&rdquo;</h3>
            <p className="body-md">
              خلال أسابيع قليلة أصبحت أمتلك خطة عملية واضحة للتعامل مع الحالات المعقدة بثقة أعلى.
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
            {['تحسن ملحوظ في تقييم الحالات', 'تقدم ثابت وفق خطة واضحة', 'تحقيق أهداف التعلم بسرعة'].map((item) => (
              <div key={item} className="glass-panel panel-pad-sm text-ink-700 font-semibold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary-900 text-white shadow-card">
          <DotPattern className="opacity-5" />
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white/20" aria-hidden="true" />
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full border-4 border-white/15" aria-hidden="true" />
          <div className="relative hero-pad grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10 items-center">
            <div className="space-y-4">
              <h2 className="heading-2 text-white">جاهز لارتقاء مهاراتك السريرية؟</h2>
              <p className="text-lg text-white/90 font-medium">
                انضم لمسار واضح ومدروس يرافقك حتى تحقيق نتائج ملموسة.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {['تقييم مستوى', 'متابعة دورية', 'محتوى محدث', 'دعم مستمر'].map((item) => (
                  <span
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-3 text-center font-semibold"
                  >
                    <svg className="w-4 h-4 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="bg-accent-sun text-ink-900 border border-accent-sun/60 w-full font-semibold"
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
