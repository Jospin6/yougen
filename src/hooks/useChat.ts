import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chat } from "@/actions/chat";
import { setCurrentChatId, postChat, postMessage, setConversation, updateLastMessage, addMessage } from "@/features/chatSlice";
import { AppDispatch, RootState } from "@/features/store";
import { readStreamableValue } from "ai/rsc";
import { Message } from "@/helpers/types"

// type Message = {
//     sender: "user" | "assistant";
//     content: string;
// };

export const useChat = () => {
    const dispatch = useDispatch<AppDispatch>();
    const conversation = useSelector((state: RootState) => state.chat.conversation);
    const currentChatId = useSelector((state: RootState) => state.chat.currentChatId);
    const [input, setInput] = useState("");
    const [hasStartedChat, setHasStartedChat] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!currentChatId) {
            dispatch(postChat({ userId: "6a0292f2-00b2-4730-b7bf-e280b0fe590a" }))
                .then((res) => {
                    if (res.meta.requestStatus === 'fulfilled') {
                        dispatch(setCurrentChatId(res.payload.id));
                    }
                })
                .catch((error) => {
                    console.error("Error creating chat:", error);
                });
        }

        const userMessage: Message = {
            chatId: currentChatId!,
            sender: "user",
            content: input.trim(),
        };
        console.log(currentChatId)
        setInput("");
        dispatch(postMessage(userMessage));
        setHasStartedChat(true);

        try {
            const { newMessage } = await chat([...conversation, userMessage]);

            let textContent = "";
            const assistantMessage: Message = {
                chatId: currentChatId!,
                sender: "assistant",
                content: "",
            };

            dispatch(addMessage(assistantMessage));

            for await (const delta of readStreamableValue(newMessage)) {
                textContent += delta;
                dispatch(setConversation([
                    ...conversation,
                    userMessage,
                    { chatId: currentChatId!, sender: "assistant", content: textContent }
                ]));
            }
            dispatch(postMessage({ chatId: currentChatId!, sender: "assistant", content: textContent }));
        } catch (error) {
            console.error("Erreur", error);
            dispatch(updateLastMessage({
                chatId: currentChatId!,
                sender: "assistant",
                content: "An error occurred. Please try again.",
            }));
        }
    };

    return { input, setInput, handleSend, hasStartedChat };
};
