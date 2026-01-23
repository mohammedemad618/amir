import React from 'react';
import { illustrations, getIllustrationsBySource } from '@/content/illustrations';

export const Credits: React.FC = () => {
  const sources = Array.from(new Set(illustrations.map((ill) => ill.sourceName)));

  return (
    <div className="mt-8 space-y-4 border-t border-ink-200 pt-6">
      <h3 className="text-lg font-semibold text-ink-900 font-display">مصادر الرسوم التوضيحية</h3>
      <div className="space-y-4">
        {sources.map((sourceName) => {
          const sourceIllustrations = getIllustrationsBySource(sourceName);
          const firstIll = sourceIllustrations[0];

          return (
            <div key={sourceName} className="text-sm text-ink-300">
              <p className="font-medium text-ink-200">
                {sourceName} - {firstIll.author}
              </p>
              <p className="text-ink-300">الترخيص: {firstIll.license}</p>
              <a
                href={firstIll.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-white hover:underline"
              >
                المزيد من المعلومات
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
