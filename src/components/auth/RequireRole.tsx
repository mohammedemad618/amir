'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RequireRoleProps {
    role: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RequireRole({ role, children, fallback }: RequireRoleProps) {
    const { user, loading, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !hasRole(role)) {
            router.push('/403');
        }
    }, [user, loading, hasRole, role, router]);

    if (loading) {
        return (
            fallback || (
                <div className="container section text-center">
                    <p className="text-ink-600">جارٍ التحميل...</p>
                </div>
            )
        );
    }

    if (!user || !hasRole(role)) {
        return null;
    }

    return <>{children}</>;
}
