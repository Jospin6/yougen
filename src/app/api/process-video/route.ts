import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export async function POST(req: NextRequest) {
    try {
        const { videoId } = await req.json();
        const video = await prisma.video.findUnique({ where: { id: videoId } });

        if (!video) return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 });

        const inputPath = path.join(process.cwd(), "public", video.originalUrl);
        const outputDir = path.join(process.cwd(), "public", "shorts");
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const shorts = [];
        const duration = 60; // Shorts de 60 secondes max
        for (let i = 0; i < 3; i++) {
            const startTime = i * duration;
            const outputFile = path.join(outputDir, `${videoId}-part${i + 1}.mp4`);

            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .setStartTime(startTime)
                    .setDuration(duration)
                    .output(outputFile)
                    .on("end", resolve)
                    .on("error", reject)
                    .run();
            });

            shorts.push(`/shorts/${videoId}-part${i + 1}.mp4`);
        }

        return NextResponse.json({ shorts });
    } catch (error) {
        console.error("Erreur de découpage :", error);
        return NextResponse.json({ error: "Erreur de traitement" }, { status: 500 });
    }
}
