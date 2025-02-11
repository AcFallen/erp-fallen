import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Se crea la respuesta inicial para continuar con el flujo normal.
  const res = NextResponse.next();

  // Configuración original de CORS
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, PATCH , DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Manejo de solicitudes preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: res.headers });
  }

  // Protección de rutas: se verifica el token con NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Si la solicitud es a una ruta de API, se devuelve un error 401 (Unauthorized)
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: res.headers,
      });
    }
    // Para rutas que no sean de API, se redirige a /login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si el token existe, continúa normalmente.
  return res;
}

// Matcher para aplicar el middleware a todas las rutas excepto las que no deseas proteger
export const config = {
  matcher: [
    // Se excluyen las rutas: /login, recursos estáticos, favicon y la API de autenticación
    "/((?!login|_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
