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
    contentDetails?: {
        duration: string; // La durée dans le format ISO 8601, par exemple "PT1M30S"
    };
}

interface VideoCategory {
    id: string;
    snippet: {
        title: string;
    };
}

interface videoIdea {
    title: string;
    description: string
}

interface initialStateProps {
    loading: boolean;
    videos: Video[] | null;
    videoCategories: VideoCategory[]
    videoIdeas: videoIdea[] | null,
    categoryId: string,
    countryCode: string;
    error: string
}

const initialState: initialStateProps = {
    loading: false,
    videos: [],
    videoIdeas: null,
    videoCategories: [],
    countryCode: "US",
    categoryId: "1",
    error: ""
}

export const fetchTrendsVideos = createAsyncThunk("trending/fetchTrendsVideos", async ({ countryCode, categoryId }: { countryCode: string, categoryId: string }) => {
    if (countryCode === "CG") {
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
                    maxResults: 40,
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
    if (countryCode === "CG") {
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

export const getvideoIdeas = createAsyncThunk(
    "trending/getvideoIdeas",
    async (channelId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/video-ideas?channelId=${channelId}`);

            return response.data;
        } catch (error: any) {
            console.error("Error fetching video ideas:", error.message);
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

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

        builder.addCase(getvideoIdeas.pending, state => {
            state.loading = true
        })
            .addCase(getvideoIdeas.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.videoIdeas = action.payload
            })
            .addCase(getvideoIdeas.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const trendingVideos = (state: RootState) => state.trending;

export const { setCountryCode, setVideoCategoriesId } = trendingSlice.actions
export default trendingSlice.reducer