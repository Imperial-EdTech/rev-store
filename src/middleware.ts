import { NextResponse, type NextRequest } from "next/server";
import { FEATURES } from "@/lib/features";
import { ADMIN_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Page-level routing rules:
 *  1. Admin pages redirect to /admin/login when there's no valid admin session.
 *     (This is for navigation only. Data is protected by requireAdmin() in
 *     every admin API route, so the pages hold nothing sensitive by themselves.)
 *  2. Retired offer pages redirect to the shop while their feature flag is off.
 */

const RETIRED_PAGES: { path: string; enabled: boolean }[] = [
  { path: "/pre-order", enabled: FEATURES.preorderPage },
  { path: "/products/tablets", enabled: FEATURES.tabletOfferPage },
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const retired = RETIRED_PAGES.find((p) => p.path === pathname && !p.enabled);
  if (retired) return NextResponse.redirect(new URL("/products", request.url));

  const isAdminPage =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") || pathname.startsWith("/revlearn/admin");
  if (isAdminPage) {
    const session = await verifySession(request.cookies.get(ADMIN_COOKIE)?.value);
    if (session?.role !== "admin") {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname + search);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Node.js runtime, like the API routes: both then read the same environment.
  // On the Edge runtime, the dev server kept the AUTH_SESSION_SECRET it started
  // with while sign-in picked up edits to .env.local, so a valid sign-in was
  // bounced back to /admin/login.
  runtime: "nodejs",
  matcher: ["/admin/:path*", "/revlearn/admin/:path*", "/pre-order", "/products/tablets"],
};
