import { getvideoIdeas } from "@/features/youtube/trendingSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store";
import { ArrowBigDown, ExternalLinkIcon } from "lucide-react";
import { formatEngagementRate, formatSubscribers } from "@/lib/functions";
import Image from "next/image";

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

const YoutubeChannelCard: React.FC<{ channel: YoutubeChannelProps, collabs: any[] }> = ({ channel, collabs }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, videoIdeas } = useSelector((state: RootState) => state.trending)
    const handleGetVideoIdeas = (description: string) => dispatch(getvideoIdeas(description))

    return (
        <div className="px-4 h-auto">
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
                <div className="w-full h-10 px-3 border border-slate-800 flex justify-between items-center">
                    <div>Get trends video ideas</div>
                    <ArrowBigDown size={25} onClick={() => handleGetVideoIdeas(channel.snippet.description)} scale={2} />
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    videoIdeas != null && (
                        <div className="h-[350px] overflow-y-auto">
                            {videoIdeas.map((vd, i) => <div key={i} className="border border-slate-800 mt-2">
                                <p className="border-b py-1 text-md px-2 text-gray-200 border-slate-800"> {vd.title} </p>
                                <p className="px-2 text-[14px] text-gray-400"> {vd.description} </p>
                                <button className="text-blue-500 hover:underline text-[12px] flex m-2"><span className="mr-2">Generate a script</span> <ExternalLinkIcon size={15} /> </button>
                            </div>)}
                        </div>
                    )
                )}
                <div>
                    <div className="my-4">
                        <h1 className="text-xl">Strategic Partnerships for Maximum Growth</h1>
                        <h4 className="text-sm text-gray-500">
                            Enhance your audience by collaborating with top industry leaders profilImage
                        </h4>
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                    {collabs && collabs.map(cl => (
                        <div className="col-span-2 rounded-xl bg-slate-800 mt-2" key={cl.id}>
                            <div className="rounded-t-xl h-[250px] w-full">
                                <img src={
                                    cl.profilImage.snippet?.thumbnails?.high?.url ??
                                    cl.profilImage.snippet?.thumbnails?.medium?.url ??
                                    cl.profilImage.snippet?.thumbnails?.default?.url
                                    
                                } alt={cl.name} className="h-[250px] rounded-t-xl w-[100%]" width={80} height={60} />
                            </div>
                            <div className="p-2 w-full">
                                <h1>{cl.name}</h1>
                                <div className="flex justify-between text-[12px]">
                                    <div>
                                        <p>Subscribers</p>
                                        <p>{formatSubscribers(cl.subscribers)}</p>
                                    </div>
                                    <div>
                                        <p>Engagement Rate</p>
                                        <p>{formatEngagementRate(cl.engagementRate, cl.subscribers)}</p>
                                    </div>
                                    <div>
                                        <ExternalLinkIcon size={15} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default YoutubeChannelCard;
