import type { Metadata } from 'next';
import { Cairo, Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'الدكتور عامر عرابي - منصة التغذية العلاجية والعلاج الوظيفي',
  description: 'منصة تعليم طبي احترافية في التغذية العلاجية والعلاج الوظيفي مع دورات متخصصة وشهادات إتمام',
  keywords: ['التغذية العلاجية', 'العلاج الوظيفي', 'دورات طبية', 'الدكتور عامر عرابي'],
  authors: [{ name: 'الدكتور عامر عرابي' }],
  openGraph: {
    title: 'الدكتور عامر عرابي - منصة التغذية العلاجية والعلاج الوظيفي',
    description: 'منصة تعليم طبي احترافية في التغذية العلاجية والعلاج الوظيفي',
    type: 'website',
    locale: 'ar_SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${kufi.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-to-content">
          الانتقال إلى المحتوى الرئيسي
        </a>
        <Navbar />
        <main id="main-content" className="min-h-screen pt-20" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
