import { User } from "@/helpers/types"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from "./store";

export const fetchcurrentUser = createAsyncThunk(
    "user/currentUser",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get("/api/me", { withCredentials: true });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data || "Erreur inconnue");
        }
        return rejectWithValue("Erreur inconnue");
      }
    }
  );

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

interface initialStateProps {
    loading: boolean,
    currentUser: User | null,
    error: string 
}

const initialState: initialStateProps = {
    loading: false,
    currentUser: null,
    error: ""
}



const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchcurrentUser.pending, state => {
                state.loading = true
            })
            .addCase(fetchcurrentUser.fulfilled, (state, action) => {
                state.loading = false
                state.currentUser = action.payload
            })
            .addCase(fetchcurrentUser.rejected, (state) => {
                state.loading = false
                state.error = "An error occured"
            })

    }
})

export const selectCurrentUser = (state: RootState) => state.user.currentUser

export default userSlice.reducer