"use client";

import { TopNavbar } from "@/components/navbar/topNavbar";
import { useEffect, useState } from "react";
import {scrapeData, puppeteerData } from "@/features/puppeteerSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/features/store";
import { scrapeMultipleArticles } from "@/lib/cheerio";

export default function SponsorFinder() {
    const [youtubeInput, setYoutubeInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const scrapedData = useSelector(puppeteerData)
    console.log(scrapedData)
    const urls = [...scrapedData.map(sc => sc.link)]
    let scrapedData2 = []
    const handleFindSponsors = async () => {
        const dt = await scrapeMultipleArticles(urls);
        dispatch(scrapeData("brands"))
        console.log(dt);
    };

    return <>
        <TopNavbar />
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-50">YouTube Sponsor Detector</h2>

            <div className="flex w-[60%] m-auto justify-between">
                <input
                    type="text"
                    className="w-[78%] px-2 h-[40px] outline-none bg-transparent border border-slate-800"
                    placeholder="Ex: MrBeast ou https://www.youtube.com/watch?v=..."
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                />
                <button className="h-[40px] bg-slate-900 px-2 text-gray-50" onClick={handleFindSponsors} disabled={isProcessing}>
                    {isProcessing ? "Loading..." : "Find sponsors"}
                </button>
            </div>

            {isProcessing && <progress className="mt-4" value={50} />}
            <button className="text-white" onClick={handleFindSponsors}>get data</button>
            <div className="text-white">
                {scrapedData && scrapedData.map(dt => (<div key={dt.link}>
                    <p> {dt.title} </p>
                    <p> {dt.link} </p>
                </div>))}
            </div>

        
        </div>
    </>
}
