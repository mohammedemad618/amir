'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Table,
} from '@/components/ui';

interface AdminSlot {
  id: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  remaining: number;
  isActive: boolean;
}

interface Booking {
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

interface BookingSchedule {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
  breakMinutes: number;
  timezone: string;
}

export default function AdminBookingsPage() {
  const [slots, setSlots] = useState<AdminSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const [slotDate, setSlotDate] = useState('');
  const [slotStart, setSlotStart] = useState('');
  const [slotEnd, setSlotEnd] = useState('');
  const [slotCapacity, setSlotCapacity] = useState('1');
  const [schedule, setSchedule] = useState<BookingSchedule | null>(null);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  useEffect(() => {
    void fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [slotsRes, bookingsRes, scheduleRes] = await Promise.all([
        fetch('/api/admin/slots', { cache: 'no-store' }),
        fetch('/api/admin/bookings', { cache: 'no-store' }),
        fetch('/api/admin/booking-schedule', { cache: 'no-store' }),
      ]);

      if (slotsRes.ok) {
        const data = await slotsRes.json();
        setSlots(data.slots || []);
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }

      if (scheduleRes.ok) {
        const data = await scheduleRes.json();
        setSchedule(data.schedule || null);
      }
    } catch (err) {
      setError('تعذر تحميل بيانات الحجوزات.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleCreateSlot = async () => {
    if (!slotDate || !slotStart || !slotEnd) {
      setError('يرجى إدخال التاريخ ووقت البداية والنهاية.');
      return;
    }

    const startAt = `${slotDate}T${slotStart}:00`;
    const endAt = `${slotDate}T${slotEnd}:00`;

    try {
      setCreating(true);
      setError(null);
      setSuccess(null);
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startAt,
          endAt,
          capacity: Number(slotCapacity) || 1,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || 'تعذر إنشاء الموعد.');
        return;
      }

      setSuccess('تم إنشاء الموعد بنجاح.');
      setSlotDate('');
      setSlotStart('');
      setSlotEnd('');
      setSlotCapacity('1');
      void fetchAll();
    } catch (err) {
      setError('تعذر إنشاء الموعد.');
    } finally {
      setCreating(false);
    }
  };

  const toggleScheduleDay = (day: number) => {
    setSchedule((prev) => {
      const current = prev ?? {
        daysOfWeek: [],
        startTime: '09:00',
        endTime: '17:00',
        slotMinutes: 30,
        breakMinutes: 0,
        timezone: 'Asia/Riyadh',
      };
      const exists = current.daysOfWeek.includes(day);
      return {
        ...current,
        daysOfWeek: exists
          ? current.daysOfWeek.filter((d) => d !== day)
          : [...current.daysOfWeek, day],
      };
    });
  };

  const handleSaveSchedule = async () => {
    if (!schedule) {
      setError('يرجى إدخال جدول الدوام.');
      return;
    }
    try {
      setScheduleSaving(true);
      setError(null);
      setSuccess(null);
      const res = await fetch('/api/admin/booking-schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || 'تعذر حفظ جدول الدوام.');
        return;
      }
      setSuccess('تم حفظ جدول الدوام بنجاح.');
      setSchedule(payload.schedule);
    } catch (err) {
      setError('تعذر حفظ جدول الدوام.');
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleToggleSlot = async (slot: AdminSlot) => {
    try {
      setUpdating(slot.id);
      const res = await fetch(`/api/admin/slots/${slot.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slot.isActive }),
      });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || 'تعذر تحديث الموعد.');
        return;
      }
      void fetchAll();
    } catch (err) {
      setError('تعذر تحديث الموعد.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموعد؟')) return;
    try {
      setUpdating(slotId);
      const res = await fetch(`/api/admin/slots/${slotId}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || 'تعذر حذف الموعد.');
        return;
      }
      void fetchAll();
    } catch (err) {
      setError('تعذر حذف الموعد.');
    } finally {
      setUpdating(null);
    }
  };

  const handleBookingStatus = async (bookingId: string, status: string) => {
    try {
      setUpdating(bookingId);
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || 'تعذر تحديث الحجز.');
        return;
      }
      void fetchAll();
    } catch (err) {
      setError('تعذر تحديث الحجز.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('هل تريد حذف هذا الحجز نهائياً؟')) return;
    try {
      setUpdating(bookingId);
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json();
        setError(payload.error || 'تعذر حذف الحجز.');
        return;
      }
      void fetchAll();
    } catch (err) {
      setError('تعذر حذف الحجز.');
    } finally {
      setUpdating(null);
    }
  };

  const pendingCount = useMemo(
    () => bookings.filter((booking) => booking.status === 'PENDING').length,
    [bookings]
  );

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container section space-y-6">
        <Card variant="modern" className="panel-pad">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-ink-900">إدارة الحجوزات</h1>
              <p className="text-sm text-ink-600 mt-1">تحكم كامل بالمواعيد وحجوزات العملاء.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="warning">طلبات معلقة: {pendingCount}</Badge>
              <Button variant="outline" onClick={fetchAll}>
                تحديث البيانات
              </Button>
            </div>
          </div>
          {error && <Alert variant="error" className="mt-4">{error}</Alert>}
          {success && <Alert variant="success" className="mt-4">{success}</Alert>}
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
          <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15">
            <CardHeader>
              <CardTitle>إعدادات الدوام التلقائي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">وقت البداية</label>
                  <Input
                    type="time"
                    value={schedule?.startTime ?? '09:00'}
                    onChange={(e) =>
                      setSchedule((prev) => ({
                        ...(prev ?? {
                          daysOfWeek: [],
                          startTime: '09:00',
                          endTime: '17:00',
                          slotMinutes: 30,
                          breakMinutes: 0,
                          timezone: 'Asia/Riyadh',
                        }),
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">وقت النهاية</label>
                  <Input
                    type="time"
                    value={schedule?.endTime ?? '17:00'}
                    onChange={(e) =>
                      setSchedule((prev) => ({
                        ...(prev ?? {
                          daysOfWeek: [],
                          startTime: '09:00',
                          endTime: '17:00',
                          slotMinutes: 30,
                          breakMinutes: 0,
                          timezone: 'Asia/Riyadh',
                        }),
                        endTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">مدة الموعد (دقيقة)</label>
                  <Input
                    type="number"
                    min="10"
                    value={schedule?.slotMinutes ?? 30}
                    onChange={(e) =>
                      setSchedule((prev) => ({
                        ...(prev ?? {
                          daysOfWeek: [],
                          startTime: '09:00',
                          endTime: '17:00',
                          slotMinutes: 30,
                          breakMinutes: 0,
                          timezone: 'Asia/Riyadh',
                        }),
                        slotMinutes: Number(e.target.value) || 30,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">استراحة بين المواعيد</label>
                  <Input
                    type="number"
                    min="0"
                    value={schedule?.breakMinutes ?? 0}
                    onChange={(e) =>
                      setSchedule((prev) => ({
                        ...(prev ?? {
                          daysOfWeek: [],
                          startTime: '09:00',
                          endTime: '17:00',
                          slotMinutes: 30,
                          breakMinutes: 0,
                          timezone: 'Asia/Riyadh',
                        }),
                        breakMinutes: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-ink-700 mb-2">أيام الدوام</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'الأحد', value: 0 },
                    { label: 'الاثنين', value: 1 },
                    { label: 'الثلاثاء', value: 2 },
                    { label: 'الأربعاء', value: 3 },
                    { label: 'الخميس', value: 4 },
                    { label: 'الجمعة', value: 5 },
                    { label: 'السبت', value: 6 },
                  ].map((day) => {
                    const active = schedule?.daysOfWeek?.includes(day.value);
                    return (
                      <Button
                        key={day.value}
                        type="button"
                        variant={active ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => toggleScheduleDay(day.value)}
                      >
                        {day.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button variant="accent" onClick={handleSaveSchedule} disabled={scheduleSaving}>
                {scheduleSaving ? 'جارٍ الحفظ...' : 'حفظ جدول الدوام'}
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15">
            <CardHeader>
              <CardTitle>إنشاء موعد جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button variant="accent" onClick={handleCreateSlot} disabled={creating}>
                {creating ? 'جارٍ الإنشاء...' : 'إضافة الموعد'}
              </Button>
            </CardContent>
          </Card>

          <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15">
            <CardHeader>
              <CardTitle>المواعيد المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-ink-600">جارٍ تحميل المواعيد...</div>
              ) : slots.length === 0 ? (
                <EmptyState
                  title="لا توجد مواعيد"
                  description="أضف أول موعد ليظهر هنا."
                  variant="courses"
                  size="sm"
                />
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-accent-sun/20 bg-white/80 px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold text-ink-900">
                          {formatDate(slot.startAt)} · {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                        </div>
                        <div className="text-xs text-ink-500 mt-1">
                          السعة {slot.capacity} · المحجوز {slot.bookedCount} · المتبقي {slot.remaining}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={slot.isActive ? 'success' : 'error'} size="sm">
                          {slot.isActive ? 'نشط' : 'موقوف'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleSlot(slot)}
                          disabled={updating === slot.id}
                        >
                          {slot.isActive ? 'إيقاف' : 'تفعيل'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={updating === slot.id}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card variant="modern" className="panel-pad">
          <CardHeader>
            <CardTitle>قائمة الحجوزات</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-ink-600">جارٍ تحميل الحجوزات...</div>
            ) : bookings.length === 0 ? (
              <EmptyState
                title="لا توجد حجوزات"
                description="ستظهر الحجوزات هنا بمجرد قيام العملاء بالحجز."
                variant="courses"
                size="sm"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <thead>
                    <tr className="text-ink-500 text-right">
                      <th className="py-3 px-2">المستخدم</th>
                      <th className="py-3 px-2">التاريخ</th>
                      <th className="py-3 px-2">الوقت</th>
                      <th className="py-3 px-2">الحالة</th>
                      <th className="py-3 px-2">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-t border-ink-100">
                        <td className="py-3 px-2">
                          <div className="font-semibold text-ink-900">{booking.user.name}</div>
                          <div className="text-xs text-ink-500">{booking.user.email}</div>
                        </td>
                        <td className="py-3 px-2">{formatDate(booking.slot.startAt)}</td>
                        <td className="py-3 px-2">
                          {formatTime(booking.slot.startAt)} - {formatTime(booking.slot.endAt)}
                        </td>
                        <td className="py-3 px-2">
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
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBookingStatus(booking.id, 'CONFIRMED')}
                              disabled={updating === booking.id}
                            >
                              تأكيد
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBookingStatus(booking.id, 'CANCELLED')}
                              disabled={updating === booking.id}
                            >
                              إلغاء
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBooking(booking.id)}
                              disabled={updating === booking.id}
                            >
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
