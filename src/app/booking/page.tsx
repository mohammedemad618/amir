'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/components/ui';

interface BookingSlot {
  id: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  remaining: number;
  isActive: boolean;
  userBookingStatus?: string | null;
  userBookingId?: string | null;
}

export default function BookingPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const ensureAuth = async () => {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      void fetchSlots();
    };

    void ensureAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/booking/slots?date=${bookingDate}`, { cache: 'no-store' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.error || 'تعذر جلب المواعيد المتاحة.');
        setSlots([]);
        return;
      }
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      setError('تعذر جلب المواعيد المتاحة.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (slotId: string) => {
    try {
      setSubmittingId(slotId);
      setError(null);
      setSuccess(null);
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || 'تعذر إنشاء الحجز.');
        return;
      }

      setSuccess('تم تأكيد الحجز بنجاح.');
      void fetchSlots();
    } catch (err) {
      setError('تعذر إنشاء الحجز.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      setError(null);
      setSuccess(null);
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL' }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || 'تعذر إلغاء الحجز.');
        return;
      }
      setSuccess('تم إلغاء الحجز بنجاح.');
      void fetchSlots();
    } catch (err) {
      setError('تعذر إلغاء الحجز.');
    } finally {
      setCancellingId(null);
    }
  };

  const openReceipt = (bookingId: string, mode: 'pdf' | 'print') => {
    const url =
      mode === 'print'
        ? `/api/booking/receipt/${bookingId}?format=print`
        : `/api/booking/receipt/${bookingId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formattedDate = useMemo(() => {
    try {
      return new Date(bookingDate).toLocaleDateString('ar-SA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return bookingDate;
    }
  }, [bookingDate]);

  return (
    <div className="container section">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <Card variant="glass" className="panel-pad space-y-6 border-accent-sun/15">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-accent-sun">حجز المواعيد</span>
            <h1 className="heading-2">احجز موعدك عبر التقويم</h1>
            <p className="body-lg text-ink-600">
              اختر التاريخ ثم حدد الوقت المناسب من المواعيد المتاحة.
            </p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-semibold text-ink-700">اختر التاريخ</label>
              <Input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
            <div className="rounded-2xl border border-accent-sun/20 bg-white/80 px-4 py-3 text-sm font-semibold text-ink-700">
              {formattedDate}
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-ink-600">جارٍ تحميل المواعيد...</div>
          ) : slots.length === 0 ? (
            <EmptyState
              title="لا توجد مواعيد متاحة"
              description="جرّب اختيار تاريخ آخر أو عُد لاحقًا لمواعيد جديدة."
              variant="courses"
              size="sm"
            />
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => {
                const status = slot.userBookingStatus;
                const available = slot.remaining > 0;
                return (
                  <Card key={slot.id} variant="elevated" className="panel-pad-sm">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                        </CardTitle>
                        <div className="text-sm text-ink-500">
                          السعة: {slot.capacity} · المتبقي: {slot.remaining}
                        </div>
                      </div>
                      <Badge
                        variant={
                          status === 'CONFIRMED'
                            ? 'success'
                            : status === 'PENDING'
                            ? 'warning'
                            : available
                            ? 'info'
                            : 'error'
                        }
                        size="sm"
                      >
                        {status === 'CONFIRMED'
                          ? 'مؤكد'
                          : status === 'PENDING'
                          ? 'قيد المراجعة'
                          : available
                          ? 'متاح'
                          : 'ممتلئ'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant={available ? 'primary' : 'outline'}
                        className="w-full"
                        disabled={!available || Boolean(status) || submittingId === slot.id}
                        onClick={() => handleBooking(slot.id)}
                      >
                        {status
                          ? 'تم الحجز'
                          : submittingId === slot.id
                          ? 'جارٍ الحجز...'
                          : 'احجز الموعد'}
                      </Button>
                      {slot.userBookingId && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => openReceipt(slot.userBookingId as string, 'pdf')}
                          >
                            تحميل PDF
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => openReceipt(slot.userBookingId as string, 'print')}
                          >
                            طباعة الوصل
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCancelBooking(slot.userBookingId as string)}
                            disabled={cancellingId === slot.userBookingId}
                          >
                            {cancellingId === slot.userBookingId ? 'جارٍ الإلغاء...' : 'إلغاء الحجز'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>

        <Card variant="glass" className="panel-pad space-y-4 border-accent-sun/15 h-fit">
          <h2 className="heading-3">معلومات مهمة</h2>
          <ul className="space-y-3 text-ink-600 text-sm">
            <li>يتم حجز الموعد مباشرة حسب التوفر.</li>
            <li>يمكنك تعديل الحجز عبر التواصل مع الإدارة.</li>
            <li>تأكد من اختيار الوقت المناسب قبل التأكيد.</li>
          </ul>
          <Button variant="outline" onClick={() => router.push('/contact')}>
            تواصل مع الدعم
          </Button>
        </Card>
      </div>
    </div>
  );
}
