// src/components/ChatBox.js
// ─────────────────────────────────────────────────────────────
//  Root chat UI: composes all sub-components and wires them
//  to the useChat hook (which talks to Redux).
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble    from './MessageBubble';
import TypingIndicator  from './TypingIndicator';
import ErrorBanner      from './ErrorBanner';
import ChatInput        from './ChatInput';

function ChatBox() {
  const {
    messages,
    loading,
    error,
    inputValue,
    bottomRef,
    setInputValue,
    handleSend,
    handleKeyDown,
    handleClearError,
    handleClearChat,
  } = useChat();

  return (
    <div className="chatbox">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="chatbox__header">
        <div className="chatbox__header-left">
          <div className="chatbox__avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="chatbox__title">Claude AI</h1>
            <p className="chatbox__subtitle">
              <span className={`status-dot ${loading ? 'status-dot--thinking' : 'status-dot--online'}`} aria-hidden="true" />
              {loading ? 'Thinking…' : 'Online'}
            </p>
          </div>
        </div>

        <button
          className="chatbox__clear-btn"
          onClick={handleClearChat}
          disabled={loading}
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              fill="currentColor"
            />
          </svg>
          <span>Clear</span>
        </button>
      </header>

      {/* ── Error banner ─────────────────────────────────── */}
      <ErrorBanner message={error} onDismiss={handleClearError} />

      {/* ── Message list ─────────────────────────────────── */}
      <main className="chatbox__messages" aria-label="Conversation" aria-live="polite">
        {messages.length === 0 && (
          <div className="chatbox__empty">
            <p>Start a conversation with Claude!</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator shown while awaiting API response */}
        {loading && <TypingIndicator />}

        {/* Invisible anchor for auto-scroll */}
        <div ref={bottomRef} aria-hidden="true" />
      </main>

      {/* ── Input bar ────────────────────────────────────── */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        loading={loading}
        disabled={loading}
      />
    </div>
  );
}

export default ChatBox;
