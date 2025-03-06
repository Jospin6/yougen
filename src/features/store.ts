
import { configureStore } from "@reduxjs/toolkit"
import chatReducer from "./chatSlice"
import trendingReducer from "./youtube/trendingSlice"
import countryReducer from "./youtube/countrySlice"

export const store = configureStore({
    reducer: { 
        chat: chatReducer,
        trending: trendingReducer,
        countries: countryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch