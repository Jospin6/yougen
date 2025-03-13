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