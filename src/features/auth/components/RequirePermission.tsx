/**
 * Auth Feature - RequirePermission Component
 * Protects routes by requiring specific permission
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Permission } from '@/lib/auth/permissions';
import { Skeleton } from '@/components/ui';

interface RequirePermissionProps {
    permission: Permission;
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

export function RequirePermission({ permission, children, fallback }: RequirePermissionProps) {
    const { user, loading, hasPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !hasPermission(permission)) {
            router.push('/403');
        }
    }, [user, loading, hasPermission, permission, router]);

    if (loading) {
        return fallback || <DefaultLoading />;
    }

    if (!user || !hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}
