import React from 'react';
import { DecorativeCircles, DotPattern, IconBadge } from '@/components/ui';
import type { DashboardStat } from '../types';

interface DashboardHeaderProps {
  userName: string;
  stats: DashboardStat[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, stats }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-hero-glow border border-accent-sun/25 shadow-soft panel-pad lux-aurora lux-aurora-lite">
      <DecorativeCircles />
      <DotPattern className="opacity-15" />
      <div className="relative space-y-6">
        <div>
          <h1 className="heading-2">لوحة التحكم</h1>
          <p className="body-md text-ink-600">مرحبًا بعودتك، {userName}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((item) => (
            <div key={item.label} className="glass-panel panel-pad-sm flex items-center gap-3">
              <IconBadge tone={item.tone} size="sm">
                {item.icon}
              </IconBadge>
              <div>
                <div className="text-sm text-ink-500">{item.label}</div>
                <div className="text-2xl font-semibold text-ink-900">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
