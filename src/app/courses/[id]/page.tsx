'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Alert } from '@/components/ui/Alert';

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
  const [progress, setProgress] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [resources, setResources] = useState<CourseResource[]>([]);

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
    } catch (error) {
      console.error('Error fetching course:', error);
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await fetch(`/api/enrollments?courseId=${courseId}`);
      if (!res.ok) return;
      const data = await res.json();
      const hasEnrollment = Array.isArray(data.enrollments) && data.enrollments.length > 0;
      setEnrolled(hasEnrollment);

      if (hasEnrollment) {
        // بعد الموافقة، اجلب محتوى الدورة
        fetchResources();
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/resources`);
      if (!res.ok) return;
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching course resources:', error);
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

      setEnrolled(true);
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

  const objectives = course.objectives ? JSON.parse(course.objectives) : [];
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

          <Card variant="glass" className="panel-pad space-y-4">
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
                <div key={item.label} className="rounded-2xl border border-ink-200 bg-white/70 panel-pad-sm">
                  <div className="text-sm text-ink-500">{item.label}</div>
                  <div className="text-lg font-semibold text-ink-900">{item.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {objectives.length > 0 && (
            <Card variant="glass" className="panel-pad space-y-4">
              <h2 className="heading-3">محاور التعلم</h2>
              <ul className="space-y-2 list-disc list-inside text-ink-700">
                {objectives.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </Card>
          )}

          <Card variant="glass" className="panel-pad space-y-4">
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

              {resources.length > 0 && (
                <Card variant="glass" className="panel-pad space-y-4 mt-4">
                  <h2 className="heading-3">مواد الدورة وروابط الحضور</h2>
                  <ul className="space-y-3">
                    {resources.map((resource) => (
                      <li
                        key={resource.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-ink-200 bg-white/70 px-4 py-3"
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
          <Card variant="glass" className="sticky top-24 panel-pad space-y-6">
            <div>
              <h3 className="heading-3 mb-4">تفاصيل التسجيل</h3>
              <div className="space-y-3 text-ink-700">
                <div className="flex justify-between">
                  <span className="font-semibold">المدة:</span>
                  <span>{course.hours} ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">السعر:</span>
                  <span className="text-primary-700 font-semibold text-lg">
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
              <div className="rounded-2xl border border-ink-200 bg-white/70 panel-pad-sm text-sm text-ink-600">
                الوصول متاح على جميع الأجهزة مع تحديثات مستمرة للمحتوى.
              </div>
              <div className="rounded-2xl border border-ink-200 bg-white/70 panel-pad-sm text-sm text-ink-600">
                متابعة دورية وتقارير تقدم لتحديد نقاط القوة.
              </div>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            {enrolled ? (
              <Button variant="primary" className="w-full" disabled>
                مسجل بالفعل
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
