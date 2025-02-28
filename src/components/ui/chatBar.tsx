import { Input } from "./input"
import { ArrowUp } from "lucide-react"

export const ChatBar = () => {
    return <div className="w-[75%] bottom-5 m-auto h-auto rounded-xl bg-gray-900 text-white">
        <div className="p-2"><Input className="h-auto" placeholder="Enter your thought"/></div>
        <div className="px-4 pb-2 flex justify-between">
            <div></div>
            <div>
                <button className="rounded-full p-1 text-black bg-white"><ArrowUp size={20}/></button>
            </div>
        </div>
    </div>
}