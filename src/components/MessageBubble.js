// src/components/MessageBubble.js
// ─────────────────────────────────────────────────────────────
//  Renders a single chat message bubble.
//  - User messages: right-aligned, accent colour
//  - Assistant messages: left-aligned, neutral surface
// ─────────────────────────────────────────────────────────────

import React, { memo } from 'react';
import { formatTime } from '../utils/formatTime';

const MessageBubble = memo(({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`message-row ${isUser ? 'message-row--user' : 'message-row--assistant'}`}
      aria-label={`${isUser ? 'You' : 'Claude'}: ${message.content}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="avatar avatar--assistant" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--assistant'}`}>
        {/* Message text – preserve line breaks */}
        <p className="bubble__text">
          {message.content.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>

        {/* Timestamp */}
        <span className="bubble__time" aria-label={`sent at ${formatTime(message.timestamp)}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="avatar avatar--user" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;
