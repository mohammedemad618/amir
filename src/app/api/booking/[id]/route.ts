import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth();
    const body = await request.json();
    const action = body?.action as string | undefined;

    if (action !== 'CANCEL') {
      return NextResponse.json({ error: 'طلب غير صالح.' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking || booking.userId !== authUser.userId) {
      return NextResponse.json({ error: 'الحجز غير موجود.' }, { status: 404 });
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ booking });
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }
    console.error('Booking cancel error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إلغاء الحجز' }, { status: 500 });
  }
}
