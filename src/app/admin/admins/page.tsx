'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
  Table,
} from '@/components/ui';

interface Admin {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
}

export default function AdminAdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    useEffect(() => {
        fetchAdmins();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setCurrentUserId(data.user.id);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/admins');
            if (response.ok) {
                const data = await response.json();
                setAdmins(data.admins);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNonAdminUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                const nonAdmins = data.users.filter((u: any) => u.role !== 'ADMIN');
                setUsers(nonAdmins);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddAdmin = async () => {
        if (!selectedUserId) {
            setMessage({ type: 'error', text: 'يرجى اختيار مستخدم.' });
            return;
        }

        try {
            setActionLoading('add');
            const response = await fetch('/api/admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUserId }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'تمت ترقية المستخدم إلى مشرف بنجاح.' });
                setShowAddForm(false);
                setSelectedUserId('');
                fetchAdmins();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.error || 'تعذر تنفيذ الترقية.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء الترقية.' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleToggleStatus = async (adminId: string, currentStatus: string) => {
        if (adminId === currentUserId) {
            setMessage({ type: 'error', text: 'لا يمكنك تعطيل حسابك الحالي.' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        try {
            setActionLoading(adminId);
            const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

            const response = await fetch(`/api/admin/admins/${adminId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'تم تحديث حالة المشرف بنجاح.' });
                fetchAdmins();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.error || 'تعذر تحديث الحالة.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث الحالة.' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleShowAddForm = () => {
        setShowAddForm(true);
        fetchNonAdminUsers();
    };

    if (loading) {
        return (
            <div className="container section space-y-6">
                <Card variant="glass" className="border-accent-sun/15" motion={false}>
                    <CardContent className="panel-pad-sm space-y-4">
                        <Skeleton variant="rectangular" height={18} width="40%" />
                        <Skeleton variant="rectangular" height={12} width="70%" />
                    </CardContent>
                </Card>
                <Card variant="elevated" motion={false}>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton variant="rectangular" height={18} width="30%" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} variant="rectangular" height={18} className="rounded-xl" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container section">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="heading-2">إدارة المشرفين</h1>
                    <p className="body-md text-ink-600 mt-2">
                        تحكم أنيق بحسابات المشرفين وصلاحياتهم داخل المنصة.
                    </p>
                </div>
                {!showAddForm && (
                    <Button variant="primary" onClick={handleShowAddForm}>
                        + إضافة مشرف
                    </Button>
                )}
            </div>

            {message && (
                <Alert variant={message.type} className="mb-6">
                    {message.text}
                </Alert>
            )}

            {showAddForm && (
                <Card variant="glass" className="mb-6 border-accent-sun/15" motion={false}>
                    <CardHeader>
                        <CardTitle>إضافة مشرف جديد</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">
                                اختر المستخدم
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full h-12 px-4 rounded-2xl border border-ink-200 bg-white shadow-sm focus:border-accent-sun focus:ring-4 focus:ring-accent-sun/20"
                            >
                                <option value="">-- اختر مستخدمًا --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                onClick={handleAddAdmin}
                                disabled={actionLoading === 'add'}
                            >
                                {actionLoading === 'add' ? 'جارٍ الإضافة...' : 'إضافة'}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                إلغاء
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {admins.length === 0 ? (
                <EmptyState
                    title="لا يوجد مشرفون حتى الآن"
                    description="قم بإضافة مشرف جديد لإدارة المنصة."
                    actionLabel="إضافة مشرف"
                    onAction={handleShowAddForm}
                    variant="admins"
                    size="sm"
                />
            ) : (
                <Card variant="elevated" motion={false}>
                    <CardHeader>
                        <CardTitle>المشرفون ({admins.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table variant="dense">
                                <thead>
                                    <tr>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الاسم</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">البريد الإلكتروني</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الحالة</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">تاريخ الإضافة</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin) => (
                                    <tr key={admin.id}>
                                            <td className="py-3 px-4 text-ink-900">
                                                {admin.name}
                                                {admin.id === currentUserId && (
                                                    <Badge variant="info" className="mr-2">
                                                        أنت
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-ink-600">{admin.email}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={admin.status === 'ACTIVE' ? 'success' : 'error'}>
                                                    {admin.status === 'ACTIVE' ? 'نشط' : 'محظور'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-ink-600">
                                                {new Date(admin.createdAt).toLocaleDateString('ar-SA')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Button
                                                    variant={admin.status === 'ACTIVE' ? 'outline' : 'primary'}
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(admin.id, admin.status)}
                                                    disabled={actionLoading === admin.id || admin.id === currentUserId}
                                                >
                                                    {actionLoading === admin.id
                                                        ? 'جارٍ...'
                                                        : admin.status === 'ACTIVE'
                                                            ? 'تعطيل'
                                                            : 'تفعيل'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
