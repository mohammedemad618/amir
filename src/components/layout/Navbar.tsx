'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { Badge } from '@/components/ui/Badge';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/courses', label: 'الدورات' },
  { href: '/about', label: 'عن الدكتور' },
  { href: '/contact', label: 'اتصل بنا' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setIsAdmin(data.user.role === 'ADMIN');
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3',
        isScrolled
          ? 'bg-white/80 shadow-glass backdrop-blur-xl border-b border-primary-100/30 py-2'
          : 'bg-transparent'
      )}
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 px-4 bg-white/40 backdrop-blur-md rounded-[1.5rem] border border-white/60 shadow-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-primary-500/10 group-hover:rotate-3 transition-transform">
              ع
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-ink-900 leading-none group-hover:text-primary-700 transition-colors">د. عامر سلمان</span>
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-0.5">منصة التدريب الطبي</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden group',
                    isActive
                      ? 'text-primary-700'
                      : 'text-ink-600 hover:text-primary-600'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-primary-100/50 -z-0" />
                  )}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary-500 rounded-full transition-all duration-300 group-hover:w-8" />
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Badge variant="warning" className="py-2 px-4 shadow-sm hover:shadow-md transition-shadow">لوحة الإدارة</Badge>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Badge variant="primary" className="py-2 px-4 shadow-sm hover:shadow-md transition-shadow">لوحة التحكم</Badge>
                </Link>
                <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-primary-50">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm" className="rounded-xl font-black px-6 shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
                    ابدأ الآن
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-ink-700 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="فتح القائمة"
          >
            <div className="relative w-6 h-5">
              <span className={clsx("absolute left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300", isMobileMenuOpen ? "top-2.5 rotate-45" : "top-0")} />
              <span className={clsx("absolute left-0 top-2.5 w-6 h-0.5 bg-current rounded-full transition-all duration-300", isMobileMenuOpen ? "opacity-0 translate-x-4" : "opacity-100")} />
              <span className={clsx("absolute left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300", isMobileMenuOpen ? "top-2.5 -rotate-45" : "top-5")} />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={clsx(
            'md:hidden fixed inset-0 top-[88px] bg-ink-900/40 backdrop-blur-sm z-40 transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={clsx(
            'md:hidden fixed top-[88px] left-4 right-4 bg-white/95 backdrop-blur-xl rounded-[2rem] border border-primary-100/50 shadow-2xl z-50 p-6 space-y-4 transition-all duration-500 ease-spring',
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
                    'flex items-center justify-between px-6 py-4 rounded-2xl text-base font-bold transition-all',
                    isActive
                      ? 'text-primary-700 bg-primary-50 ring-1 ring-primary-100'
                      : 'text-ink-700 hover:bg-ink-50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-6 rounded-2xl font-bold">لوحة الإدارة</Button>
                  </Link>
                )}
                <Link href="/dashboard" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full py-6 rounded-2xl text-lg font-black">لوحة التحكم</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full py-6 rounded-2xl font-bold">تسجيل الدخول</Button>
                </Link>
                <Link href="/auth/register" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full py-6 rounded-2xl text-lg font-black">إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
