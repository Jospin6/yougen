import { NextResponse, NextRequest  } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string;

    try {
        const chat = await prisma.chat.findUnique({
            where: { id, },
        });
        if (!chat) {
            return NextResponse.json({ message: 'Not Found' }, { status: 404 });
        }
        return NextResponse.json(chat);
    } catch (error) {
        console.error('Error getting chat:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop() as string;

    try {
        await prisma.chat.delete({
            where: { id, },
        });
        return NextResponse.json({ message: 'Chat deleted' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}