'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RequireAuthProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            fallback || (
                <div className="container section text-center">
                    <p className="text-ink-600">جارٍ التحميل...</p>
                </div>
            )
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
