import React from 'react';
import { clsx } from 'clsx';

const alertVariants = {
  success: 'bg-success/5 border-success/20 text-success shadow-sm shadow-success/5',
  error: 'bg-error/5 border-error/20 text-error shadow-sm shadow-error/5',
  warning: 'bg-warning/5 border-warning/20 text-warning shadow-sm shadow-warning/5',
  info: 'bg-info/5 border-info/20 text-info shadow-sm shadow-info/5',
};

const alertIcons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
  title?: string;
  showIcon?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, showIcon = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          'relative overflow-hidden rounded-2xl border p-4 transition-all duration-300',
          alertVariants[variant],
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          {showIcon && <div className="flex-shrink-0 mt-0.5">{alertIcons[variant]}</div>}
          <div className="flex-1">
            {title && <h4 className="mb-1 font-bold leading-none">{title}</h4>}
            <div className="text-sm opacity-90">{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
