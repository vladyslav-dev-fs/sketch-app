import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt");
  const refreshToken = req.cookies.get("refresh_token");
  const { pathname } = req.nextUrl;

  // Allow access to login, register pages and API routes
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // If no access token and no refresh token, redirect to login
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If we have either token, allow access (client-side will handle refresh if needed)
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/register"],
};
