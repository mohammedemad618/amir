import React from 'react';
import { clsx } from 'clsx';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'left' | 'center' | 'right';
  showAccent?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  eyebrow,
  align = 'center',
  showAccent = true,
  className,
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const accentAlignClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div className={clsx(alignClasses[align], className)} {...props}>
      {eyebrow && (
        <span className="mb-2 block text-sm font-semibold text-accent-sun">{eyebrow}</span>
      )}
      {showAccent && (
        <span
          className={clsx(
            'mb-4 block h-1 w-12 rounded-full bg-gradient-to-l from-accent-sun to-primary-600',
            accentAlignClasses[align]
          )}
          aria-hidden="true"
        />
      )}
      <h2 className="heading-2 mb-4">{title}</h2>
      {subtitle && <p className="body-lg">{subtitle}</p>}
    </div>
  );
};
