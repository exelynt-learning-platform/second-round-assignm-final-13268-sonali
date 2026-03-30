// src/services/claudeService.js
// ─────────────────────────────────────────────────────────────
//  Service layer: all communication with the Anthropic API.
//
//  NOTE – Browser / CORS limitation:
//  The official @anthropic-ai/sdk cannot be called directly
//  from a browser because the Anthropic API does not set
//  CORS headers for browser origins.  The recommended
//  production approach is a thin backend proxy (Node/Express).
//
//  For this assignment we call the API through a lightweight
//  fetch wrapper so you can:
//    a) point REACT_APP_API_PROXY_URL at your own proxy, OR
//    b) leave it unset and the app will show a friendly mock
//       response so the UI can be demoed without a backend.
//
//  To run a quick local proxy:
//    npx @anthropic-ai/proxy   (opens on localhost:8080)
//  Then set REACT_APP_API_PROXY_URL=http://localhost:8080
// ─────────────────────────────────────────────────────────────

const API_KEY   = process.env.REACT_APP_ANTHROPIC_API_KEY   || '';
const MODEL     = process.env.REACT_APP_CLAUDE_MODEL        || 'claude-3-haiku-20240307';
const PROXY_URL = process.env.REACT_APP_API_PROXY_URL       || '';

// Direct Anthropic endpoint (works from Node / proxy, not from browser directly)
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

/**
 * sendMessageToClaudeAPI
 *
 * @param {string}   userMessage          – The latest message from the user.
 * @param {Array}    conversationHistory  – Previous { role, content } pairs.
 * @returns {Promise<string>}             – Assistant reply text.
 */
export async function sendMessageToClaudeAPI(userMessage, conversationHistory = []) {
  // Build the messages array in Anthropic's expected format.
  // We strip the leading assistant greeting (role=assistant at index 0)
  // because the API infers the initial context from the system prompt.
  const historyForAPI = conversationHistory
    .filter((m) => !(m.role === 'assistant' && conversationHistory.indexOf(m) === 0))
    .map(({ role, content }) => ({ role, content }));

  const messages = [
    ...historyForAPI,
    { role: 'user', content: userMessage },
  ];

  const body = {
    model: MODEL,
    max_tokens: 1024,
    system:
      'You are Claude, a helpful, harmless, and honest AI assistant. ' +
      'Respond in a friendly, clear, and concise manner.',
    messages,
  };

  // ── Determine endpoint ────────────────────────────────────
  const endpoint = PROXY_URL ? `${PROXY_URL}/v1/messages` : ANTHROPIC_URL;

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
  };

  // ── Validate key presence ─────────────────────────────────
  if (!API_KEY || API_KEY === 'your_anthropic_api_key_here') {
    // Return a mock response so UI works during development
    return getMockResponse(userMessage);
  }

  // ── API call ──────────────────────────────────────────────
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg =
      errorData?.error?.message ||
      `API error ${response.status}: ${response.statusText}`;
    throw new Error(msg);
  }

  const data = await response.json();

  // Extract the text from the first content block
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error('Empty response received from Claude API.');

  return text;
}

// ── Mock responses for development / demo ────────────────────
const MOCK_RESPONSES = [
  "I'm currently running in demo mode because no API key is configured. Set REACT_APP_ANTHROPIC_API_KEY in your .env file to get real Claude responses!",
  "This is a demo response. Once you add your Anthropic API key to the .env file, I'll respond with real AI-generated content.",
  "Demo mode active! Configure your API key to unlock full Claude AI capabilities.",
];
let mockIndex = 0;

function getMockResponse(userMessage) {
  // Simple echo for very short messages, cycling mock responses otherwise
  if (userMessage.length < 20) {
    return Promise.resolve(`You said: "${userMessage}" — (demo mode, add your API key for real responses)`);
  }
  const reply = MOCK_RESPONSES[mockIndex % MOCK_RESPONSES.length];
  mockIndex++;
  return Promise.resolve(reply);
}
