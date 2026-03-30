// src/components/ChatInput.js
// ─────────────────────────────────────────────────────────────
//  Message input bar: textarea + send button.
//  Supports Enter-to-send (Shift+Enter for newline).
// ─────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';

function ChatInput({ value, onChange, onKeyDown, onSend, loading, disabled }) {
  const textareaRef = useRef(null);

  // Auto-grow the textarea up to ~5 lines, then scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [value]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="chat-input-bar">
      <div className="chat-input-bar__inner">
        <textarea
          ref={textareaRef}
          className="chat-input-bar__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message Claude…"
          disabled={disabled}
          rows={1}
          aria-label="Message input"
          aria-multiline="true"
        />

        <button
          className={`chat-input-bar__send ${loading ? 'chat-input-bar__send--loading' : ''}`}
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          {loading ? (
            /* Spinner */
            <svg
              className="spin"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
            </svg>
          ) : (
            /* Send arrow */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <p className="chat-input-bar__hint">
        Press <kbd>Enter</kbd> to send &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

export default ChatInput;
