import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
    try {
        await requirePermission(Permission.VIEW_ANALYTICS);

        const [totalUsers, totalEnrollments, pendingEnrollments, totalCourses] = await Promise.all([
            prisma.user.count(),
            prisma.enrollment.count(),
            prisma.enrollment.count({ where: { status: 'PENDING' } }),
            prisma.course.count(),
        ]);

        return NextResponse.json({
            stats: {
                totalUsers,
                totalEnrollments,
                pendingEnrollments,
                totalCourses,
            },
        });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
