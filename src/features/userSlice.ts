import { User } from "@/helpers/types"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

export const postUser = createAsyncThunk(
    "user/register",
    async (data: User, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/registration", 
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,    
                }
                , {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error: any) {
            console.error("Erreur Axios :", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Erreur inconnue");
        }
    }
);

export const postLogin = createAsyncThunk("user/postLogin", async ({email, password}: {email: string, password: string}, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/login", 
            {
                email: email,
                password: password,    
            }
            , {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("Erreur Axios :", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Erreur inconnue");
    }
})



const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        status: "idle",
    },
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload
        },
    },
})