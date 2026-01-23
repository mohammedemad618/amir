'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  objectives: string;
  hours: number;
  price: number;
  level: string;
  thumbnail?: string | null;
}

interface CourseResource {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  type: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [newResource, setNewResource] = useState<{
    title: string;
    description: string;
    url: string;
    type: string;
  }>({
    title: '',
    description: '',
    url: '',
    type: 'FILE',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses');
      if (!res.ok) {
        throw new Error('تعذر جلب الدورات');
      }
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب الدورات');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setError(null);
    setSuccess(null);
    fetchResources(course.id);
  };

  const handleChange = (field: keyof Course, value: string) => {
    if (!selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      [field]:
        field === 'hours' || field === 'price'
          ? Number(value)
          : value,
    });
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صحيح.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('الحد الأعلى لحجم الصورة هو 5MB.');
      return;
    }

    setError(null);
    setSuccess(null);
    setImageUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedCourse({
        ...selectedCourse,
        thumbnail: base64,
      });
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedCourse) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedCourse.title,
          category: selectedCourse.category,
          description: selectedCourse.description,
          objectives: selectedCourse.objectives,
          hours: selectedCourse.hours,
          price: selectedCourse.price,
          level: selectedCourse.level,
          thumbnail: selectedCourse.thumbnail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'تعذر حفظ التعديلات');
        return;
      }

      setSuccess('تم حفظ بيانات الدورة بنجاح.');
      // حدث القائمة
      setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
      setSelectedCourse(data.course);

      // إذا تم إدخال بيانات مصدر جديد، قم بحفظه أيضًا عند الضغط على زر حفظ التعديلات الرئيسي
      if (newResource.title && newResource.url) {
        await handleAddResource();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ التعديلات');
    } finally {
      setSaving(false);
    }
  };

  const fetchResources = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/resources`);
      if (!res.ok) return;
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching course resources:', error);
    }
  };

  const handleAddResource = async () => {
    if (!selectedCourse) return;
    if (!newResource.title || !newResource.url) {
      setError('يجب إدخال عنوان ورابط للمصدر.');
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر إضافة المصدر');
        return;
      }
      setResources((prev) => [...prev, data.resource]);
      setNewResource({ title: '', description: '', url: '', type: 'FILE' });
      setSuccess('تمت إضافة المصدر بنجاح.');
    } catch (error) {
      setError('حدث خطأ أثناء إضافة المصدر');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!selectedCourse) return;
    if (!confirm('هل أنت متأكد من حذف هذا المصدر؟')) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/resources/${resourceId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر حذف المصدر');
        return;
      }
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
      setSuccess('تم حذف المصدر بنجاح.');
    } catch (error) {
      setError('حدث خطأ أثناء حذف المصدر');
    }
  };

  if (loading) {
    return (
      <div className="container section">
        <p className="text-ink-600">جارٍ تحميل الدورات...</p>
      </div>
    );
  }

  return (
    <div className="container section space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">إدارة الدورات</h1>
          <p className="body-md text-ink-600 mt-1">تحرير بيانات الدورات، الروابط، والتفاصيل الأخرى.</p>
        </div>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
        {/* قائمة الدورات */}
        <Card variant="glass" className="h-full">
          <CardHeader>
            <CardTitle>جميع الدورات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[540px] overflow-auto">
            {courses.length === 0 && (
              <p className="text-sm text-ink-600">لا توجد دورات حالياً.</p>
            )}
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSelectCourse(course)}
                className={`w-full text-right px-4 py-3 rounded-xl border text-sm transition-all ${
                  selectedCourse?.id === course.id
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-ink-100 hover:border-primary-200 hover:bg-ink-50 text-ink-800'
                }`}
              >
                <div className="font-semibold">{course.title}</div>
                <div className="text-xs text-ink-500 mt-1">
                  {course.category} • المستوى: {course.level} • الساعات: {course.hours}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* نموذج تعديل الدورة */}
        <Card variant="elevated" className="h-full">
          <CardHeader>
            <CardTitle>تفاصيل الدورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedCourse ? (
              <p className="text-sm text-ink-600">اختر دورة من القائمة على اليسار لعرض وتعديل بياناتها.</p>
            ) : (
              <>
                <Input
                  label="عنوان الدورة"
                  value={selectedCourse.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />

                <Input
                  label="التصنيف"
                  value={selectedCourse.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                />

                <Textarea
                  label="وصف الدورة"
                  value={selectedCourse.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />

                <Textarea
                  label="الأهداف / الروابط (نص أو JSON أو روابط متعددة)"
                  value={selectedCourse.objectives}
                  onChange={(e) => handleChange('objectives', e.target.value)}
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="عدد الساعات"
                    type="number"
                    value={String(selectedCourse.hours)}
                    onChange={(e) => handleChange('hours', e.target.value)}
                  />
                  <Input
                    label="السعر"
                    type="number"
                    value={String(selectedCourse.price)}
                    onChange={(e) => handleChange('price', e.target.value)}
                  />
                </div>

                <Input
                  label="المستوى (BEGINNER / INTERMEDIATE / ADVANCED)"
                  value={selectedCourse.level}
                  onChange={(e) => handleChange('level', e.target.value)}
                />

                <div className="space-y-3">
                  <Input
                    label="رابط الصورة / الفيديو (thumbnail)"
                    value={selectedCourse.thumbnail || ''}
                    onChange={(e) => handleChange('thumbnail', e.target.value)}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-ink-700">
                      أو قم برفع صورة من جهازك
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      disabled={imageUploading}
                    />
                    <p className="text-xs text-ink-500">الحد الأعلى للحجم 5MB، ويتم حفظها مباشرة في حقل الصورة.</p>
                    {selectedCourse.thumbnail && selectedCourse.thumbnail.startsWith('data:image') && (
                      <div className="mt-2">
                        <p className="text-xs text-ink-500 mb-1">معاينة الصورة الحالية:</p>
                        <img
                          src={selectedCourse.thumbnail}
                          alt={selectedCourse.title}
                          className="max-h-40 rounded-xl border border-ink-100 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full md:w-auto"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                </div>

                <hr className="my-4" />

                <div className="space-y-3">
                  <h3 className="heading-4">مصادر الدورة (ملفات / روابط / اجتماعات)</h3>

                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <div className="space-y-2">
                      <Input
                        label="عنوان المصدر"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                      <Textarea
                        label="وصف قصير (اختياري)"
                        rows={2}
                        value={newResource.description}
                        onChange={(e) =>
                          setNewResource({ ...newResource, description: e.target.value })
                        }
                      />
                      <Input
                        label="الرابط (ملف Google Drive / PDF / رابط Zoom أو Meet...)"
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-ink-700">
                        نوع المصدر
                      </label>
                      <select
                        value={newResource.type}
                        onChange={(e) =>
                          setNewResource({ ...newResource, type: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white/80 shadow-ring focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="FILE">ملف قابل للتحميل</option>
                        <option value="LINK">رابط تعليمي</option>
                        <option value="MEETING">رابط جلسة مباشرة (Zoom / Meet)</option>
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={handleAddResource}
                      >
                        إضافة المصدر إلى الدورة
                      </Button>
                    </div>
                  </div>

                  {resources.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-ink-800">المصادر الحالية:</h4>
                      <ul className="space-y-2">
                        {resources.map((resource) => (
                          <li
                            key={resource.id}
                            className="flex items-start justify-between gap-3 rounded-xl border border-ink-200 bg-white/70 px-3 py-2 text-sm"
                          >
                            <div>
                              <div className="font-semibold text-ink-900">{resource.title}</div>
                              {resource.description && (
                                <div className="text-xs text-ink-600 mt-1">
                                  {resource.description}
                                </div>
                              )}
                              <div className="text-[11px] text-ink-500 mt-1">
                                النوع:{' '}
                                {resource.type === 'MEETING'
                                  ? 'جلسة مباشرة'
                                  : resource.type === 'FILE'
                                  ? 'ملف'
                                  : 'رابط'}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary-700 text-xs underline"
                              >
                                فتح
                              </a>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleDeleteResource(resource.id)}
                              >
                                حذف
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

