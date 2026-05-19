import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Admin Panel (all pages starting with /admin)
  if (pathname.startsWith("/admin")) {
    // Skip protection for the login page itself to prevent loop
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // 2. Read the secure session cookie
    const adminSession = request.cookies.get("admin_session");

    // 3. If no active cookie session, securely redirect to login page
    if (!adminSession || adminSession.value !== "true") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Run proxy on all subpaths of /admin
export const config = {
  matcher: ["/admin/:path*"],
};
