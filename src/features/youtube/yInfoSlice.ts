import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import "dotenv/config";
import { RootState } from "../store";
import { findSimilarChannels } from "@/lib/recommandation";

interface dataProps {
    channelId: string,
    userId: string,
}

interface initialState {
    loading: boolean
    channel: dataProps | null
    youtubeData: any[] | null
    colabos: string[]
    error: string
}

const initialState: initialState = {
    loading: false,
    youtubeData: null,
    channel: null,
    colabos: [],
    error: ""
}



export const postChannelId = createAsyncThunk("channel/postChannelId", async (data: dataProps) => {
    try {
        const response = await axios.post("/api/youtube", {
            channelId: data.channelId,
            userId: data.userId,
        }
            , {
                headers: {
                    "Content-Type": "application/json",
                },
            }

        )
        return response.data
    } catch (error) {
        throw new Error("someting went wrong")
    }
})

export const fetchYoutubeChannelInfos = createAsyncThunk("channel/fetchYoutubeChannelInfos",
    async (channelId: string) => {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc`;
        const response = await axios.get(url)
        return response.data.items;
})

export const fetchChannelInfos = createAsyncThunk("channel/fetchChannelInfos", async (userId: string) => {
    try {
        const response = await axios.get(`/api/youtube?userId=${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user channel");
    }
})

export const fetchCollabSuggestions = createAsyncThunk("channel/fetchCollabSuggestions", async (channelId: string) => {
    const response = await axios.get(`/api/collab-suggestion?channelId=${channelId}`)
    const categories = response.data
    console.log("categs: ", categories)
    return await findSimilarChannels(categories)
})

const yInfoSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannelInfos.pending, state => {
                state.loading = true
            })
            .addCase(fetchChannelInfos.fulfilled, (state, action: PayloadAction<any>) => {
                state.channel = action.payload
            })
            .addCase(fetchChannelInfos.rejected, state => {
                state.error = "An error occured"
            })

            .addCase(fetchYoutubeChannelInfos.pending, state => {
                state.loading = true
            })
            .addCase(fetchYoutubeChannelInfos.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.youtubeData = action.payload
            })
            .addCase(fetchYoutubeChannelInfos.rejected, state => {
                state.error = "An error occured"
            })

            .addCase(fetchCollabSuggestions.fulfilled,(state, action: PayloadAction<any>) => {
                state.colabos = action.payload
            })
    }
})

export const selectChanel = (state: RootState) => state.channel.channel
export const selectYoutubeData = (state: RootState) => state.channel.youtubeData
export const selectColabos = (state: RootState) => state.channel.colabos

export default yInfoSlice.reducer