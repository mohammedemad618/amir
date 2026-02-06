import React from 'react';
import { clsx } from 'clsx';

const badgeVariants = {
  neutral: 'bg-ink-50 text-ink-700 border border-ink-100',
  success: 'bg-success/10 text-success border border-success/20',
  error: 'bg-error/10 text-error border border-error/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  info: 'bg-info/10 text-info border border-info/20',
  primary: 'bg-accent-sun/15 text-ink-900 border border-accent-sun/40',
  modern: 'bg-white/90 backdrop-blur-sm border border-ink-100 text-ink-700',
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
