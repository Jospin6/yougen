import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../../../../prisma/prisma";
import fluent from "fluent-ffmpeg"

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("video") as File;
        const title = formData.get("title") as string;
        const userId = formData.get("userId") as string;

        if (!file) return NextResponse.json({ error: "Aucune vidéo reçue" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, buffer);

        const video = await prisma.video.create({
            data: {
                title,
                originalUrl: `/uploads/${file.name}`,
                userId: userId,
            },
        });

        return NextResponse.json({ video });
    } catch (error) {
        console.error("Erreur d'upload :", error);
        return NextResponse.json({ error: "Erreur d'upload" }, { status: 500 });
    }
}
