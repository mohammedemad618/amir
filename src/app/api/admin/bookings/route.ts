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
    const status = searchParams.get('status');

    const bookings = await prisma.booking.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        slot: {
          select: {
            id: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin bookings fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الحجوزات' }, { status: 500 });
  }
}
