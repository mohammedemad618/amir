import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth, hasPermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from '@react-pdf/renderer';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 12,
    color: '#1A1A1A',
    backgroundColor: '#FAF7F2',
  },
  ribbon: {
    height: 6,
    width: '100%',
    backgroundColor: '#D7B790',
    borderRadius: 999,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#0F172A',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: { fontSize: 20, marginTop: 6, marginBottom: 6, color: '#1F2937' },
  subtitle: { fontSize: 11, color: '#6B7280' },
  watermark: {
    marginTop: 6,
    fontSize: 42,
    color: '#EADBC7',
    opacity: 0.6,
    textAlign: 'left',
  },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D7C3',
  },
  section: { marginBottom: 10 },
  label: { fontSize: 10, color: '#8B7E6B' },
  value: { fontSize: 12, marginTop: 3, color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  badge: {
    fontSize: 10,
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#F1E6D8',
    color: '#7A5C3E',
    textAlign: 'center',
    minWidth: 72,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  infoItem: {
    width: '48%',
    borderRadius: 10,
    border: '1px solid #EFE3D4',
    padding: 10,
    backgroundColor: '#FFFCF7',
  },
  qrWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    border: '1px dashed #E8D7C3',
    backgroundColor: '#FFF9F1',
    width: 120,
  },
  qrImage: {
    width: 90,
    height: 90,
  },
  qrLabel: {
    marginTop: 6,
    fontSize: 9,
    color: '#8B7E6B',
  },
  footer: { marginTop: 18, fontSize: 9, color: '#9CA3AF' },
});

const resolveStatusLabel = (status: string) => {
  if (status === 'CONFIRMED') return 'مؤكد';
  if (status === 'CANCELLED') return 'ملغي';
  return 'معلق';
};

const ReceiptDoc = ({ booking, qrDataUrl }: { booking: any; qrDataUrl: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.ribbon} />
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.brand}>AMER ARABI • MEDICAL EDUCATION</Text>
          <Text style={styles.title}>وصل حجز موعد</Text>
          <Text style={styles.subtitle}>
            وثيقة مؤكدة صادرة من منصة التدريب الطبي
          </Text>
          <Text style={styles.watermark}>A</Text>
        </View>
        <View style={styles.qrWrap}>
          <Image src={qrDataUrl} style={styles.qrImage} />
          <Text style={styles.qrLabel}>تحقق من الحجز</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={[styles.row, { marginBottom: 12 }]}>
          <View>
            <Text style={styles.label}>رقم الحجز</Text>
            <Text style={styles.value}>{booking.id}</Text>
          </View>
          <View>
            <Text style={styles.label}>الحالة</Text>
            <Text style={styles.badge}>{resolveStatusLabel(booking.status)}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>الاسم</Text>
            <Text style={styles.value}>{booking.user.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <Text style={styles.value}>{booking.user.email}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.row]}>
          <View>
            <Text style={styles.label}>تاريخ الموعد</Text>
            <Text style={styles.value}>
              {new Date(booking.slot.startAt).toLocaleDateString('ar-SA')}
            </Text>
          </View>
          <View>
            <Text style={styles.label}>الوقت</Text>
            <Text style={styles.value}>
              {new Date(booking.slot.startAt).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(booking.slot.endAt).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>تاريخ الإنشاء</Text>
          <Text style={styles.value}>
            {new Date(booking.createdAt).toLocaleString('ar-SA')}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        يرجى الوصول قبل الموعد بـ 10 دقائق. هذا الوصل صالح للمراجعة من لوحة الإدارة.
      </Text>
    </Page>
  </Document>
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth();
    const canManage = await hasPermission(Permission.MANAGE_BOOKINGS);
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        slot: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'الحجز غير موجود.' }, { status: 404 });
    }

    if (booking.userId !== authUser.userId && !canManage) {
      return NextResponse.json({ error: 'ليس لديك صلاحية.' }, { status: 403 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const receiptUrl = `${baseUrl}/booking/receipt/${booking.id}`;
    const qrDataUrl = await QRCode.toDataURL(receiptUrl, {
      margin: 1,
      width: 200,
      color: { dark: '#1F2937', light: '#FFF9F1' },
    });

    const format = request.nextUrl.searchParams.get('format');
    if (format === 'json') {
      return NextResponse.json({
        booking: {
          id: booking.id,
          status: booking.status,
          createdAt: booking.createdAt,
          user: booking.user,
          slot: booking.slot,
        },
      });
    }
    if (format === 'print') {
      const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>وصل الحجز</title>
  <style>
    body { font-family: 'Tahoma', Arial, sans-serif; padding: 32px; color: #111; background: #faf7f2; }
    .brand { font-size: 11px; letter-spacing: 2px; color: #0f172a; text-transform: uppercase; }
    h1 { margin: 6px 0 4px; font-size: 22px; color: #1f2937; }
    .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
    .card { background: #fff; border: 1px solid #e8d7c3; border-radius: 16px; padding: 16px; }
    .row { margin-bottom: 12px; }
    .label { color: #8b7e6b; font-size: 12px; }
    .value { font-size: 14px; margin-top: 4px; color: #111827; }
    .grid { display: flex; justify-content: space-between; gap: 16px; }
    .badge { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #f1e6d8; color: #7a5c3e; font-size: 11px; }
    .qr { width: 96px; height: 96px; border: 1px dashed #e8d7c3; border-radius: 12px; padding: 6px; background: #fff9f1; text-align: center; }
    .qr img { width: 84px; height: 84px; }
    .qr span { display: block; margin-top: 4px; font-size: 10px; color: #8b7e6b; }
    .footer { margin-top: 16px; font-size: 11px; color: #9ca3af; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; }
    .ribbon { height: 6px; background: #d7b790; border-radius: 999px; margin-bottom: 16px; }
    .watermark { font-size: 42px; color: #eadbc7; opacity: 0.6; margin-top: 6px; }
    .info-grid { display: flex; gap: 12px; margin: 12px 0; }
    .info-card { flex: 1; border: 1px solid #efe3d4; border-radius: 12px; padding: 10px; background: #fffcf7; }
  </style>
</head>
<body onload="window.print()">
  <div class="ribbon"></div>
  <div class="header">
    <div>
      <div class="brand">AMER ARABI • MEDICAL EDUCATION</div>
      <h1>وصل حجز موعد</h1>
      <div class="subtitle">وثيقة مؤكدة صادرة من منصة التدريب الطبي</div>
      <div class="watermark">A</div>
    </div>
    <div class="qr">
      <img src="${qrDataUrl}" alt="QR" />
      <span>تحقق من الحجز</span>
    </div>
  </div>
  <div class="card">
    <div class="grid row">
      <div>
        <div class="label">رقم الحجز</div>
        <div class="value">${booking.id}</div>
      </div>
      <div>
        <div class="label">الحالة</div>
        <div class="badge">${resolveStatusLabel(booking.status)}</div>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-card">
        <div class="label">الاسم</div>
        <div class="value">${booking.user.name}</div>
      </div>
      <div class="info-card">
        <div class="label">البريد الإلكتروني</div>
        <div class="value">${booking.user.email}</div>
      </div>
    </div>
    <div class="grid row">
      <div>
        <div class="label">التاريخ</div>
        <div class="value">${new Date(
    booking.slot.startAt
  ).toLocaleDateString('ar-SA')}</div></div>
      <div>
        <div class="label">الوقت</div>
        <div class="value">${new Date(
    booking.slot.startAt
  ).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} - ${new Date(
    booking.slot.endAt
  ).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div></div>
    </div>
    <div class="row"><div class="label">تاريخ الإنشاء</div><div class="value">${new Date(
    booking.createdAt
  ).toLocaleString('ar-SA')}</div></div>
  </div>
  <div class="footer">يرجى الوصول قبل الموعد بـ 10 دقائق. هذا الوصل صالح للمراجعة من لوحة الإدارة.</div>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    const pdfBuffer = await renderToBuffer(<ReceiptDoc booking={booking} qrDataUrl={qrDataUrl} />);
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="booking-${booking.id}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }
    console.error('Booking receipt error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الوصل' }, { status: 500 });
  }
}
