"use client";

import { TopNavbar } from "@/components/navbar/topNavbar";
import Popup from "@/components/ui/popup";
import { VideoIcon, VideotapeIcon } from "lucide-react";
import { SetStateAction, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectItem } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";

export default function ShortsGenerator() {
    const [videoUrl, setVideoUrl] = useState("");
    const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
    const [mode, setMode] = useState("auto");
    const [isProcessing, setIsProcessing] = useState(false);
    const [shorts, setShorts] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleSearchPopup = () => setIsOpen(!isOpen)

    // Gestion de l'upload de vidéo
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedVideo(e.target.files[0]);
        }
    };

    // Envoi des données pour la génération de Shorts
    const handleGenerateShorts = async () => {
        setIsProcessing(true);
        const formData = new FormData();
        if (uploadedVideo) formData.append("video", uploadedVideo);
        formData.append("videoUrl", videoUrl);

        const response = await fetch("/api/generate-shorts", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setShorts(data.shorts);
        setIsProcessing(false);
    };

    return <>
        <TopNavbar />
        <div className="pt-4">
            <div className="flex justify-between items-center text-gray-50 px-6">
                <h2 className="text-2xl font-bold">YouTube Shorts Generator</h2>
                <button onClick={handleSearchPopup}>
                    <VideoIcon size={20} />
                </button>
            </div>

            {/* Barre de progression */}
            {isProcessing && <progress className="mt-4" value={50} />}

            {/* Affichage des extraits générés */}
            {shorts.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Shorts générés :</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {shorts.map((shortUrl, index) => (
                            <div key={index} className="p-4 bg-gray-100 rounded-lg">
                                <video src={shortUrl} controls className="w-full rounded-md shadow-md" />
                                <button className="mt-2 w-full">
                                    <a href={shortUrl} download>
                                        ⬇ Télécharger
                                    </a>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {isOpen && (
            <Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<span className="text-2xl pl-2">Shorts Generator</span>} >
                <div className="p-3">
                    {/* Input URL YouTube */}
                    <label className="mb-2">YouTube URL</label>
                    <input
                        type="text"
                        className="h-[30px] w-full outline-none border-[1px] border-black mb-2 rounded-xl px-2"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />

                    <div className="my-2 text-center font-semibold">-- Or --</div>

                    {/* Upload de vidéo */}
                    <label className="mb-2 flex cursor-pointer p-2 rounded-xl bg-gray-300" htmlFor="videoId">
                        <VideotapeIcon size={25} className="mr-2" />
                        <span>Upload a Video</span>
                    </label>
                    <input type="file" className="hidden" accept="video/*" id="videoId" onChange={handleVideoUpload} />


                    {/* Bouton de génération */}
                    <button className="mt-6 w-full h-[35px] rounded-2xl bg-black text-gray-50" onClick={handleGenerateShorts} disabled={isProcessing}>
                        {isProcessing ? "loading..." : "Generate Shorts"}
                    </button>
                </div>
            </Popup>
        )}
    </>
}
