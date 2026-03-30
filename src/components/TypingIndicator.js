// src/components/TypingIndicator.js
// ─────────────────────────────────────────────────────────────
//  Animated "Claude is typing…" indicator shown while the API
//  call is in-flight.
// ─────────────────────────────────────────────────────────────

import React from 'react';

function TypingIndicator() {
  return (
    <div className="message-row message-row--assistant" aria-live="polite" aria-label="Claude is typing">
      {/* Avatar */}
      <div className="avatar avatar--assistant" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Bubble with animated dots */}
      <div className="bubble bubble--assistant bubble--typing">
        <span className="typing-dot" style={{ animationDelay: '0ms' }}   />
        <span className="typing-dot" style={{ animationDelay: '180ms' }} />
        <span className="typing-dot" style={{ animationDelay: '360ms' }} />
      </div>
    </div>
  );
}

export default TypingIndicator;
