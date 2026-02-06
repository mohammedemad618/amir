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
    const { startAt, endAt, capacity, isActive } = body || {};

    const data: Record<string, any> = {};
    if (startAt) data.startAt = new Date(startAt);
    if (endAt) data.endAt = new Date(endAt);
    if (capacity !== undefined) data.capacity = Math.max(1, Number(capacity));
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    if (data.startAt && data.endAt && data.endAt <= data.startAt) {
      return NextResponse.json({ error: 'وقت النهاية يجب أن يكون بعد البداية.' }, { status: 400 });
    }

    const slot = await prisma.bookingSlot.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ slot });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin slot update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الموعد' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_BOOKINGS);
    await prisma.bookingSlot.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Admin slot delete error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الموعد' }, { status: 500 });
  }
}
