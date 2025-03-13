import { NextResponse, NextRequest } from "next/server";
import { streamObject } from "ai";
import { gemini } from "@/lib/gemini";
import { z } from "zod";

const videoIdeaSchema = z.object({
    title: z.string().describe("YouTube SEO-respectful video title"),
    description: z.string().describe("A description of the video title"),
});


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const description = searchParams.get("description") || "general content creation";

        const prompt = ` 
            Generate 10 unique and engaging video ideas based on trends YouTube video for this YouTube channel description "${description}". 
            Each idea should be compelling and designed to maximize engagement.
        `;

        const result = await streamObject({
            model: gemini("gemini-1.5-flash"),
            output: 'array',
            schema: videoIdeaSchema,
            system: "You are an AI specialized in YouTube content strategy.",
            prompt,
        });


        return result.toTextStreamResponse();

    } catch (error) {
        console.error("Error fetching video ideas:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to generate video ideas" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
