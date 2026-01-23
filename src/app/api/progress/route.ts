import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { progressSchema } from '@/utils/validations';

export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuth();

    const body = await request.json();
    const validation = progressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { courseId, progressPercent } = validation.data;

    // Find enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: authUser.userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'أنت غير مسجل في هذه الدورة' },
        { status: 404 }
      );
    }

    // Update progress
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent,
        status: progressPercent === 100 ? 'COMPLETED' : 'ACTIVE',
      },
    });

    return NextResponse.json({
      message: 'تم تحديث التقدم بنجاح',
      enrollment: updatedEnrollment,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث التقدم' },
      { status: 500 }
    );
  }
}
