import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl.pathname;

    const isAdmin = token?.role === "ADMIN";
    const needsPasswordReset = token?.mustChangePassword;

    // Regra Absoluta de BYPASS para o ADMIN
    if (isAdmin) {
      if (url.startsWith("/setup-password")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next(); // Acesso irrestrito
    }

    // Regras para STUDENTS (Não-Admins)
    if (!isAdmin) {
      // Proteger rotas de admin contra alunos
      if (url.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Restrição de Troca Obrigatória de Senha
      if (needsPasswordReset && !url.startsWith("/setup-password")) {
        return NextResponse.redirect(new URL("/setup-password", req.url));
      }

      // Se não precisa trocar a senha e tenta acessar a rota de setup
      if (!needsPasswordReset && url.startsWith("/setup-password")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/setup-password"],
};
