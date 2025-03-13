import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(req: NextRequest) {
    const { channelId, userId } = await req.json();

    try {
        const youtube = await prisma.channel.create({
            data: { channelId, userId },
        });
        return NextResponse.json(youtube, { status: 201 });
    } catch (error) {
        console.error('Error creating youtube:', error);
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
        const channel = await prisma.channel.findFirst({
            where: { userId: userId },
        });
        return NextResponse.json(channel);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chats with messages" }, { status: 500 });
    }
}