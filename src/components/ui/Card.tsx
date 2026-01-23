import React from 'react';
import { clsx } from 'clsx';

const cardVariants = {
  default: 'bg-white shadow-soft border border-ink-100',
  elevated: 'bg-white shadow-card border border-ink-100/70 hover:shadow-lift transition-shadow duration-300',
  bordered: 'bg-white border border-ink-200 shadow-ring',
  glass: 'bg-white/75 backdrop-blur-xl border border-white/70 shadow-soft',
  modern: 'bg-white shadow-card border-2 border-ink-100 hover:border-primary-200 hover:shadow-glow transition-all duration-300',
  featured: 'bg-white shadow-glow-lg border-2 border-primary-200 relative overflow-hidden',
  interactive: 'bg-white shadow-card border border-ink-100 hover:scale-[1.02] hover:shadow-lift transition-all duration-300 cursor-pointer',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('rounded-2xl p-6', cardVariants[variant], className)}
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
