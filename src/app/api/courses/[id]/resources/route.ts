import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';

// إرجاع موارد الدورة (ملفات / روابط / اجتماعات) للمستخدم المسجل في الدورة
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth();

    // تأكد أن المستخدم مسجل وموافق عليه أو مكتمل في هذه الدورة
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: authUser.userId,
        courseId: params.id,
        status: {
          in: ['APPROVED', 'COMPLETED'],
        },
      },
    });

    if (!enrollment && authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'لا تملك صلاحية للوصول إلى محتوى هذه الدورة' },
        { status: 403 }
      );
    }

    const resources = await prisma.courseResource.findMany({
      where: { courseId: params.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ resources });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Course resources fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب محتوى الدورة' },
      { status: 500 }
    );
  }
}

