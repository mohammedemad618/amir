import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white shadow-soft hover:shadow-lift hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-primary-300',
        secondary:
          'bg-ink-900 text-white shadow-soft hover:bg-ink-800 hover:shadow-lift hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-ink-300',
        accent:
          'bg-gradient-to-r from-accent-orange to-accent-sun text-white shadow-soft hover:shadow-lift hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-accent-sun',
        outline:
          'border-2 border-ink-200 bg-white/80 text-ink-800 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-[0.98] focus-visible:ring-primary-200',
        ghost:
          'text-ink-700 hover:text-ink-900 hover:bg-ink-100 active:bg-ink-200 focus-visible:ring-ink-200',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-5 text-base',
        lg: 'h-14 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
