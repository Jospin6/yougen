"use client";

import { TopNavbar } from "@/components/navbar/topNavbar";
import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
// import { Card, CardContent } from "@/components/ui/card";

export default function SponsorFinder() {
    const [youtubeInput, setYoutubeInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [sponsors, setSponsors] = useState<{ name: string; score: number }[]>([]);
    const [emailTemplate, setEmailTemplate] = useState<string | null>(null);

    // Envoi de la requête pour trouver les sponsors
    const handleFindSponsors = async () => {
        setIsProcessing(true);

        const response = await fetch("/api/find-sponsors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ youtubeInput }),
        });

        const data = await response.json();
        setSponsors(data.sponsors);
        setIsProcessing(false);
    };

    // Génération d’un email premium optimisé
    const handleGenerateEmail = async (sponsorName: string) => {
        const response = await fetch("/api/generate-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sponsorName, youtubeInput }),
        });

        const data = await response.json();
        setEmailTemplate(data.email);
    };

    return <>
        <TopNavbar />
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-50">YouTube Sponsor Detector</h2>

            <div className="flex w-[60%] m-auto justify-between">
                <input
                    type="text"
                    className="w-[78%] px-2 h-[40px] outline-none bg-transparent border border-slate-800"
                    placeholder="Ex: MrBeast ou https://www.youtube.com/watch?v=..."
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                />
                <button className="h-[40px] bg-slate-900 px-2 text-gray-50" onClick={handleFindSponsors} disabled={isProcessing}>
                    {isProcessing ? "Loading..." : "Find sponsors"}
                </button>
            </div>

            {isProcessing && <progress className="mt-4" value={50} />}

            {sponsors.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">📌 Sponsors potentiels :</h3>
                    <div className="grid gap-4">
                        {sponsors.map((sponsor, index) => (
                            <div key={index} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-medium">{sponsor.name}</p>
                                    <p className="text-gray-500">Compatibilité : {sponsor.score}%</p>
                                </div>
                                <button
                                    onClick={() => handleGenerateEmail(sponsor.name)}
                                >
                                    ✉ Générer Email
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Affichage de l’email généré */}
            {emailTemplate && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">📩 Email optimisé :</h3>
                    <textarea
                        className="w-full p-3 border rounded-md bg-gray-100"
                        rows={5}
                        value={emailTemplate}
                        readOnly
                    />
                </div>
            )}
        </div>
    </>
}
