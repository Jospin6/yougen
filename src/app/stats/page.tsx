"use client"
import { YInfos } from "@/components/forms/yInfos";
import { TopNavbar } from "@/components/navbar/topNavbar";
import Popup from "@/components/ui/popup";
import { useState } from "react";

export default function Stats() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleSearchPopup = () => setIsOpen(!isOpen)

    return <div className="h-screen">
        <TopNavbar />
        <div className="flex flex-col justify-center items-center h-[70vh]">
            <h1 className="text-white w-[50%] text-center">
                To receive AI-driven insights and analytics about your YouTube account, 
                you need to connect it to this app.
            </h1>
            <button className="mt-4 px-10 py-[4px] rounded-xl bg-red-900 text-gray-50" onClick={handleSearchPopup}>Connect your youtube channel</button>
        </div>


        {isOpen && (
            <Popup isOpen={isOpen} onClose={handleSearchPopup} comp={<span className="text-2xl pl-2">Connect your YouTube Channel</span>} >
                <div className="p-3">
                    <YInfos/>
                </div>
            </Popup>
        )}

    </div>
}