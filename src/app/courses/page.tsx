'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { CourseCard } from '@/features/courses';
import {
  Button,
  Card,
  CourseCardSkeleton,
  DecorativeCircles,
  DotPattern,
  EmptyState,
  Input,
} from '@/components/ui';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  hours: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
}

const categoryOptions = [
  { value: '', label: 'الكل' },
  { value: 'nutrition', label: 'التغذية العلاجية' },
  { value: 'occupational-therapy', label: 'العلاج الوظيفي' },
];

const levelOptions = [
  { value: '', label: 'الكل' },
  { value: 'BEGINNER', label: 'مبتدئ' },
  { value: 'INTERMEDIATE', label: 'متوسط' },
  { value: 'ADVANCED', label: 'متقدم' },
];

const COURSE_SYNC_KEY = 'courses:updated';
const COURSE_SYNC_CHANNEL = 'courses-updates';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    minPrice: '',
    maxPrice: '',
    minHours: '',
    maxHours: '',
  });

  const fetchCourses = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    try {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minHours) params.append('minHours', filters.minHours);
      if (filters.maxHours) params.append('maxHours', filters.maxHours);

      const res = await fetch(`/api/courses?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('تعذر جلب الدورات.');
      }
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      if (mode === 'initial') {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    void fetchCourses('initial');
  }, [fetchCourses]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COURSE_SYNC_KEY) {
        void fetchCourses('refresh');
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void fetchCourses('refresh');
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(COURSE_SYNC_CHANNEL);
      channel.onmessage = (event) => {
        if (event?.data?.type === 'courses-updated') {
          void fetchCourses('refresh');
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
      channel?.close();
    };
  }, [fetchCourses]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      minPrice: '',
      maxPrice: '',
      minHours: '',
      maxHours: '',
    });
    setQuery('');
  };

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return courses;
    return courses.filter((course) =>
      `${course.title} ${course.description}`.toLowerCase().includes(normalizedQuery)
    );
  }, [courses, query]);

  return (
    <div className="container section">
      <div className="relative overflow-hidden rounded-3xl bg-hero-glow border border-accent-sun/25 shadow-soft lux-aurora lux-aurora-lite">
        <DecorativeCircles />
        <DotPattern className="opacity-20" />
        <div className="relative panel-pad">
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 border border-accent-sun/30 text-sm font-semibold text-ink-700 shadow-sm">
            <svg className="w-4 h-4 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            مسارات تعلم احترافية
          </span>
          <h1 className="heading-1 mt-4 text-ink-900">اختر برنامجك التدريبي المثالي</h1>
          <p className="body-lg mt-3 max-w-2xl text-ink-700">
            برامج مصممة بعناية للارتقاء بالخبرة السريرية مع أدوات تطبيقية واضحة.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <Card variant="modern" className="lg:sticky lg:top-24 h-fit panel-pad-sm space-y-6" motion={false}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-ink-900">بحث سريع</h3>
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن برنامج أو كلمة مفتاحية"
              className="border"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-lg font-semibold text-ink-900">التخصص</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange('category', option.value)}
                  aria-pressed={filters.category === option.value}
                  className={clsx(
                    'px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all',
                    filters.category === option.value
                      ? 'bg-primary-900 text-white border-accent-sun/50 shadow-glow'
                      : 'bg-white text-ink-600 border-ink-200 hover:border-accent-sun/40 hover:text-accent-sun'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-lg font-semibold text-ink-900">المستوى</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange('level', option.value)}
                  aria-pressed={filters.level === option.value}
                  className={clsx(
                    'px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all',
                    filters.level === option.value
                      ? 'bg-primary-900 text-white border-accent-sun/50 shadow-glow'
                      : 'bg-white text-ink-600 border-ink-200 hover:border-accent-sun/40 hover:text-accent-sun'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ink-900">السعر</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="أقل سعر"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="border"
                />
                <Input
                  type="number"
                  placeholder="أعلى سعر"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="border"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-ink-900">الساعات</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="أقل عدد"
                  value={filters.minHours}
                  onChange={(e) => handleFilterChange('minHours', e.target.value)}
                  className="border"
                />
                <Input
                  type="number"
                  placeholder="أعلى عدد"
                  value={filters.maxHours}
                  onChange={(e) => handleFilterChange('maxHours', e.target.value)}
                  className="border"
                />
              </div>
            </div>
          </div>

          <Button variant="accent" onClick={clearFilters} className="w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            إعادة ضبط الفلاتر
          </Button>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-600">
              إجمالي النتائج: <span className="font-semibold">{visibleCourses.length}</span>
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-2 rounded-full border border-accent-sun/25 bg-white/80 text-xs font-semibold text-ink-600">
                {refreshing ? 'جار التحقق من البيانات' : 'تحديث مستمر'}
              </span>
              <span className="px-3 py-2 rounded-full border border-accent-sun/25 bg-white/80 text-xs font-semibold text-ink-600">
                مسارات متخصصة
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : visibleCourses.length === 0 ? (
            <EmptyState
              title="لا توجد دورات مطابقة"
              description="جرّب إزالة بعض الفلاتر أو توسيع البحث."
              actionLabel="إعادة ضبط الفلاتر"
              onAction={clearFilters}
              variant="search"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
              {visibleCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
