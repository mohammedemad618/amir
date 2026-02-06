'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DecorativeCircles,
  DotPattern,
  EmptyState,
  IconBadge,
  Input,
  ProgressBar,
  Skeleton,
  Textarea,
} from '@/components/ui';

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

interface LessonDraft {
  title: string;
  content: string;
  videoUrl: string;
  duration: string;
  order: string;
  isFree: boolean;
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'مبتدئ',
  INTERMEDIATE: 'متوسط',
  ADVANCED: 'متقدم',
};

const levelVariants: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  BEGINNER: 'success',
  INTERMEDIATE: 'warning',
  ADVANCED: 'error',
};

const resourceTypeLabels: Record<string, string> = {
  FILE: 'ملف',
  LINK: 'رابط',
  MEETING: 'جلسة مباشرة',
};

const resourceTypeBadges: Record<string, 'info' | 'primary' | 'warning'> = {
  FILE: 'info',
  LINK: 'primary',
  MEETING: 'warning',
};

const COURSE_SYNC_KEY = 'courses:updated';
const COURSE_SYNC_CHANNEL = 'courses-updates';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourceSaving, setResourceSaving] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [moduleSaving, setModuleSaving] = useState(false);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');
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
  const [newModule, setNewModule] = useState<{ title: string; order: string }>({
    title: '',
    order: '',
  });
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [moduleDraft, setModuleDraft] = useState<{ title: string; order: string } | null>(null);
  const [lessonDrafts, setLessonDrafts] = useState<Record<string, LessonDraft>>({});
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft] = useState<LessonDraft | null>(null);

  useEffect(() => {
    void fetchCourses();
  }, []);

  const notifyCoursesUpdated = () => {
    if (typeof window === 'undefined') return;
    const timestamp = Date.now();
    try {
      localStorage.setItem(COURSE_SYNC_KEY, String(timestamp));
    } catch {
      // Ignore storage errors (e.g. privacy mode)
    }

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(COURSE_SYNC_CHANNEL);
      channel.postMessage({ type: 'courses-updated', at: timestamp });
      channel.close();
    }
  };

  const fetchCourses = async (mode: 'initial' | 'refresh' = 'initial') => {
    try {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      const res = await fetch('/api/courses', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('تعذر جلب الدورات.');
      }
      const data = await res.json();
      const fetchedCourses = data.courses || [];
      setCourses(fetchedCourses);
      if (selectedCourse && !fetchedCourses.find((course: Course) => course.id === selectedCourse.id)) {
        setSelectedCourse(null);
        setResources([]);
        setModules([]);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب الدورات.');
    } finally {
      if (mode === 'initial') {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setError(null);
    setSuccess(null);
    setResources([]);
    setModules([]);
    setNewResource({ title: '', description: '', url: '', type: 'FILE' });
    setNewModule({ title: '', order: '' });
    setLessonDrafts({});
    setEditingModuleId(null);
    setModuleDraft(null);
    setEditingLessonId(null);
    setLessonDraft(null);
    void fetchResources(course.id);
    void fetchModules(course.id);
  };

  const handleChange = (field: keyof Course, value: string) => {
    if (!selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      [field]: field === 'hours' || field === 'price' ? Number(value) : value,
    });
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('الحد الأقصى لحجم الصورة 5MB.');
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

      const res = await fetch(`/api/courses/${selectedCourse.id}` as string, {
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
        setError(data.error || 'تعذر حفظ التعديلات.');
        return;
      }

      setSuccess('تم حفظ بيانات الدورة بنجاح.');
      setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
      setSelectedCourse(data.course);
      notifyCoursesUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ التعديلات.');
    } finally {
      setSaving(false);
    }
  };

  const fetchResources = async (courseId: string) => {
    try {
      setResourcesLoading(true);
      const res = await fetch(`/api/courses/${courseId}/resources`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching course resources:', error);
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    try {
      setModulesLoading(true);
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error('Error fetching course modules:', error);
    } finally {
      setModulesLoading(false);
    }
  };

  const createEmptyLessonDraft = (): LessonDraft => ({
    title: '',
    content: '',
    videoUrl: '',
    duration: '',
    order: '',
    isFree: false,
  });

  const updateLessonDraft = (moduleId: string, changes: Partial<LessonDraft>) => {
    setLessonDrafts((prev) => ({
      ...prev,
      [moduleId]: { ...createEmptyLessonDraft(), ...prev[moduleId], ...changes },
    }));
  };

  const handleAddModule = async () => {
    if (!selectedCourse) return;
    if (!newModule.title.trim()) {
      setError('يرجى إدخال عنوان الوحدة.');
      return;
    }

    try {
      setModuleSaving(true);
      setError(null);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newModule.title.trim(),
          order: newModule.order ? Number(newModule.order) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر إضافة الوحدة.');
        return;
      }
      setSuccess('تمت إضافة الوحدة بنجاح.');
      setNewModule({ title: '', order: '' });
      void fetchModules(selectedCourse.id);
      notifyCoursesUpdated();
    } catch (error) {
      setError('حدث خطأ أثناء إضافة الوحدة.');
    } finally {
      setModuleSaving(false);
    }
  };

  const handleEditModule = (module: Module) => {
    setEditingModuleId(module.id);
    setModuleDraft({ title: module.title, order: String(module.order ?? 0) });
  };

  const handleUpdateModule = async (moduleId: string) => {
    if (!selectedCourse || !moduleDraft) return;
    if (!moduleDraft.title.trim()) {
      setError('يرجى إدخال عنوان الوحدة.');
      return;
    }
    try {
      setModuleSaving(true);
      setError(null);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: moduleDraft.title.trim(),
          order: moduleDraft.order ? Number(moduleDraft.order) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر تحديث الوحدة.');
        return;
      }
      setSuccess('تم تحديث الوحدة بنجاح.');
      setEditingModuleId(null);
      setModuleDraft(null);
      void fetchModules(selectedCourse.id);
      notifyCoursesUpdated();
    } catch (error) {
      setError('حدث خطأ أثناء تحديث الوحدة.');
    } finally {
      setModuleSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!selectedCourse) return;
    if (!confirm('هل أنت متأكد من حذف هذه الوحدة؟ سيتم حذف جميع الدروس التابعة.')) return;

    try {
      setModuleSaving(true);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/modules/${moduleId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر حذف الوحدة.');
        return;
      }
      setSuccess('تم حذف الوحدة بنجاح.');
      if (editingModuleId === moduleId) {
        setEditingModuleId(null);
        setModuleDraft(null);
      }
      void fetchModules(selectedCourse.id);
      notifyCoursesUpdated();
    } catch (error) {
      setError('حدث خطأ أثناء حذف الوحدة.');
    } finally {
      setModuleSaving(false);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!selectedCourse) return;
    const draft = lessonDrafts[moduleId] || createEmptyLessonDraft();
    if (!draft.title.trim()) {
      setError('يرجى إدخال عنوان الدرس.');
      return;
    }

    try {
      setLessonSaving(true);
      setError(null);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title.trim(),
          content: draft.content.trim() || null,
          videoUrl: draft.videoUrl.trim() || null,
          duration: draft.duration ? Number(draft.duration) : null,
          order: draft.order ? Number(draft.order) : undefined,
          isFree: Boolean(draft.isFree),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر إضافة الدرس.');
        return;
      }
      setSuccess('تمت إضافة الدرس بنجاح.');
      updateLessonDraft(moduleId, createEmptyLessonDraft());
      void fetchModules(selectedCourse.id);
      notifyCoursesUpdated();
    } catch (error) {
      setError('حدث خطأ أثناء إضافة الدرس.');
    } finally {
      setLessonSaving(false);
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonDraft({
      title: lesson.title || '',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration ? String(lesson.duration) : '',
      order: String(lesson.order ?? 0),
      isFree: Boolean(lesson.isFree),
    });
  };

  const handleUpdateLesson = async (moduleId: string, lessonId: string) => {
    if (!selectedCourse || !lessonDraft) return;
    if (!lessonDraft.title.trim()) {
      setError('يرجى إدخال عنوان الدرس.');
      return;
    }

    try {
      setLessonSaving(true);
      setError(null);
      const res = await fetch(
        `/api/admin/courses/${selectedCourse.id}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: lessonDraft.title.trim(),
            content: lessonDraft.content.trim() || null,
            videoUrl: lessonDraft.videoUrl.trim() || null,
            duration: lessonDraft.duration ? Number(lessonDraft.duration) : null,
            order: lessonDraft.order ? Number(lessonDraft.order) : 0,
            isFree: Boolean(lessonDraft.isFree),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر تحديث الدرس.');
        return;
      }
      setSuccess('تم تحديث الدرس بنجاح.');
      setEditingLessonId(null);
      setLessonDraft(null);
      void fetchModules(selectedCourse.id);
      notifyCoursesUpdated();
    } catch (error) {
      setError('حدث خطأ أثناء تحديث الدرس.');
    } finally {
      setLessonSaving(false);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!selectedCourse) return;
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;

    try {
      setLessonSaving(true);
      const res = await fetch(
        `/api/admin/courses/${selectedCourse.id}/modules/${moduleId}/lessons/${lessonId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر حذف الدرس.');
        return;
      }
      setSuccess('تم حذف الدرس بنجاح.');
      if (editingLessonId === lessonId) {
        setEditingLessonId(null);
        setLessonDraft(null);
      }
      void fetchModules(selectedCourse.id);
      notifyCoursesUpdated();
    } catch (error) {
      setError('حدث خطأ أثناء حذف الدرس.');
    } finally {
      setLessonSaving(false);
    }
  };

  const handleAddResource = async () => {
    if (!selectedCourse) return;
    if (!newResource.title || !newResource.url) {
      setError('يرجى إدخال عنوان ورابط للمصدر.');
      return;
    }

    try {
      setResourceSaving(true);
      setError(null);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر إضافة المصدر.');
        return;
      }
      setResources((prev) => [...prev, data.resource]);
      notifyCoursesUpdated();
      setNewResource({ title: '', description: '', url: '', type: 'FILE' });
      setSuccess('تمت إضافة المصدر بنجاح.');
    } catch (error) {
      setError('حدث خطأ أثناء إضافة المصدر.');
    } finally {
      setResourceSaving(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!selectedCourse) return;
    if (!confirm('هل أنت متأكد من حذف هذا المصدر؟')) return;

    try {
      setResourceSaving(true);
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}/resources/${resourceId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر حذف المصدر.');
        return;
      }
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
      notifyCoursesUpdated();
      setSuccess('تم حذف المصدر بنجاح.');
    } catch (error) {
      setError('حدث خطأ أثناء حذف المصدر.');
    } finally {
      setResourceSaving(false);
    }
  };

  const handleRefresh = () => {
    void fetchCourses('refresh');
    if (selectedCourse) {
      void fetchResources(selectedCourse.id);
      void fetchModules(selectedCourse.id);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLevelFilter('ALL');
    setCategoryFilter('ALL');
    setSortBy('recent');
  };

  const formatNumber = (value: number) => new Intl.NumberFormat('ar-SA').format(value);
  const formatPrice = (value: number) => (value === 0 ? 'مجانية' : `${formatNumber(value)} ل.س`);
  const resolveCategoryLabel = (value: string) => {
    if (!value) return 'غير مصنفة';
    const normalized = value.toLowerCase();
    if (normalized === 'nutrition') return 'التغذية العلاجية';
    if (normalized === 'occupational') return 'العلاج الوظيفي';
    return value;
  };

  const categories = useMemo(() => {
    const values = courses.map((course) => course.category).filter(Boolean);
    return Array.from(new Set(values));
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let list = [...courses];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter((course) =>
        course.title.toLowerCase().includes(query) || course.category.toLowerCase().includes(query)
      );
    }

    if (levelFilter !== 'ALL') {
      list = list.filter((course) => course.level === levelFilter);
    }

    if (categoryFilter !== 'ALL') {
      list = list.filter((course) => course.category === categoryFilter);
    }

    switch (sortBy) {
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'hours-high':
        list.sort((a, b) => b.hours - a.hours);
        break;
      case 'hours-low':
        list.sort((a, b) => a.hours - b.hours);
        break;
      default:
        break;
    }

    return list;
  }, [courses, searchQuery, levelFilter, categoryFilter, sortBy]);

  const totalCourses = courses.length;
  const totalHours = courses.reduce((sum, course) => sum + (Number(course.hours) || 0), 0);
  const totalPrice = courses.reduce((sum, course) => sum + (Number(course.price) || 0), 0);
  const averagePrice = totalCourses ? Math.round(totalPrice / totalCourses) : 0;
  const averageHours = totalCourses ? (totalHours / totalCourses).toFixed(1) : '0';
  const freeCourses = courses.filter((course) => course.price === 0).length;
  const withThumbnail = courses.filter((course) => Boolean(course.thumbnail)).length;

  const selectedCompletion = selectedCourse
    ? Math.round(
        ([
          selectedCourse.title?.trim(),
          selectedCourse.category?.trim(),
          selectedCourse.description?.trim(),
          selectedCourse.objectives?.trim(),
          selectedCourse.level?.trim(),
          selectedCourse.thumbnail ? '1' : '',
          selectedCourse.hours > 0 ? '1' : '',
          Number.isFinite(selectedCourse.price) ? '1' : '',
        ].filter(Boolean).length /
          8) *
          100
      )
    : 0;

  const completionVariant =
    selectedCompletion >= 80 ? 'success' : selectedCompletion >= 55 ? 'primary' : 'warning';

  const resourceCounts = useMemo(() => {
    return resources.reduce(
      (acc, resource) => {
        const type = resource.type || 'LINK';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      { FILE: 0, LINK: 0, MEETING: 0 } as Record<string, number>
    );
  }, [resources]);

  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [modules]);

  const lessonsCount = useMemo(() => {
    return modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
  }, [modules]);

  const freeLessonsCount = useMemo(() => {
    return modules.reduce(
      (sum, module) => sum + (module.lessons?.filter((lesson) => lesson.isFree)?.length || 0),
      0
    );
  }, [modules]);

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';
  if (loading) {
    return (
      <div className="container section space-y-6">
        <Card variant="glass" className="border-accent-sun/15" motion={false}>
          <CardContent className="panel-pad space-y-4">
            <Skeleton variant="rectangular" height={24} width="40%" />
            <Skeleton variant="rectangular" height={12} width="60%" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={90} />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <Card variant="glass" className="h-full border-accent-sun/15" motion={false}>
            <CardContent className="panel-pad-sm space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={46} className="rounded-2xl" />
              ))}
            </CardContent>
          </Card>
          <Card variant="elevated" className="h-full" motion={false}>
            <CardContent className="panel-pad-sm space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={48} className="rounded-2xl" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container section space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-accent-sun/20 bg-white/90 shadow-soft lux-aurora">
        <DecorativeCircles />
        <DotPattern className="opacity-15" />
        <div className="relative panel-pad space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Badge variant="primary" className="w-fit">
                إدارة المحتوى التدريبي
              </Badge>
              <h1 className="heading-2">إدارة الدورات</h1>
              <p className="body-md text-ink-600">
                تحكم متكامل في الدورات، المحتوى، والمصادر من لوحة واحدة.
              </p>
              <div className="text-xs text-ink-500">آخر تحديث: {lastUpdatedLabel}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'جارٍ التحديث...' : 'تحديث القائمة'}
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                إعادة ضبط الفلاتر
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="modern" className="p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <IconBadge tone="sun" size="sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </IconBadge>
                  <Badge variant="primary" size="sm">{withThumbnail} مع صور</Badge>
                </div>
                <div className="text-2xl font-bold text-ink-900">{formatNumber(totalCourses)}</div>
                <div className="text-sm text-ink-500">إجمالي الدورات</div>
              </CardContent>
            </Card>
            <Card variant="modern" className="p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <IconBadge tone="mint" size="sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </IconBadge>
                  <Badge variant="info" size="sm">{formatNumber(totalCourses - freeCourses)} مدفوعة</Badge>
                </div>
                <div className="text-2xl font-bold text-ink-900">{formatNumber(freeCourses)}</div>
                <div className="text-sm text-ink-500">الدورات المجانية</div>
              </CardContent>
            </Card>
            <Card variant="modern" className="p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <IconBadge tone="sky" size="sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                      <path d="M12 2v20" />
                      <path d="M7 7h10" />
                      <path d="M7 12h10" />
                      <path d="M7 17h10" />
                    </svg>
                  </IconBadge>
                  <span className="text-xs text-ink-400">إجمالي {formatPrice(totalPrice)}</span>
                </div>
                <div className="text-2xl font-bold text-ink-900">{formatPrice(averagePrice)}</div>
                <div className="text-sm text-ink-500">متوسط السعر</div>
              </CardContent>
            </Card>
            <Card variant="modern" className="p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <IconBadge tone="coral" size="sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                      <path d="M12 8v4l3 3" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </IconBadge>
                  <span className="text-xs text-ink-400">متوسط {averageHours} ساعة</span>
                </div>
                <div className="text-2xl font-bold text-ink-900">{formatNumber(totalHours)}</div>
                <div className="text-sm text-ink-500">إجمالي الساعات</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {courses.length === 0 ? (
        <EmptyState
          title="لا توجد دورات حالياً"
          description="أضف أول دورة لتبدأ إدارة المحتوى التدريبي."
          variant="courses"
          size="sm"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <Card variant="glass" className="h-full border-accent-sun/15" motion={false}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle>قائمة الدورات</CardTitle>
                <Badge variant="modern" size="sm">
                  {filteredCourses.length} من {courses.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="بحث سريع"
                  placeholder="ابحث بالعنوان أو التصنيف"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-ink-700">التصنيف</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20"
                  >
                    <option value="ALL">كل التصنيفات</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {resolveCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-ink-700">المستوى</label>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20"
                  >
                    <option value="ALL">كل المستويات</option>
                    {Object.keys(levelLabels).map((level) => (
                      <option key={level} value={level}>
                        {levelLabels[level]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-ink-700">الترتيب</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20"
                  >
                    <option value="recent">الأحدث</option>
                    <option value="title">العنوان (أ-ي)</option>
                    <option value="price-high">الأعلى سعرًا</option>
                    <option value="price-low">الأقل سعرًا</option>
                    <option value="hours-high">الأطول مدة</option>
                    <option value="hours-low">الأقصر مدة</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[620px] overflow-auto">
              {filteredCourses.length === 0 ? (
                <EmptyState
                  title="لا توجد نتائج مطابقة"
                  description="جرّب تعديل الفلاتر أو تغيير كلمة البحث."
                  variant="search"
                  size="sm"
                />
              ) : (
                filteredCourses.map((course) => {
                  const levelLabel = levelLabels[course.level] || course.level;
                  const levelBadge = levelVariants[course.level] || 'primary';
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => handleSelectCourse(course)}
                      className={`w-full text-right rounded-2xl border p-3 transition-all ${
                        selectedCourse?.id === course.id
                          ? 'border-accent-sun/50 bg-accent-sun/10 text-ink-900 shadow-soft'
                          : 'border-ink-100 hover:border-accent-sun/30 hover:bg-white/90 text-ink-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl overflow-hidden bg-ink-100 flex items-center justify-center">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-ink-400">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-ink-900 truncate">{course.title}</div>
                            <Badge variant={levelBadge} size="sm">
                              {levelLabel}
                            </Badge>
                          </div>
                          <div className="text-xs text-ink-500">
                            {resolveCategoryLabel(course.category)} • {course.hours} ساعة • {formatPrice(course.price)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>
          <Card variant="elevated" className="h-full" motion={false}>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>تفاصيل الدورة</CardTitle>
                  <p className="text-sm text-ink-600">قم بتحديث البيانات والمحتوى والمصادر بسهولة.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse && (
                    <Link href={`/courses/${selectedCourse.id}`} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm">
                        عرض صفحة الدورة
                      </Button>
                    </Link>
                  )}
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={!selectedCourse || saving}
                  >
                    {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedCourse ? (
                <EmptyState
                  title="اختر دورة لعرض التفاصيل"
                  description="ستظهر هنا تفاصيل الدورة المختارة لتعديلها وإدارة مواردها."
                  variant="courses"
                  size="sm"
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-6">
                    <div className="rounded-3xl border border-ink-100 bg-white/90 overflow-hidden">
                      <div className="relative h-44 bg-ink-100">
                        {selectedCourse.thumbnail ? (
                          <img
                            src={selectedCourse.thumbnail}
                            alt={selectedCourse.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-ink-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            <span className="text-xs">لا توجد صورة</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge variant="neutral" className="bg-white/90 border border-ink-100">
                            {resolveCategoryLabel(selectedCourse.category)}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-ink-900">{selectedCourse.title}</h3>
                          <Badge variant={levelVariants[selectedCourse.level] || 'primary'} size="sm">
                            {levelLabels[selectedCourse.level] || selectedCourse.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-ink-500 line-clamp-3">
                          {selectedCourse.description || 'أضف وصفًا للدورة لإثراء تجربة المتدربين.'}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-ink-600">
                          <span>{selectedCourse.hours} ساعة</span>
                          <span className="text-ink-300">|</span>
                          <span className="font-semibold text-accent-sun">
                            {formatPrice(selectedCourse.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-3xl border border-ink-100 bg-white/90 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-ink-700">اكتمال البيانات</span>
                          <Badge variant={completionVariant} size="sm">
                            {selectedCompletion}%
                          </Badge>
                        </div>
                        <ProgressBar value={selectedCompletion} variant={completionVariant} showValue={false} size="sm" />
                        <div className="text-xs text-ink-500">
                          اكمل البيانات الأساسية والوصف والوسائط لرفع جودة العرض.
                        </div>
                      </div>
                      <div className="rounded-3xl border border-ink-100 bg-white/90 p-4 space-y-3">
                        <div className="text-sm font-semibold text-ink-700">ملخص المحتوى</div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="info" size="sm">وحدات {formatNumber(modules.length)}</Badge>
                          <Badge variant="primary" size="sm">دروس {formatNumber(lessonsCount)}</Badge>
                          <Badge variant="success" size="sm">مجانية {formatNumber(freeLessonsCount)}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="info" size="sm">ملفات {resourceCounts.FILE}</Badge>
                          <Badge variant="primary" size="sm">روابط {resourceCounts.LINK}</Badge>
                          <Badge variant="warning" size="sm">جلسات {resourceCounts.MEETING}</Badge>
                        </div>
                        <div className="text-xs text-ink-500">
                          إجمالي {formatNumber(resources.length)} مصدر مرفق.
                        </div>
                      </div>
                    </div>
                  </div>

                  <section className="rounded-3xl border border-ink-100 bg-white/90 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <IconBadge tone="sun" size="sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                          <path d="M4 4h16v16H4z" />
                          <path d="M4 9h16" />
                        </svg>
                      </IconBadge>
                      <div>
                        <h3 className="text-lg font-semibold text-ink-900">البيانات الأساسية</h3>
                        <p className="text-xs text-ink-500">تحديث العنوان، التصنيف، والمستوى.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="عنوان الدورة"
                        value={selectedCourse.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                      />
                      <div>
                        <Input
                          label="التصنيف"
                          value={selectedCourse.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          list="course-categories"
                        />
                        <datalist id="course-categories">
                          {categories.map((category) => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block mb-1.5 text-sm font-semibold text-ink-700">المستوى</label>
                        <select
                          value={selectedCourse.level}
                          onChange={(e) => handleChange('level', e.target.value)}
                          className="w-full h-12 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20"
                        >
                          {Object.keys(levelLabels).map((level) => (
                            <option key={level} value={level}>
                              {levelLabels[level]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-ink-100 bg-white/90 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <IconBadge tone="mint" size="sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                          <path d="M4 6h16" />
                          <path d="M4 12h16" />
                          <path d="M4 18h10" />
                        </svg>
                      </IconBadge>
                      <div>
                        <h3 className="text-lg font-semibold text-ink-900">الوصف والأهداف</h3>
                        <p className="text-xs text-ink-500">حدد أهداف الدورة وروابطها لتوضيح القيمة التعليمية.</p>
                      </div>
                    </div>
                    <Textarea
                      label="وصف الدورة"
                      value={selectedCourse.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                    <Textarea
                      label="الأهداف / الروابط (نص أو JSON أو قائمة روابط)"
                      value={selectedCourse.objectives}
                      onChange={(e) => handleChange('objectives', e.target.value)}
                      rows={4}
                    />
                  </section>

                  <section className="rounded-3xl border border-ink-100 bg-white/90 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <IconBadge tone="sky" size="sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                          <path d="M12 3v18" />
                          <path d="M6 8h12" />
                          <path d="M6 16h12" />
                        </svg>
                      </IconBadge>
                      <div>
                        <h3 className="text-lg font-semibold text-ink-900">المدة والسعر</h3>
                        <p className="text-xs text-ink-500">قم بتحديد عدد الساعات والسعر المناسبين.</p>
                      </div>
                    </div>
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
                  </section>

                  <section className="rounded-3xl border border-ink-100 bg-white/90 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <IconBadge tone="coral" size="sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M8 10l4 4 4-4" />
                        </svg>
                      </IconBadge>
                      <div>
                        <h3 className="text-lg font-semibold text-ink-900">الوسائط البصرية</h3>
                        <p className="text-xs text-ink-500">أضف رابط الصورة أو ارفع صورة جديدة للدورة.</p>
                      </div>
                    </div>
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
                      <p className="text-xs text-ink-500">
                        الحد الأقصى للحجم 5MB، ويتم حفظها مباشرة في بيانات الصورة.
                      </p>
                      {selectedCourse.thumbnail && (
                        <div className="mt-2">
                          <p className="text-xs text-ink-500 mb-1">معاينة الصورة الحالية:</p>
                          <img
                            src={selectedCourse.thumbnail}
                            alt={selectedCourse.title}
                            className="max-h-40 rounded-2xl border border-ink-100 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-ink-100 bg-white/90 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <IconBadge tone="mint" size="sm">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                            <path d="M4 4h16v16H4z" />
                            <path d="M4 9h16" />
                            <path d="M4 15h8" />
                          </svg>
                        </IconBadge>
                        <div>
                          <h3 className="text-lg font-semibold text-ink-900">الوحدات والدروس</h3>
                          <p className="text-xs text-ink-500">إنشاء وحدات تدريبية وإضافة الدروس مع إمكانية التعديل.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="info" size="sm">وحدات {formatNumber(modules.length)}</Badge>
                        <Badge variant="primary" size="sm">دروس {formatNumber(lessonsCount)}</Badge>
                        <Badge variant="success" size="sm">مجانية {formatNumber(freeLessonsCount)}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-3 items-end">
                      <Input
                        label="عنوان الوحدة الجديدة"
                        value={newModule.title}
                        onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                      />
                      <Input
                        label="الترتيب (اختياري)"
                        type="number"
                        value={newModule.order}
                        onChange={(e) => setNewModule({ ...newModule, order: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddModule}
                        disabled={moduleSaving}
                      >
                        {moduleSaving ? 'جارٍ الإضافة...' : 'إضافة وحدة'}
                      </Button>
                    </div>

                    {modulesLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <Skeleton key={index} variant="rectangular" height={140} />
                        ))}
                      </div>
                    ) : sortedModules.length > 0 ? (
                      <div className="space-y-4">
                        {sortedModules.map((module) => {
                          const moduleLessons = [...(module.lessons || [])].sort(
                            (a, b) => (a.order ?? 0) - (b.order ?? 0)
                          );
                          const moduleDraftActive = editingModuleId === module.id;
                          const draft = lessonDrafts[module.id] || createEmptyLessonDraft();

                          return (
                            <div
                              key={module.id}
                              className="rounded-2xl border border-accent-sun/15 bg-white/90 p-4 space-y-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                {moduleDraftActive && moduleDraft ? (
                                  <div className="flex flex-1 flex-col md:flex-row gap-3">
                                    <Input
                                      label="عنوان الوحدة"
                                      value={moduleDraft.title}
                                      onChange={(e) =>
                                        setModuleDraft({ ...moduleDraft, title: e.target.value })
                                      }
                                    />
                                    <Input
                                      label="الترتيب"
                                      type="number"
                                      value={moduleDraft.order}
                                      onChange={(e) =>
                                        setModuleDraft({ ...moduleDraft, order: e.target.value })
                                      }
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="text-lg font-semibold text-ink-900">{module.title}</div>
                                    <div className="text-xs text-ink-500">
                                      ترتيب {module.order} • {moduleLessons.length} درس
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {moduleDraftActive ? (
                                    <>
                                      <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleUpdateModule(module.id)}
                                        disabled={moduleSaving}
                                      >
                                        {moduleSaving ? 'جارٍ الحفظ...' : 'حفظ الوحدة'}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingModuleId(null);
                                          setModuleDraft(null);
                                        }}
                                      >
                                        إلغاء
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditModule(module)}
                                      >
                                        تعديل الوحدة
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteModule(module.id)}
                                        disabled={moduleSaving}
                                      >
                                        حذف
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-ink-700">إضافة درس جديد</span>
                                  <Badge variant="neutral" size="sm">ترتيب تلقائي إذا لم تحدد</Badge>
                                </div>
                                <Input
                                  label="عنوان الدرس"
                                  value={draft.title}
                                  onChange={(e) => updateLessonDraft(module.id, { title: e.target.value })}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <Input
                                    label="رابط الفيديو"
                                    value={draft.videoUrl}
                                    onChange={(e) => updateLessonDraft(module.id, { videoUrl: e.target.value })}
                                  />
                                  <Input
                                    label="المدة (دقيقة)"
                                    type="number"
                                    value={draft.duration}
                                    onChange={(e) => updateLessonDraft(module.id, { duration: e.target.value })}
                                  />
                                  <Input
                                    label="الترتيب"
                                    type="number"
                                    value={draft.order}
                                    onChange={(e) => updateLessonDraft(module.id, { order: e.target.value })}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`free-${module.id}`}
                                    type="checkbox"
                                    checked={draft.isFree}
                                    onChange={(e) => updateLessonDraft(module.id, { isFree: e.target.checked })}
                                    className="h-4 w-4 rounded border-ink-300 text-accent-sun focus:ring-accent-sun/30"
                                  />
                                  <label htmlFor={`free-${module.id}`} className="text-sm text-ink-700">
                                    درس مجاني
                                  </label>
                                </div>
                                <Textarea
                                  label="محتوى الدرس"
                                  rows={3}
                                  value={draft.content}
                                  onChange={(e) => updateLessonDraft(module.id, { content: e.target.value })}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleAddLesson(module.id)}
                                  disabled={lessonSaving}
                                >
                                  {lessonSaving ? 'جارٍ الإضافة...' : 'إضافة الدرس'}
                                </Button>
                              </div>

                              {moduleLessons.length > 0 ? (
                                <div className="space-y-3">
                                  {moduleLessons.map((lesson) => {
                                    const isEditing = editingLessonId === lesson.id;
                                    const activeDraft = lessonDraft || createEmptyLessonDraft();
                                    return (
                                      <div
                                        key={lesson.id}
                                        className="rounded-2xl border border-ink-100 bg-white p-4 space-y-3"
                                      >
                                        {isEditing ? (
                                          <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <Input
                                                label="عنوان الدرس"
                                                value={activeDraft.title}
                                                onChange={(e) =>
                                                  setLessonDraft({ ...activeDraft, title: e.target.value })
                                                }
                                              />
                                              <Input
                                                label="رابط الفيديو"
                                                value={activeDraft.videoUrl}
                                                onChange={(e) =>
                                                  setLessonDraft({ ...activeDraft, videoUrl: e.target.value })
                                                }
                                              />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <Input
                                                label="المدة (دقيقة)"
                                                type="number"
                                                value={activeDraft.duration}
                                                onChange={(e) =>
                                                  setLessonDraft({ ...activeDraft, duration: e.target.value })
                                                }
                                              />
                                              <Input
                                                label="الترتيب"
                                                type="number"
                                                value={activeDraft.order}
                                                onChange={(e) =>
                                                  setLessonDraft({ ...activeDraft, order: e.target.value })
                                                }
                                              />
                                              <div className="flex items-center gap-2 pt-6">
                                                <input
                                                  id={`free-edit-${lesson.id}`}
                                                  type="checkbox"
                                                  checked={activeDraft.isFree}
                                                  onChange={(e) =>
                                                    setLessonDraft({ ...activeDraft, isFree: e.target.checked })
                                                  }
                                                  className="h-4 w-4 rounded border-ink-300 text-accent-sun focus:ring-accent-sun/30"
                                                />
                                                <label htmlFor={`free-edit-${lesson.id}`} className="text-sm text-ink-700">
                                                  درس مجاني
                                                </label>
                                              </div>
                                            </div>
                                            <Textarea
                                              label="محتوى الدرس"
                                              rows={3}
                                              value={activeDraft.content}
                                              onChange={(e) =>
                                                setLessonDraft({ ...activeDraft, content: e.target.value })
                                              }
                                            />
                                            <div className="flex flex-wrap gap-2">
                                              <Button
                                                type="button"
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleUpdateLesson(module.id, lesson.id)}
                                                disabled={lessonSaving}
                                              >
                                                {lessonSaving ? 'جارٍ الحفظ...' : 'حفظ الدرس'}
                                              </Button>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  setEditingLessonId(null);
                                                  setLessonDraft(null);
                                                }}
                                              >
                                                إلغاء
                                              </Button>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div className="space-y-1">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold text-ink-900">{lesson.title}</span>
                                                <Badge variant={lesson.isFree ? 'success' : 'neutral'} size="sm">
                                                  {lesson.isFree ? 'مجاني' : 'مدفوع'}
                                                </Badge>
                                                <Badge variant="modern" size="sm">ترتيب {lesson.order}</Badge>
                                              </div>
                                              <div className="text-xs text-ink-500">
                                                المدة: {lesson.duration ? `${lesson.duration} دقيقة` : 'غير محددة'}
                                              </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditLesson(lesson)}
                                              >
                                                تعديل
                                              </Button>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                disabled={lessonSaving}
                                              >
                                                حذف
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <EmptyState
                                  title="لا توجد دروس بعد"
                                  description="ابدأ بإضافة أول درس لهذه الوحدة."
                                  variant="courses"
                                  size="sm"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        title="لا توجد وحدات حالياً"
                        description="أضف أول وحدة لتبدأ تنظيم محتوى الدروس."
                        variant="courses"
                        size="sm"
                      />
                    )}
                  </section>

                  <section className="rounded-3xl border border-ink-100 bg-white/90 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <IconBadge tone="ink" size="sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                          <path d="M4 4h16v16H4z" />
                          <path d="M4 9h16" />
                        </svg>
                      </IconBadge>
                      <div>
                        <h3 className="text-lg font-semibold text-ink-900">مصادر الدورة</h3>
                        <p className="text-xs text-ink-500">
                          أضف الملفات والروابط والجلسات المباشرة لإثراء المحتوى.
                        </p>
                      </div>
                    </div>

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
                          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        />
                        <Input
                          label="الرابط (Google Drive / PDF / Zoom / Meet)"
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
                          onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                          className="w-full h-11 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20"
                        >
                          <option value="FILE">ملف قابل للتحميل</option>
                          <option value="LINK">رابط تعليمي</option>
                          <option value="MEETING">جلسة مباشرة (Zoom / Meet)</option>
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={handleAddResource}
                          disabled={resourceSaving}
                        >
                          {resourceSaving ? 'جارٍ الإضافة...' : 'إضافة المصدر إلى الدورة'}
                        </Button>
                      </div>
                    </div>

                    {resourcesLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={index} variant="rectangular" height={64} />
                        ))}
                      </div>
                    ) : resources.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold text-ink-800">المصادر الحالية:</h4>
                        <ul className="space-y-2">
                          {resources.map((resource) => (
                            <li
                              key={resource.id}
                              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-accent-sun/15 bg-white/80 px-3 py-3 text-sm"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-ink-900">{resource.title}</span>
                                  <Badge variant={resourceTypeBadges[resource.type] || 'primary'} size="sm">
                                    {resourceTypeLabels[resource.type] || resource.type}
                                  </Badge>
                                </div>
                                {resource.description && (
                                  <div className="text-xs text-ink-600">{resource.description}</div>
                                )}
                                <div className="text-[11px] text-ink-500 break-all">{resource.url}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-accent-sun text-xs font-semibold underline"
                                >
                                  فتح
                                </a>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteResource(resource.id)}
                                  disabled={resourceSaving}
                                >
                                  حذف
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <EmptyState
                        title="لا توجد مصادر حالياً"
                        description="أضف ملفات أو روابط أو جلسات مباشرة لتقديم محتوى غني."
                        variant="enrollments"
                        size="sm"
                      />
                    )}
                  </section>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
