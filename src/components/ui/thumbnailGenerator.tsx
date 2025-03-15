"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export const ThumbnailGenerator = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!image || !title) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);

        try {
            const { data } = await axios.post("/api/generate-thumbnail", formData);
            setGeneratedThumbnail(data.thumbnailUrl);
        } catch (error) {
            console.error("Erreur de génération", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-xl font-bold mb-4">Générateur de Miniatures</h2>

            <Input
                type="text"
                placeholder="Titre accrocheur"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
            />

            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mb-4"
            />

            <button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? "Génération..." : "Générer"}
            </button>

            {generatedThumbnail && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Miniature générée :</h3>
                    <img src={generatedThumbnail} alt="Miniature" className="mt-2 rounded-lg shadow-lg" />
                </div>
            )}
        </div>
    );
}
