import { cookies } from 'next/headers';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const ACCESS_TOKEN_COOKIE = 'accessToken';

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  // #region agent log
  fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/auth/cookies.ts:6',message:'setAuthCookies entry',data:{hasAccessToken:!!accessToken,hasRefreshToken:!!refreshToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const cookieStore = await cookies();
  // #region agent log
  fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/auth/cookies.ts:8',message:'After cookies() call',data:{cookieStoreExists:!!cookieStore},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  // #region agent log
  fetch('http://127.0.0.1:7251/ingest/97982c00-d435-4267-bc68-430964f896f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/lib/auth/cookies.ts:24',message:'setAuthCookies exit',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null;
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
