import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Course fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الدورة' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth();

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, category, description, objectives, hours, price, level, thumbnail } = body;

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        category,
        description,
        objectives,
        hours,
        price,
        level,
        thumbnail: thumbnail ?? undefined,
      },
    });

    return NextResponse.json({ course });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Course update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الدورة' },
      { status: 500 }
    );
  }
}
