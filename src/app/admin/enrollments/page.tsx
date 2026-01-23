'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';

interface Enrollment {
    id: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    course: {
        id: string;
        title: string;
        category: string;
    };
}

export default function AdminEnrollmentsPage() {
    const searchParams = useSearchParams();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'ALL');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/enrollments');
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data.enrollments);
            }
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (enrollmentId: string) => {
        try {
            setActionLoading(enrollmentId);
            const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'APPROVED' }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'تمت الموافقة على التسجيل بنجاح' });
                fetchEnrollments();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.error || 'فشلت الموافقة' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الموافقة' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleReject = async (enrollmentId: string) => {
        if (!confirm('هل أنت متأكد من رفض هذا التسجيل؟')) {
            return;
        }

        try {
            setActionLoading(enrollmentId);
            const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REJECTED' }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'تم رفض التسجيل' });
                fetchEnrollments();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.error || 'فشل الرفض' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الرفض' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredEnrollments = enrollments.filter((enrollment) => {
        if (statusFilter === 'ALL') return true;
        return enrollment.status === statusFilter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="warning">قيد الانتظار</Badge>;
            case 'APPROVED':
                return <Badge variant="success">موافق عليه</Badge>;
            case 'REJECTED':
                return <Badge variant="error">مرفوض</Badge>;
            case 'COMPLETED':
                return <Badge variant="info">مكتمل</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="container section text-center">
                <p className="text-ink-600">جارٍ تحميل التسجيلات...</p>
            </div>
        );
    }

    const pendingCount = enrollments.filter((e) => e.status === 'PENDING').length;

    return (
        <div className="container section">
            {/* Header */}
            <div className="mb-8">
                <h1 className="heading-2">إدارة التسجيلات</h1>
                <p className="body-md text-ink-600 mt-2">
                    الموافقة على طلبات التسجيل في الدورات
                    {pendingCount > 0 && (
                        <Badge variant="warning" className="mr-2">
                            {pendingCount} طلب معلق
                        </Badge>
                    )}
                </p>
            </div>

            {message && (
                <Alert variant={message.type} className="mb-6">
                    {message.text}
                </Alert>
            )}

            {/* Filter */}
            <Card variant="glass" className="mb-6">
                <CardContent className="panel-pad-sm">
                    <div className="flex gap-4 items-center">
                        <label className="text-sm font-semibold text-ink-700">تصفية حسب الحالة:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 px-4 rounded-xl border border-ink-200 bg-white/80 shadow-ring focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        >
                            <option value="ALL">الكل</option>
                            <option value="PENDING">قيد الانتظار</option>
                            <option value="APPROVED">موافق عليه</option>
                            <option value="REJECTED">مرفوض</option>
                            <option value="COMPLETED">مكتمل</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Enrollments List */}
            <div className="space-y-4">
                {filteredEnrollments.map((enrollment) => (
                    <Card key={enrollment.id} variant="elevated">
                        <CardContent className="panel-pad-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-ink-900">
                                            {enrollment.course.title}
                                        </h3>
                                        {getStatusBadge(enrollment.status)}
                                    </div>
                                    <div className="space-y-1 text-sm text-ink-600">
                                        <p>
                                            <span className="font-semibold">المتدرب:</span> {enrollment.user.name} (
                                            {enrollment.user.email})
                                        </p>
                                        <p>
                                            <span className="font-semibold">التصنيف:</span> {enrollment.course.category}
                                        </p>
                                        <p>
                                            <span className="font-semibold">تاريخ الطلب:</span>{' '}
                                            {new Date(enrollment.createdAt).toLocaleDateString('ar-SA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {enrollment.status === 'PENDING' && (
                                    <div className="flex gap-3">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleApprove(enrollment.id)}
                                            disabled={actionLoading === enrollment.id}
                                        >
                                            {actionLoading === enrollment.id ? 'جارٍ...' : 'موافقة'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleReject(enrollment.id)}
                                            disabled={actionLoading === enrollment.id}
                                        >
                                            رفض
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredEnrollments.length === 0 && (
                    <Card variant="glass">
                        <CardContent className="panel-pad text-center text-ink-500">
                            لا توجد تسجيلات
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
