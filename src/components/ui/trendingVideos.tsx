"use client"
import { trendingVideos } from "@/features/youtube/trendingSlice"
import { useSelector } from "react-redux";
import VideoCard from "./videoCard";


const TrendingVideos = () => {
  const {videos, loading, countryCode, categoryId } = useSelector(trendingVideos) 
  
  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="text-white overflow-y-auto h-screen px-32">
      { videos ? videos?.map((video) => (<VideoCard video={video} />)): (<div>No Results for this country</div>)}
    </div>
  )
};

export default TrendingVideos;
