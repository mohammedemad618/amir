import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth();
    const body = await request.json();
    const slotId = body?.slotId as string | undefined;
    const note = body?.note as string | undefined;

    if (!slotId) {
      return NextResponse.json({ error: 'يرجى تحديد الموعد.' }, { status: 400 });
    }

    const slot = await prisma.bookingSlot.findUnique({ where: { id: slotId } });
    if (!slot || !slot.isActive) {
      return NextResponse.json({ error: 'هذا الموعد غير متاح.' }, { status: 404 });
    }

    if (slot.startAt <= new Date()) {
      return NextResponse.json({ error: 'لا يمكن حجز موعد في الماضي.' }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({
      where: {
        slotId_userId: {
          slotId,
          userId: authUser.userId,
        },
      },
    });

    if (existing && existing.status !== 'CANCELLED') {
      return NextResponse.json({ error: 'لديك حجز مسبق لهذا الموعد.' }, { status: 409 });
    }

    const activeBooking = await prisma.booking.findFirst({
      where: {
        userId: authUser.userId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        slot: {
          endAt: {
            gt: new Date(),
          },
        },
      },
      include: {
        slot: true,
      },
    });

    if (activeBooking) {
      return NextResponse.json(
        { error: 'لديك حجز نشط بالفعل حتى ينتهي الموعد الحالي.' },
        { status: 409 }
      );
    }

    const bookedCount = await prisma.booking.count({
      where: {
        slotId,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (bookedCount >= slot.capacity) {
      return NextResponse.json({ error: 'هذا الموعد ممتلئ حالياً.' }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        slotId,
        userId: authUser.userId,
        status: 'CONFIRMED',
        note: note?.trim() || null,
      },
      include: {
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }
    console.error('Booking create error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحجز' }, { status: 500 });
  }
}
