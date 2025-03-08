"use client"
import ChatSection from "@/components/ui/chatSection";
import { useParams } from "next/navigation";

export default function Chat() {
    const params = useParams();
    const chatId = params?.id as string

    return <ChatSection chatId={chatId}/>
}