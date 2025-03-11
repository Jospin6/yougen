import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ChatList, Chat, Message } from "@/helpers/types"
import { RootState } from "./store";

type ChatDataProps = {
  userId: string
}
interface ChatState {
  loading: boolean;
  conversation: Message[];
  currentChatId: string | null;
  inputMessage: string
  chats: Chat[];
  error: string;
}

const initialState: ChatState = {
  loading: false,
  conversation: [],
  currentChatId: null,
  inputMessage: "",
  chats: [],
  error: ""
}
interface MessageDataProps {
  chatId?: string;
  sender: string;  
  content: string;
}

export const postChat = createAsyncThunk(
  "chat/postChat",
  async (data: ChatDataProps, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/chats", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create chat");
    }
  }
);

export const postMessage = createAsyncThunk(
  "chat/postMessage",
  async (data: MessageDataProps, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/messages", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

export const fetchUserChat = createAsyncThunk(
  "chat/fetchUserChat",
  async (userId: string) => {
    try {
      const response = await axios.get(`/api/chats?userId=${userId}`);
      console.log(response)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch user chats");
    }
  }
);

export const fetchChatMessages = createAsyncThunk("chat/fetchChatMessages", async (chatId: string)=>{
  try {
    const response = await axios.get(`/api/messages?chatId=${chatId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user chats");
  }
})

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<Message[]>) => {
      state.conversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // state.conversation.push(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<Message>) => {
      if (state.conversation.length > 0) {
        state.conversation[state.conversation.length - 1] = action.payload;
      }
    },
    setInputMessage: (state, action: PayloadAction<string>) => {
      state.inputMessage = action.payload;
    },
    clearInputMessage: (state) => {
      state.inputMessage = "";
    },
    // clearMessages: (state) => {
    //   state.conversation = [];
    // },
    setCurrentChatId: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postChat.fulfilled, (state, action) => {
        state.chats.push(action.payload);
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        const chat = state.chats.find(c => c.id === action.payload.chatId);
        if (chat) {
          if (chat.messages) {
            chat.messages.push(action.payload);
            state.conversation.push(action.payload);
          } else {
            chat.messages = [action.payload];
            if (state.conversation) {
              state.conversation = [action.payload];
            }
          }
        }
      })
      .addCase(postChat.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchUserChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserChat.fulfilled, (state, action: PayloadAction<any>) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserChat.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;})

      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.conversation = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;});
  },
});

export const selectChats = (state: RootState) => state.chat.chats;
export const selectConversation = (state: RootState) => state.chat.conversation;
export const selectCurrentChatId = (state: RootState) => state.chat.currentChatId;
export const selectInputMessage = (state: RootState) => state.chat.inputMessage;

export const { 
  setCurrentChatId, 
  setConversation, 
  clearInputMessage, 
  updateLastMessage, 
  addMessage, 
  setInputMessage } = chatSlice.actions;
export default chatSlice.reducer;
