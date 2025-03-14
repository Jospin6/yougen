"use client"
import TrendingVideos from "@/components/ui/trendingVideos";
import { AppDispatch } from "@/features/store";
import { allCountries, fetchCountries } from "@/features/youtube/countrySlice";
import { fetchTrendsVideos, trendingVideos, setCountryCode, setVideoCategoriesId, getVideoCategories } from "@/features/youtube/trendingSlice"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
    const { countryCode, videoCategories, categoryId } = useSelector(trendingVideos)
    const { countries } = useSelector(allCountries)
    const dispatch = useDispatch<AppDispatch>()



    useEffect(() => {
        dispatch(getVideoCategories(countryCode));
        dispatch(fetchCountries())
    }, [dispatch, countryCode]);

    useEffect(() => {
        dispatch(fetchTrendsVideos({ countryCode, categoryId }));
    }, [dispatch, countryCode, categoryId]);

    return <>
        <div className="mb-6">
            <h1 className="text-3xl text-white pt-4 pb-8 px-2">Trends videos</h1>
            <div className="mx-2 flex justify-end">
                <div className="border border-slate-800 h-[40px] px-2 mr-4">
                    <select
                        className="h-[40px] w-full rounded-xl outline-none text-gray-200 bg-transparent"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            dispatch(setCountryCode(e.target.value))
                        }
                        value={countryCode}
                    >
                        <option className="text-black font-bold">Choose a country</option>
                        {
                            countries != null ? countries?.map(country => (<option value={country.code} key={country.code}> {country.name} </option>)) : (<div>No Results</div>)
                        }
                    </select>
                </div>

                <div className="border border-slate-800 h-[40px] px-2">
                    <select className="h-[40px] w-full rounded-xl outline-none text-gray-200 bg-transparent" onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        dispatch(setVideoCategoriesId(e.target.value))
                    }>
                        <option className="text-black font-bold">Choose a category</option>
                        {videoCategories.map(categ => (
                            <option value={categ.id} key={categ.id}> {categ.snippet.title} </option>
                        ))}

                    </select>
                </div>
            </div>


            <TrendingVideos />
        </div>
    </>
}