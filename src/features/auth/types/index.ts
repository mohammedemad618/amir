/**
 * Auth Feature - TypeScript Types
 */

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    accessToken?: string;
    error?: string;
    message?: string;
}
