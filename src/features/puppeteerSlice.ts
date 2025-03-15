import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "./store"

interface puppeteerProps {
    title: string
    link: string
}

interface initialStateProps {
    loading: boolean
    data: puppeteerProps[]
    error: string
}

const initialState: initialStateProps = {
    loading: false,
    data: [],
    error: ""
}

export const scrapeData = createAsyncThunk("puppeteer/scrapeData", async (query: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/puppeteer?query=${query}`)
        const results = response.data.results;
        localStorage.setItem("scrapedSites", JSON.stringify(results));

        return results;
    } catch (error: any) {
        console.error("Erreur Axios :", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Erreur inconnue");
    }
})

const puppeteerSlice = createSlice({
    name: "puppeteer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(scrapeData.pending, state => {
                state.loading = true
            })
            .addCase(scrapeData.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false
                const items = localStorage.getItem("scrapedSites")
                if (items) {
                    state.data = JSON.parse(items)
                } else {
                    state.data = action.payload
                }
            })
            .addCase(scrapeData.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const puppeteerData = (state: RootState) => state.puppeteer.data 

export default puppeteerSlice.reducer