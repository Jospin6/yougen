import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { streamText, generateText } from "ai";
import { gemini } from "@/lib/gemini";
import { RootState } from "./store";
import { readStreamableValue } from "ai/rsc";

type Message = {
  sender: "user" | "assistant" | "system";
  content: string;
}
interface ChatState {
  loading: boolean;
  conversation: Message[];
  error: string;
}

const initialState: ChatState = {
  loading: false,
  conversation: [],
  error: ""
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<Message[]>) => {
      state.conversation = action.payload; // Assure que `conversation` reste un tableau plat
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.conversation.push(action.payload); // Ajoute un seul message proprement
    },
    updateLastMessage: (state, action: PayloadAction<Message>) => {
      if (state.conversation.length > 0) {
        state.conversation[state.conversation.length - 1] = action.payload;
      }
    },
    clearMessages: (state) => {
      state.conversation = [];
    }
  },
});

export const { setConversation, addMessage, updateLastMessage } = chatSlice.actions;

export default chatSlice.reducer;
