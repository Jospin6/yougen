"use client";

import { useEffect, useRef, useState } from "react";
import {
    BarChart3Icon,
    FileTextIcon,
    LineChartIcon,
    CalculatorIcon,
    ArrowUpIcon
} from "lucide-react";
import rehypeHighlight from "rehype-highlight";
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"

import { chat } from "@/actions/chat";
import { readStreamableValue } from "ai/rsc";
import { useDispatch, useSelector } from "react-redux";

export type Message = {
    sender: "user" | "assistant" | "system";
    content: string;
}
import { addMessage, chatAsync } from "@/features/chatSlice";
import { AppDispatch, RootState } from "@/features/store";

const prompts = [
    {
        icon: <CalculatorIcon strokeWidth={1.0} className="size-5" />,
        text: "Titles for your script",
    },
    {
        icon: <LineChartIcon strokeWidth={1.0} className="size-5" />,
        text: "Descritpion for your script",
    },
    {
        icon: <FileTextIcon strokeWidth={1.0} className="size-5" />,
        text: "Tags for your script",
    },
    {
        icon: <BarChart3Icon strokeWidth={1.0} className="size-5" />,
        text: "Create miniature for your post",
    },
]

export default function TestChat() {
    const messageEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch<AppDispatch>()

    const [input, setInput] = useState<string>("")
    const [conversation, setConversation] = useState<Message[]>([])
    const [isLoading, setIsLoanding] = useState<boolean>(false)
    const [hasStartedChat, setHasStartedChat] = useState<boolean>(false)
    const { messages, loading } = useSelector((state: RootState) => state.chat);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [])

    const handlePromptClick = (text: string) => {
        setInput(text)
        if (inputRef.current) {
            inputRef.current.textContent = text
        }
    }

    const handleSend = async () => {
        if (!input.trim() || loading) return;
    
        const userMessage: Message = {
            sender: "user",
            content: input.trim(),
        };
    
        setInput("");
    
        // Ajout immédiat du message utilisateur dans Redux
        dispatch(addMessage(userMessage));
    
        // Lancer la requête AI et gérer le streaming dans Redux
        dispatch(chatAsync([...messages, userMessage]));
    };

    return (
        <div className="w-full text-gray-50 relative h-screen flex flex-col items-center">
            {/* Zone des messages w-[80%] pb-[200px] h-screan m-auto pt-6 */}
            <div className="flex-1 w-full max-w-3xl px-4 overflow-y-auto max-h-screan scrollbar">
                {!messages ? (
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
                        {messages.map((message, index) => (
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
                        className="relative border bg-gray-600  rounded-2xl lg:rounded-e-3xl p-2.5 flex items-end gap-2 bg-background">
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
                            className="flex-1 text-gray-200 bg-gray-600 min-h-[36px] overflow-y-auto px-3 py-2 focus:outline-none 
                        text-sm bg-background rounded-md empty:before:text-gray-300 empty:before:content-[attr(data-placeholder)] whitespace-pre-wrap break-words"
                            ref={(element) => {
                                inputRef.current = element
                                if (element && !input) {
                                    element.textContent = ""
                                }
                            }}
                        />
                        <button onClick={handleSend} className="rounded-full shrink-0 mb-0.5 p-1 bg-black text-white">
                            <ArrowUpIcon strokeWidth={2.5} className="size-5" />
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
