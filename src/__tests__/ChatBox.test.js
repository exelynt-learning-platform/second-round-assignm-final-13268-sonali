// src/__tests__/ChatBox.test.js
// ─────────────────────────────────────────────────────────────
//  Component tests using Jest + React Testing Library.
//  Tests ChatBox rendering, MessageBubble alignment,
//  and ErrorBanner display.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/slices/chatSlice';
import ChatBox from '../components/ChatBox';
import MessageBubble from '../components/MessageBubble';
import ErrorBanner from '../components/ErrorBanner';

// ── Helper: build a test store with optional preloaded state ──
function buildStore(preloadedState = {}) {
  return configureStore({
    reducer: { chat: chatReducer },
    preloadedState,
  });
}

// ── Helper: render a component wrapped in Redux Provider ──────
function renderWithStore(ui, store) {
  return render(<Provider store={store}>{ui}</Provider>);
}

// ── ChatBox tests ─────────────────────────────────────────────
describe('ChatBox component', () => {
  test('renders header with Claude AI title', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    expect(screen.getByText('Claude AI')).toBeInTheDocument();
  });

  test('renders the initial greeting message from Claude', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    expect(
      screen.getByText(/Hello! I'm Claude/i)
    ).toBeInTheDocument();
  });

  test('renders input textarea', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    expect(screen.getByPlaceholderText(/Message Claude/i)).toBeInTheDocument();
  });

  test('renders Send button', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  test('send button is disabled when input is empty', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });

  test('send button enables when user types a message', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    const input  = screen.getByPlaceholderText(/Message Claude/i);
    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.change(input, { target: { value: 'Hello!' } });
    expect(sendBtn).not.toBeDisabled();
  });

  test('renders Clear button', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    expect(screen.getByLabelText('Clear conversation')).toBeInTheDocument();
  });

  test('shows "Online" status when not loading', () => {
    const store = buildStore();
    renderWithStore(<ChatBox />, store);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  test('shows "Thinking…" status when loading', () => {
    const store = buildStore({
      chat: {
        messages: [],
        loading: true,
        error: null,
      },
    });
    renderWithStore(<ChatBox />, store);
    expect(screen.getByText('Thinking…')).toBeInTheDocument();
  });

  test('displays error banner when error exists in store', () => {
    const store = buildStore({
      chat: {
        messages: [],
        loading: false,
        error: 'Invalid API key.',
      },
    });
    renderWithStore(<ChatBox />, store);
    expect(screen.getByText('Invalid API key.')).toBeInTheDocument();
  });
});

// ── MessageBubble tests ───────────────────────────────────────
describe('MessageBubble component', () => {
  const userMsg = {
    id: '1',
    role: 'user',
    content: 'Hello, AI!',
    timestamp: new Date().toISOString(),
  };

  const aiMsg = {
    id: '2',
    role: 'assistant',
    content: 'Hello! How can I help?',
    timestamp: new Date().toISOString(),
  };

  test('renders user message content', () => {
    render(<MessageBubble message={userMsg} />);
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
  });

  test('renders assistant message content', () => {
    render(<MessageBubble message={aiMsg} />);
    expect(screen.getByText('Hello! How can I help?')).toBeInTheDocument();
  });

  test('user message row has --user class (right-aligned)', () => {
    const { container } = render(<MessageBubble message={userMsg} />);
    expect(container.querySelector('.message-row--user')).toBeInTheDocument();
  });

  test('assistant message row has --assistant class (left-aligned)', () => {
    const { container } = render(<MessageBubble message={aiMsg} />);
    expect(container.querySelector('.message-row--assistant')).toBeInTheDocument();
  });

  test('user bubble has --user class', () => {
    const { container } = render(<MessageBubble message={userMsg} />);
    expect(container.querySelector('.bubble--user')).toBeInTheDocument();
  });

  test('assistant bubble has --assistant class', () => {
    const { container } = render(<MessageBubble message={aiMsg} />);
    expect(container.querySelector('.bubble--assistant')).toBeInTheDocument();
  });
});

// ── ErrorBanner tests ─────────────────────────────────────────
describe('ErrorBanner component', () => {
  test('renders nothing when message is null', () => {
    const { container } = render(
      <ErrorBanner message={null} onDismiss={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders error message text', () => {
    render(<ErrorBanner message="Network error occurred." onDismiss={() => {}} />);
    expect(screen.getByText('Network error occurred.')).toBeInTheDocument();
  });

  test('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = jest.fn();
    render(<ErrorBanner message="Some error" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText('Dismiss error'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('has role="alert" for accessibility', () => {
    render(<ErrorBanner message="Error!" onDismiss={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
