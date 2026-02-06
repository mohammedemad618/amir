import React from 'react';
import { clsx } from 'clsx';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'dense' | 'spacious';
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const spacing =
      variant === 'dense'
        ? 'lux-table--dense'
        : variant === 'spacious'
        ? 'lux-table--spacious'
        : '';

    return (
      <table
        ref={ref}
        className={clsx('lux-table', spacing, className)}
        {...props}
      />
    );
  }
);

Table.displayName = 'Table';
