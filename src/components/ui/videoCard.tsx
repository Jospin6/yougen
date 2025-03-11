"use client"
import { PlayCircle, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { postChat, setCurrentChatId, setInputMessage } from "@/features/chatSlice";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useCurrentUser()

    const handleGenerateScript = async (videoTitle: string) => {
        const prompt = `Generate a similar script for this topic: ${videoTitle}`
    
        try {
            const res = await dispatch(postChat({ userId: user?.id! })).unwrap();
    
            if (res?.id) {
                dispatch(setCurrentChatId(res.id));
                dispatch(setInputMessage(prompt));
                setTimeout(() => { 
                    router.push(`/y/${res.id}`);
                }, 200)
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

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
