'use client';

import React from 'react';
import Image from 'next/image';
import { getIllustrationById } from '@/content/illustrations';

export interface MedicalIllustrationProps {
  id: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
}

const unsplashImages: Record<string, string> = {
  doctorClipboard: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop&q=85',
  nutritionist: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&q=85',
  occupationalTherapy: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&q=85',
  consultationScene: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop&q=85',
};

export const MedicalIllustration: React.FC<MedicalIllustrationProps> = ({
  id,
  alt,
  priority = false,
  className = '',
  width = 600,
  height = 400,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}) => {
  const illustration = getIllustrationById(id);

  if (!illustration) {
    console.warn(`Illustration with id "${id}" not found`);
    return (
      <div
        className={`flex items-center justify-center bg-white/80 rounded-3xl border border-accent-sun/15 ${className}`}
        style={{ width, height, minHeight: height }}
      >
        <div className="text-center p-4 text-ink-600">
          <p className="text-sm">الصورة غير متوفرة</p>
        </div>
      </div>
    );
  }

  const altText = alt || illustration.title;
  const imageSrc = unsplashImages[id] || illustration.assetPath;

  return (
    <div className={`relative ${className}`} style={{ minHeight: height }}>
      <Image
        src={imageSrc}
        alt={altText}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="object-cover rounded-3xl shadow-soft"
        unoptimized={imageSrc.startsWith('http')}
      />
    </div>
  );
};
