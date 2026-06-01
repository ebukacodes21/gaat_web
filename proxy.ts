import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "./constants";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET_KEY || "");

export async function proxy(request: NextRequest) {
  console.log("PROXY RUNNING");
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const pathname = request.nextUrl.pathname;

  // allow verify page completely
  if (pathname.startsWith("/auth/verify")) {
    return NextResponse.next();
  }

  const isPrivatePath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/loans") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/deposits") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/users")

  const isAuthPath =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/login-employee");

  if (!token) {
    if (isPrivatePath) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const isVerified =
      payload.isAuth === true ||
      payload.isAuth === "true";

    if (isPrivatePath && !isVerified) {
      const url = new URL("/auth/verify", request.url);
      url.searchParams.set("email", String(payload.email || ""));
      return NextResponse.redirect(url);
    }

    if (isAuthPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    if (isPrivatePath) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/loans/:path*",
    "/security/:path*",
    "/auth/:path*",
    "/management/:path*",
    "/users/:path*",
    "/deposits/:path*",
  ],
};