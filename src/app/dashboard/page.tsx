'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  DashboardAchievements,
  DashboardCourses,
  DashboardHeader,
  DashboardQuickActions,
  DashboardSidebar,
  DashboardSkeleton,
  type Course,
  type DashboardStat,
  type Enrollment,
  type User,
} from '@/features/dashboard';

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
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewName, setPreviewName] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      clearPreview();
    }
  }, [selectedCourse]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
        const enrollmentsRes = await fetch('/api/enrollments?includePending=true', { cache: 'no-store' });
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json();
          setEnrollments(enrollmentsData.enrollments || []);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }

      if (userData.user.role === 'ADMIN') {
        try {
          const coursesRes = await fetch('/api/courses', { cache: 'no-store' });
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

  const readFileAsDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setPreviewName('');
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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

    const objectUrl = URL.createObjectURL(file);
    clearPreview();
    setPreviewUrl(objectUrl);
    setPreviewName(file.name);

    try {
      setUploading(true);
      setUploadError('');
      setUploadSuccess(false);

      const base64String = await readFileAsDataUrl(file);

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
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('تعذر رفع الصورة.');
    } finally {
      setUploading(false);
    }
  };

  const trackableEnrollments = useMemo(
    () => enrollments.filter((enrollment) => enrollment.status !== 'PENDING'),
    [enrollments]
  );
  const completedCount = useMemo(
    () => trackableEnrollments.filter((enrollment) => enrollment.status === 'COMPLETED').length,
    [trackableEnrollments]
  );
  const avgProgress = useMemo(() => {
    if (!trackableEnrollments.length) return 0;
    const total = trackableEnrollments.reduce((sum, enrollment) => sum + enrollment.progressPercent, 0);
    return Math.round(total / trackableEnrollments.length);
  }, [trackableEnrollments]);

  const nextEnrollment = enrollments.find((enrollment) => enrollment.status === 'APPROVED');
  const selectedCourseTitle = courses.find((course) => course.id === selectedCourse)?.title;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  const statCards: DashboardStat[] = [
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
      <DashboardHeader userName={user.name} stats={statCards} />
      <DashboardQuickActions
        nextCourse={
          nextEnrollment
            ? { title: nextEnrollment.course.title, href: `/courses/${nextEnrollment.courseId}` }
            : undefined
        }
        isAdmin={isAdmin}
      />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
        <div className="space-y-10">
          <DashboardCourses enrollments={enrollments} />
          <DashboardAchievements enrollments={enrollments} />
        </div>
        <DashboardSidebar
          user={user}
          isAdmin={isAdmin}
          courses={courses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          uploading={uploading}
          uploadError={uploadError}
          uploadSuccess={uploadSuccess}
          previewUrl={previewUrl}
          previewName={previewName}
          selectedCourseTitle={selectedCourseTitle}
          onClearPreview={clearPreview}
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  );
}
