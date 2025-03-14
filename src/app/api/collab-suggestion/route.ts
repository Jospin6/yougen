import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const API_KEY = "AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc"

    try {
        // Récupérer les vidéos récentes de la chaîne
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&type=video&maxResults=10&key=${API_KEY}`;
        const searchResponse = await axios.get(searchUrl);
        const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId);

        // Obtenir les catégories des vidéos de l'utilisateur
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${API_KEY}`;
        const videosResponse = await axios.get(videosUrl);

        // Trouver des chaînes similaires pour des collaborations
        const categories = videosResponse.data.items.map((video: any) => video.snippet.categoryId);

        // Analyser les chaînes avec des catégories et engagements similaires
        // const collaboratorSuggestions = await findSimilarChannels(categories);
        return NextResponse.json(categories);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}