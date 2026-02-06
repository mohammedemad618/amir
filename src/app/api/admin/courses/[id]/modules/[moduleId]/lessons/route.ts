import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);
    const body = await request.json();
    const { title, content, videoUrl, duration, order, isFree } = body;

    if (!title) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان الدرس.' }, { status: 400 });
    }

    const module = await prisma.module.findFirst({
      where: { id: params.moduleId, courseId: params.id },
    });

    if (!module) {
      return NextResponse.json({ error: 'الوحدة غير موجودة.' }, { status: 404 });
    }

    let orderNumber = Number.isFinite(Number(order)) ? Number(order) : undefined;
    if (orderNumber === undefined) {
      const maxOrder = await prisma.lesson.aggregate({
        where: { moduleId: params.moduleId },
        _max: { order: true },
      });
      orderNumber = (maxOrder._max.order ?? 0) + 1;
    }

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: params.moduleId,
        title,
        content: content || null,
        videoUrl: videoUrl || null,
        duration: duration !== undefined && duration !== null ? Number(duration) : null,
        order: orderNumber,
        isFree: Boolean(isFree),
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Lesson create error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة الدرس' }, { status: 500 });
  }
}
