import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/cookies';
import { rateLimit, getClientIP } from '@/lib/security/rate-limiter';
import { loginSchema } from '@/utils/validations';

export async function POST(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:9',message:'Login POST entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimitResult = rateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز الحد المسموح به. يرجى المحاولة لاحقاً' },
        { status: 429 }
      );
    }

    const body = await request.json();
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:21',message:'Request body parsed',data:{hasEmail:!!body.email,hasPassword:!!body.password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:33',message:'Before prisma.user.findUnique',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const user = await prisma.user.findUnique({
      where: { email },
    });
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:37',message:'After prisma.user.findUnique',data:{userFound:!!user,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    if (!user) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Verify password
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:45',message:'Before bcrypt.compare',data:{hasPassword:!!password,hasHash:!!user.passwordHash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:47',message:'After bcrypt.compare',data:{isValidPassword},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookies
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:69',message:'Before setAuthCookies',data:{hasAccessToken:!!accessToken,hasRefreshToken:!!refreshToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    await setAuthCookies(accessToken, refreshToken);
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:71',message:'After setAuthCookies',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/api/auth/login/route.ts:80',message:'Login error caught',data:{errorName:error instanceof Error?error.name:'unknown',errorMessage:error instanceof Error?error.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'ALL'})}).catch(()=>{});
    // #endregion
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
