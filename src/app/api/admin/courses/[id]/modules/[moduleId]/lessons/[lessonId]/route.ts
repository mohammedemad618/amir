import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);
    const body = await request.json();
    const { title, content, videoUrl, duration, order, isFree } = body;

    const module = await prisma.module.findFirst({
      where: { id: params.moduleId, courseId: params.id },
    });

    if (!module) {
      return NextResponse.json({ error: 'الوحدة غير موجودة.' }, { status: 404 });
    }

    const existing = await prisma.lesson.findFirst({
      where: { id: params.lessonId, moduleId: params.moduleId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'الدرس غير موجود.' }, { status: 404 });
    }

    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content || null;
    if (videoUrl !== undefined) data.videoUrl = videoUrl || null;
    if (duration !== undefined) data.duration = duration !== null ? Number(duration) : null;
    if (order !== undefined) data.order = Number(order);
    if (isFree !== undefined) data.isFree = Boolean(isFree);

    const lesson = await prisma.lesson.update({
      where: { id: existing.id },
      data,
    });

    return NextResponse.json({ lesson });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Lesson update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الدرس' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    await requirePermission(Permission.MANAGE_COURSES);

    const module = await prisma.module.findFirst({
      where: { id: params.moduleId, courseId: params.id },
    });

    if (!module) {
      return NextResponse.json({ error: 'الوحدة غير موجودة.' }, { status: 404 });
    }

    const existing = await prisma.lesson.findFirst({
      where: { id: params.lessonId, moduleId: params.moduleId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'الدرس غير موجود.' }, { status: 404 });
    }

    await prisma.lesson.delete({ where: { id: existing.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
    }
    console.error('Lesson delete error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الدرس' }, { status: 500 });
  }
}
