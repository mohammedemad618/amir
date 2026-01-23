'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/IconBadge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface DashboardStats {
    totalUsers: number;
    totalEnrollments: number;
    pendingEnrollments: number;
    totalCourses: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalEnrollments: 0,
        pendingEnrollments: 0,
        totalCourses: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            tone: 'sky' as const,
            label: 'إجمالي المستخدمين',
            value: stats.totalUsers,
            href: '/admin/users',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            tone: 'mint' as const,
            label: 'إجمالي التسجيلات',
            value: stats.totalEnrollments,
            href: '/admin/enrollments',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            ),
        },
        {
            tone: 'sun' as const,
            label: 'التسجيلات المعلقة',
            value: stats.pendingEnrollments,
            href: '/admin/enrollments?status=PENDING',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            tone: 'coral' as const,
            label: 'إجمالي الدورات',
            value: stats.totalCourses,
            href: '/courses',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="container section text-center">
                <p className="text-ink-600">جارٍ تحميل الإحصائيات...</p>
            </div>
        );
    }

    return (
        <div className="container section">
            {/* Header */}
            <div className="mb-8">
                <h1 className="heading-2">لوحة تحكم المشرف</h1>
                <p className="body-md text-ink-600 mt-2">نظرة عامة على النظام والإحصائيات</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((item) => (
                    <Link key={item.label} href={item.href}>
                        <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="panel-pad-sm flex items-center gap-4">
                                <IconBadge tone={item.tone} size="md">
                                    {item.icon}
                                </IconBadge>
                                <div>
                                    <div className="text-sm text-ink-500">{item.label}</div>
                                    <div className="text-3xl font-bold text-ink-900">{item.value}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" className="w-full justify-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 ml-2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            إدارة المستخدمين
                        </Button>
                    </Link>

                    <Link href="/admin/admins">
                        <Button variant="outline" className="w-full justify-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 ml-2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            إدارة المشرفين
                        </Button>
                    </Link>

                    <Link href="/admin/enrollments?status=PENDING">
                        <Button variant="outline" className="w-full justify-start">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 ml-2">
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            الموافقة على التسجيلات
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
