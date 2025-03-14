"use client"
import { trendingVideos } from "@/features/youtube/trendingSlice"
import { useSelector } from "react-redux";
import VideoCard from "./videoCard";


const TrendingVideos = () => {
  const {videos, loading } = useSelector(trendingVideos) 
  
  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="text-white overflow-y-auto h-screen grid grid-cols-6 gap-4 mt-6">
      { videos ? videos?.map((video) => (<VideoCard video={video} key={video.id} />)): (<div>No Results for this country</div>)}
    </div>
  )
};

export default TrendingVideos;
