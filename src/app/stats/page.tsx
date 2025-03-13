"use client"
import { YInfos } from "@/components/forms/yInfos";
import { TopNavbar } from "@/components/navbar/topNavbar";
import Popup from "@/components/ui/popup";
import { useEffect, useMemo, useState } from "react";
import { selectYoutubeData, selectChanel, fetchYoutubeChannelInfos, fetchChannelInfos } from "@/features/youtube/yInfoSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import YoutubeChannelCard from "@/components/ui/youtubeChanelCard";

export default function Stats() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleSearchPopup = () => setIsOpen(!isOpen)
    const channel = useSelector(selectChanel)
    const youtubeData = useSelector(selectYoutubeData)
    const dispatch = useDispatch<AppDispatch>()
    const user = useCurrentUser()
    const userId = useMemo(() => user?.id, [user]);
    const channelId = useMemo(() => channel?.channelId, [channel]);
    console.log(youtubeData)

    useEffect(() => {
        if (userId) {
            dispatch(fetchChannelInfos(userId));
        }
        if (channelId) {
            dispatch(fetchYoutubeChannelInfos(channelId));
        }
    }, [userId, channelId, dispatch]);

    return <div className="h-screen">
        <TopNavbar />
        {channel === null ? (
            <div className="flex flex-col justify-center items-center h-[70vh]">
                <h1 className="text-white w-[50%] text-center">
                    To receive AI-driven insights and analytics about your YouTube account,
                    you need to connect it to this app.
                </h1>
                <button className="mt-4 px-10 py-[4px] rounded-xl bg-red-900 text-gray-50" onClick={handleSearchPopup}>Connect your youtube channel</button>
            </div>
        ) : (
            <div className="text-white">
                {youtubeData && <YoutubeChannelCard channel={youtubeData[0]}/>}
            </div>
        )}



        {isOpen && (
            <Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<span className="text-2xl pl-2">Connect your YouTube Channel</span>} >
                <div className="p-3">
                    <YInfos />
                </div>
            </Popup>
        )}

    </div>
}