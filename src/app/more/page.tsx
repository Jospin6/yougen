"use client"
import { TopNavbar } from "@/components/navbar/topNavbar";
import Image from "next/image";
import Link from "next/link";

export default function More() {
    return <>
        <TopNavbar />
        <h1 className="text-white text-center text-4xl font-semibold mt-10">YouGen</h1>
        <div className="text-md text-gray-400 mt-4 text-center w-[50%] m-auto">
            Leverage our AI-powered tools to optimize your content strategy,
            boost audience engagement, and unlock new revenue streams effortlessly.
        </div>
        <div className="px-32 mt-6">
            <div className="grid grid-cols-4 gap-4 text-white">
                <Link href={"/thumbnail"} className="col-span-2 ">
                    <div className="h-[120px] flex mt-2 rounded-xl bg-slate-900 hover:bg-slate-800">
                        <div className="w-[40%] flex items-center justify-center">
                            <div className="h-[80px] w-[80px] rounded-full">
                                <Image src={"/images/miniature.jpg"} alt="video" className="rounded-full h-[80px] w-[80px]" width={80} height={80} />
                            </div>
                        </div>
                        <div className="w-[60%] p-2">
                            <h1 className="text-md">🚀 AI Thumbnail Generator</h1>
                            <p className="text-[12px] text-gray-400 mt-3">
                                Create eye-catching thumbnails that drive more clicks and views.
                            </p>
                        </div>
                    </div>
                </Link>

                <Link href={"/shorts"} className="col-span-2 ">
                    <div className="h-[120px] flex mt-2 rounded-xl bg-slate-900 hover:bg-slate-800">
                        <div className="w-[40%] flex items-center justify-center">
                            <div className="h-[80px] w-[80px] rounded-full">
                                <Image src={"/images/video.jpg"} alt="video" className="rounded-full h-[80px] w-[80px]" width={80} height={80} />
                            </div>
                        </div>
                        <div className="w-[60%] p-2">
                            <h1 className="text-md ">🎬 Long-to-Short Video Converter</h1>
                            <p className="text-[12px] text-gray-400 mt-3">
                                Transform long-form content into engaging Shorts in just a few clicks
                            </p>
                        </div>
                    </div>
                </Link>

                <Link href={"/sponsors"} className="col-span-2 ">
                    <div className="h-[120px] flex mt-2 rounded-xl bg-slate-900 hover:bg-slate-800">
                        <div className="w-[40%] flex items-center justify-center">
                            <div className="h-[80px] w-[80px] rounded-full">
                                <Image src={"/images/sponsor.jpg"} alt="video" className="rounded-full h-[80px] w-[80px]" width={80} height={80} />
                            </div>
                        </div>
                        <div className="w-[60%] p-2">
                            <h1 className="text-md">💰 YouTube Sponsor Detector</h1>
                            <p className="text-[12px] text-gray-400 mt-3">
                                Find potential sponsorship opportunities tailored to your channel.
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    </>
}