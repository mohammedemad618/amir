import React from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block mb-1.5 text-sm font-bold text-ink-700 mr-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full rounded-2xl border bg-white/60 backdrop-blur-md p-4 transition-all duration-300',
            'placeholder:text-ink-400',
            'shadow-sm shadow-ink-200/5',
            'focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white/90',
            error
              ? 'border-error/50 focus:border-error focus:ring-error/10'
              : 'border-ink-200 focus:border-primary-500',
            'disabled:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-[120px] resize-y',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="mt-1.5 text-xs font-bold text-error mr-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
