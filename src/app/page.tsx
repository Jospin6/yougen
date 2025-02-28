"use client"
import Popup from "@/components/ui/popup";
import { SearchBar } from "@/components/ui/searchBar";
import { SideItem } from "@/components/ui/sideItem"
import { LayoutDashboard, LucideTrendingUp, Search, ChartBar, Edit, UserCircle } from "lucide-react"
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleSearchPopup = () => setIsOpen(!isOpen)
  return (
    <>
      <div className="flex w-full">
        <div className="w-[25%] relative h-[100vh] pb-[65px] bg-gray-900 px-4">
          <div className="pb-4 border-b border-gray-600 pt-3">
            <div className="flex justify-between items-center">
              <SideItem label={"youGen"} className="text-white text-2xl hover:bg-gray-900 cursor-pointer" />
              <Search className="text-gray-50" size={20} onClick={handleSearchPopup} />
            </div>
            <SideItem label={"Trends"} icon={<LucideTrendingUp size={20} />} />
            <SideItem label={"Performances"} icon={<ChartBar size={20} />} />
            <SideItem label={"plus"} icon={<LayoutDashboard size={20} />} />
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

        </div>
        <div className="w-[75%] h-[100vh] bg-gray-950"></div>
      </div>
      {
        isOpen && (<Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<SearchBar />}>
          <div className="p-2">
            <SideItem label={"New script"} className="text-sm bg-gray-300 text-gray-500 rounded-xl hover:bg-gray-300" icon={<Edit />} />
          </div>

        </Popup>)
      }
    </>
  );
}

//   @headlessui/react embla-carousel react-markdown tiptap react-lazy-load-image-component recharts react-intersection-observer

