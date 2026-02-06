import React from 'react';
import Link from 'next/link';
import { Alert, Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import type { Course, User } from '../types';

interface DashboardSidebarProps {
  user: User;
  isAdmin: boolean;
  courses: Course[];
  selectedCourse: string;
  setSelectedCourse: (value: string) => void;
  uploading: boolean;
  uploadError: string;
  uploadSuccess: boolean;
  previewUrl?: string;
  previewName?: string;
  selectedCourseTitle?: string;
  onClearPreview?: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  isAdmin,
  courses,
  selectedCourse,
  setSelectedCourse,
  uploading,
  uploadError,
  uploadSuccess,
  previewUrl,
  previewName,
  selectedCourseTitle,
  onClearPreview,
  onImageUpload,
}) => {
  return (
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
          <div className="flex items-center gap-2">
            <span className="font-semibold">الدور:</span>
            <Badge variant={user.role === 'ADMIN' ? 'warning' : 'primary'} size="sm">
              {user.role === 'ADMIN' ? 'مشرف' : 'متدرب'}
            </Badge>
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

            <p className="text-sm text-ink-600">
              اختر دورة وحدّث الصورة لتظهر بشكل احترافي في صفحة الدورات.
            </p>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                اختر الدورة
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20 focus:ring-offset-2 focus:ring-offset-surface-muted"
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
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-ink-700">
                  تحميل الصورة
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={uploading}
                />
                <p className="text-sm text-ink-500">الحجم الأقصى 5MB.</p>

                {previewUrl && (
                  <div className="rounded-2xl border border-accent-sun/20 bg-white/70 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-ink-800">معاينة الصورة</div>
                        <div className="text-xs text-ink-500">
                          {selectedCourseTitle || 'الدورة المحددة'}
                        </div>
                      </div>
                      {previewName && (
                        <Badge variant="modern" size="sm">
                          {previewName}
                        </Badge>
                      )}
                    </div>
                    <div className="overflow-hidden rounded-xl border border-ink-100">
                      <img
                        src={previewUrl}
                        alt="معاينة الصورة"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    {onClearPreview && (
                      <Button variant="ghost" size="sm" onClick={onClearPreview}>
                        إزالة المعاينة
                      </Button>
                    )}
                  </div>
                )}

                {uploading && <div className="text-center text-ink-600">جارٍ الرفع...</div>}
              </div>
            )}
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
  );
};
