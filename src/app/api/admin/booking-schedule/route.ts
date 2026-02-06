import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    const schedule = await prisma.bookingSchedule.findUnique({
      where: { id: 'default' },
    });
    return NextResponse.json({ schedule });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Booking schedule fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب جدول الدوام' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    const body = await request.json();
    const {
      daysOfWeek,
      startTime,
      endTime,
      slotMinutes,
      breakMinutes,
      timezone,
    } = body || {};

    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      return NextResponse.json({ error: 'يرجى تحديد أيام الدوام.' }, { status: 400 });
    }

    if (!startTime || !endTime) {
      return NextResponse.json({ error: 'يرجى تحديد وقت البداية والنهاية.' }, { status: 400 });
    }

    const schedule = await prisma.bookingSchedule.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        daysOfWeek,
        startTime,
        endTime,
        slotMinutes: Number(slotMinutes) || 30,
        breakMinutes: Number(breakMinutes) || 0,
        timezone: timezone || 'Asia/Riyadh',
      },
      update: {
        daysOfWeek,
        startTime,
        endTime,
        slotMinutes: Number(slotMinutes) || 30,
        breakMinutes: Number(breakMinutes) || 0,
        timezone: timezone || 'Asia/Riyadh',
      },
    });

    const slotLength = Number(slotMinutes) || 30;
    const breakLength = Number(breakMinutes) || 0;
    const [startHour, startMinute] = String(startTime).split(':').map(Number);
    const [endHour, endMinute] = String(endTime).split(':').map(Number);

    const today = new Date();
    for (let i = 0; i < 14; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      if (!daysOfWeek.includes(startOfDay.getDay())) {
        continue;
      }

      const existing = await prisma.bookingSlot.findFirst({
        where: {
          startAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        select: { id: true },
      });

      if (existing) {
        continue;
      }

      const slotStart = new Date(startOfDay);
      slotStart.setHours(startHour, startMinute, 0, 0);
      const slotEndBoundary = new Date(startOfDay);
      slotEndBoundary.setHours(endHour, endMinute, 0, 0);

      const slotsToCreate: { startAt: Date; endAt: Date; capacity: number; isActive: boolean }[] = [];
      let current = new Date(slotStart);

      while (current < slotEndBoundary) {
        const end = new Date(current);
        end.setMinutes(end.getMinutes() + slotLength);
        if (end > slotEndBoundary) break;
        slotsToCreate.push({
          startAt: new Date(current),
          endAt: end,
          capacity: 1,
          isActive: true,
        });
        current = new Date(end);
        if (breakLength > 0) {
          current.setMinutes(current.getMinutes() + breakLength);
        }
      }

      if (slotsToCreate.length > 0) {
        await prisma.bookingSlot.createMany({
          data: slotsToCreate,
        });
      }
    }

    return NextResponse.json({ schedule });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Booking schedule update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث جدول الدوام' }, { status: 500 });
  }
}
