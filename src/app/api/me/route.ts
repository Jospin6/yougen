import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json(decoded, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 });
  }
}
