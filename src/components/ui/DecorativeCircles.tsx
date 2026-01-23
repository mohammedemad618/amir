import React from 'react';

interface DecorativeCirclesProps {
    className?: string;
}

export const DecorativeCircles: React.FC<DecorativeCirclesProps> = ({ className = '' }) => {
    return (
        <div className={`decorative-circles absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            {/* Large circle - top right */}
            <div
                className="absolute rounded-full border border-primary-300/30 opacity-50 animate-float"
                style={{
                    width: '400px',
                    height: '400px',
                    top: '-200px',
                    right: '-100px',
                    animationDelay: '0s',
                }}
            />

            {/* Medium circle - top left */}
            <div
                className="absolute rounded-full border border-sky-300/30 opacity-40 animate-float-slow"
                style={{
                    width: '300px',
                    height: '300px',
                    top: '100px',
                    left: '-80px',
                    animationDelay: '1s',
                }}
            />

            {/* Small circle - middle right */}
            <div
                className="absolute rounded-full border border-emerald-300/30 opacity-30 animate-float-slower"
                style={{
                    width: '180px',
                    height: '180px',
                    top: '40%',
                    right: '8%',
                    animationDelay: '2s',
                }}
            />

            {/* Tiny circle - bottom left */}
            <div
                className="absolute rounded-full border border-amber-300/30 opacity-30 animate-float"
                style={{
                    width: '120px',
                    height: '120px',
                    bottom: '15%',
                    left: '12%',
                    animationDelay: '1.5s',
                }}
            />

            {/* Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-400/5 blur-[100px] rounded-full" />
        </div>
    );
};
