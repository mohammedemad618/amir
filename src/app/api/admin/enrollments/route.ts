import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
    try {
        await requirePermission(Permission.MANAGE_ENROLLMENTS);

        const enrollments = await prisma.enrollment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ enrollments });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Enrollments fetch error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
