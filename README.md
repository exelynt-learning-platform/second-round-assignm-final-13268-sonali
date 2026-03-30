# Chatbox Application with Claude AI API Integration using Redux

A fully functional chatbox application built with **React** and **Redux Toolkit**, integrated with the **Anthropic Claude AI API**. This project was built as part of an assignment to demonstrate state management, API integration, responsive UI, and testing.

---

## Features

- **Real-time AI Chat** — Send messages and receive responses from Claude AI
- **Redux State Management** — Manages messages, loading state, and errors using Redux Toolkit
- **redux-thunk** — Handles all async API calls via thunk middleware (included in Redux Toolkit by default)
- **Loading Indicator** — Animated typing indicator while waiting for AI response
- **Error Handling** — Displays error banners when API calls fail (invalid key, network issues, etc.)
- **Responsive Design** — Works on desktop and mobile devices
- **Message Alignment** — User messages on the RIGHT, AI responses on the LEFT
- **Unit Tests** — Tests for Redux actions, reducers, selectors, and components using Jest & React Testing Library

---

## Project Structure

```
chatbox-app/
├── public/
│   └── index.html
├── src/
│   ├── __tests__/
│   │   ├── chatSlice.test.js        # Redux slice unit tests
│   │   └── ChatBox.test.js          # Component integration tests
│   ├── components/
│   │   ├── ChatBox.js               # Main chat container component
│   │   ├── ChatInput.js             # Message input bar component
│   │   ├── ErrorBanner.js           # Error display component
│   │   ├── MessageBubble.js         # Individual message bubble
│   │   └── TypingIndicator.js       # Animated loading dots
│   ├── hooks/
│   │   └── useChat.js               # Custom hook connecting UI to Redux
│   ├── services/
│   │   └── claudeService.js         # Anthropic Claude API service layer
│   ├── store/
│   │   ├── index.js                 # Redux store configuration
│   │   └── slices/
│   │       └── chatSlice.js         # Redux slice (actions + reducers + selectors)
│   ├── utils/
│   │   └── formatTime.js            # Utility helpers
│   ├── App.css                      # Global styles (responsive)
│   ├── App.js                       # Root component
│   ├── index.css                    # Base CSS reset
│   └── index.js                     # Entry point with Redux Provider
├── .env.example                     # Environment variable template
├── .gitignore
└── package.json
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Redux Toolkit | State management |
| redux-thunk | Async middleware (built into RTK) |
| react-redux | React-Redux bindings |
| Anthropic Claude API | AI responses |
| Jest | Unit testing |
| React Testing Library | Component testing |

---

## Getting Started

### 1. Clone / Extract the project

```bash
cd chatbox-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```
REACT_APP_ANTHROPIC_API_KEY=your_actual_api_key_here
```

Get your API key from: https://console.anthropic.com/

> **Security Note:** The `.env` file is listed in `.gitignore` and will NEVER be committed to GitHub. Your API key stays local.

### 4. Start the app

```bash
npm start
```

App opens at: http://localhost:3000

### 5. Run tests

```bash
npm test
```

---

## Redux State Management

The entire chat state is managed in `src/store/slices/chatSlice.js`:

```js
// State shape
{
  messages: [
    { id, role: 'user' | 'assistant', content, timestamp }
  ],
  loading: false,   // true while API call is in flight
  error: null       // error string if API call fails
}
```

### Actions

| Action | Description |
|---|---|
| `addUserMessage(text)` | Optimistically adds user message |
| `clearError()` | Dismisses error banner |
| `clearChat()` | Resets conversation |
| `sendMessage(thunk)` | Async thunk — calls Claude API |

### Async Flow (redux-thunk)

```
User types → handleSend()
  → dispatch(addUserMessage)     [optimistic UI update]
  → dispatch(sendMessage thunk)
      → pending:   loading = true
      → fulfilled: append AI message, loading = false
      → rejected:  error = message, loading = false
```

---

## API Integration

The app integrates with the **Anthropic Claude API** (`claude-3-haiku-20240307` by default).

**Endpoint:** `https://api.anthropic.com/v1/messages`

**Request format:**
```json
{
  "model": "claude-3-haiku-20240307",
  "max_tokens": 1024,
  "system": "You are Claude, a helpful AI assistant.",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

> **Note:** Due to browser CORS restrictions, a backend proxy is recommended for production. The app includes demo/mock mode when no API key is configured.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `REACT_APP_CLAUDE_MODEL` | No | Override model (default: claude-3-haiku-20240307) |
| `REACT_APP_API_PROXY_URL` | No | Backend proxy URL (for production) |

---

## Testing

Tests are located in `src/__tests__/`.

```bash
npm test                    # run all tests
npm test -- --coverage      # with coverage report
```

**Test coverage includes:**
- Redux reducers (`addUserMessage`, `clearError`, `clearChat`)
- Async thunk lifecycle (`pending`, `fulfilled`, `rejected`)
- Redux selectors
- Component rendering (ChatBox, MessageBubble, ErrorBanner)

---

## Responsive Design

- **Desktop:** Centered card layout (max-width 780px)
- **Mobile (≤600px):** Full-screen layout, no border-radius, compact buttons

---

## Security

- API key stored in `.env` (never hardcoded)
- `.env` excluded from git via `.gitignore`
- Mock/demo mode activates automatically if key is missing
