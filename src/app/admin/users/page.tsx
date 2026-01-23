'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        try {
            setActionLoading(userId);
            const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'تم تحديث حالة المستخدم بنجاح' });
                fetchUsers();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.error || 'فشل تحديث الحالة' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث الحالة' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) {
        return (
            <div className="container section text-center">
                <p className="text-ink-600">جارٍ تحميل المستخدمين...</p>
            </div>
        );
    }

    return (
        <div className="container section">
            {/* Header */}
            <div className="mb-8">
                <h1 className="heading-2">إدارة المستخدمين</h1>
                <p className="body-md text-ink-600 mt-2">عرض وإدارة جميع مستخدمي النظام</p>
            </div>

            {message && (
                <Alert variant={message.type} className="mb-6">
                    {message.text}
                </Alert>
            )}

            {/* Filters */}
            <Card variant="glass" className="mb-6">
                <CardContent className="panel-pad-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">البحث</label>
                            <Input
                                type="text"
                                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">الدور</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-ink-200 bg-white/80 shadow-ring focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            >
                                <option value="ALL">الكل</option>
                                <option value="USER">متدرب</option>
                                <option value="ADMIN">مشرف</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-ink-700 mb-2">الحالة</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-ink-200 bg-white/80 shadow-ring focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            >
                                <option value="ALL">الكل</option>
                                <option value="ACTIVE">نشط</option>
                                <option value="BLOCKED">محظور</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card variant="elevated">
                <CardHeader>
                    <CardTitle>المستخدمون ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-ink-100">
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الاسم</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">البريد الإلكتروني</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الدور</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الحالة</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">تاريخ التسجيل</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-ink-50 hover:bg-ink-25">
                                        <td className="py-3 px-4 text-ink-900">{user.name}</td>
                                        <td className="py-3 px-4 text-ink-600">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={user.role === 'ADMIN' ? 'warning' : 'info'}>
                                                {user.role === 'ADMIN' ? 'مشرف' : 'متدرب'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={user.status === 'ACTIVE' ? 'success' : 'error'}>
                                                {user.status === 'ACTIVE' ? 'نشط' : 'محظور'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-ink-600">
                                            {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button
                                                variant={user.status === 'ACTIVE' ? 'outline' : 'primary'}
                                                size="sm"
                                                onClick={() => handleToggleStatus(user.id, user.status)}
                                                disabled={actionLoading === user.id}
                                            >
                                                {actionLoading === user.id
                                                    ? 'جارٍ...'
                                                    : user.status === 'ACTIVE'
                                                        ? 'حظر'
                                                        : 'إلغاء الحظر'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-ink-500">لا توجد نتائج</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
