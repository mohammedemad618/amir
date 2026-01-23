import React from 'react';
import { clsx } from 'clsx';

const toneClasses = {
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  sky: 'bg-accent-sky/15 text-accent-sky border-accent-sky/30',
  coral: 'bg-accent-coral/15 text-accent-coral border-accent-coral/30',
  sun: 'bg-accent-sun/15 text-accent-sun border-accent-sun/30',
  mint: 'bg-accent-mint/15 text-accent-mint border-accent-mint/30',
  ink: 'bg-ink-100 text-ink-700 border-ink-200',
};

const sizeClasses = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-14 h-14 text-lg',
};

export interface IconBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneClasses;
  size?: keyof typeof sizeClasses;
}

export const IconBadge = React.forwardRef<HTMLSpanElement, IconBadgeProps>(
  ({ tone = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-2xl border shadow-ring',
          toneClasses[tone],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

IconBadge.displayName = 'IconBadge';
