import React from 'react';
import type { Metadata } from 'next';
import {
  Badge,
  Card,
  DecorativeCircles,
  DotPattern,
  IconBadge,
  SectionHeading,
} from '@/components/ui';
import { clsx } from 'clsx';
import { LottieAnimation } from '@/components/ui';
import doctorAnimation from '../../../public/animations/doctor.json';

export const metadata: Metadata = {
  title: 'عن الدكتور - منصة التدريب الطبي',
  description: 'تعرف على الخبرات والمسار المهني ونهج التدريب السريري المبني على النتائج.',
};

const values = [
  {
    tone: 'sky' as const,
    title: 'احترافية مبنية على الأدلة',
    description: 'نعتمد منهجيات علمية واضحة لضمان جودة المحتوى وقياس أثره العملي.',
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
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    tone: 'sun' as const,
    title: 'تعلم موجّه بالنتائج',
    description: 'نحوّل المعرفة النظرية إلى خطوات عملية قابلة للتطبيق والقياس.',
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
        <path d="M4 15l5-5 4 4 7-7" />
        <path d="M15 7h5v5" />
      </svg>
    ),
  },
  {
    tone: 'mint' as const,
    title: 'متابعة وتطوير مستمر',
    description: 'نراجع المحتوى باستمرار ليبقى مواكبًا لأحدث الممارسات الطبية.',
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
        <path d="M4 12a8 8 0 0 1 13-5" />
        <path d="M17 4v4h-4" />
        <path d="M20 12a8 8 0 0 1-13 5" />
        <path d="M7 20v-4h4" />
      </svg>
    ),
  },
];

const timeline = [
  {
    year: '2003',
    title: 'بداية المسار المهني',
    description: 'انطلاق العمل السريري والتركيز على أسس العلاج والتغذية العلاجية.',
  },
  {
    year: '2012',
    title: 'توسيع نطاق التدريب',
    description: 'إطلاق برامج تدريبية متخصصة لمهنيي الرعاية الصحية.',
  },
  {
    year: '2020',
    title: 'الاعتماد الدولي',
    description: 'الحصول على شهادات اعتماد دولية في تصميم المناهج الطبية.',
  },
  {
    year: '2024',
    title: 'منصة تدريب متكاملة',
    description: 'تحويل الخبرة إلى مسارات رقمية بتجربة تعلم متقدمة.',
  },
];

export default function AboutPage() {
  return (
    <div className="container section">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-hero-glow border border-accent-sun/25 shadow-soft panel-pad mb-20 group lux-aurora lux-aurora-lite">
        <DecorativeCircles className="opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
        <DotPattern className="opacity-10" />

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-sun/12 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-700/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <div className="relative mx-auto lg:mx-0 max-w-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-sun/15 to-primary-500/10 blur-3xl rounded-full scale-90" aria-hidden="true" />
            <div className="relative z-10 p-4 bg-white/40 backdrop-blur-md rounded-[3rem] border border-accent-sun/20 shadow-soft overflow-hidden">
              <LottieAnimation
                animationData={doctorAnimation}
                className="w-full rounded-[2.5rem] drop-shadow-sm hover:scale-[1.02] transition-transform duration-700 lottie-luxe"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 z-20 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-soft border border-accent-sun/30 animate-float-slow">
              <div className="text-center">
                <span className="block text-3xl font-semibold text-accent-sun leading-none">+20</span>
                <span className="text-xs font-semibold text-ink-600 uppercase tracking-wider">عامًا من الخبرة</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="primary" size="md" className="py-2 px-5 text-sm uppercase tracking-widest shadow-soft scale-105 origin-right">
                المسار المهني للطبيب
              </Badge>
              <h1 className="heading-1 !text-5xl lg:!text-6xl text-ink-900 !leading-[1.2]">
                خبرة سريرية تمتد لأكثر من عقدين
              </h1>
              <p className="body-lg text-ink-700 leading-relaxed max-w-2xl">
                نلتزم بتقديم تجربة تعليمية فاخرة تجمع بين العمق العلمي والتطبيق العملي،
                لتمكين مهنيي الصحة من تحقيق حضور مهني مؤثر.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {['تغذية علاجية', 'علاج وظيفي', 'تدريب مهني', 'تصميم مناهج'].map((tag) => (
                <div
                  key={tag}
                  className="px-6 py-3 rounded-2xl border border-accent-sun/30 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300 font-semibold text-accent-sun cursor-default"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <SectionHeading
          eyebrow="رؤيتنا"
          title="قيمنا الأساسية"
          subtitle="نلتزم بجودة المحتوى، وضوح التجربة، وقياس الأثر الحقيقي للتعلم."
          align="center"
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card
              key={value.title}
              variant="modern"
              className="p-8 space-y-6 animate-fade-up group relative overflow-hidden h-full shadow-soft transition-all duration-500"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-sun/15 rounded-bl-full -mr-16 -mt-16 group-hover:mr-0 group-hover:mt-0 transition-all duration-700" />
              <div className="relative">
                <IconBadge tone={value.tone} className="w-16 h-16 rounded-2xl shadow-soft ring-4 ring-white/50 transition-all duration-300">
                  {value.icon}
                </IconBadge>
              </div>
              <div className="space-y-3">
                <h3 className="heading-3 text-2xl text-ink-900">{value.title}</h3>
                <p className="body-md text-lg leading-relaxed text-ink-700">{value.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-24 relative overflow-hidden py-10">
        <div className="absolute top-1/2 left-0 w-full h-[600px] bg-accent-sun/10 -translate-y-1/2 -z-10 blur-[100px]" />

        <SectionHeading
          eyebrow="الرحلة المهنية"
          title="محطات الخبرة"
          subtitle="محطات رئيسية شكّلت المنهج الحالي في التدريب والتطوير."
          align="center"
        />

        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-sun/30 via-primary-200/30 to-accent-sun/20 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 relative">
            {timeline.map((item, idx) => (
              <div
                key={item.year}
                className={clsx(
                  'flex flex-col md:flex-row gap-8 items-center animate-fade-up',
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                )}
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-accent-sun/40 shadow-soft z-10 hidden md:flex items-center justify-center font-semibold text-accent-sun">
                  {item.year}
                </div>

                <div className="w-full md:w-[45%]">
                  <Card
                    variant="modern"
                    className="p-7 group hover:border-accent-sun/40 transition-all duration-500 relative glass-card"
                  >
                    <div className="md:hidden inline-block px-4 py-1.5 rounded-full bg-primary-900 text-white font-semibold mb-4 shadow-soft">
                      {item.year}
                    </div>
                    <h4 className="text-2xl font-semibold text-ink-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="body-md text-lg mt-3 leading-relaxed text-ink-600">
                      {item.description}
                    </p>
                    <div
                      className={clsx(
                        'absolute top-8 hidden md:block w-5 h-5 bg-white border-t border-r border-ink-100 transition-colors rotate-45',
                        idx % 2 === 0 ? '-right-2.5' : '-left-2.5 rotate-[225deg]'
                      )}
                    />
                  </Card>
                </div>

                <div className="hidden md:block w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="heading-2 !text-3xl">اعتمادات ومجالات العمل</h2>
            <p className="body-lg text-ink-700">
              يشمل العمل السريري والتدريبي تقديم حلول متكاملة للمختصين في مجالات متنوعة،
              مع التركيز على أعلى معايير الجودة العالمية.
            </p>
            <ul className="space-y-4">
              {[
                'إشراف مباشر على خطط علاج غذائي متخصصة.',
                'تطوير محتوى تدريبي يعتمد على الحالات الواقعية.',
                'تقديم برامج تدريبية فردية ومؤسسية مكثفة.',
                'استشارات مهنية لتطوير مراكز التأهيل الطبي.',
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-center text-ink-800 font-semibold group">
                  <span className="w-8 h-8 rounded-lg bg-accent-sun/15 text-accent-sun flex items-center justify-center flex-shrink-0 group-hover:bg-primary-900 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <Card variant="glass" className="p-2 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-50 to-ink-50 border-2 border-white shadow-card skew-x-1 lg:skew-x-2">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden">
              <LottieAnimation
                animationData={doctorAnimation}
                className="w-full opacity-80 lottie-luxe"
              />
              <div className="absolute inset-0 bg-primary-900/30 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 text-white transition-transform cursor-pointer">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
