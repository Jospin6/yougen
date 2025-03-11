"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowUpIcon,
    FileText,
    Type,
    AlignLeft,
    Tags,
    Copy,
    CopyCheck
} from "lucide-react";
import rehypeHighlight from "rehype-highlight";
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { TopNavbar } from "../navbar/topNavbar";
import { fetchChatMessages, selectCurrentChatId, selectConversation, setCurrentChatId, selectInputMessage } from "@/features/chatSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { useChat } from "@/hooks/useChat";

export type Message = {
    chatId?: string;
    sender: "user" | "assistant";
    content: string;
}

const prompts = [
    {
        icon: <FileText strokeWidth={1.0} className="size-5" />,
        text: "Generate a Youtube video script",
    },
    {
        icon: <Type strokeWidth={1.0} className="size-5" />,
        text: "Titles suggestion for your video",
    },
    {
        icon: <AlignLeft strokeWidth={1.0} className="size-5" />,
        text: "Generate a description for your script",
    },
    {
        icon: <Tags strokeWidth={1.0} className="size-5" />,
        text: "Get Tags for your video",
    },
]

export default function ChatSection({ chatId }: { chatId: string }) {
    const conversation = useSelector(selectConversation)
    const curentChatId = useSelector(selectCurrentChatId)
    const dispatch = useDispatch<AppDispatch>();
    const { input, setInput, handleSend, hasStartedChat } = useChat();
    const messageEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const inputMessage = useSelector(selectInputMessage)
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Réinitialisation après 2s
        });
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        dispatch(fetchChatMessages(chatId))
        dispatch(setCurrentChatId(chatId))
    }, [dispatch, chatId])

    useEffect(() => {
        scrollToBottom()
    }, [conversation])

    useEffect(() => {
        if (inputRef.current && inputMessage.trim() !== inputRef.current.textContent?.trim()) {
            inputRef.current.textContent = inputMessage; // Initialisation du contenu si nécessaire
        }
    }, [inputMessage]);

    const handlePromptClick = (text: string) => {
        setInput(text)
        if (inputRef.current) {
            inputRef.current.textContent = text
        }
    }

    return (
        <div className="w-full text-gray-50 relative h-screen flex flex-col items-center">
            <TopNavbar />
            {/* Zone des messages w-[80%] pb-[200px] h-screan m-auto pt-6 */}
            <div className="flex-1 w-full max-w-3xl px-4 overflow-y-auto max-h-screan scrollbar">
                {curentChatId === null ? (
                    <div className="flex flex-col justify-center h-full space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-semibold">
                                Hi there !
                            </h1>
                            <h2 className="text-xl text-gray-500">
                                What can i help you with ?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
                            <AnimatePresence>
                                {prompts.map((prompt, index) => (
                                    <motion.button key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handlePromptClick(prompt.text)}
                                        transition={{ duration: 0.4, delay: index * 0.05, type: "spring", bounce: 0.25 }}
                                        className="flex items-center gap-3 p-4 text-left border rounded-xl transition-all text-sm"
                                    >
                                        {prompt.icon}
                                        <span>
                                            {prompt.text}
                                        </span>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (

                    <motion.div
                        animate={{
                            paddingBottom: input ? (input.split("\n").length > 3 ? "206px" : "110px") : "80px"
                        }}
                        transition={{ duration: 0.2 }}
                        className="pt-8 space-y-4">
                        {conversation && conversation.map((message, index) => (
                            <motion.div key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex space-x-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>

                                <div className={`p-4 ${message.sender === "user" ? "bg-gray-600" : "bg-gray-950"} rounded-xl`}>
                                    {message.sender === "assistant" ? (
                                        <div className="prose prose-invert max-w-none text-sm font-sans">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeHighlight]}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                            <button
                                                onClick={() => handleCopy(message.content)}
                                                className=" p-1 mt-2 text-gray-400 hover:text-white transition"
                                            >
                                                {copied ?
                                                    (
                                                        <CopyCheck size={18} />
                                                    ) :
                                                    (
                                                        <Copy size={18} />
                                                    )}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{message.content}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messageEndRef} />
                    </motion.div>

                )}


            </div>

            {/* Zone d'entrée */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full absolute bg-gray-950 pb-4 pt-2 bottom-0 mt-auto">
                <div className="max-w-3xl mx-auto px-4">
                    <motion.div
                        animate={{ height: "auto" }}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-gray-800  rounded-2xl lg:rounded-e-3xl p-2.5 flex items-end gap-2 bg-background">
                        <div
                            contentEditable
                            role="textbox"
                            onInput={(e) => {
                                setInput(e.currentTarget.textContent || "")
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            data-placeholder="Create a script..."
                            className="flex-1 text-gray-200 bg-gray-800 min-h-[36px] overflow-y-auto px-3 py-2 focus:outline-none 
                        text-sm bg-background rounded-md empty:before:text-gray-300 empty:before:content-[attr(data-placeholder)] whitespace-pre-wrap break-words"
                            ref={inputRef}
                        />
                        <button onClick={() => handleSend()} className="rounded-full shrink-0 mb-0.5 p-1 bg-black text-white">
                            <ArrowUpIcon strokeWidth={2.5} className="size-5" />
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
