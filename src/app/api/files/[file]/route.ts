import { createReadStream } from "fs";
import path from "path";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { file: string } }
) {
  // Esperar explícitamente los parámetros
  const awaitedParams = await Promise.resolve(params);
  const filePath = path.join(process.cwd(), "uploads", awaitedParams.file);

  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);
    return new Response(webStream as unknown as BodyInit, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return new Response("File not found", { status: 404 });
  }
}
