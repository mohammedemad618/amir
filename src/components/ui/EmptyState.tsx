import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Button } from './Button';
import { IconBadge } from './IconBadge';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  tone?: 'sun' | 'mint' | 'sky' | 'coral' | 'ink';
  size?: 'sm' | 'md';
  variant?: 'default' | 'users' | 'admins' | 'courses' | 'enrollments' | 'search';
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

const defaultIcons: Record<string, React.ReactNode> = {
  inbox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M4 4h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
      <path d="M4 13h4l2 3h4l2-3h4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  admins: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  courses: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5z" />
    </svg>
  ),
  enrollments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  tone = 'sun',
  size = 'md',
  variant = 'default',
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  className,
}) => {
  const sizeClasses = size === 'sm' ? 'panel-pad-sm' : 'panel-pad';
  const iconSize = size === 'sm' ? 'md' : 'lg';
  const titleClass = size === 'sm' ? 'text-base' : 'text-lg';
  const resolvedIcon = icon || defaultIcons[variant] || defaultIcons.inbox;
  return (
    <div
      className={clsx(
        `glass-panel text-center space-y-4 border border-accent-sun/15 ${sizeClasses}`,
        className
      )}
    >
      <div className="flex justify-center">
        <IconBadge tone={tone} size={iconSize} className="shadow-soft">
          {resolvedIcon}
        </IconBadge>
      </div>
      <div className="space-y-2">
        <h3 className={`${titleClass} font-semibold text-ink-900`}>{title}</h3>
        {description && <p className="text-sm text-ink-600">{description}</p>}
      </div>
      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actionLabel && (actionHref || onAction) && (
            actionHref ? (
              <Link href={actionHref}>
                <Button variant="primary">{actionLabel}</Button>
              </Link>
            ) : (
              <Button variant="primary" onClick={onAction}>
                {actionLabel}
              </Button>
            )
          )}
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref}>
              <Button variant="outline">{secondaryLabel}</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
