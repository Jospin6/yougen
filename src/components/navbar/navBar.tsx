"use client"
import { ChartBar, Edit, LayoutDashboard, LucideTrendingUp, Search, UserCircle } from "lucide-react"
import { SideItem } from "../ui/sideItem"
import { useEffect, useState } from "react"
import Popup from "../ui/popup"
import { SearchBar } from "../ui/searchBar"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/features/store"
import { fetchUserChat, selectChats } from "@/features/chatSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export const NavBar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleSearchPopup = () => setIsOpen(!isOpen)
    const dispatch = useDispatch<AppDispatch>();
    const chats = useSelector(selectChats)
    const [searchTerm, setSearchTerm] = useState("");
    const user = useCurrentUser()

    const filteredChats = chats.filter(chat =>
        chat.messages?.some(message =>
            message.sender === "user" &&
            message.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    useEffect(() => {
        if (user) {
            dispatch(fetchUserChat(user.id!))
        }  
    }, [dispatch])
    return <>
        <div className="pb-4 border-b border-gray-600 pt-3">
            <div className="flex justify-between items-center">
                <Link href={"/"}>
                    <SideItem label={"youGen"} className="text-white text-2xl hover:bg-gray-900 cursor-pointer" />
                </Link>
                <Search className="text-gray-50" size={20} onClick={handleSearchPopup} />
            </div>
            <Link href={"/trends"}><SideItem label={"Trends"} icon={<LucideTrendingUp size={20} />} /></Link>
            <Link href={"/stats"}><SideItem label={"Performances"} icon={<ChartBar size={20} />} /></Link>
            <Link href={"/more"}><SideItem label={"plus"} icon={<LayoutDashboard size={20} />} /></Link>
        </div>
        <SideItem label={"Scripts"} className="text-sm py-4 hover:bg-gray-900" />

        <div className="overflow-y-auto max-h-[300px] scrollbar">
            {
                chats.map((chat, index) => {
                    const userMessage = chat.messages?.find((message) => message.sender === "user");
                    console.log("user scripts",userMessage)
                    return (
                        <Link href={`/y/${chat.id}`} key={index}>
                            <SideItem
                                label={userMessage ? `${userMessage.content.slice(0, 30)}...` : "New chat"}
                                className="text-sm"
                            />
                        </Link>
                    );
                })
            }
        </div>

        <div className="p-2 flex items-center absolute bottom-0 left-0 w-full text-gray-50 h-[60px]">
            {user ? 
            (
                <Link href={"#"} className="w-full">
                <SideItem label={user.name} icon={<UserCircle scale={30} />} className="text-sm w-full rounded-xl" isActive />
            </Link>
            ) 
            : (<Link href={"/login"} className="w-full">
                <SideItem label={"SignUp"} icon={<UserCircle scale={30} />} className="text-sm w-full rounded-xl" isActive />
            </Link>)}

        </div>
        {isOpen && (
            <Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<SearchBar onSearch={setSearchTerm} />}>
                <div className="p-2">
                    <SideItem label="New script" className="text-sm bg-gray-300 text-gray-500 rounded-xl hover:bg-gray-300" icon={<Edit />} />
                </div>
                <div className="p-2 h-[250px] overflow-y-auto scrollbar">
                    {(filteredChats.length > 0 && searchTerm != "") ? (
                        filteredChats.map((chat) => (
                            <div key={chat.id} className="p-2 bg-gray-100 rounded-lg mb-1">
                                {/* <p className="text-gray-600 font-bold">Chat ID: {chat.id}</p> */}
                                {chat.messages
                                    ?.filter(message => message.sender === "user" && message.content.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((message) => (

                                        <Link href={`/y/${chat.id}`} onClick={handleSearchPopup} key={message.id}><p className="text-gray-800">{message.content}</p></Link>
                                    ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No matching results</p>
                    )}
                </div>
            </Popup>
        )}
    </>
}