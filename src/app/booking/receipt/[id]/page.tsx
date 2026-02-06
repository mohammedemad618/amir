'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';

interface BookingReceipt {
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

export default function BookingReceiptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const receiptId = params.id as string;
  const [booking, setBooking] = useState<BookingReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/booking/receipt/${receiptId}?format=json`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          setError(payload.error || 'تعذر جلب بيانات الوصل.');
          return;
        }
        const data = await res.json();
        setBooking(data.booking);
      } catch (err) {
        setError('تعذر جلب بيانات الوصل.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [receiptId]);

  useEffect(() => {
    if (searchParams.get('print') === '1') {
      setTimeout(() => window.print(), 400);
    }
  }, [searchParams]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const statusLabel = useMemo(() => {
    if (!booking) return '';
    if (booking.status === 'CONFIRMED') return 'مؤكد';
    if (booking.status === 'CANCELLED') return 'ملغي';
    return 'معلق';
  }, [booking]);

  return (
    <div className="container section">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card variant="glass" className="panel-pad border-accent-sun/20">
          <CardHeader className="space-y-2">
            <div className="h-1.5 w-16 rounded-full bg-accent-sun/70" />
            <span className="text-xs uppercase tracking-widest text-ink-500">
              AMER ARABI • MEDICAL EDUCATION
            </span>
            <CardTitle className="text-3xl">وصل حجز موعد</CardTitle>
            <p className="text-sm text-ink-500">
              وثيقة رسمية تؤكد تفاصيل موعدك لدى المنصة.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton variant="rectangular" height={36} />
                <Skeleton variant="rectangular" height={120} />
              </div>
            ) : error ? (
              <Alert variant="error">{error}</Alert>
            ) : booking ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent-sun/20 bg-white/90 px-4 py-3 shadow-soft">
                  <div>
                    <div className="text-xs text-ink-500">رقم الحجز</div>
                    <div className="font-semibold text-ink-900">{booking.id}</div>
                  </div>
                  <Badge
                    variant={
                      booking.status === 'CONFIRMED'
                        ? 'success'
                        : booking.status === 'CANCELLED'
                        ? 'error'
                        : 'warning'
                    }
                  >
                    {statusLabel}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-ink-100 bg-white/95 px-4 py-3">
                    <div className="text-xs text-ink-500">الاسم</div>
                    <div className="font-semibold text-ink-900">{booking.user.name}</div>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-white/95 px-4 py-3">
                    <div className="text-xs text-ink-500">البريد الإلكتروني</div>
                    <div className="font-semibold text-ink-900">{booking.user.email}</div>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-white/95 px-4 py-3">
                    <div className="text-xs text-ink-500">تاريخ الموعد</div>
                    <div className="font-semibold text-ink-900">
                      {formatDate(booking.slot.startAt)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-white/95 px-4 py-3">
                    <div className="text-xs text-ink-500">الوقت</div>
                    <div className="font-semibold text-ink-900">
                      {formatTime(booking.slot.startAt)} - {formatTime(booking.slot.endAt)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-white/95 px-4 py-3 md:col-span-2">
                    <div className="text-xs text-ink-500">تاريخ إنشاء الحجز</div>
                    <div className="font-semibold text-ink-900">
                      {new Date(booking.createdAt).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/api/booking/receipt/${booking.id}`)}
                  >
                    تحميل PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/booking/receipt/${booking.id}?print=1`)}
                  >
                    طباعة الوصل
                  </Button>
                </div>
                <p className="text-xs text-ink-400">
                  يرجى الوصول قبل الموعد بـ 10 دقائق. هذا الوصل صالح للمراجعة من لوحة الإدارة.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
