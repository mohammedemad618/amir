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
          <label htmlFor={props.id} className="block mb-1.5 text-sm font-semibold text-ink-700 mr-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full rounded-2xl border bg-white p-4 transition-all duration-300',
            'placeholder:text-ink-400',
            'shadow-sm',
            'focus:outline-none focus:ring-4 focus:ring-accent-sun/20 focus:bg-white',
            error
              ? 'border-error/50 focus:border-error focus:ring-error/10'
              : 'border-ink-200 focus:border-accent-sun',
            'disabled:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-[120px] resize-y',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="mt-1.5 text-xs font-semibold text-error mr-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
