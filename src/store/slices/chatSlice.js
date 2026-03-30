// src/store/slices/chatSlice.js
// ─────────────────────────────────────────────────────────────
//  Redux slice: manages all chat state
//    - messages  : array of { id, role, content, timestamp }
//    - loading   : boolean – true while API call is in flight
//    - error     : string | null – last API error message
// ─────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageToClaudeAPI } from '../../services/claudeService';

// ── Async thunk ───────────────────────────────────────────────
/**
 * sendMessage
 * Dispatched when the user submits a message.
 * Adds the user message to the store, calls the Claude API,
 * then adds the assistant reply (or records an error).
 */
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ userMessage, conversationHistory }, { rejectWithValue }) => {
    try {
      const reply = await sendMessageToClaudeAPI(userMessage, conversationHistory);
      return reply;
    } catch (err) {
      // Pass a serialisable error string to the rejected action
      return rejectWithValue(err.message || 'Something went wrong. Please try again.');
    }
  }
);

// ── Initial state ─────────────────────────────────────────────
const initialState = {
  messages: [
    {
      id: uuidv4(),
      role: 'assistant',
      content: "Hello! I'm Claude, your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────
const chatSlice = createSlice({
  name: 'chat',
  initialState,

  reducers: {
    /**
     * addUserMessage
     * Optimistically appends the user's message to the list
     * before the API responds.
     */
    addUserMessage: (state, action) => {
      state.messages.push({
        id: uuidv4(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
      // Clear any previous error when user sends a new message
      state.error = null;
    },

    /**
     * clearError
     * Lets the UI dismiss an error banner.
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * clearChat
     * Resets the conversation to the initial greeting.
     */
    clearChat: (state) => {
      state.messages = [
        {
          id: uuidv4(),
          role: 'assistant',
          content: "Hello! I'm Claude, your AI assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ];
      state.error = null;
      state.loading = false;
    },
  },

  // ── Extra reducers (async thunk lifecycle) ──────────────────
  extraReducers: (builder) => {
    builder
      // Pending: show spinner
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fulfilled: append assistant reply
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: uuidv4(),
          role: 'assistant',
          content: action.payload,
          timestamp: new Date().toISOString(),
        });
      })

      // Rejected: store error, remove loading
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred.';
      });
  },
});

// ── Exports ───────────────────────────────────────────────────
export const { addUserMessage, clearError, clearChat } = chatSlice.actions;
export default chatSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────
export const selectMessages = (state) => state.chat.messages;
export const selectLoading  = (state) => state.chat.loading;
export const selectError    = (state) => state.chat.error;
