import React from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ProgressBar,
} from '@/components/ui';
import type { Enrollment } from '../types';

interface DashboardCoursesProps {
  enrollments: Enrollment[];
}

export const DashboardCourses: React.FC<DashboardCoursesProps> = ({ enrollments }) => {
  const resolveCategory = (category: string) => {
    if (category === 'nutrition') return 'التغذية العلاجية';
    if (category === 'occupational-therapy') return 'العلاج الوظيفي';
    return 'مسار تخصصي';
  };

  return (
    <div className="space-y-6">
      <h2 className="heading-3">مساراتك الحالية</h2>
      {enrollments.length === 0 ? (
        <EmptyState
          title="لا توجد دورات نشطة حتى الآن"
          description="ابدأ مسارك من قائمة الدورات المتاحة."
          actionLabel="استكشف الدورات"
          actionHref="/courses"
          variant="courses"
          size="sm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} variant="elevated">
              <CardHeader>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{enrollment.course.title}</CardTitle>
                    {enrollment.status === 'PENDING' ? (
                      <Badge variant="warning">بانتظار الموافقة</Badge>
                    ) : (
                      <Badge variant={enrollment.status === 'COMPLETED' ? 'success' : 'info'}>
                        {enrollment.status === 'COMPLETED' ? 'مكتملة' : 'قيد التقدم'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="modern" className="font-semibold">
                      {resolveCategory(enrollment.course.category)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProgressBar
                  value={enrollment.progressPercent}
                  label="نسبة الإنجاز"
                  showValue
                  className="mb-4"
                />
                <div className="flex gap-2">
                  {enrollment.status === 'PENDING' ? (
                    <Button variant="outline" className="w-full flex-1" disabled>
                      الطلب قيد المراجعة
                    </Button>
                  ) : (
                    <Link href={`/courses/${enrollment.courseId}`} className="flex-1">
                      <Button variant="primary" className="w-full">
                        متابعة التعلم
                      </Button>
                    </Link>
                  )}
                  {enrollment.certificateUrl && (
                    <a href={enrollment.certificateUrl} download className="flex-1">
                      <Button variant="outline" className="w-full">
                        تحميل الشهادة
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
