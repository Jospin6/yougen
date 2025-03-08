import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    try {
        const chat = await prisma.chat.create({
            data: {
                userId,
            },
        });
        return NextResponse.json(chat, { status: 201 });
    } catch (error) {
        console.error('Error creating chat:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const chats = await prisma.chat.findMany();
    return NextResponse.json(chats);
}