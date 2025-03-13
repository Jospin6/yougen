import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import "dotenv/config";

interface dataProps {
    channelId: string,
    userId: string,
}

interface initialState {
    loading: boolean
    channel: dataProps | null
    error: string
}

const initialState: initialState = {
    loading: false,
    channel: null,
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

const API_KEY = process.env.YOUTUBE_API_KEY;
const myId = "UCIdmNmW1ZfPLdndZY5p4B6g"

export const fetchYoutubeChannelInfos = createAsyncThunk("channel/fetchYoutubeChannelInfos",
    async (channelId: string) => {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
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
    }
})

export default yInfoSlice.reducer