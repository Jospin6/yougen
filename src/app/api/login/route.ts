import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email },
    })
  
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password)
  
    if (!isPasswordValid) {
      throw new Error('Mot de passe incorrect')
    }
    return NextResponse.json(user, { status: 200 });
  }