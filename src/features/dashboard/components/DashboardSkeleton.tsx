import React from 'react';
import { Card, Skeleton } from '@/components/ui';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="container section">
      <div className="relative overflow-hidden rounded-3xl bg-hero-glow border border-accent-sun/25 shadow-soft panel-pad">
        <div className="space-y-5">
          <div className="space-y-3">
            <Skeleton variant="rectangular" height={28} width="45%" />
            <Skeleton variant="rectangular" height={16} width="35%" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-panel panel-pad-sm">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={36} height={36} />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="rectangular" height={10} width="60%" />
                    <Skeleton variant="rectangular" height={20} width="40%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} variant="glass" motion={false} className="panel-pad-sm">
            <div className="flex items-start gap-4">
              <Skeleton variant="circular" width={48} height={48} />
              <div className="flex-1 space-y-3">
                <Skeleton variant="rectangular" height={16} width="65%" />
                <Skeleton variant="rectangular" height={12} width="90%" />
                <Skeleton variant="rectangular" height={36} width="45%" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
        <div className="space-y-6">
          <Skeleton variant="rectangular" height={20} width="30%" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <Card key={item} variant="elevated" motion={false} className="space-y-4">
                <Skeleton variant="rectangular" height={18} width="70%" />
                <Skeleton variant="rectangular" height={12} width="40%" />
                <Skeleton variant="rectangular" height={10} width="100%" />
                <Skeleton variant="rectangular" height={42} width="100%" />
              </Card>
            ))}
          </div>
          <Skeleton variant="rectangular" height={20} width="35%" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <Card key={item} variant="glass" motion={false} className="space-y-3">
                <Skeleton variant="rectangular" height={18} width="60%" />
                <Skeleton variant="rectangular" height={12} width="90%" />
                <Skeleton variant="rectangular" height={36} width="50%" />
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2].map((item) => (
            <Card key={item} variant="glass" motion={false} className="space-y-3">
              <Skeleton variant="rectangular" height={18} width="60%" />
              <Skeleton variant="rectangular" height={12} width="90%" />
              <Skeleton variant="rectangular" height={12} width="80%" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
