'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, Badge, Button, Card, EmptyState, ProgressBar } from '@/components/ui';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  objectives: string;
  hours: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
}

interface CourseResource {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  type: string;
}

interface Lesson {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  order: number;
  isFree: boolean;
  createdAt?: string;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

const levelLabels = {
  BEGINNER: 'مبتدئ',
  INTERMEDIATE: 'متوسط',
  ADVANCED: 'متقدم',
};

const levelVariants = {
  BEGINNER: 'success' as const,
  INTERMEDIATE: 'warning' as const,
  ADVANCED: 'error' as const,
};

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) {
        router.push('/courses');
        return;
      }
      const data = await res.json();
      setCourse(data.course);
      setModules([]);
      setResources([]);
    } catch (error) {
      console.error('Error fetching course:', error);
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await fetch(`/api/enrollments?courseId=${courseId}&includePending=true`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      const enrollment = Array.isArray(data.enrollments) ? data.enrollments[0] : null;
      const status = enrollment?.status ?? null;
      const hasAccess = status === 'APPROVED' || status === 'COMPLETED';
      setEnrollmentStatus(status);
      setEnrolled(hasAccess);

      if (hasAccess) {
        // بعد الموافقة، اجلب محتوى الدورة
        fetchResources();
        fetchModules();
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/resources`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching course resources:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error('Error fetching course modules:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError('');
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        setError(result.error || 'تعذر إتمام عملية التسجيل.');
        return;
      }

      setEnrollmentStatus('PENDING');
      setEnrolled(false);
      // بعد الموافقة من المشرف سيتمكن المتدرب من رؤية المحتوى عند تحديث الصفحة
      router.refresh();
    } catch (err) {
      setError('تعذر إتمام عملية التسجيل. يرجى المحاولة لاحقًا.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container section text-center">
        <p className="text-ink-600">جارٍ تحميل تفاصيل الدورة...</p>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const parseObjectives = (value?: string) => {
    if (!value) return [] as string[];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string') as string[];
      }
      if (typeof parsed === 'string') {
        return [parsed];
      }
    } catch (_) {
      // Fallback to newline-separated text
    }
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const objectives = parseObjectives(course.objectives);
  const courseDetails = [
    { label: 'مدة الدورة', value: `${course.hours} ساعة` },
    { label: 'المستوى', value: levelLabels[course.level] },
    { label: 'السعر', value: course.price === 0 ? 'مجانية' : `${course.price} ل.س` },
  ];

  return (
    <div className="container section">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10">
        <div className="space-y-6">
          {course.thumbnail && (
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-ink-50 shadow-soft">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
          )}

          <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15">
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">
                {course.category === 'nutrition' ? 'التغذية العلاجية' : 'العلاج الوظيفي'}
              </Badge>
              <Badge variant={levelVariants[course.level]}>{levelLabels[course.level]}</Badge>
            </div>
            <h1 className="heading-2">{course.title}</h1>
            <p className="body-lg whitespace-pre-line">{course.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {courseDetails.map((item) => (
                <div key={item.label} className="rounded-2xl border border-accent-sun/15 bg-white/80 panel-pad-sm">
                  <div className="text-sm text-ink-500">{item.label}</div>
                  <div className="text-lg font-semibold text-ink-900">{item.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {objectives.length > 0 && (
            <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15">
              <h2 className="heading-3">محاور التعلم</h2>
              <ul className="space-y-2 list-disc list-inside text-ink-700">
                {objectives.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </Card>
          )}

          <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15">
            <h2 className="heading-3">محتوى الدورة يشمل</h2>
            <ul className="space-y-2 text-ink-700">
              <li>مذكرات تطبيقية وقوالب جاهزة للاستخدام.</li>
              <li>اختبارات قصيرة لقياس تقدمك.</li>
              <li>جلسات أسئلة وأجوبة مع المختصين.</li>
              <li>شهادة رقمية قابلة للتحقق.</li>
            </ul>
          </Card>

          {enrolled && (
            <>
              <Card variant="bordered" className="panel-pad">
                <h2 className="heading-3 mb-4">تقدمك</h2>
                <ProgressBar value={progress} label="نسبة الإنجاز" showValue />
              </Card>

              <Card variant="glass" className="panel-pad space-y-4 mt-4 border-accent-sun/15">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="heading-3">الدروس والوحدات</h2>
                  <Badge variant="modern" size="sm">
                    {modules.reduce((sum, module) => sum + module.lessons.length, 0)} درس
                  </Badge>
                </div>

                {modules.length === 0 ? (
                  <EmptyState
                    title="لا توجد دروس بعد"
                    description="سيتم عرض الدروس هنا بمجرد إضافتها من المشرف."
                    variant="courses"
                    size="sm"
                  />
                ) : (
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className="rounded-2xl border border-accent-sun/15 bg-white/80 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold text-ink-900">{module.title}</div>
                          <Badge variant="modern" size="sm">
                            {module.lessons.length} درس
                          </Badge>
                        </div>
                        {module.lessons.length > 0 ? (
                          <ul className="mt-3 space-y-2">
                            {module.lessons.map((lesson) => (
                              <li
                                key={lesson.id}
                                className="flex items-start justify-between gap-3 rounded-xl border border-ink-100 bg-white px-3 py-2"
                              >
                                <div>
                                  <div className="font-semibold text-ink-900">{lesson.title}</div>
                                  <div className="text-xs text-ink-500 mt-1">
                                    {lesson.duration ? `${lesson.duration} دقيقة` : 'بدون مدة'} ·{' '}
                                    {lesson.isFree ? 'مجاني' : 'محتوى مدفوع'}
                                  </div>
                                </div>
                                <Badge variant={lesson.isFree ? 'success' : 'neutral'} size="sm">
                                  {lesson.isFree ? 'مجاني' : 'محجوز'}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-3 text-sm text-ink-500">لا توجد دروس داخل هذه الوحدة بعد.</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {resources.length > 0 && (
                <Card variant="glass" className="panel-pad space-y-4 mt-4 border-accent-sun/15">
                  <h2 className="heading-3">مواد الدورة وروابط الحضور</h2>
                  <ul className="space-y-3">
                    {resources.map((resource) => (
                      <li
                        key={resource.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-accent-sun/15 bg-white/80 px-4 py-3"
                      >
                        <div>
                          <div className="font-semibold text-ink-900">{resource.title}</div>
                          {resource.description && (
                            <div className="text-sm text-ink-600 mt-1 whitespace-pre-line">
                              {resource.description}
                            </div>
                          )}
                          <div className="mt-1 text-xs text-ink-500">
                            {resource.type === 'MEETING'
                              ? 'رابط جلسة مباشرة (Zoom / Meet)'
                              : resource.type === 'FILE'
                              ? 'ملف قابل للتحميل'
                              : 'رابط تعليمي'}
                          </div>
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0"
                        >
                          <Button variant="primary" size="sm">
                            {resource.type === 'FILE' ? 'تحميل' : 'فتح الرابط'}
                          </Button>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card variant="glass" className="sticky top-24 panel-pad space-y-6 border-accent-sun/15">
            <div>
              <h3 className="heading-3 mb-4">تفاصيل التسجيل</h3>
              <div className="space-y-3 text-ink-700">
                <div className="flex justify-between">
                  <span className="font-semibold">المدة:</span>
                  <span>{course.hours} ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">السعر:</span>
                  <span className="text-accent-sun font-semibold text-lg">
                    {course.price === 0 ? 'مجانية' : `${course.price} ل.س`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">المستوى:</span>
                  <Badge variant={levelVariants[course.level]}>{levelLabels[course.level]}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-accent-sun/15 bg-white/80 panel-pad-sm text-sm text-ink-600">
                الوصول متاح على جميع الأجهزة مع تحديثات مستمرة للمحتوى.
              </div>
              <div className="rounded-2xl border border-accent-sun/15 bg-white/80 panel-pad-sm text-sm text-ink-600">
                متابعة دورية وتقارير تقدم لتحديد نقاط القوة.
              </div>
            </div>

            {error && <Alert variant="error">{error}</Alert>}
            {enrollmentStatus === 'PENDING' && (
              <Alert variant="info">
                تم إرسال طلب التسجيل وهو قيد المراجعة. سيتم تفعيل المحتوى فور الموافقة.
              </Alert>
            )}

            {enrolled ? (
              <Button variant="primary" className="w-full" disabled>
                مسجل بالفعل
              </Button>
            ) : enrollmentStatus === 'PENDING' ? (
              <Button variant="outline" className="w-full" disabled>
                الطلب قيد المراجعة
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'جارٍ التسجيل...' : 'سجّل الآن'}
              </Button>
            )}

            <Link href="/courses">
              <Button variant="outline" className="w-full">
                العودة إلى الدورات
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
