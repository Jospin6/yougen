"use client";

import { SetStateAction, useState } from "react";
import Image from "next/image";
import Popup from "@/components/ui/popup";
import { TopNavbar } from "@/components/navbar/topNavbar";
import { CreativeCommons, ImageIcon } from "lucide-react";

export default function Thumbnail() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [textOverlay, setTextOverlay] = useState("");
  const [style, setStyle] = useState("bold");
  const [color, setColor] = useState("#ff0000");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleSearchPopup = () => setIsOpen(!isOpen)

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

  return <>
    <TopNavbar />
    <div className="px-4">
      <div className="flex justify-between items-center text-gray-50 px-6">
        <h2 className="text-2xl font-bold">
          Generate AI miniatures
        </h2>
        <button onClick={handleSearchPopup}>
          <ImageIcon size={25} />
        </button>
      </div>
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


      {isOpen && (
        <Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<span className="text-2xl pl-2">Generate miniatures</span>} >
          <div className="p-3">
            {/* Options */}
            <div className="">
              <label className="mb-2 block">Text on the image</label>
              <input
                type="text"
                placeholder="Titre accrocheur..."
                className="h-[30px] w-full outline-none border-[1px] border-black mb-2 rounded-xl px-2"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
              />
            </div>
            <div>

              <div className="grid grid-cols-4 gap-2">
                <div className="mt-4 col-span-2">
                  <label className="mb-2 block">Miniature style</label>
                  <select
                    className="h-[30px] w-full outline-none border-[1px] border-black mb-2 rounded-xl px-2"
                    value={style}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setStyle(e.target.value)}>
                    <option value="bold">🔥 Audacieux</option>
                    <option value="minimal">🎯 Minimaliste</option>
                    <option value="gaming">🎮 Gaming</option>
                  </select>
                </div>

                <div className="mt-4 col-span-2">
                  <label className="mb-2 block">Dominant color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

                <div>
                  {/* Upload d’image */}
                  <label className="mb-2 flex cursor-pointer p-2 rounded-xl bg-gray-300" htmlFor="image">
                    <ImageIcon size={25} className="mr-2"/>
                    <span>Choose an Image</span>
                  </label>
                  <input type="file" accept="image/*" id="image" className="hidden" onChange={handleImageUpload} />
                </div>

              </div>
              {/* Bouton de génération */}
              <button className="mt-6 w-full h-[35px] rounded-2xl bg-black text-gray-50" onClick={handleGenerateThumbnail}>
                Générer la miniature
              </button>


            </div>
          </div>
        </Popup>
      )}
    </div>
  </>
}
