import React from 'react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';

export const Footer: React.FC = () => {
  return (
    <footer
      className="relative overflow-hidden bg-ink-900 text-ink-200 py-16 px-4 md:px-0 border-t border-ink-800"
      role="contentinfo"
    >
      <div className="absolute top-0 left-1/4 w-[520px] h-[520px] bg-accent-sun/18 blur-[140px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-accent-sun/20 blur-[140px] rounded-full translate-y-1/2" />

      <div className="relative container">
        {/* Footer CTA */}
        <div className="mb-20 overflow-hidden rounded-[2.5rem] border border-accent-sun/25 bg-ink-900/70 p-10 md:p-16 relative shadow-card">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-sun/20 via-transparent to-primary-600/20 opacity-60" />
          <div className="absolute top-0 right-1/2 w-48 h-48 bg-accent-sun/18 blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative flex flex-col lg:flex-row gap-10 items-center justify-between text-center lg:text-right">
            <div className="max-w-xl space-y-4">
              <Badge variant="primary" size="sm" className="bg-accent-sun text-ink-900 border-transparent">
                جاهز للانطلاق؟
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug">
                صمّم مسارك المهني بأناقة وثقة
              </h2>
              <p className="text-lg text-ink-300 font-medium">
                انضم إلى برامج تدريبية مصممة بعناية لخبراء الرعاية الصحية الباحثين عن التميّز.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/courses">
                <Button variant="accent" className="px-10 py-5 rounded-2xl text-base font-semibold">
                  استعرض الدورات
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="px-10 py-5 rounded-2xl text-base font-semibold border-accent-sun/40 text-ink-100"
                >
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-accent-sun flex items-center justify-center text-ink-900 font-semibold text-2xl shadow-sm ring-4 ring-accent-sun/20">
                ع
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-white leading-none">الدكتور عامر عرابي</span>
                <span className="text-xs font-semibold text-ink-400 uppercase tracking-widest mt-1">منصة التدريب الطبي</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-ink-300 font-medium">
              دكتوراه في علوم التغذية العلاجية والعلاج الوظيفي بطرطوس، سوريا. نؤمن بتجربة تدريبية
              راقية تجمع بين العمق العلمي والتطبيق العملي.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:mr-auto">
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wider">روابط سريعة</h3>
            <ul className="space-y-4 text-sm font-semibold">
              {[{ label: 'الرئيسية', href: '/' }, { label: 'عن الدكتور', href: '/about' }, { label: 'الدورات', href: '/courses' }, { label: 'اتصل بنا', href: '/contact' }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-accent-sun transition-colors flex items-center gap-2 text-ink-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-sun opacity-60" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wider">معلومات الاتصال</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-ink-900/60 border border-ink-700 flex items-center justify-center flex-shrink-0 text-accent-sun">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-semibold uppercase tracking-widest mb-1">الهاتف</p>
                  <p className="text-white font-semibold">+963985391696</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-ink-900/60 border border-ink-700 flex items-center justify-center flex-shrink-0 text-accent-sun">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-semibold uppercase tracking-widest mb-1">الموقع</p>
                  <p className="text-white font-semibold">سوريا – طرطوس</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Statement */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wider">رسالة المنصة</h3>
            <p className="text-sm leading-loose text-ink-300 mb-6 font-medium">
              نطمح أن نكون الوجهة الأولى لكل ممارس صحي يبحث عن التميّز مع تجربة رقمية راقية.
            </p>
            <Link href="/courses">
              <Badge variant="primary" className="py-2.5 px-6 rounded-xl cursor-pointer">
                انضم للمنصة الآن
              </Badge>
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-semibold text-ink-400 bg-ink-900/60 p-6 rounded-2xl border border-ink-800">
          <p>© {new Date().getFullYear()} الدكتور عامر عرابي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-accent-sun transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-accent-sun transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
