import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    const today = new Date();
    const dateBase = dateParam ? new Date(`${dateParam}T00:00:00`) : today;
    const startOfDay = new Date(dateBase);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateBase);
    endOfDay.setHours(23, 59, 59, 999);
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const isToday = startOfDay.getTime() === todayStart.getTime();

    const existingSlots = await prisma.bookingSlot.findMany({
      where: {
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { id: true },
    });

    if (existingSlots.length === 0) {
      const schedule = await prisma.bookingSchedule.findUnique({
        where: { id: 'default' },
      });

      if (schedule) {
        const dayOfWeek = startOfDay.getDay();
        if (schedule.daysOfWeek.includes(dayOfWeek)) {
          const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
          const slotMinutes = schedule.slotMinutes || 30;
          const breakMinutes = schedule.breakMinutes || 0;

          const slotStart = new Date(startOfDay);
          slotStart.setHours(startHour, startMinute, 0, 0);
          const slotEndBoundary = new Date(startOfDay);
          slotEndBoundary.setHours(endHour, endMinute, 0, 0);

          const slotsToCreate: { startAt: Date; endAt: Date; capacity: number; isActive: boolean }[] = [];
          let current = new Date(slotStart);

          while (current < slotEndBoundary) {
            const end = new Date(current);
            end.setMinutes(end.getMinutes() + slotMinutes);
            if (end > slotEndBoundary) break;
            slotsToCreate.push({
              startAt: new Date(current),
              endAt: end,
              capacity: 1,
              isActive: true,
            });
            current = new Date(end);
            if (breakMinutes > 0) {
              current.setMinutes(current.getMinutes() + breakMinutes);
            }
          }

          if (slotsToCreate.length > 0) {
            await prisma.bookingSlot.createMany({
              data: slotsToCreate,
              skipDuplicates: true,
            });
          }
        }
      }
    }

    const slots = await prisma.bookingSlot.findMany({
      where: {
        isActive: true,
        startAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(isToday ? { endAt: { gt: new Date() } } : {}),
      },
      orderBy: { startAt: 'asc' },
      include: {
        bookings: {
          where: {
            status: {
              not: 'CANCELLED',
            },
          },
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    const formatted = slots.map((slot) => {
      const bookedCount = slot.bookings.length;
      const remaining = Math.max(0, slot.capacity - bookedCount);
      const userBooking = slot.bookings.find((booking) => booking.userId === authUser.userId);

      return {
        id: slot.id,
        startAt: slot.startAt,
        endAt: slot.endAt,
        capacity: slot.capacity,
        bookedCount,
        remaining,
        isActive: slot.isActive,
        userBookingStatus: userBooking?.status ?? null,
        userBookingId: userBooking?.id ?? null,
      };
    });

    const response = NextResponse.json({ slots: formatted });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }
    console.error('Booking slots fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب المواعيد' }, { status: 500 });
  }
}
