export const uniqueChannels = (channels: any[]) => {
    const seen = new Set<string>();
    return channels.filter(channel => {
        if (seen.has(channel.id)) {
            return false;
        }
        seen.add(channel.id);
        return true;
    });
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const formatSubscribers = (count: number): string => {
    if (count >= 1_000_000) {
        return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (count >= 1_000) {
        return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
};

export const formatEngagementRate = (engagement: number, subscribers: number): string => {
    if (subscribers === 0) return '0%';

    const rate = (engagement / subscribers) * 100;
    return `${rate.toFixed(2)}%`;
};

export const getYouTubeChannelUrl = (channelId: string): string => {
    return `https://www.youtube.com/channel/${channelId}`;
};