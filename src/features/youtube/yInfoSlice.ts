import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import "dotenv/config";
import { RootState } from "../store";

interface dataProps {
    channelId: string,
    userId: string,
}

interface initialState {
    loading: boolean
    channel: dataProps | null
    youtubeData: any[],
    error: string
}

const initialState: initialState = {
    loading: false,
    youtubeData: [],
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
console.log("api key", API_KEY)
const myId = "UCIdmNmW1ZfPLdndZY5p4B6g"

export const fetchYoutubeChannelInfos = createAsyncThunk("channel/fetchYoutubeChannelInfos",
    async (channelId: string) => {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=AIzaSyA75RiVKOZ-vCc772e8ZHDVQR5wMSrYMjc`;
        const response = await axios.get(url)
        return response.data.items;
    })

export const fetchChannelInfos = createAsyncThunk("channel/fetchChannelInfos", async (userId: string) => {
    try {
        const response = await axios.get(`/api/youtube?userId=${userId}`);
        console.log("data",response.data)
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
    }
})

export const selectChanel = (state: RootState) => state.channel.channel
export const selectYoutubeData = (state: RootState) => state.channel.youtubeData

export default yInfoSlice.reducer