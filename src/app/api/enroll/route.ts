import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const enrollSchema = z.object({
  courseId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth();

    const body = await request.json();
    const validation = enrollSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { courseId } = validation.data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: authUser.userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في هذه الدورة' },
        { status: 400 }
      );
    }

    // Create enrollment with PENDING status (requires admin approval)
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: authUser.userId,
        courseId,
        status: 'PENDING',
        progressPercent: 0,
      },
    });

    return NextResponse.json(
      { message: 'تم إرسال طلب التسجيل بنجاح. في انتظار موافقة المشرف.', enrollment },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل في الدورة' },
      { status: 500 }
    );
  }
}
