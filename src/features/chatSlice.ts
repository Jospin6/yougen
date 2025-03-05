import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { streamText } from "ai";
import { gemini } from "@/lib/gemini";
import { Message } from "@/components/ui/chatSection";

export const chatAsync = createAsyncThunk(
  "chat/fetchMessages",
  async (history: Message[], { dispatch }) => {
    const formattedHistory = history.map((msg) => ({
      role: "user" as const,
      content: msg.content,
    }));

    // Ajouter un message vide pour le streaming
    dispatch(addMessage({ sender: "assistant", content: "" }));

    try {
      const { textStream } = await streamText({
        model: gemini("gemini-1.5-flash"),
        messages: formattedHistory,
      });

      let textContent = "";
      for await (const delta of textStream) {
        textContent += delta;
        dispatch(updateLastMessage(textContent)); // 🔥 Mise à jour progressive en Redux
      }
    } catch (error) {
      console.error("Erreur AI:", error);
      dispatch(updateLastMessage("An error occurred. Please try again."));
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [] as Message[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<string>) => {
      if (state.messages.length > 0) {
        state.messages[state.messages.length - 1].content = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(chatAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(chatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred.";
      });
  },
});

export const { addMessage, updateLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
