import { NextRequest, NextResponse } from 'next/server';
import { getRefreshToken } from '@/lib/auth/cookies';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/cookies';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'رمز التحديث غير موجود' },
        { status: 401 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'رمز التحديث غير صحيح أو منتهي الصلاحية' },
        { status: 401 }
      );
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({
      message: 'تم تحديث الرمز بنجاح',
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الرمز' },
      { status: 500 }
    );
  }
}
