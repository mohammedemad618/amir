import React from 'react';
import { clsx } from 'clsx';

const badgeVariants = {
  neutral: 'bg-ink-50 text-ink-700 border border-ink-100',
  success: 'bg-success/10 text-success border border-success/20 shadow-sm shadow-success/5',
  error: 'bg-error/10 text-error border border-error/20 shadow-sm shadow-error/5',
  warning: 'bg-warning/10 text-warning border border-warning/20 shadow-sm shadow-warning/5',
  info: 'bg-info/10 text-info border border-info/20 shadow-sm shadow-info/5',
  primary: 'bg-primary-50 text-primary-700 border border-primary-100 shadow-sm shadow-primary-500/5',
  modern: 'bg-white/80 backdrop-blur-sm border border-white/50 shadow-glass text-ink-700',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full font-bold transition-all duration-300',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          badgeVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
