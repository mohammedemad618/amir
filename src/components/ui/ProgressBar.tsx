import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, label, showValue = true, size = 'md', variant = 'primary', ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary-900 via-primary-700 to-accent-sun',
      success: 'bg-success',
      warning: 'bg-warning',
    };

    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>
        {(label || showValue) && (
          <div className="mb-2 flex items-center justify-between px-0.5">
            {label && <span className="text-sm font-semibold text-ink-800">{label}</span>}
            {showValue && (
              <span className="text-xs font-semibold text-ink-900 bg-accent-sun/20 px-2 py-0.5 rounded-lg border border-accent-sun/40">
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        )}
        <div className={clsx('w-full overflow-hidden rounded-full bg-ink-100/60 shadow-inner', sizeClasses[size])}>
          <div
            className={clsx('h-full transition-all duration-700 ease-out rounded-full shadow-sm', variantClasses[variant])}
            style={{ width: `${clampedValue}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label || 'Progress'}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

