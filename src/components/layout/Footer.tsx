import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-[#070A13] text-ink-300 py-20 px-4 md:px-0" role="contentinfo">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sky-600/10 blur-[120px] rounded-full translate-y-1/2" />

      <div className="relative container">
        {/* Footer CTA */}
        <div className="mb-20 overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-900/90 backdrop-blur-2xl p-10 md:p-16 relative group shadow-2xl shadow-primary-900/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-sky-600/20 opacity-30" />
          <div className="absolute top-0 right-1/2 w-48 h-48 bg-primary-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/20 transition-colors" />

          <div className="relative flex flex-col lg:flex-row gap-10 items-center justify-between text-center lg:text-right">
            <div className="max-w-xl space-y-4">
              <Badge variant="primary" size="sm" className="bg-primary-500 text-white border-transparent">جاهز للبدء؟</Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-snug">ابدأ مسارك المهني المتطور اليوم</h2>
              <p className="text-lg text-ink-200/80 font-medium">
                انضم إلى المئات من المتدربين الذين طوروا مهاراتهم في التغذية العلاجية والعلاج الوظيفي.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/courses">
                <Button variant="primary" className="px-10 py-6 rounded-2xl text-lg font-black shadow-xl shadow-primary-500/20 bg-white text-primary-900 border-2 border-white hover:bg-primary-50 active:scale-95 transition-all">
                  استكشف كافة الدورات
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="px-10 py-6 rounded-2xl text-lg font-bold border-white/20 text-white hover:bg-white/10 active:scale-95 transition-all">
                  تواصل معنا الآن
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-primary-500/10 group-hover:rotate-6 transition-transform">
                ع
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white leading-none">الدكتور عامر عرابي</span>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest mt-1">منصة التدريب الطبي</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-ink-300 font-medium">
              دكتوراه في علوم التغذية العلاجية والعلاج الوظيفي بطرطوس، سوريا. نلتزم بتقديم أرقى المناهج التدريبية التي تدمج بين النظرية والتطبيق العملي.
            </p>
            {/* Social Placeholder */}
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="w-5 h-5 bg-current opacity-60 rounded-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:mr-auto">
            <h3 className="text-white text-lg font-black mb-6 uppercase tracking-wider">روابط سريعة</h3>
            <ul className="space-y-4 text-sm font-bold">
              {['الرئيسية', 'عن الدكتور', 'الدورات', 'اتصل بنا'].map((item, i) => (
                <li key={i}>
                  <Link href={i === 0 ? '/' : i === 1 ? '/about' : i === 2 ? '/courses' : '/contact'} className="hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-lg font-black mb-6 uppercase tracking-wider">معلومات الاتصال</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-bold uppercase tracking-widest mb-1">الهاتف</p>
                  <p className="text-white font-black">+963985391696</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-primary-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-ink-400 font-bold uppercase tracking-widest mb-1">الموقع</p>
                  <p className="text-white font-black">سوريا – طرطوس</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Meta */}
          <div>
            <h3 className="text-white text-lg font-black mb-6 uppercase tracking-wider">رسالة المنصة</h3>
            <p className="text-sm leading-loose text-ink-300 mb-6 font-medium">
              نهدف أن نكون الوجهة الأولى لكل ممارس صحي يبحث عن التميز، مع توفير كافة الأدوات التعليمية والرقمية اللازمة.
            </p>
            <Link href="/courses">
              <Badge variant="primary" className="py-2.5 px-6 rounded-xl hover:scale-105 transition-transform cursor-pointer">انضم للمنصة الآن</Badge>
            </Link>
          </div>
        </div>


        {/* Footer Bottom */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-ink-500 bg-white/5 p-6 rounded-2xl border border-white/5">
          <p>© {new Date().getFullYear()} الدكتور عامر عرابي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
