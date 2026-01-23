import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
    try {
        await requirePermission(Permission.VIEW_USERS);

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ users });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Users fetch error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
