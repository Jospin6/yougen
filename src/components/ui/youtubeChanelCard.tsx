import React, { useState } from "react";
import { FaUserPlus, FaEye, FaVideo, FaCalendar } from "react-icons/fa";

interface YoutubeChannelProps {
    snippet: {
        title: string;
        customUrl: string;
        description: string;
        publishedAt: string;
        thumbnails: {
            high: { url: string };
        };
    };
    statistics: {
        viewCount: string;
        subscriberCount: string;
        videoCount: string;
    };
}

const YoutubeChannelCard: React.FC<{ channel: YoutubeChannelProps }> = ({ channel }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="px-4">
            {/* Bannière */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 relative rounded-xl">
                {/* Image de profil */}
                <img
                    src={channel.snippet.thumbnails.high.url}
                    alt={channel.snippet.title}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md absolute left-24 transform -translate-x-1/2 -bottom-12"
                />
            </div>
            <div className="pl-40 pt-6">
                <h2 className="text-2xl font-bold">{channel.snippet.title}</h2>
                <p className="text-sm text-gray-500">@{channel.snippet.customUrl.replace("@", "")}</p>
            </div>

            {/* Contenu principal */}
            {/* <div className="text-center p-6 mt-10">

                <p className="mt-3 text-gray-700 text-sm">
                    {showFullDescription
                        ? channel.snippet.description
                        : `${channel.snippet.description.slice(0, 120)}... `}
                    {!showFullDescription && (
                        <button
                            onClick={() => setShowFullDescription(true)}
                            className="text-blue-500 hover:underline"
                        >
                            Lire plus
                        </button>
                    )}
                </p>

                <div className="flex justify-around mt-4 text-gray-600">
                    <div className="flex items-center gap-1">
                        <FaUserPlus className="text-lg text-yellow-500" />
                        <span>{parseInt(channel.statistics.subscriberCount).toLocaleString()} abonnés</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaEye className="text-lg text-green-500" />
                        <span>{parseInt(channel.statistics.viewCount).toLocaleString()} vues</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaVideo className="text-lg text-red-500" />
                        <span>{channel.statistics.videoCount} vidéos</span>
                    </div>
                </div>

                <div className="flex items-center justify-center text-gray-500 mt-3">
                    <FaCalendar className="text-lg mr-1" />
                    <span>Créée le {formatDate(channel.snippet.publishedAt)}</span>
                </div>

                <a
                    href={`https://www.youtube.com/${channel.snippet.customUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-md transition duration-300"
                >
                    S'abonner
                </a>
            </div> */}
            <div className="text-gray-50 mt-4">
                
            </div>
        </div>
    );
};

export default YoutubeChannelCard;
