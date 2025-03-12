"use client";

import { SetStateAction, useState } from "react";
import Image from "next/image";

export default function Thumbnail() {
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [textOverlay, setTextOverlay] = useState("");
  const [style, setStyle] = useState("bold");
  const [color, setColor] = useState("#ff0000");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Gestion de l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImage(e.target.files[0]);
    }
  };

  // Gestion de la génération
  const handleGenerateThumbnail = async () => {
    const formData = new FormData();
    if (uploadedImage) formData.append("image", uploadedImage);
    formData.append("videoUrl", videoUrl);
    formData.append("textOverlay", textOverlay);
    formData.append("style", style);
    formData.append("color", color);

    const response = await fetch("/api/generate-thumbnail", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setGeneratedImage(data.thumbnailUrl);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🎨 Générateur de Miniature IA</h2>

      {/* Input URL YouTube */}
      <label className="mb-2">URL YouTube :</label>
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <div className="my-4 text-center font-semibold">Ou</div>

      {/* Upload d’image */}
      <label className="mb-2">Télécharger une image :</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Options */}
      <div className="mt-4">
        <label className="mb-2">Texte sur l’image :</label>
        <input
          type="text"
          placeholder="Titre accrocheur..."
          value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="mb-2">Style de miniature :</label>
        <select value={style} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setStyle(e.target.value)}>
          <option value="bold">🔥 Audacieux</option>
          <option value="minimal">🎯 Minimaliste</option>
          <option value="gaming">🎮 Gaming</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-2">Couleur dominante :</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      {/* Bouton de génération */}
      <button className="mt-6 w-full" onClick={handleGenerateThumbnail}>
        🎨 Générer la miniature
      </button>

      {/* Prévisualisation de l’image générée */}
      {generatedImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Aperçu :</h3>
          <Image
            src={generatedImage}
            alt="Miniature générée"
            width={600}
            height={340}
            className="rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
