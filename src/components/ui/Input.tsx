import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, size = 'md', icon, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-10 px-3 text-sm',
      md: 'h-12 px-4 text-base',
      lg: 'h-14 px-5 text-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block mb-1.5 text-sm font-bold text-ink-700 mr-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-ink-400 group-focus-within:text-primary-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full rounded-2xl border bg-white/60 backdrop-blur-md transition-all duration-300',
              'placeholder:text-ink-400',
              'shadow-sm shadow-ink-200/5',
              'focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white/90',
              sizeClasses[size],
              icon && 'pr-10',
              error
                ? 'border-error/50 focus:border-error focus:ring-error/10'
                : 'border-ink-200 focus:border-primary-500',
              'disabled:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-1.5 text-xs font-bold text-error mr-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
