"use client";

import { useState } from "react";
import { Input } from "./input";
import { ArrowUp, DessertIcon, GalleryThumbnails, Send, TextCursor } from "lucide-react";
import Image from "next/image"
import { SideItem } from "./sideItem";

interface Message {
    sender: "user" | "ia";
    text: string;
}

export default function ChatSection() {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "ia", text: "Bonjour ! Posez-moi une question sur ce livre." }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: "user", text: input };
        const aiMessage: Message = {
            sender: "ia",
            text: "Bonne question ! Voici une réponse basée sur le contenu du livre..."
        };

        setMessages([...messages, userMessage, aiMessage]);
        setInput("");
    };

    return (
        <div className="w-full relative h-screen">
            {/* Zone des messages */}
            <div className="w-[80%] pb-[200px] h-screan m-auto pt-6 ">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg max-w-[75%] ${msg.sender === "user" ? "bg-gray-600 text-gray-50 ml-auto": 'text-gray-100'}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Zone d'entrée */}
            <div className="absolute bottom-5 w-full left-0">
                <div className="flex justify-center">
                    <SideItem label={"Get Titles"} className="text-sm" icon={<TextCursor size={18} />} />
                    <SideItem label={"Get miniature"} className="text-sm" icon={<GalleryThumbnails size={18} />} />
                    <SideItem label={"Generate Description"} icon={<DessertIcon size={18} />} className="text-sm ml-[-5px]" />
                </div>
                <div className="w-[75%] bottom-5 m-auto h-auto rounded-xl bg-gray-900 text-white">
                    <div className="p-2">
                        <Input
                            className="h-auto"
                            placeholder="Enter your thought"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                    </div>
                    <div className="px-4 pb-2 flex justify-between">
                        <div></div>
                        <div>
                            <button className="rounded-full p-1 text-black bg-white" onClick={sendMessage}><ArrowUp size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
