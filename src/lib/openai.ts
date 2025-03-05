import "dotenv/config"; 
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from "ai"

export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});