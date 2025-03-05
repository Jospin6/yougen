import "dotenv/config"; 
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const gemini = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_MODEL_API_KEY
})