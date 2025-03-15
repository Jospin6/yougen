"use client";

import { useState } from "react";
import axios from "axios";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const VideoUploader = () => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [shorts, setShorts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser()

  const handleUpload = async () => {
    if (!video || user === null) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("userId", user.id!);

    try {
      const { data } = await axios.post("/api/upload-video", formData);
      const videoId = data.video.id;

      const { data: processData } = await axios.post("/api/process-video", { videoId });
      setShorts(processData.shorts);
    } catch (error) {
      console.error("Erreur lors de l'upload", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Convertir une vidéo en Shorts</h2>
      
      <Input 
        type="text" 
        placeholder="Titre de la vidéo" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="mb-4"
      />

      <Input 
        type="file" 
        accept="video/*"
        onChange={(e) => setVideo(e.target.files?.[0] || null)} 
        className="mb-4"
      />

      <button onClick={handleUpload} disabled={loading} className="w-full">
        {loading ? "Traitement..." : "Envoyer"}
      </button>

      {shorts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Shorts générés :</h3>
          {shorts.map((short, index) => (
            <video key={index} src={short} controls className="mt-2 w-full rounded-lg shadow-lg" />
          ))}
        </div>
      )}
    </div>
  );
}
