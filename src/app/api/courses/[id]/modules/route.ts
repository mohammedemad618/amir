import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth();

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

    const modules = await prisma.module.findMany({
      where: { courseId: params.id },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        lessons: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    const response = NextResponse.json({ modules });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Course modules fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب محتوى الدورة' },
      { status: 500 }
    );
  }
}
