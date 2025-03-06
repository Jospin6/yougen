import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { RootState } from "../store";
import { countryCodeProp } from "@/helpers/types";

interface Video {
    id: string;
    snippet: {
        title: string;
        channelTitle: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
    };
}

interface VideoCategory {
    id: string;
    snippet: {
      title: string;
    };
  }

interface initialStateProps {
    loading: boolean;
    videos: Video[] | null;
    videoCategories: VideoCategory[]
    categoryId: string,
    countryCode: string;
    error: string
}

const initialState: initialStateProps = {
    loading: false,
    videos: [],
    videoCategories: [],
    countryCode: "US",
    categoryId: "1",
    error: ""
}

export const fetchTrendsVideos = createAsyncThunk("trending/fetchTrendsVideos", async ({countryCode, categoryId}:{countryCode: string, categoryId: string}) => {
    if (countryCode === "CG" ) {
        countryCode = "CD"
    }
    try {
        const response = await axios.get<{ items: Video[] }>(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet,statistics",
                    chart: "mostPopular",
                    regionCode: countryCode,
                    maxResults: 10,
                    videoCategoryId: categoryId,
                    key: "AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc",
                },
            }
        );
        return response.data.items;
    } catch (error) {
        console.error("Erreur lors de la récupération des vidéos tendances :", error);
    }
})

export const getVideoCategories = createAsyncThunk("trending/getVideoCategories", async (countryCode: string) => {
    if (countryCode === "CG" ) {
        countryCode = "CD"
    }
    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videoCategories`, {
            params: {
                part: "snippet",
                regionCode: countryCode,
                key: "AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc",
            }
        });
        return response.data.items;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
})

const trendingSlice = createSlice({
    name: "trending",
    initialState,
    reducers: {
        setCountryCode: (state, action: PayloadAction<string>) => {
            state.countryCode = action.payload
        },
        setVideoCategoriesId: (state, action: PayloadAction<string>) => {
            state.categoryId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTrendsVideos.pending, state => {
            state.loading = true
        })
        .addCase(fetchTrendsVideos.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false
            state.videos = action.payload
        })
        .addCase(fetchTrendsVideos.rejected, state => {
            state.loading = false
            state.error = "An error occured please try again"
        })

        builder.addCase(getVideoCategories.fulfilled, (state, action: PayloadAction<any>) => {
            state.videoCategories = action.payload
        })
    }
})

export const trendingVideos = (state: RootState) => state.trending;

export const {setCountryCode, setVideoCategoriesId} = trendingSlice.actions
export default trendingSlice.reducer