import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted disabled:pointer-events-none disabled:opacity-50 lux-button',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-800 text-white border border-primary-900 shadow-soft hover:bg-primary-900 hover:shadow-lift active:translate-y-[1px] focus-visible:ring-primary-300',
        secondary:
          'bg-ink-900 text-white shadow-soft hover:bg-ink-800 hover:shadow-lift active:translate-y-[1px] focus-visible:ring-ink-300',
        accent:
          'bg-accent-sun text-ink-900 border border-accent-sun/60 shadow-soft hover:bg-[#B8936A] hover:shadow-lift active:translate-y-[1px] focus-visible:ring-accent-sun',
        outline:
          'border border-accent-sun/60 bg-white text-ink-800 hover:border-accent-sun hover:bg-accent-sun/10 active:translate-y-[1px] focus-visible:ring-accent-sun/40',
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
