/**
 * Auth Feature - RequireAuth Component
 * Protects routes by requiring authentication
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '@/components/ui';

interface RequireAuthProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const DefaultLoading = () => (
    <div className="container section">
        <div className="max-w-xl mx-auto glass-panel panel-pad text-center space-y-4">
            <div className="text-sm font-semibold text-accent-sun">جارٍ التحقق من الجلسة</div>
            <Skeleton variant="rectangular" height={14} />
            <Skeleton variant="rectangular" height={14} width="80%" className="mx-auto" />
        </div>
    </div>
);

export function RequireAuth({ children, fallback }: RequireAuthProps) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return fallback || <DefaultLoading />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
