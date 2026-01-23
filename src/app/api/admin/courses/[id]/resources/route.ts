import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/guards';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { title, description, url, type } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'يجب إدخال عنوان ورابط للمصدر.' },
        { status: 400 }
      );
    }

    const resource = await prisma.courseResource.create({
      data: {
        courseId: params.id,
        title,
        description,
        url,
        type: type || 'FILE',
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    console.error('Course resource create error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

