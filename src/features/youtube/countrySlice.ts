import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { RootState } from "../store";

interface Country {
    name: string;
    code: string;
}

interface CountryState {
    countries: Country[];
    loading: boolean;
    error: string;
}

const initialState: CountryState = {
    countries: [],
    loading: false,
    error: ""
}

export const fetchCountries = createAsyncThunk("countries/fetchCountries", async () => {
    try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countries = response.data.map((country: any) => ({
            name: country.name.common,
            code: country.cca2, 
        }));
        return countries;
    } catch (error) {
        console.error("Erreur lors de la récupération des pays", error);
        return [];
    }
})


const countrySlice = createSlice({
    name: "countries",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.countries = action.payload;
                state.loading = false;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "";})
    }
})

export const allCountries = (state: RootState) => state.countries;
export default countrySlice.reducer