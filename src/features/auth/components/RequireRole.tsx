/**
 * Auth Feature - RequireRole Component
 * Protects routes by requiring specific role
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '@/components/ui';

interface RequireRoleProps {
    role: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const DefaultLoading = () => (
    <div className="container section">
        <div className="max-w-xl mx-auto glass-panel panel-pad text-center space-y-4">
            <div className="text-sm font-semibold text-accent-sun">جارٍ التحقق من الصلاحيات</div>
            <Skeleton variant="rectangular" height={14} />
            <Skeleton variant="rectangular" height={14} width="80%" className="mx-auto" />
        </div>
    </div>
);

export function RequireRole({ role, children, fallback }: RequireRoleProps) {
    const { user, loading, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !hasRole(role)) {
            router.push('/403');
        }
    }, [user, loading, hasRole, role, router]);

    if (loading) {
        return fallback || <DefaultLoading />;
    }

    if (!user || !hasRole(role)) {
        return null;
    }

    return <>{children}</>;
}
