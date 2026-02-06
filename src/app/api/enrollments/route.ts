import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const includePending = searchParams.get('includePending');

    const statusFilter =
      includePending === 'false'
        ? ['APPROVED', 'COMPLETED']
        : ['PENDING', 'APPROVED', 'COMPLETED'];

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: authUser.userId,
        status: {
          in: statusFilter,
        },
        ...(courseId ? { courseId } : {}),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            hours: true,
            price: true,
            level: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ enrollments });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Enrollments fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التسجيلات' },
      { status: 500 }
    );
  }
}
