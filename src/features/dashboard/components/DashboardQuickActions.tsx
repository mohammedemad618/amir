import React from 'react';
import Link from 'next/link';
import { Button, Card, IconBadge } from '@/components/ui';

interface NextCourseAction {
  title: string;
  href: string;
}

interface DashboardQuickActionsProps {
  nextCourse?: NextCourseAction;
  isAdmin: boolean;
}

interface QuickAction {
  key: string;
  title: string;
  description: string;
  href: string;
  tone: 'sun' | 'mint' | 'sky';
  buttonVariant: 'primary' | 'outline' | 'secondary';
  buttonLabel: string;
  icon: React.ReactNode;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  nextCourse,
  isAdmin,
}) => {
  const actions: QuickAction[] = [
    {
      key: 'continue',
      title: nextCourse ? 'متابعة المسار' : 'استكشاف الدورات',
      description: nextCourse
        ? `أكمل رحلتك في ${nextCourse.title}.`
        : 'تصفّح المسارات الجديدة وابدأ رحلة تعليمية جديدة.',
      href: nextCourse ? nextCourse.href : '/courses',
      tone: 'sun',
      buttonVariant: 'primary',
      buttonLabel: nextCourse ? 'تابع الآن' : 'استكشف الدورات',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      ),
    },
    {
      key: 'support',
      title: 'الدعم السريع',
      description: 'تواصل مع الفريق للحصول على مساعدة فورية وإرشاد واضح.',
      href: '/contact',
      tone: 'sky',
      buttonVariant: 'outline',
      buttonLabel: 'تواصل معنا',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      ),
    },
  ];

  if (isAdmin) {
    actions.push({
      key: 'admin',
      title: 'إدارة المنصة',
      description: 'راجع المحتوى والطلاب ووسّع تجربة التعلم باحتراف.',
      href: '/admin',
      tone: 'mint',
      buttonVariant: 'secondary',
      buttonLabel: 'لوحة الإدارة',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    });
  }

  return (
    <section className="mt-8 space-y-4 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="heading-3">إجراءات سريعة</h2>
        <p className="text-sm text-ink-500">خطوات مختصرة تبقي مسارك واضحًا.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <Card
            key={action.key}
            variant="glass"
            className="group relative overflow-hidden panel-pad-sm border border-accent-sun/15 transition-transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-sun/10 via-transparent to-primary-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start gap-4">
              <IconBadge tone={action.tone} size="md" className="shadow-soft">
                {action.icon}
              </IconBadge>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">{action.title}</h3>
                  <p className="text-sm text-ink-600 mt-1">{action.description}</p>
                </div>
                <Link href={action.href} className="inline-block">
                  <Button variant={action.buttonVariant} size="sm" className="px-4">
                    {action.buttonLabel}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
