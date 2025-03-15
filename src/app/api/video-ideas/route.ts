import { NextResponse, NextRequest } from "next/server";
import { streamObject } from "ai";
import { gemini } from "@/lib/gemini";
import { z } from "zod";
import axios from "axios";


const videoIdeaSchema = z.object({
    title: z.string().describe("YouTube SEO-respectful video title"),
    description: z.string().describe("A description of the video title"),
});

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc";


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const channelId = searchParams.get("channelId");

        if (!channelId) {
            return NextResponse.json({ error: "ID de la chaîne requis" }, { status: 400 });
        }

        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                key: API_KEY,
                channelId,
                part: "snippet",
                maxResults: 10,
                order: "date",
            },
        });

        const videos = response.data.items.map((video: any) => ({
            title: video.snippet.title,
            description: video.snippet.description,
        }));
        const prompt = generateDescription(videos);

        const result = await streamObject({
            model: gemini("gemini-1.5-flash"),
            output: 'array',
            schema: videoIdeaSchema,
            system: `
                You are an AI specialized in YouTube content strategy. 
                Your primary role is to help content creators improve their 
                YouTube channel's performance and engagement by providing data-driven 
                insights, strategic content suggestions, and actionable recommendations. 

                You have the ability to:
                - Analyze the titles, descriptions, and keywords of videos to understand the channel's niche and target audience.
                - Suggest relevant, trending, and creative video topics based on the channel's existing content.
                - Recommend new content ideas and angles to keep the channel fresh and engaging.
                - Identify potential sponsors that align with the content and the channel's audience.
                - Help content creators grow their audience and optimize their content strategy 
                by providing relevant content suggestions that resonate with their viewers.
            `,
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

function generateDescription(videos: { title: string; description: string }[]) {
    const content = videos
        .map((video) => `Title: ${video.title}\nDescription: ${video.description}`)
        .join("\n\n");

    return `
        You are an AI specialized in content strategy for YouTube channels. 
        Your task is to analyze the titles and descriptions of the following 
        videos and suggest future content ideas or topics that would engage the channel's 
        audience based on the current content.

        For each video, based on the provided title and description, suggest:
        1. New video topics that align with the channel's existing themes.
        2. Trending or relevant subjects related to the channel's niche.
        3. Creative angles or approaches for future content.

        Please provide suggestions that are:
        - Relevant to the channel's content and audience.
        - Creative and unique, offering fresh ideas for future videos.
        - Well-aligned with current trends or the channel's niche 
        (e.g., technology, gaming, beauty, fitness, etc.).

        Here are the titles and descriptions of the videos to analyze:

        ${content}

        Please make your suggestions actionable, practical, and tailored to the channel's 
        existing themes and target audience.
        Generate 10 ideas
    `;
}

