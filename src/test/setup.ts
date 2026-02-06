import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('next/link', () => {
  return {
    default: ({ href, children, ...props }: any) => {
      return React.createElement('a', { href, ...props }, children);
    },
  };
});

vi.mock('next/image', () => {
  return {
    default: ({ src, alt, ...props }: any) => {
      return React.createElement('img', { src, alt, ...props });
    },
  };
});
