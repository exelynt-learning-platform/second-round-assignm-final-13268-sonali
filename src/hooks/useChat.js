// src/hooks/useChat.js
// ─────────────────────────────────────────────────────────────
//  Custom hook: encapsulates all chat-related Redux dispatching
//  and state selection so components stay lean.
// ─────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessage,
  addUserMessage,
  clearError,
  clearChat,
  selectMessages,
  selectLoading,
  selectError,
} from '../store/slices/chatSlice';

export function useChat() {
  const dispatch = useDispatch();

  // ── Redux state ───────────────────────────────────────────
  const messages = useSelector(selectMessages);
  const loading  = useSelector(selectLoading);
  const error    = useSelector(selectError);

  // ── Local input state ─────────────────────────────────────
  const [inputValue, setInputValue] = useState('');

  // ── Scroll anchor ─────────────────────────────────────────
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message whenever messages or
  // loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Handlers ──────────────────────────────────────────────

  /**
   * handleSend
   * Validates the input, dispatches addUserMessage (optimistic),
   * then dispatches the async sendMessage thunk.
   */
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;

    // Optimistically add the user message
    dispatch(addUserMessage(trimmed));

    // Pass the current message list as context BEFORE adding the new one
    // (addUserMessage hasn't been reflected yet in the selector at this point)
    dispatch(
      sendMessage({
        userMessage: trimmed,
        conversationHistory: messages,
      })
    );

    setInputValue('');
  }, [inputValue, loading, dispatch, messages]);

  /**
   * handleKeyDown
   * Sends on Enter (without Shift) for a natural chat feel.
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  /**
   * handleClearError
   * Dismisses the error banner.
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * handleClearChat
   * Resets the conversation.
   */
  const handleClearChat = useCallback(() => {
    dispatch(clearChat());
  }, [dispatch]);

  return {
    // State
    messages,
    loading,
    error,
    inputValue,
    bottomRef,

    // Handlers
    setInputValue,
    handleSend,
    handleKeyDown,
    handleClearError,
    handleClearChat,
  };
}
