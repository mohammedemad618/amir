import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  hours: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
  isEnrolled?: boolean;
  progressPercent?: number;
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

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  category,
  description,
  hours,
  price,
  level,
  thumbnail,
  isEnrolled = false,
  progressPercent = 0,
}) => {
  return (
    <Card
      variant="modern"
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-glow p-0"
    >
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-primary-50 via-sky-50 to-white">
        {thumbnail ? (
          <>
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary-100 via-sky-50 to-white">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
                aria-hidden="true"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-primary-700">صورة الدورة</span>
          </div>
        )}

        {/* Category badge overlay */}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="neutral" className="bg-white/95 backdrop-blur-sm shadow-md font-bold">
            {category === 'nutrition' ? 'التغذية العلاجية' : 'العلاج الوظيفي'}
          </Badge>
        </div>
      </div>

      <div className="panel-pad-sm flex flex-col gap-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug group-hover:text-primary-600 transition-colors">{title}</CardTitle>
            {isEnrolled && (
              <Badge variant="info" className="flex-shrink-0 shadow-sm">
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                مسجل
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={levelVariants[level]} className="font-bold">{levelLabels[level]}</Badge>
          </div>
        </div>

        <p className="body-md line-clamp-3 flex-1">{description}</p>

        {isEnrolled && progressPercent > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-ink-700">التقدم</span>
              <span className="text-primary-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm pt-2 border-t border-ink-100">
          <div className="flex items-center gap-1.5 text-ink-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{hours} ساعة</span>
          </div>
          <span className="text-ink-300">|</span>
          <span className="font-bold text-lg bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {price === 0 ? 'مجاني' : `${price} ل.س`}
          </span>
        </div>

        <Link href={`/courses/${id}`} className="block mt-auto">
          <Button variant="primary" className="w-full group-hover:shadow-lg transition-shadow">
            {isEnrolled ? 'متابعة الدورة' : 'عرض التفاصيل'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>
      </div>
    </Card>
  );
};
