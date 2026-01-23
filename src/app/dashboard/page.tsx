'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { IconBadge } from '@/components/ui/IconBadge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  progressPercent: number;
  certificateUrl?: string;
  course: {
    id: string;
    title: string;
    category: string;
  };
}

interface Course {
  id: string;
  title: string;
  category: string;
  thumbnail?: string;
  level: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/auth/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);
      setIsAdmin(userData.user.role === 'ADMIN');

      try {
        const enrollmentsRes = await fetch('/api/enrollments');
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json();
          setEnrollments(enrollmentsData.enrollments || []);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }

      if (userData.user.role === 'ADMIN') {
        try {
          const coursesRes = await fetch('/api/courses');
          if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            setCourses(coursesData.courses || []);
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار صورة صحيحة.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('الحد الأعلى لحجم الصورة هو 5MB.');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      setUploadSuccess(false);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const res = await fetch(`/api/courses/${selectedCourse}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thumbnail: base64String }),
        });

        if (!res.ok) {
          const error = await res.json();
          setUploadError(error.error || 'تعذر رفع الصورة.');
          return;
        }

        setUploadSuccess(true);
        setSelectedCourse('');

        const coursesRes = await fetch('/api/courses');
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData.courses || []);
        }

        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('تعذر رفع الصورة.');
    } finally {
      setUploading(false);
    }
  };

  const completedCount = useMemo(
    () => enrollments.filter((enrollment) => enrollment.status === 'COMPLETED').length,
    [enrollments]
  );
  const avgProgress = useMemo(() => {
    if (!enrollments.length) return 0;
    const total = enrollments.reduce((sum, enrollment) => sum + enrollment.progressPercent, 0);
    return Math.round(total / enrollments.length);
  }, [enrollments]);

  if (loading) {
    return (
      <div className="container section text-center">
        <p className="text-ink-600">جارٍ تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      tone: 'sky' as const,
      label: 'الدورات الملتحق بها',
      value: enrollments.length,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h10" />
        </svg>
      ),
    },
    {
      tone: 'mint' as const,
      label: 'الدورات المكتملة',
      value: completedCount,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      tone: 'sun' as const,
      label: 'متوسط التقدم',
      value: `${avgProgress}%`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M4 18l6-6 4 4 6-6" />
          <path d="M16 10h4v4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="container section">
      <div className="relative overflow-hidden rounded-3xl bg-hero-glow border border-ink-100/70 shadow-soft panel-pad">
        <div className="absolute inset-0 subtle-grid opacity-20" aria-hidden="true" />
        <div className="relative space-y-6">
          <div>
            <h1 className="heading-2">لوحة التحكم</h1>
            <p className="body-md">مرحبًا، {user.name}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((item) => (
              <div key={item.label} className="glass-panel panel-pad-sm flex items-center gap-3">
                <IconBadge tone={item.tone} size="sm">
                  {item.icon}
                </IconBadge>
                <div>
                  <div className="text-sm text-ink-500">{item.label}</div>
                  <div className="text-2xl font-semibold text-ink-900">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
        <div className="space-y-6">
          <h2 className="heading-3">مساراتك الحالية</h2>
          {enrollments.length === 0 ? (
            <Alert variant="info">
              لا توجد دورات نشطة حتى الآن.{' '}
              <Link href="/courses" className="underline font-semibold">
                استكشف الدورات
              </Link>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} variant="elevated">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{enrollment.course.title}</CardTitle>
                      <Badge variant={enrollment.status === 'COMPLETED' ? 'success' : 'info'}>
                        {enrollment.status === 'COMPLETED' ? 'مكتملة' : 'قيد التقدم'}
                      </Badge>
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
                      <Link href={`/courses/${enrollment.courseId}`} className="flex-1">
                        <Button variant="primary" className="w-full">
                          متابعة التعلم
                        </Button>
                      </Link>
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

        <div className="space-y-6">
          <Card variant="glass" className="panel-pad-sm">
            <CardHeader>
              <CardTitle>بيانات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-ink-700">
              <div>
                <span className="font-semibold">الاسم:</span> {user.name}
              </div>
              <div>
                <span className="font-semibold">البريد الإلكتروني:</span> {user.email}
              </div>
              <div>
                <span className="font-semibold">الدور:</span> {user.role === 'ADMIN' ? 'مشرف' : 'متدرب'}
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card variant="glass" className="panel-pad-sm">
              <CardHeader>
                <CardTitle>رفع صور الدورات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadSuccess && <Alert variant="success">تم رفع الصورة بنجاح.</Alert>}
                {uploadError && <Alert variant="error">{uploadError}</Alert>}

                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">
                    اختر الدورة
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-ink-200 bg-white/80 shadow-ring focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:ring-offset-surface-muted"
                  >
                    <option value="">-- اختر دورة --</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourse && (
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 mb-2">
                      تحميل الصورة
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <p className="mt-1 text-sm text-ink-500">الحجم الأقصى 5MB.</p>
                  </div>
                )}

                {uploading && <div className="text-center text-ink-600">جارٍ الرفع...</div>}
              </CardContent>
            </Card>
          )}

          <Card variant="glass" className="panel-pad-sm space-y-3">
            <h3 className="text-lg font-semibold text-ink-900">توصيات سريعة</h3>
            <p className="text-sm text-ink-600">
              حافظ على التقدم الأسبوعي لضمان إكمال المسار في الوقت المحدد.
            </p>
            <Link href="/courses">
              <Button variant="outline" className="w-full">
                استكشاف مسارات جديدة
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
