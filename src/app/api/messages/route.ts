import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(req: NextRequest) {
    const { chatId, sender, content } = await req.json();

    try {
        const message = await prisma.message.create({
            data: {
                chatId,
                sender,
                content
            }
        })
        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error creating chat:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
        return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    try {
        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}