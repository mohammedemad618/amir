'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge, Button } from '@/components/ui';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/courses', label: 'الدورات' },
  { href: '/booking', label: 'الحجز' },
  { href: '/about', label: 'عن الدكتور' },
  { href: '/contact', label: 'اتصل بنا' },
];

const AUTH_CACHE_TTL = 60_000;
let authCache: { isAuthenticated: boolean; isAdmin: boolean; ts: number } | null = null;
let authPromise: Promise<{ isAuthenticated: boolean; isAdmin: boolean; ts: number }> | null = null;

const loadAuthState = async () => {
  const now = Date.now();
  if (authCache && now - authCache.ts < AUTH_CACHE_TTL) {
    return authCache;
  }
  if (authPromise) {
    return authPromise;
  }

  authPromise = fetch('/api/auth/me', { cache: 'no-store' })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        authCache = {
          isAuthenticated: true,
          isAdmin: data.user.role === 'ADMIN',
          ts: Date.now(),
        };
        return authCache;
      }
      authCache = { isAuthenticated: false, isAdmin: false, ts: Date.now() };
      return authCache;
    })
    .catch(() => {
      authCache = { isAuthenticated: false, isAdmin: false, ts: Date.now() };
      return authCache;
    })
    .finally(() => {
      authPromise = null;
    });

  return authPromise;
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const state = await loadAuthState();
      if (!mounted) return;
      setIsAuthenticated(state.isAuthenticated);
      setIsAdmin(state.isAdmin);
    };

    checkAuth();
    const handleAuthChange = () => {
      authCache = null;
      checkAuth();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      mounted = false;
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    authCache = null;
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3',
        isScrolled
          ? 'bg-white/90 shadow-sm backdrop-blur-md border-b border-accent-sun/30 py-2'
          : 'bg-transparent'
      )}
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md rounded-2xl border border-accent-sun/25 shadow-sm">
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-primary-900 flex items-center justify-center text-white font-semibold text-xl shadow-sm ring-4 ring-accent-sun/20">
              ع
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-ink-900 leading-none group-hover:text-accent-sun transition-colors">
                الدكتور عامر عربي
              </span>
              <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-widest mt-0.5">
                منصة التدريب الطبي
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'text-ink-900 bg-accent-sun/15'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-accent-sun/10'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/booking">
              <Button variant="accent" size="sm" className="rounded-xl font-semibold px-5">
                احجز موعدك
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Badge variant="warning" className="py-2 px-4">لوحة الإدارة</Badge>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Badge variant="primary" className="py-2 px-4">لوحة التحكم</Badge>
                </Link>
                <Button variant="outline" size="sm" className="rounded-xl font-semibold" onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="rounded-xl font-semibold hover:bg-accent-sun/10">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/auth/login?mode=register">
                  <Button variant="primary" size="sm" className="rounded-xl font-semibold px-6">
                    ابدأ الآن
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-ink-700 hover:bg-accent-sun/10 transition-colors border border-transparent hover:border-accent-sun/25"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="فتح القائمة"
          >
            <div className="relative w-6 h-5">
              <span className={clsx('absolute left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300', isMobileMenuOpen ? 'top-2.5 rotate-45' : 'top-0')} />
              <span className={clsx('absolute left-0 top-2.5 w-6 h-0.5 bg-current rounded-full transition-all duration-300', isMobileMenuOpen ? 'opacity-0 translate-x-4' : 'opacity-100')} />
              <span className={clsx('absolute left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300', isMobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-5')} />
            </div>
          </button>
        </div>

        <div
          className={clsx(
            'md:hidden fixed inset-0 top-[88px] bg-ink-900/20 backdrop-blur-sm z-40 transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={clsx(
            'md:hidden fixed top-[88px] left-4 right-4 bg-white/95 backdrop-blur-md rounded-[2rem] border border-accent-sun/25 shadow-card z-50 p-6 space-y-4 transition-all duration-300',
            isMobileMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'
          )}
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center justify-between px-6 py-4 rounded-2xl text-base font-semibold transition-all',
                    isActive
                      ? 'text-ink-900 bg-accent-sun/15 ring-1 ring-accent-sun/30'
                      : 'text-ink-700 hover:bg-accent-sun/10'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary-900" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link href="/booking" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="accent" className="w-full py-6 rounded-2xl text-lg font-semibold">
                احجز موعدك
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-6 rounded-2xl font-semibold">لوحة الإدارة</Button>
                  </Link>
                )}
                <Link href="/dashboard" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full py-6 rounded-2xl text-lg font-semibold">لوحة التحكم</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full py-6 rounded-2xl font-semibold">تسجيل الدخول</Button>
                </Link>
                <Link href="/auth/login?mode=register" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full py-6 rounded-2xl text-lg font-semibold">إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
