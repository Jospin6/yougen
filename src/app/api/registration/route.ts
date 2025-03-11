import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, {
      expiresIn: "7d",
    });


    const response = NextResponse.json(user, { status: 200 });

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}