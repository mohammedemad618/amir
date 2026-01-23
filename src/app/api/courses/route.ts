import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minHours = searchParams.get('minHours');
    const maxHours = searchParams.get('maxHours');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minHours || maxHours) {
      where.hours = {};
      if (minHours) where.hours.gte = parseInt(minHours);
      if (maxHours) where.hours.lte = parseInt(maxHours);
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الدورات' },
      { status: 500 }
    );
  }
}
