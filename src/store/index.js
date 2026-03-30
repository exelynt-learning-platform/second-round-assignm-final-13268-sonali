// src/store/index.js
// ─────────────────────────────────────────────────────────────
//  Redux store – configures the global store with Redux Toolkit.
//  redux-thunk middleware is included by default in RTK's
//  configureStore, so no manual setup is required.
// ─────────────────────────────────────────────────────────────

import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';

const store = configureStore({
  reducer: {
    chat: chatReducer,
  },

  // RTK includes redux-thunk by default.
  // The serializable-check middleware is relaxed here because
  // Date objects would otherwise trigger a warning.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/sendMessage/pending'],
      },
    }),

  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
