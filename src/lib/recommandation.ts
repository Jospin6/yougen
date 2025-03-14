import axios from "axios";

const API_KEY = "AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc";

export async function findSimilarChannels(categories: string[]) {
    try {
        const maxResults = 10;
        let recommendedChannels: any[] = [];

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=${categories[0]}&order=viewCount&maxResults=${maxResults}&key=${API_KEY}`;
        const searchResponse = await axios.get(searchUrl);
        const videos = searchResponse.data.items;

        for (const video of videos) {
            const channelId = video.snippet.channelId;
            const channelTitle = video.snippet.channelTitle;

            // Vérifier les détails de la chaîne
            const channelData = await getChannelDetails(channelId);
            if (channelData) {
                recommendedChannels.push({
                    id: channelId,
                    name: channelTitle,
                    subscribers: channelData.subscriberCount,
                    engagementRate: channelData.engagementRate,
                    profilImage: channelData.profileImage
                });
            }
        }

        // Trier les chaînes par engagement et abonnés
        recommendedChannels = recommendedChannels
            .filter((channel) => channel.subscribers > 500) // Éviter les petites chaînes
            .sort((a, b) => b.engagementRate - a.engagementRate) // Trier par engagement

        // Retourner les 5 meilleures suggestions
        return recommendedChannels.slice(0, 9);

    } catch (error) {
        console.error("Error finding similar channels:", error);
        return [];
    }
}

/**
 * Récupère les détails d'une chaîne YouTube
 * @param channelId ID de la chaîne
 * @returns Détails de la chaîne (abonnés, engagement)
 */
async function getChannelDetails(channelId: string) {
    try {
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
        const response = await axios.get(channelUrl);
        const data = response.data.items[0];

        if (!data) {
            console.error(`Channel data not found for ID: ${channelId}`);
            return null;
        }

        const subscriberCount = parseInt(data.statistics.subscriberCount, 10);
        const viewCount = parseInt(data.statistics.viewCount, 10);
        const videoCount = parseInt(data.statistics.videoCount, 10);

        // Calculer un taux d'engagement approximatif
        const engagementRate = videoCount > 0 ? viewCount / videoCount : 0;

        // Vérification que 'snippet' et 'thumbnails' existent avant d'accéder à l'URL de l'image
        const profileImage =data ?? null;

        return {
            subscriberCount,
            engagementRate,
            profileImage,
        };
    } catch (error) {
        console.error(`Error fetching details for channel ${channelId}:`, error);
        return null;
    }
}

