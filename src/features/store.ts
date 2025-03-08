
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import chatReducer from "./chatSlice"
import trendingReducer from "./youtube/trendingSlice"
import countryReducer from "./youtube/countrySlice"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"


// Configuration de la persistance
const persistConfig = {
    key: "root", // Utiliser "root" pour englober tous les reducers
    storage,
    whitelist: ["chat"], // Permet de spécifier les reducers à persister
};

// Combinaison des reducers
const rootReducer = combineReducers({
    chat: chatReducer,
    trending: trendingReducer,
    countries: countryReducer,
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