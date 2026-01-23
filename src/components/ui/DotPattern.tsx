import React from 'react';

interface DotPatternProps {
    className?: string;
    dense?: boolean;
}

export const DotPattern: React.FC<DotPatternProps> = ({ className = '', dense = false }) => {
    return (
        <div
            className={`absolute inset-0 ${dense ? 'dot-pattern-dense' : 'dot-pattern'} ${className}`}
            aria-hidden="true"
        />
    );
};
