import React from 'react';

interface DecorativeCirclesProps {
    className?: string;
}

export const DecorativeCircles: React.FC<DecorativeCirclesProps> = ({ className = '' }) => {
    return (
        <div className={`decorative-circles absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            {/* Large circle - top right */}
            <div
                className="absolute rounded-full border border-accent-sun/35 opacity-35 animate-float-slow"
                style={{
                    width: '360px',
                    height: '360px',
                    top: '-180px',
                    right: '-120px',
                }}
            />

            {/* Medium circle - top left */}
            <div
                className="absolute rounded-full border border-accent-sun/25 opacity-25 animate-float-slower"
                style={{
                    width: '260px',
                    height: '260px',
                    top: '120px',
                    left: '-90px',
                }}
            />

            {/* Small circle - middle right */}
            <div
                className="absolute rounded-full border border-accent-sun/20 opacity-20 animate-float-slow"
                style={{
                    width: '160px',
                    height: '160px',
                    top: '42%',
                    right: '10%',
                }}
            />

            {/* Tiny circle - bottom left */}
            <div
                className="absolute rounded-full border border-accent-sun/25 opacity-20 animate-float-slower"
                style={{
                    width: '120px',
                    height: '120px',
                    bottom: '18%',
                    left: '12%',
                }}
            />

            {/* Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-sun/8 blur-[140px] rounded-full animate-glow-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-400/6 blur-[140px] rounded-full animate-glow-pulse" />
        </div>
    );
};
