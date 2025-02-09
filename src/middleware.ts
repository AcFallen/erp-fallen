import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si el usuario no está autenticado y trata de acceder a /dashboard, redirigir a /login
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Configurar qué rutas se protegen con el Middleware
export const config = {
  matcher: ["/dashboard/:path*"], // Protege todas las subrutas dentro de /dashboard
};
