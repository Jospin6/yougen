"use client";

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🔍 Détecteur de Sponsors YouTube</h2>

      {/* Input chaîne YouTube ou URL vidéo */}
      <label className="mb-2">Nom de la chaîne ou URL vidéo :</label>
      <input
        type="text"
        placeholder="Ex: MrBeast ou https://www.youtube.com/watch?v=..."
        value={youtubeInput}
        onChange={(e) => setYoutubeInput(e.target.value)}
      />

      {/* Bouton de recherche */}
      <button className="mt-4 w-full" onClick={handleFindSponsors} disabled={isProcessing}>
        {isProcessing ? "⏳ Recherche en cours..." : "🔎 Trouver des sponsors"}
      </button>

      {/* Barre de progression */}
      {isProcessing && <progress className="mt-4" value={50} />}

      {/* Résultats : Liste des sponsors */}
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
  );
}
