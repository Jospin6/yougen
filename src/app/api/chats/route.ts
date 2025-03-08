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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }
    try {
        const chats = await prisma.chat.findMany({
            where: { userId, },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
        return NextResponse.json(chats);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chats with messages" }, { status: 500 });
    }
}