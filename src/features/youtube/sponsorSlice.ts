import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "../store"

interface initialStateProps {
    loading: boolean
    sponsors: any
    error: string
    
}

const initialState: initialStateProps = {
    loading: false,
    sponsors: [],
    error: ""
}

export const fetchSponsors = createAsyncThunk("sponsor/fetchSponsors", async (channelId: string) => {
    try {
        const response = await axios.get(`/api/sponsor?channelId=${channelId}`)
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch sponsors");
    }
})

const sponsorSlice = createSlice({
    name: "sponsor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSponsors.pending, state => {
                state.loading = true
            })
            .addCase(fetchSponsors.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.sponsors = action.payload
            })
            .addCase(fetchSponsors.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const selecteSponsors = (state: RootState) => state.sponsors

export default sponsorSlice.reducer
