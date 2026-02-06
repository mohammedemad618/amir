'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Alert,
    DecorativeCircles,
    DotPattern,
    EmptyState,
    IconBadge,
    Input,
    ProgressBar,
    Skeleton,
    SkeletonText,
    Table,
} from '@/components/ui';

interface DashboardStats {
    totalUsers: number;
    totalEnrollments: number;
    pendingEnrollments: number;
    totalCourses: number;
}

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
        category?: string;
    };
}

interface BookingSlot {
    id: string;
    startAt: string;
    endAt: string;
    capacity: number;
    bookedCount: number;
    remaining: number;
    isActive: boolean;
}

interface BookingItem {
    id: string;
    status: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    slot: {
        id: string;
        startAt: string;
        endAt: string;
    };
}

interface StatCardItem {
    tone: 'sky' | 'mint' | 'sun' | 'coral';
    label: string;
    value: number;
    href: string;
    description: string;
    helper: string;
    icon: React.ReactNode;
}

interface OperationRow {
    label: string;
    value: string;
    note: string;
    badge: 'success' | 'warning' | 'info' | 'primary';
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalEnrollments: 0,
        pendingEnrollments: 0,
        totalCourses: 0,
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [reviewEnrollments, setReviewEnrollments] = useState<Enrollment[]>([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [bookingLoading, setBookingLoading] = useState(true);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
    const [slotDate, setSlotDate] = useState('');
    const [slotStart, setSlotStart] = useState('');
    const [slotEnd, setSlotEnd] = useState('');
    const [slotCapacity, setSlotCapacity] = useState('1');
    const [slotCreating, setSlotCreating] = useState(false);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchReviewData = async (showLoader = false) => {
        try {
            if (showLoader) {
                setReviewLoading(true);
            }
            const response = await fetch('/api/admin/enrollments');
            if (response.ok) {
                const data = await response.json();
                setReviewEnrollments(data.enrollments || []);
            }
        } catch (error) {
            console.error('Error fetching review data:', error);
        } finally {
            if (showLoader) {
                setReviewLoading(false);
            }
        }
    };

    const fetchBookingSummary = async () => {
        try {
            setBookingLoading(true);
            setBookingError(null);
            const [slotsRes, bookingsRes] = await Promise.all([
                fetch(`/api/admin/slots?from=${new Date().toISOString()}`, { cache: 'no-store' }),
                fetch('/api/admin/bookings', { cache: 'no-store' }),
            ]);

            if (slotsRes.ok) {
                const data = await slotsRes.json();
                setBookingSlots((data.slots || []).slice(0, 5));
            }

            if (bookingsRes.ok) {
                const data = await bookingsRes.json();
                setBookings((data.bookings || []).slice(0, 6));
            }
        } catch (error) {
            setBookingError('تعذر تحميل بيانات الحجوزات.');
        } finally {
            setBookingLoading(false);
        }
    };

    const loadDashboard = async (mode: 'initial' | 'refresh' = 'initial') => {
        if (mode === 'refresh') {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            await Promise.all([fetchStats(), fetchReviewData(mode === 'initial'), fetchBookingSummary()]);
        } finally {
            if (mode === 'refresh') {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
            setLastUpdated(new Date());
        }
    };

    const handleRefresh = () => {
        void loadDashboard('refresh');
    };

    useEffect(() => {
        void loadDashboard();
    }, []);

    const formatNumber = (value: number) => new Intl.NumberFormat('ar-SA').format(value);
    const formatDecimal = (value: number, digits = 1) => (Number.isFinite(value) ? value.toFixed(digits) : '0');
    const formatDateShort = (value: string) =>
        new Date(value).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    const formatDateFull = (value: string) =>
        new Date(value).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
    const formatTime = (value: string) =>
        new Date(value).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    const getEnrollmentStatusUI = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { label: 'قيد الانتظار', badge: 'warning' as const, tone: 'sun' as const };
            case 'APPROVED':
                return { label: 'موافق عليه', badge: 'success' as const, tone: 'mint' as const };
            case 'REJECTED':
                return { label: 'مرفوض', badge: 'error' as const, tone: 'coral' as const };
            case 'COMPLETED':
                return { label: 'مكتمل', badge: 'info' as const, tone: 'sky' as const };
            default:
                return { label: status, badge: 'primary' as const, tone: 'ink' as const };
        }
    };

    const pendingRate = useMemo(() => {
        if (!stats.totalEnrollments) return 0;
        return (stats.pendingEnrollments / stats.totalEnrollments) * 100;
    }, [stats.pendingEnrollments, stats.totalEnrollments]);

    const enrollmentsPerCourse = useMemo(() => {
        if (!stats.totalCourses) return 0;
        return stats.totalEnrollments / stats.totalCourses;
    }, [stats.totalCourses, stats.totalEnrollments]);

    const enrollmentsPerUser = useMemo(() => {
        if (!stats.totalUsers) return 0;
        return stats.totalEnrollments / stats.totalUsers;
    }, [stats.totalUsers, stats.totalEnrollments]);

    const coursesPer100Users = useMemo(() => {
        if (!stats.totalUsers) return 0;
        return Math.round((stats.totalCourses / stats.totalUsers) * 100);
    }, [stats.totalCourses, stats.totalUsers]);

    const pendingRateRounded = Math.round(pendingRate);
    const pendingBadgeVariant: 'success' | 'warning' | 'info' =
        pendingRateRounded > 25 ? 'warning' : pendingRateRounded > 0 ? 'info' : 'success';
    const pendingBadgeLabel =
        pendingRateRounded > 25 ? 'مراجعة عاجلة' : pendingRateRounded > 0 ? 'قيد المتابعة' : 'مستقر';

    const statCards: StatCardItem[] = [
        {
            tone: 'sky',
            label: 'إجمالي المستخدمين',
            value: stats.totalUsers,
            href: '/admin/users',
            description: 'إدارة الحسابات النشطة وتعقب نمو المنصة.',
            helper: `متوسط ${formatDecimal(enrollmentsPerUser)} تسجيل/مستخدم`,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            tone: 'mint',
            label: 'إجمالي التسجيلات',
            value: stats.totalEnrollments,
            href: '/admin/enrollments',
            description: 'متابعة تدفق التسجيلات ومستوى التفاعل.',
            helper: `متوسط ${formatDecimal(enrollmentsPerCourse)} لكل دورة`,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            ),
        },
        {
            tone: 'sun',
            label: 'الطلبات المعلقة',
            value: stats.pendingEnrollments,
            href: '/admin/enrollments?status=PENDING',
            description: 'الطلبات التي تحتاج مراجعة سريعة اليوم.',
            helper: `نسبة ${pendingRateRounded}% من الإجمالي`,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            tone: 'coral',
            label: 'إجمالي الدورات',
            value: stats.totalCourses,
            href: '/admin/courses',
            description: 'توزيع المحتوى وتحسين تجربة التعلم.',
            helper: `${formatNumber(coursesPer100Users)} دورة لكل 100 مستخدم`,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            ),
        },
    ];

    const operationsRows: OperationRow[] = [
        {
            label: 'متوسط التسجيل لكل مستخدم',
            value: `${formatDecimal(enrollmentsPerUser)} تسجيل`,
            note: 'قياس التفاعل العام',
            badge: 'info',
        },
        {
            label: 'متوسط التسجيل لكل دورة',
            value: `${formatDecimal(enrollmentsPerCourse)} تسجيل`,
            note: 'توازن الإقبال',
            badge: 'primary',
        },
        {
            label: 'نسبة الطلبات المعلقة',
            value: `${pendingRateRounded}%`,
            note: pendingRateRounded > 25 ? 'تحتاج تسريع' : pendingRateRounded > 0 ? 'ضمن المراقبة' : 'مستقر',
            badge: pendingRateRounded > 25 ? 'warning' : pendingRateRounded > 0 ? 'info' : 'success',
        },
        {
            label: 'دورات لكل 100 مستخدم',
            value: `${formatNumber(coursesPer100Users)} دورة`,
            note: 'عمق المحتوى المتاح',
            badge: 'primary',
        },
    ];

    const pendingReviewEnrollments = reviewEnrollments.filter((enrollment) => enrollment.status === 'PENDING');
    const reviewList = pendingReviewEnrollments.length > 0
        ? pendingReviewEnrollments.slice(0, 4)
        : reviewEnrollments.slice(0, 4);
    const reviewDescription = pendingReviewEnrollments.length > 0
        ? 'طلبات التسجيل المعلّقة تظهر هنا للمتابعة السريعة.'
        : 'أحدث عمليات التسجيل للمراجعة السريعة.';

    const lastUpdatedLabel = lastUpdated
        ? lastUpdated.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })
        : '—';

    const handleCreateSlot = async () => {
        if (!slotDate || !slotStart || !slotEnd) {
            setBookingError('يرجى إدخال التاريخ ووقت البداية والنهاية.');
            return;
        }

        try {
            setSlotCreating(true);
            setBookingError(null);
            setBookingSuccess(null);
            const startAt = `${slotDate}T${slotStart}:00`;
            const endAt = `${slotDate}T${slotEnd}:00`;

            const response = await fetch('/api/admin/slots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startAt,
                    endAt,
                    capacity: Number(slotCapacity) || 1,
                }),
            });

            const payload = await response.json();
            if (!response.ok) {
                setBookingError(payload.error || 'تعذر إنشاء الموعد.');
                return;
            }

            setBookingSuccess('تمت إضافة الموعد بنجاح.');
            setSlotDate('');
            setSlotStart('');
            setSlotEnd('');
            setSlotCapacity('1');
            void fetchBookingSummary();
        } catch (error) {
            setBookingError('تعذر إنشاء الموعد.');
        } finally {
            setSlotCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="container section space-y-8">
                <Card variant="glass" className="border-accent-sun/15" motion={false}>
                    <CardContent className="panel-pad space-y-6">
                        <div className="space-y-3">
                            <Skeleton variant="rectangular" height={22} width="35%" />
                            <SkeletonText lines={2} />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height={44} width={150} />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height={160} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8">
                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardContent className="panel-pad space-y-5">
                            <Skeleton variant="rectangular" height={18} width="30%" />
                            <SkeletonText lines={3} />
                            <Skeleton variant="rectangular" height={12} width="80%" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" height={90} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardContent className="panel-pad space-y-4">
                            <Skeleton variant="rectangular" height={18} width="40%" />
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height={64} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container section space-y-10">
            <section className="relative overflow-hidden rounded-3xl border border-accent-sun/20 bg-white/90 shadow-soft lux-aurora">
                <DecorativeCircles />
                <DotPattern className="opacity-15" />
                <span
                    className="absolute -top-16 right-8 h-40 w-40 rounded-full bg-accent-sun/25 blur-3xl animate-pulse-slow"
                    aria-hidden="true"
                />
                <span
                    className="absolute bottom-6 left-8 h-32 w-32 rounded-full bg-accent-mint/20 blur-3xl animate-float-slow"
                    aria-hidden="true"
                />
                <div className="relative panel-pad space-y-10">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
                        <div className="space-y-5 animate-fade-up">
                            <Badge variant="primary" className="w-fit">
                                نظرة تنفيذية
                            </Badge>
                            <div>
                                <h1 className="heading-2">مركز الإدارة الذكي</h1>
                                <p className="body-md text-ink-600 mt-3">
                                    لوحة مركّزة لمتابعة الأداء التشغيلي واتخاذ قرارات سريعة بثقة.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/admin/enrollments?status=PENDING">
                                    <Button variant="primary">مراجعة التسجيلات المعلقة</Button>
                                </Link>
                                <Link href="/admin/users">
                                    <Button variant="outline">إدارة المستخدمين</Button>
                                </Link>
                                <Link href="/admin/courses">
                                    <Button variant="outline">تحديث الدورات</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="glass-panel p-6 md:p-8 shadow-glow animate-fade-in">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-ink-500">آخر تحديث</span>
                                <div className="flex items-center gap-2">
                                    <Badge variant={pendingBadgeVariant} size="sm">
                                        {pendingBadgeLabel}
                                    </Badge>
                                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                                        {refreshing ? 'جارٍ التحديث...' : 'تحديث البيانات'}
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-3 text-2xl font-semibold text-ink-900">{lastUpdatedLabel}</div>
                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl border border-ink-100 bg-white/80 p-3">
                                    <div className="text-ink-500">نسبة المعلّق</div>
                                    <div className="text-lg font-semibold text-ink-900">{pendingRateRounded}%</div>
                                </div>
                                <div className="rounded-2xl border border-ink-100 bg-white/80 p-3">
                                    <div className="text-ink-500">تسجيل لكل دورة</div>
                                    <div className="text-lg font-semibold text-ink-900">
                                        {formatDecimal(enrollmentsPerCourse)}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-ink-100 bg-white/80 p-3">
                                    <div className="text-ink-500">تسجيل لكل مستخدم</div>
                                    <div className="text-lg font-semibold text-ink-900">
                                        {formatDecimal(enrollmentsPerUser)}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-ink-100 bg-white/80 p-3">
                                    <div className="text-ink-500">دورات لكل 100 مستخدم</div>
                                    <div className="text-lg font-semibold text-ink-900">{formatNumber(coursesPer100Users)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
                        {statCards.map((item) => (
                            <Link key={item.label} href={item.href} className="group">
                                <Card
                                    variant="modern"
                                    className="h-full p-5 bg-white/95 border-accent-sun/10 group-hover:shadow-card transition-all"
                                >
                                    <CardContent className="p-0 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <IconBadge tone={item.tone} size="md">
                                                {item.icon}
                                            </IconBadge>
                                            <span className="text-[11px] font-semibold text-ink-500 bg-ink-50 px-2 py-1 rounded-full border border-ink-100">
                                                {item.helper}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-ink-900">{formatNumber(item.value)}</div>
                                            <div className="text-sm font-semibold text-ink-700 mt-1">{item.label}</div>
                                        </div>
                                        <p className="text-xs text-ink-500 leading-relaxed">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8">
                <div className="space-y-8">
                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardHeader className="space-y-2">
                            <CardTitle>نبض المنصة</CardTitle>
                            <p className="text-sm text-ink-600">مؤشرات تشغيلية تلخص معدل التفاعل والانتظار.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ProgressBar
                                label="معدل الطلبات المعلقة"
                                value={pendingRateRounded}
                                variant={pendingRateRounded > 25 ? 'warning' : pendingRateRounded > 0 ? 'primary' : 'success'}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="surface-panel p-4">
                                    <div className="text-sm text-ink-500">إجمالي التسجيلات</div>
                                    <div className="text-2xl font-semibold text-ink-900">{formatNumber(stats.totalEnrollments)}</div>
                                    <span className="text-xs text-ink-500">نشاط المنصة الإجمالي</span>
                                </div>
                                <div className="surface-panel p-4">
                                    <div className="text-sm text-ink-500">متوسط التسجيل</div>
                                    <div className="text-2xl font-semibold text-ink-900">{formatDecimal(enrollmentsPerUser)}</div>
                                    <span className="text-xs text-ink-500">لكل مستخدم نشط</span>
                                </div>
                                <div className="surface-panel p-4">
                                    <div className="text-sm text-ink-500">توازن الدورات</div>
                                    <div className="text-2xl font-semibold text-ink-900">{formatDecimal(enrollmentsPerCourse)}</div>
                                    <span className="text-xs text-ink-500">تسجيل لكل دورة</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" className="border-accent-sun/10" motion={false}>
                        <CardHeader className="space-y-2">
                            <CardTitle>مركز العمليات</CardTitle>
                            <p className="text-sm text-ink-600">صورة مركزة لتوازن المحتوى ومعدل الإنجاز.</p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table variant="spacious">
                                    <thead>
                                        <tr>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">المؤشر</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">القيمة</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-ink-700">الملاحظة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {operationsRows.map((row) => (
                                            <tr key={row.label}>
                                                <td className="py-3 px-4 text-ink-900 font-semibold">{row.label}</td>
                                                <td className="py-3 px-4 text-ink-700">{row.value}</td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={row.badge} size="sm">
                                                        {row.note}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardHeader className="space-y-2">
                            <CardTitle>إجراءات سريعة</CardTitle>
                            <p className="text-sm text-ink-600">اختصارات مباشرة لإدارة الحسابات والمحتوى.</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/admin/users" className="group block">
                                <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 p-4 transition-all group-hover:shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <IconBadge tone="sky" size="sm">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                        </IconBadge>
                                        <div>
                                            <div className="font-semibold text-ink-900">إدارة المستخدمين</div>
                                            <div className="text-xs text-ink-500">تفعيل وتعطيل الحسابات بسهولة.</div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-ink-400">↗</span>
                                </div>
                            </Link>
                            <Link href="/admin/admins" className="group block">
                                <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 p-4 transition-all group-hover:shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <IconBadge tone="mint" size="sm">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                <path d="M2 17l10 5 10-5" />
                                            </svg>
                                        </IconBadge>
                                        <div>
                                            <div className="font-semibold text-ink-900">إدارة المشرفين</div>
                                            <div className="text-xs text-ink-500">تحديث الصلاحيات وتوزيع المهام.</div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-ink-400">↗</span>
                                </div>
                            </Link>
                            <Link href="/admin/enrollments?status=PENDING" className="group block">
                                <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 p-4 transition-all group-hover:shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <IconBadge tone="sun" size="sm">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        </IconBadge>
                                        <div>
                                            <div className="font-semibold text-ink-900">مراجعة التسجيلات</div>
                                            <div className="text-xs text-ink-500">متابعة الطلبات المعلقة بسرعة.</div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-ink-400">↗</span>
                                </div>
                            </Link>
                            <Link href="/admin/courses" className="group block">
                                <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 p-4 transition-all group-hover:shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <IconBadge tone="coral" size="sm">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                            </svg>
                                        </IconBadge>
                                        <div>
                                            <div className="font-semibold text-ink-900">إدارة الدورات</div>
                                            <div className="text-xs text-ink-500">تحسين المحتوى ومسار التعلم.</div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-ink-400">↗</span>
                                </div>
                            </Link>
                            <Link href="/admin/bookings" className="group block">
                                <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 p-4 transition-all group-hover:shadow-soft">
                                    <div className="flex items-center gap-3">
                                        <IconBadge tone="sun" size="sm">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                        </IconBadge>
                                        <div>
                                            <div className="font-semibold text-ink-900">إدارة الحجوزات</div>
                                            <div className="text-xs text-ink-500">ضبط المواعيد ومتابعة الطلبات.</div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-ink-400">↗</span>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardHeader className="space-y-2">
                            <CardTitle>تحديد المواعيد المتاحة</CardTitle>
                            <p className="text-sm text-ink-600">اضبط الأيام والأوقات لتظهر للمستخدمين فورًا.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {bookingError && <Alert variant="error">{bookingError}</Alert>}
                            {bookingSuccess && <Alert variant="success">{bookingSuccess}</Alert>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700 mb-2">التاريخ</label>
                                    <Input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700 mb-2">السعة</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={slotCapacity}
                                        onChange={(e) => setSlotCapacity(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700 mb-2">وقت البداية</label>
                                    <Input type="time" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-ink-700 mb-2">وقت النهاية</label>
                                    <Input type="time" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="accent" onClick={handleCreateSlot} disabled={slotCreating}>
                                    {slotCreating ? 'جارٍ الإضافة...' : 'إضافة الموعد'}
                                </Button>
                                <Link href="/admin/bookings">
                                    <Button variant="outline">إدارة كاملة للحجوزات</Button>
                                </Link>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-ink-700">أقرب المواعيد</div>
                                {bookingLoading ? (
                                    <div className="text-sm text-ink-500">جارٍ تحميل المواعيد...</div>
                                ) : bookingSlots.length === 0 ? (
                                    <EmptyState
                                        title="لا توجد مواعيد بعد"
                                        description="أضف موعدًا ليظهر هنا للمستخدمين."
                                        variant="courses"
                                        size="sm"
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        {bookingSlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 px-4 py-3"
                                            >
                                                <div>
                                                    <div className="font-semibold text-ink-900">
                                                        {formatDateFull(slot.startAt)} • {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                                                    </div>
                                                    <div className="text-xs text-ink-500">
                                                        السعة {slot.capacity} · المتبقي {slot.remaining}
                                                    </div>
                                                </div>
                                                <Badge variant={slot.isActive ? 'success' : 'error'} size="sm">
                                                    {slot.isActive ? 'نشط' : 'موقوف'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardHeader className="space-y-2">
                            <CardTitle>آخر الحجوزات</CardTitle>
                            <p className="text-sm text-ink-600">تظهر هنا آخر الحجوزات التي قام بها المستخدمون.</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {bookingLoading ? (
                                <div className="text-sm text-ink-500">جارٍ تحميل الحجوزات...</div>
                            ) : bookings.length === 0 ? (
                                <EmptyState
                                    title="لا توجد حجوزات"
                                    description="ستظهر الحجوزات الجديدة فور قيام المستخدم بالحجز."
                                    variant="courses"
                                    size="sm"
                                />
                            ) : (
                                bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 px-4 py-3"
                                    >
                                        <div>
                                            <div className="font-semibold text-ink-900">{booking.user.name}</div>
                                            <div className="text-xs text-ink-500">
                                                {formatDateFull(booking.slot.startAt)} • {formatTime(booking.slot.startAt)}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                booking.status === 'CONFIRMED'
                                                    ? 'success'
                                                    : booking.status === 'CANCELLED'
                                                    ? 'error'
                                                    : 'warning'
                                            }
                                            size="sm"
                                        >
                                            {booking.status === 'CONFIRMED'
                                                ? 'مؤكد'
                                                : booking.status === 'CANCELLED'
                                                ? 'ملغي'
                                                : 'معلق'}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card variant="glass" className="border-accent-sun/15" motion={false}>
                        <CardHeader className="space-y-2">
                            <div className="flex items-center justify-between">
                                <CardTitle>قائمة المراجعة</CardTitle>
                                {pendingReviewEnrollments.length > 0 && (
                                    <Badge variant="warning" size="sm">
                                        {pendingReviewEnrollments.length} طلب
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-ink-600">{reviewDescription}</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reviewLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton key={index} variant="rectangular" height={64} />
                                    ))}
                                </div>
                            ) : reviewList.length > 0 ? (
                                reviewList.map((enrollment) => {
                                    const statusUI = getEnrollmentStatusUI(enrollment.status);
                                    const reviewHref =
                                        enrollment.status === 'PENDING'
                                            ? '/admin/enrollments?status=PENDING'
                                            : '/admin/enrollments';
                                    return (
                                        <Link key={enrollment.id} href={reviewHref} className="group block">
                                            <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/90 p-4 transition-all group-hover:shadow-soft">
                                                <div className="flex items-center gap-3">
                                                    <IconBadge tone={statusUI.tone} size="sm">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
                                                            <path d="M4 4h16v16H4z" />
                                                            <path d="M4 9h16" />
                                                        </svg>
                                                    </IconBadge>
                                                    <div>
                                                        <div className="font-semibold text-ink-900">{enrollment.course.title}</div>
                                                        <div className="text-xs text-ink-500">
                                                            {enrollment.user.name} • {formatDateShort(enrollment.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant={statusUI.badge} size="sm">
                                                    {statusUI.label}
                                                </Badge>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <EmptyState
                                    title="لا توجد طلبات للمراجعة"
                                    description="ستظهر طلبات التسجيل الجديدة هنا فور وصولها."
                                    variant="enrollments"
                                    size="sm"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
