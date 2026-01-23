'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/lib/auth/permissions';

interface RequirePermissionProps {
    permission: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RequirePermission({ permission, children, fallback }: RequirePermissionProps) {
    const { user, loading, hasPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !hasPermission(permission)) {
            router.push('/403');
        }
    }, [user, loading, hasPermission, permission, router]);

    if (loading) {
        return (
            fallback || (
                <div className="container section text-center">
                    <p className="text-ink-600">جارٍ التحميل...</p>
                </div>
            )
        );
    }

    if (!user || !hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}
