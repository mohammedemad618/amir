import React from 'react';
import Link from 'next/link';
import { Badge, Button, Card, EmptyState, IconBadge } from '@/components/ui';
import type { Enrollment } from '../types';

interface DashboardAchievementsProps {
  enrollments: Enrollment[];
}

const resolveCategory = (category: string) => {
  if (category === 'nutrition') return 'التغذية العلاجية';
  if (category === 'occupational-therapy') return 'العلاج الوظيفي';
  return 'مسار تخصصي';
};

export const DashboardAchievements: React.FC<DashboardAchievementsProps> = ({ enrollments }) => {
  const completed = enrollments.filter((enrollment) => enrollment.status === 'COMPLETED');
  const withCertificates = completed.filter((enrollment) => enrollment.certificateUrl);

  return (
    <section className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="heading-3">الإنجازات والشهادات</h2>
          <p className="text-sm text-ink-500">تابع إنجازاتك وحمّل شهاداتك المعتمدة بسهولة.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" size="sm">{completed.length} دورة مكتملة</Badge>
          <Badge variant="primary" size="sm">{withCertificates.length} شهادة جاهزة</Badge>
        </div>
      </div>

      {completed.length === 0 ? (
        <EmptyState
          title="لا توجد شهادات بعد"
          description="أكمل أول دورة لتحصل على شهادة معتمدة تظهر هنا."
          actionLabel="ابدأ مسارك"
          actionHref="/courses"
          variant="courses"
          size="sm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completed.map((enrollment) => (
            <Card
              key={enrollment.id}
              variant="glass"
              className="relative overflow-hidden panel-pad-sm transition-transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 via-transparent to-accent-sun/15 opacity-70" />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink-900">{enrollment.course.title}</h3>
                    <p className="text-sm text-ink-500 mt-1">
                      {resolveCategory(enrollment.course.category)}
                    </p>
                  </div>
                  <IconBadge tone="mint" size="sm" className="shadow-soft">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </IconBadge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="success" size="sm">مكتملة</Badge>
                  {enrollment.certificateUrl ? (
                    <Badge variant="primary" size="sm">الشهادة جاهزة</Badge>
                  ) : (
                    <Badge variant="info" size="sm">قيد المراجعة</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/courses/${enrollment.courseId}`}>
                    <Button variant="outline" size="sm">عرض الدورة</Button>
                  </Link>
                  {enrollment.certificateUrl && (
                    <a href={enrollment.certificateUrl} download>
                      <Button variant="primary" size="sm">تحميل الشهادة</Button>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
