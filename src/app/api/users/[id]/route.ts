import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🚀 `params` ahora es una promesa
) {
  try {
    const { id } = await params; // 🚀 Hacemos `await` a params antes de extraer `id`

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🚀 `params` ahora es una promesa
) {
  try {
    const { id } = await params; // 🚀 Hacemos `await` a params antes de extraer `id`
    const data = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 🚀 `params` ahora es una promesa
) {
  try {
    const { id } = await params; // 🚀 Hacemos `await` a params antes de extraer `id`
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
