import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Configurar CORS
  res.headers.set("Access-Control-Allow-Origin", "*"); // Permite todas las solicitudes (puedes restringirlo)
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Manejar solicitudes preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: res.headers });
  }

  // Protección de rutas del Dashboard
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// Aplicar CORS solo a las rutas de la API
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"], // Agregamos todas las rutas de la API
};
