import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantClasses = {
    text: 'h-4 rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-ink-100 via-accent-sun/10 to-ink-100 bg-[length:200%_100%] animate-shimmer',
        variantClasses[variant],
        className
      )}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'circular' ? width : undefined),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i < lines - 1 ? 'mb-2.5' : ''}
          style={{ width: i === lines - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-accent-sun/15 bg-white/90 shadow-soft overflow-hidden">
      <Skeleton variant="rectangular" className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <Skeleton variant="rectangular" height={24} width="80%" />
          <Skeleton variant="rectangular" height={24} width="40%" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={70} height={28} className="rounded-full" />
          <Skeleton variant="rectangular" width={70} height={28} className="rounded-full" />
        </div>
        <SkeletonText lines={3} />
        <div className="pt-2 border-t border-ink-50">
          <Skeleton variant="rectangular" height={48} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
