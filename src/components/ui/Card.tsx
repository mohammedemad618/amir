import React from 'react';
import { clsx } from 'clsx';

const cardVariants = {
  default: 'bg-white shadow-soft border border-ink-100',
  elevated: 'bg-white shadow-card border border-ink-100/80 transition-shadow duration-300',
  bordered: 'bg-white border border-ink-200 shadow-ring',
  glass: 'bg-white/90 backdrop-blur-md border border-ink-100/80 shadow-soft',
  modern: 'bg-white shadow-soft border border-ink-100 hover:border-accent-sun/40 transition-all duration-300',
  featured: 'bg-white shadow-card border border-accent-sun/40 relative overflow-hidden',
  interactive: 'bg-white shadow-soft border border-ink-100 hover:shadow-card transition-all duration-300 cursor-pointer',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
  motion?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', motion = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('rounded-2xl p-6', motion && 'lux-card', cardVariants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('mb-5', className)} {...props} />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx('text-xl font-semibold text-ink-900 font-display', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('', className)} {...props} />
));

CardContent.displayName = 'CardContent';
