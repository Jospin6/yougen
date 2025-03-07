import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chat } from "@/actions/chat";
import { addMessage, setConversation, updateLastMessage } from "@/features/chatSlice";
import { RootState } from "@/features/store";
import { readStreamableValue } from "ai/rsc";

type Message = {
    sender: "user" | "assistant";
    content: string;
};

export const useChat = () => {
    const dispatch = useDispatch();
    const conversation = useSelector((state: RootState) => state.chat.conversation);
    const [input, setInput] = useState("");
    const [hasStartedChat, setHasStartedChat] = useState(false);

    const handleSend = async () => {
            if (!input.trim()) return;
    
            const userMessage: Message = {
                sender: "user",
                content: input.trim(),
            };
    
            setInput("");
            dispatch(addMessage(userMessage));
            setHasStartedChat(true);
    
            try {
                const { newMessage } = await chat([...conversation, userMessage]);
    
                let textContent = "";
                const assistantMessage: Message = {
                    sender: "assistant",
                    content: "",
                };
    
                dispatch(addMessage(assistantMessage));
    
                for await (const delta of readStreamableValue(newMessage)) {
                    textContent += delta;
                    dispatch(setConversation([
                        ...conversation,
                        userMessage, 
                        { sender: "assistant", content: textContent }
                    ]));
                }
            } catch (error) {
                console.error("Erreur", error);
                dispatch(updateLastMessage({
                    sender: "assistant",
                    content: "An error occurred. Please try again.",
                }));
            }
        };

    return { input, setInput, handleSend, hasStartedChat };
};
