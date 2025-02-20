import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  // Verificar que el usuario esté autenticado
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  // Obtener el formulario que viene como multipart/form-data
  const formData = await req.formData();
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  // Convertir directamente a File ya que no usamos multiple
  const file = formData.get("avatar") as File | null;
  let avatarUrl: string | null = null;

  // Ruta de la carpeta donde se guardan las imágenes
  const uploadsDir = path.join(process.cwd(), "uploads");
  console.log("Uploads directory:", uploadsDir);

  if (file) {
    try {
      // Asegurarse de que la carpeta exista
      await mkdir(uploadsDir, { recursive: true });

      // Generar un nombre único para evitar conflictos
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);

      // Leer el contenido del archivo y guardarlo en el servidor
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Guardar la ruta relativa del archivo para almacenarla en la DB
      avatarUrl = fileName;
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
      return new Response("Error interno al guardar la imagen", {
        status: 500,
      });
    }
  }

  try {
    // Verificar si ya existe un perfil para el usuario
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    // Si existe y se está actualizando el avatar, eliminar el archivo anterior
    if (existingProfile && existingProfile.avatar && avatarUrl) {
      const previousFilePath = path.join(uploadsDir, existingProfile.avatar);
      try {
        await unlink(previousFilePath);
        console.log("Avatar anterior eliminado:", previousFilePath);
      } catch (err) {
        // Si falla la eliminación, registra el error pero continúa
        console.error("Error al eliminar avatar anterior:", err);
      }
    }

    // Crear o actualizar el perfil en la base de datos (upsert)
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { bio, avatar: avatarUrl, phone, address },
      create: {
        userId: session.user.id,
        bio,
        avatar: avatarUrl,
        phone,
        address,
      },
    });
    return new Response(JSON.stringify(profile), { status: 201 });
  } catch (error) {
    console.error("Error al guardar el perfil:", error);
    return new Response("Error interno al guardar el perfil", { status: 500 });
  }
}
