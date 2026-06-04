import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;
  const url = req.nextUrl.pathname;

  // Protect /dashboard
  if (url.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Protect /admin
  if (url.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Se for página de login e já estiver logado
  if (url.startsWith("/login") && isLoggedIn) {
    return NextResponse.redirect(new URL(userRole === "ADMIN" ? "/admin" : "/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
