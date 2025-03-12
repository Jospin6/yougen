"use client";

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
    formData.append("mode", mode);

    const response = await fetch("/api/generate-shorts", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setShorts(data.shorts);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🎬 Convertisseur de Shorts YouTube</h2>

      {/* Input URL YouTube */}
      <label className="mb-2">URL YouTube :</label>
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <div className="my-4 text-center font-semibold">Ou</div>

      {/* Upload de vidéo */}
      <label className="mb-2">Télécharger une vidéo :</label>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      {/* Options de sélection */}
      <div className="mt-4">
        <label className="mb-2">Mode de sélection :</label>
        <select value={mode} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setMode(e.target.value)}>
          <option value="auto">✨ Automatique (IA détecte les moments clés)</option>
          <option value="manual">🎥 Manuel (sélection personnalisée)</option>
        </select>
      </div>

      {/* Bouton de génération */}
      <button className="mt-6 w-full" onClick={handleGenerateShorts} disabled={isProcessing}>
        {isProcessing ? "⏳ Génération en cours..." : "🎬 Générer Shorts"}
      </button>

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
  );
}
