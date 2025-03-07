"use client"
import React, { useEffect, useState } from "react";
import { PlayCircle, Wand2 } from "lucide-react";
import { createChatWithScript } from "@/actions/createChatWithScript";
import { useChat } from "@/hooks/useChat";
import { redirect } from "next/navigation";

interface VideoCardProps {
    video: {
        id: string;
        snippet: {
            title: string;
            channelTitle: string;
            thumbnails: {
                medium: {
                    url: string;
                };
            };
        };
    };
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const { input, setInput, handleSend } = useChat();
    const [str, setStr] = useState("")
    const handleGenerateScript = (videoTitle: string) => {
        setStr(videoTitle)
        setInput(videoTitle);  // Met à jour l'état (asynchrone)
    };

    // Utiliser useEffect pour écouter la mise à jour de `input`
    useEffect(() => {
        if (input === str && input.trim()) {  // Vérifie que la mise à jour a eu lieu
            handleSend();  // Envoie le message après la mise à jour
            const chatId = "1234";
            redirect(`/y/${chatId}`);
        }
    }, [input, str]);
    return (
        <div className=" shadow-lg m-2 p-2 h-[200px] border-b border-gray-600 flex overflow-hidden">
            <div className="w-[80%] relative">
                <p className="text-sm text-gray-100 my-2">{video.snippet.channelTitle}</p>
                <h3 className="text-2xl font-semibold text-gray-50">{video.snippet.title}</h3>
                <div className="flex justify-start absolute left-0 w-full items-center bottom-1">
                    <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mr-4 text-blue-300 text-[12px]"
                    >
                        <PlayCircle className="w-4 h-4 text-red-600" />
                    </a>
                    <Wand2 className="w-4 h-4 text-blue-600" onClick={() => handleGenerateScript(video.snippet.title)} />
                </div>

            </div>
            <div className="w-[20%] relative">
                <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 bottom-2"
                >
                    <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="w-[100px] h-[100px] object-cover"
                    />
                </a>

            </div>
        </div>
    );
};

export default VideoCard;
