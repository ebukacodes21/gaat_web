// utils/auth.ts
import { jwtDecode } from "jwt-decode";

export type UserRole = "admin" | "supervisor" | "staff" | "user";

type TokenPayload = {
  role: UserRole;
  exp: number;
  email: string
};

const TOKEN_KEY = "access_token";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserRole = (): UserRole | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role;
  } catch {
    return null;
  }
};

export const ROUTE_ROLE_GUARD: Record<string, UserRole> = {
  "/dashboard": "user",
  "/loans": "staff",
  "/settings": "supervisor",
  "/admin": "admin",
};

export const ROLE_RANK = {
  user: 1,
  staff: 2,
  supervisor: 3,
  admin: 4,
} as const;

export type Role = keyof typeof ROLE_RANK;

export const getDecodedUser = (): TokenPayload | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};