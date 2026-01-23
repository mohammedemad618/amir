'use client';

import { useState, useEffect, useCallback } from 'react';
import { Permission, hasPermission as checkPermission } from '@/lib/auth/permissions';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    hasPermission: (permission: Permission) => boolean;
    hasRole: (role: string) => boolean;
    refetch: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth/me');

            if (!response.ok) {
                if (response.status === 401) {
                    setUser(null);
                    return;
                }
                throw new Error('فشل في جلب بيانات المستخدم');
            }

            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const hasPermission = useCallback(
        (permission: Permission): boolean => {
            if (!user) return false;
            return checkPermission(user.role, permission);
        },
        [user]
    );

    const hasRole = useCallback(
        (role: string): boolean => {
            if (!user) return false;
            return user.role === role;
        },
        [user]
    );

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        hasPermission,
        hasRole,
        refetch: fetchUser,
    };
}
