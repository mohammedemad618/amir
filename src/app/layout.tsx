import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Amiri } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'الدكتور عامر عربي - منصة التغذية العلاجية والعلاج الوظيفي',
  description: 'منصة تعليم طبي احترافية في التغذية العلاجية والعلاج الوظيفي مع دورات متخصصة وشهادات إتمام.',
  keywords: ['التغذية العلاجية', 'العلاج الوظيفي', 'دورات طبية', 'الدكتور عامر عربي'],
  authors: [{ name: 'الدكتور عامر عربي' }],
  openGraph: {
    title: 'الدكتور عامر عربي - منصة التغذية العلاجية والعلاج الوظيفي',
    description: 'منصة تعليم طبي احترافية في التغذية العلاجية والعلاج الوظيفي.',
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
      <body className={`${plex.variable} ${amiri.variable} font-sans antialiased`}>
        <div className="global-texture" aria-hidden="true" />
        <a href="#main-content" className="skip-to-content">
          الانتقال إلى المحتوى الرئيسي
        </a>
        <div className="app-shell">
          <Navbar />
          <main id="main-content" className="min-h-screen pt-20" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
