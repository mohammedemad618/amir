import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    const body = await request.json();
    const status = body?.status as string | undefined;

    if (!status) {
      return NextResponse.json({ error: 'يرجى تحديد حالة الحجز.' }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ booking });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin booking update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الحجز' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    await prisma.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin booking delete error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الحجز' }, { status: 500 });
  }
}
