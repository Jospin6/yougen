"use server";

import { redirect } from "next/navigation";
// import { createChat } from "@/lib/database"; // Fonction pour créer un chat en DB
import { chat } from "@/actions/chat"; 
import { Message } from "@/components/ui/chatSection"; 

export const createChatWithScript = async (videoTitle: string) => {
    // 1. Créer un chat en base de données
    // const chatId = await createChat({
    //     title: `Script pour : ${videoTitle}`,
    // });

    const chatId = "1";

    // 2. Définir le message de départ pour l'IA
    const initialMessage: Message = {
        sender: "user",
        content: `Génère un script YouTube similaire à une vidéo qui a pour titre "${videoTitle}".`,
    };

    // 3. Appeler la fonction `chat` pour lancer la génération automatique
    await chat([initialMessage]);

    // 4. Rediriger vers la conversation
    redirect(`/y/${chatId}`);
};
