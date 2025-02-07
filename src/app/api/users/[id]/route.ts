import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({ where: { id: params.id } });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, role } = await req.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { name, email, role },
    });

    return NextResponse.json(user);
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.user.delete({ where: { id: params.id } });
      return NextResponse.json({ message: "Usuario eliminado" });
    } catch (error : any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  