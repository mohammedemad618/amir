import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/guards';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; resourceId: string } }
) {
  try {
    await requireAdmin();

    await prisma.courseResource.delete({
      where: { id: params.resourceId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    console.error('Course resource delete error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

