import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { generateObject } from "ai";
import { gemini } from "@/lib/gemini";
import { z } from "zod";

const API_KEY = "AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const sponsorSchema = z.object({
    firmeName: z.string().describe("The sponsor's name or brand"),
    website: z.string().describe("Their official website URL"),
    email: z.string().describe("Public contact email (if available)"),
    description: z.string().describe("Brief explanation of why the sponsor is relevant to the content")
});


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
        const prompt = generatePrompt(videos);

        const result = await generateObject({
            model: gemini("gemini-1.5-flash"),
            output: 'array',
            schema: sponsorSchema,
            system: systemPrompt(),
            prompt,
        });

        return result.toJsonResponse();
    } catch (error) {
        console.error("Erreur while geting sponsors :", error);
        return NextResponse.json({ error: "Impossible de récupérer les sponsors" }, { status: 500 });
    }
}

export const systemPrompt = (): string =>{
    const prompt = `
        You are an AI specialized in YouTube content strategy, capable of identifying 
        potential brand partnerships based on the content of a YouTube channel. 
        Your task is to analyze the titles, descriptions, 
        and keywords from the provided YouTube videos and suggest potential sponsors 
        that align with the channel's niche and content. 

        For each video, focus on:
        1. Identifying brands, products, or services mentioned within the video's description or title.
        2. Suggesting brands or companies that would likely be interested in sponsoring similar content based on the themes and target audience of the channel.
        3. Provide relevant information about each potential sponsor, including:
        - The sponsor's name or brand.
        - Their official website URL.
        - Public contact email (if available).
        - Brief explanation of why this sponsor is relevant to the content.

        Context: The content analyzed comes from a YouTube channel
        identify brands or companies that align with the channel's tone, 
        audience, and topics.

        Please make your suggestions concise, professional, and actionable for the content 
        creator to explore. You are expected to make an insightful analysis, considering trends, 
        audience demographics, and industry relevance.

    `
    return prompt
} 

function generatePrompt(videos: { title: string; description: string }[]) {
    const content = videos
        .map((video) => `Title: ${video.title}\nDescription: ${video.description}`)
        .join("\n\n");

    return `
        You are an AI specialized in YouTube content strategy, 
        tasked with identifying potential sponsors based on the content of YouTube videos. 

        Please analyze the following videos and provide a list of potential sponsors for each, 
        considering the content, target audience, and market fit. For each sponsor, include the 
        following details:
        - Sponsor Name
        - Website URL
        - Public Email (if available)
        - Why This Sponsor is Relevant (explain why this brand aligns with the video content)

        Here are the titles and descriptions of the videos to analyze:

        ${content}

        Please ensure your suggestions are insightful and actionable, 
        focused on brands that would align well with the channel's content.
        give 35 suggestions at most
    `;
}


