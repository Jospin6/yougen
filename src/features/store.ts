
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import chatReducer from "./chatSlice"
import trendingReducer from "./youtube/trendingSlice"
import countryReducer from "./youtube/countrySlice"
import userReducer from "./userSlice"
import yInfoReducer from "./youtube/yInfoSlice"
import sponsorReducer from "./youtube/sponsorSlice"
import { persistStore, persistReducer } from "redux-persist"
import puppeteerReducer from "./puppeteerSlice"
import storage from "redux-persist/lib/storage"


// Configuration de la persistance
const persistConfig = {
    key: "root", // Utiliser "root" pour englober tous les reducers
    storage,
    whitelist: ["chat"], // Permet de spécifier les reducers à persister
};

// Combinaison des reducers
const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    trending: trendingReducer,
    countries: countryReducer,
    channel: yInfoReducer,
    puppeteer: puppeteerReducer,
    sponsors: sponsorReducer
});

// Création du reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch