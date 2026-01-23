'use client';

import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
    animationData: any;
    className?: string;
    loop?: boolean;
    autoplay?: boolean;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
    animationData,
    className = '',
    loop = true,
    autoplay = true,
}) => {
    return (
        <div className={className}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
            />
        </div>
    );
};
