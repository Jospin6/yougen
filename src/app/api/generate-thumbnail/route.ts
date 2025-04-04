import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import prisma from "../../../../prisma/prisma";
import axios from "axios";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;
        const title = formData.get("title") as string;
        const userId = formData.get("userId") as string;

        if (!file || !title) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

        const buffer = Buffer.from(await file.arrayBuffer());
        const outputPath = path.join("/tmp", `${Date.now()}-thumbnail.jpg`);

        await sharp(buffer).resize(1280, 720).toFormat("jpeg").toFile(outputPath);

        const aiResponse = await axios.post("https://api.deepai.org/api/text2img", {
            text: title,
        }, { headers: { "Api-Key": "40452ad1-5a0a-4516-a788-f4e4a04dbbb7" } });

        const thumbnailUrl = aiResponse.data.output_url;

        await prisma.thumbnail.create({
            data: { title, url: thumbnailUrl, userId: userId },
        });

        return NextResponse.json({ thumbnailUrl });
    } catch (error) {
        console.error("Erreur :", error);
        return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
    }
}
