import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const addAdminSchema = z.object({
    userId: z.string().min(1),
});

export async function GET() {
    try {
        await requirePermission(Permission.MANAGE_ADMINS);

        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ admins });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Admins fetch error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requirePermission(Permission.MANAGE_ADMINS);

        const body = await request.json();
        const validation = addAdminSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { userId } = validation.data;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
        }

        if (user.role === 'ADMIN') {
            return NextResponse.json({ error: 'المستخدم مشرف بالفعل' }, { status: 400 });
        }

        // Promote to admin
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: 'ADMIN' },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { message: 'تمت ترقية المستخدم إلى مشرف بنجاح', admin: updatedUser },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Add admin error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
