import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getRefreshToken } from './cookies';
import { verifyAccessToken, verifyRefreshToken, type TokenPayload } from './jwt';
import { Permission, hasPermission as checkPermission } from './permissions';

export async function getAuthUser(request?: NextRequest): Promise<TokenPayload | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const payload = verifyAccessToken(accessToken);
    return payload;
  } catch (error) {
    // Token expired or invalid, try refresh token
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      const payload = verifyRefreshToken(refreshToken);
      return payload;
    } catch {
      return null;
    }
  }
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require user to have a specific role
 */
export async function requireRole(role: string): Promise<TokenPayload> {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error('Forbidden');
  }

  return user;
}

/**
 * Require user to be an admin
 */
export async function requireAdmin(): Promise<TokenPayload> {
  return requireRole('ADMIN');
}

/**
 * Require user to have a specific permission
 */
export async function requirePermission(permission: Permission): Promise<TokenPayload> {
  const user = await requireAuth();

  if (!checkPermission(user.role, permission)) {
    throw new Error('Forbidden');
  }

  return user;
}

/**
 * Check if current user has a specific permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  try {
    const user = await getAuthUser();
    if (!user) return false;

    return checkPermission(user.role, permission);
  } catch {
    return false;
  }
}
