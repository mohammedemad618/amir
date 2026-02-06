import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    const searchParams = request.nextUrl.searchParams;
    const fromParam = searchParams.get('from');

    const fromDate = fromParam ? new Date(fromParam) : new Date();

    const slots = await prisma.bookingSlot.findMany({
      where: {
        startAt: {
          gte: fromDate,
        },
      },
      orderBy: { startAt: 'asc' },
      include: {
        bookings: {
          where: { status: { not: 'CANCELLED' } },
          select: { id: true },
        },
      },
    });

    const formatted = slots.map((slot) => {
      const bookedCount = slot.bookings.length;
      return {
        id: slot.id,
        startAt: slot.startAt,
        endAt: slot.endAt,
        capacity: slot.capacity,
        isActive: slot.isActive,
        bookedCount,
        remaining: Math.max(0, slot.capacity - bookedCount),
      };
    });

    return NextResponse.json({ slots: formatted });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin slots fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب المواعيد' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    const body = await request.json();
    const { startAt, endAt, capacity } = body || {};

    if (!startAt || !endAt) {
      return NextResponse.json({ error: 'يرجى تحديد وقت البداية والنهاية.' }, { status: 400 });
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'تنسيق التاريخ غير صالح.' }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json({ error: 'يجب أن يكون وقت النهاية بعد البداية.' }, { status: 400 });
    }

    const slot = await prisma.bookingSlot.create({
      data: {
        startAt: startDate,
        endAt: endDate,
        capacity: Number.isFinite(Number(capacity)) ? Math.max(1, Number(capacity)) : 1,
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin slot create error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الموعد' }, { status: 500 });
  }
}
