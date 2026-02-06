import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);
    const body = await request.json();
    const { title, order } = body;

    if (title === undefined && order === undefined) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث.' }, { status: 400 });
    }

    const existing = await prisma.module.findFirst({
      where: { id: params.moduleId, courseId: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'الوحدة غير موجودة.' }, { status: 404 });
    }

    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (order !== undefined) data.order = Number(order);

    const updatedModule = await prisma.module.update({
      where: { id: existing.id },
      data,
    });

    return NextResponse.json({ module: updatedModule });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Module update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الوحدة' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);

    const existing = await prisma.module.findFirst({
      where: { id: params.moduleId, courseId: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'الوحدة غير موجودة.' }, { status: 404 });
    }

    await prisma.module.delete({ where: { id: existing.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Module delete error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الوحدة' }, { status: 500 });
  }
}
