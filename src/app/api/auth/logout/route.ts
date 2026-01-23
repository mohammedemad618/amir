import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json({ message: 'تم تسجيل الخروج بنجاح' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
}
