import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Función para configurar los encabezados CORS
function setCorsHeaders(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function middleware(req: NextRequest) {
  // Manejar solicitudes preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    const response = new Response(null, { status: 204 });
    return setCorsHeaders(response);
  }

  // Obtener el token de autenticación
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token, redirigir a /login
  if (!token) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    return setCorsHeaders(response);
  }

  // Si el usuario está autenticado, se continúa con la solicitud normal
  const response = NextResponse.next();
  return setCorsHeaders(response);
}

// Configuración del matcher para aplicar la protección a todas las rutas excepto las que se quieran excluir.
// En este ejemplo se excluyen rutas como "/login", recursos de Next.js y la API de autenticación.
export const config = {
  matcher: [
    // Este matcher protege todas las rutas que NO comiencen con "login", "_next", "favicon.ico" o "api/auth"
    "/((?!login|_next/static|_next/image|favicon.ico|api/auth).*)"
  ],
};
