import { NextResponse, NextRequest  } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET(req: NextRequest){
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string;
    const user = await prisma.user.findUnique({
        where: { id, },
    });
    if (!user) {
        return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(user);
}

export async function PUT(req: NextRequest){
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string;
    const { email, name, password } = await req.json();
    const user = await prisma.user.update({
        where: { id, },
        data: {
          email,
          name,
          password,
        },
      });
      return NextResponse.json(user);
}

export async function DELETE(req: NextRequest){
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string;
    await prisma.user.delete({
        where: { id, },
    });
    return NextResponse.json({ message : 'User deleted' });
} 
    