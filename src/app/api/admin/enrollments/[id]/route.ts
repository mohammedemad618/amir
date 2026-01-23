import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guards';
import { Permission } from '@/lib/auth/permissions';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const updateEnrollmentSchema = z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requirePermission(Permission.MANAGE_ENROLLMENTS);

        const body = await request.json();
        const validation = updateEnrollmentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const enrollment = await prisma.enrollment.update({
            where: { id: params.id },
            data: { status: validation.data.status },
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
                    },
                },
            },
        });

        return NextResponse.json({ enrollment });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }
        if (error.message === 'Forbidden') {
            return NextResponse.json({ error: 'ليس لديك صلاحية' }, { status: 403 });
        }
        console.error('Enrollment update error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
