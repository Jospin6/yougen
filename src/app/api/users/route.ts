import { NextResponse, NextRequest  } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(req: NextRequest){
    const { email, name, password } = await req.json();

    try {
        const user = await prisma.user.create({
            data: {
              email,
              name,
              password, // Pense à hacher le mot de passe avant de le stocker (par ex. avec bcrypt)
            },
          });
          return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest){
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}