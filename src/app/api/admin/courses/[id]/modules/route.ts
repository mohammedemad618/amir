import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);

    const modules = await prisma.module.findMany({
      where: { courseId: params.id },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        lessons: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    return NextResponse.json({ modules });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Modules fetch error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الوحدات' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);
    const body = await request.json();
    const { title, order } = body;

    if (!title) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان الوحدة.' }, { status: 400 });
    }

    let orderNumber = Number.isFinite(Number(order)) ? Number(order) : undefined;
    if (orderNumber === undefined) {
      const maxOrder = await prisma.module.aggregate({
        where: { courseId: params.id },
        _max: { order: true },
      });
      orderNumber = (maxOrder._max.order ?? 0) + 1;
    }

    const module = await prisma.module.create({
      data: {
        courseId: params.id,
        title,
        order: orderNumber,
      },
    });

    return NextResponse.json({ module }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Module create error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة الوحدة' }, { status: 500 });
  }
}
