import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const updateAdminSchema = z.object({
    status: z.enum(['ACTIVE', 'BLOCKED']).optional(),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requirePermission(Permission.MANAGE_ADMINS);

        const body = await request.json();
        const validation = updateAdminSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const admin = await prisma.user.update({
            where: { id: params.id },
            data: validation.data,
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ admin });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Admin update error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requirePermission(Permission.MANAGE_ADMINS);

        // Demote admin to user
        const user = await prisma.user.update({
            where: { id: params.id },
            data: { role: 'USER' },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return NextResponse.json({ message: 'تم تخفيض رتبة المشرف بنجاح', user });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Admin demote error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
