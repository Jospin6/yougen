import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { streamText, generateText } from "ai";
import { gemini } from "@/lib/gemini";
import { RootState } from "./store";
import { readStreamableValue } from "ai/rsc";

interface Message {
  role: "user" | "assistant";
  content: string;
}
interface ChatState {
  response: string;
  status: string;
  error: string;
  chatHistory: Message[]
}

const initialState: ChatState = {
  response: '',
  status: 'idle',
  chatHistory: [],
  error: ""
}

// export const chatAsync = createAsyncThunk(
//   "chat/fetchMessages",
//   async (history: Message[], { dispatch }) => {
//     const formattedHistory = history.map((msg) => ({
//       role: "user" as const,
//       content: msg.content,
//     }));

//     // Ajouter un message vide pour le streaming
//     dispatch(addMessage({ sender: "assistant", content: "" }));

//     try {
//       const { textStream } = await streamText({
//         model: gemini("gemini-1.5-flash"),
//         messages: formattedHistory,
//       });

//       let textContent = "";
//       for await (const delta of textStream) {
//         textContent += delta;
//         dispatch(updateLastMessage(textContent)); // 🔥 Mise à jour progressive en Redux
//       }
//     } catch (error) {
//       console.error("Erreur AI:", error);
//       dispatch(updateLastMessage("An error occurred. Please try again."));
//     }
//   }
// );

// export const fetchAIResponse = createAsyncThunk(
//   'ai/fetchResponse',
//   async (message: string) => {
//     const response = await fetch('/api/ai', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message }),
//     });
//     const data = await response.json();
//     return data.text;
//   }
// );

export const fetchAIResponse = createAsyncThunk(
  'ai/fetchResponse',
  async (message: string, { dispatch }) => {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    if (reader) {
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          result += decoder.decode(value, { stream: true });
          dispatch(updateAIResponse(result));
        }
      }
      dispatch(addChatHistory({ role: 'ai', content: result }));
    }
    return result;
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateAIResponse: (state, action) => {
      state.response = action.payload;
    },
    setAIStatus: (state, action) => {
      state.status = action.payload;
    },
    addChatHistory: (state, action) => {
      state.chatHistory.push(action.payload);
      console.log(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIResponse.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAIResponse.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(fetchAIResponse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = "action error message";
      });
  },
});

export const { updateAIResponse, setAIStatus, addChatHistory } = chatSlice.actions;
export const selectAIResponse = (state: RootState) => state.chat.response;
export const selectAIStatus = (state: RootState) => state.chat.status;
export const selectChatHistory = (state: RootState) => state.chat.chatHistory;
export default chatSlice.reducer;
