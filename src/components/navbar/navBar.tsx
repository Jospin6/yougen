"use client"
import { ChartBar, Edit, LayoutDashboard, LucideTrendingUp, Search, UserCircle } from "lucide-react"
import { SideItem } from "../ui/sideItem"
import { useState } from "react"
import Popup from "../ui/popup"
import { SearchBar } from "../ui/searchBar"
import Link from "next/link"

export const NavBar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleSearchPopup = () => setIsOpen(!isOpen)
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

        <SideItem label={"user prompt1"} className="text-sm" />
        <SideItem label={"user prompt5"} className="text-sm" />
        <SideItem label={"user prompt6"} className="text-sm" />
        <SideItem label={"user prompt7"} className="text-sm" />
        <SideItem label={"user prompt8"} className="text-sm" />

        <div className="p-2 flex items-center absolute bottom-0 left-0 w-full text-gray-50 h-[60px]">
            <SideItem label={"Jospin Ndagano"} icon={<UserCircle scale={30} />} className="text-sm w-full rounded-xl" isActive />
        </div>
        {
            isOpen && (<Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<SearchBar />}>
                <div className="p-2">
                    <SideItem label={"New script"} className="text-sm bg-gray-300 text-gray-500 rounded-xl hover:bg-gray-300" icon={<Edit />} />
                </div>

            </Popup>)
        }
    </>
}