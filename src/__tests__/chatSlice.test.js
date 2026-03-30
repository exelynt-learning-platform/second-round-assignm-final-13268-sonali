// src/__tests__/chatSlice.test.js
// ─────────────────────────────────────────────────────────────
//  Unit tests for the chat Redux slice.
//  Tests cover: reducers, selectors, and async thunk lifecycle.
//  Run with: npm test
// ─────────────────────────────────────────────────────────────

import chatReducer, {
  addUserMessage,
  clearError,
  clearChat,
  sendMessage,
  selectMessages,
  selectLoading,
  selectError,
} from '../store/slices/chatSlice';

// ── Helper ────────────────────────────────────────────────────
const buildState = (overrides = {}) => ({
  messages: [
    { id: '1', role: 'assistant', content: 'Hello!', timestamp: new Date().toISOString() },
  ],
  loading: false,
  error: null,
  ...overrides,
});

// ── Reducer tests ─────────────────────────────────────────────
describe('chatSlice reducers', () => {
  test('addUserMessage appends a user message and clears error', () => {
    const state  = buildState({ error: 'previous error' });
    const next   = chatReducer(state, addUserMessage('Hello, Claude!'));

    expect(next.messages).toHaveLength(2);
    const added = next.messages[1];
    expect(added.role).toBe('user');
    expect(added.content).toBe('Hello, Claude!');
    expect(added.id).toBeTruthy();
    expect(added.timestamp).toBeTruthy();
    // error cleared
    expect(next.error).toBeNull();
  });

  test('clearError sets error to null', () => {
    const state = buildState({ error: 'Some error' });
    const next  = chatReducer(state, clearError());
    expect(next.error).toBeNull();
  });

  test('clearChat resets to initial greeting and clears error/loading', () => {
    const state = buildState({
      messages: [
        { id: '1', role: 'user',      content: 'Hi',     timestamp: '' },
        { id: '2', role: 'assistant', content: 'Hello!', timestamp: '' },
      ],
      error: 'err',
      loading: true,
    });
    const next = chatReducer(state, clearChat());

    expect(next.messages).toHaveLength(1);
    expect(next.messages[0].role).toBe('assistant');
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });
});

// ── Async thunk lifecycle ─────────────────────────────────────
describe('chatSlice extraReducers (async thunk)', () => {
  test('sendMessage.pending sets loading = true and clears error', () => {
    const state = buildState({ error: 'old error' });
    const next  = chatReducer(state, { type: sendMessage.pending.type });

    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  test('sendMessage.fulfilled appends assistant message and sets loading = false', () => {
    const state = buildState({ loading: true });
    const next  = chatReducer(state, {
      type: sendMessage.fulfilled.type,
      payload: 'This is Claude speaking.',
    });

    expect(next.loading).toBe(false);
    const added = next.messages[next.messages.length - 1];
    expect(added.role).toBe('assistant');
    expect(added.content).toBe('This is Claude speaking.');
  });

  test('sendMessage.rejected sets loading = false and stores error', () => {
    const state = buildState({ loading: true });
    const next  = chatReducer(state, {
      type: sendMessage.rejected.type,
      payload: 'API key invalid.',
    });

    expect(next.loading).toBe(false);
    expect(next.error).toBe('API key invalid.');
  });

  test('sendMessage.rejected with no payload uses fallback error', () => {
    const state = buildState({ loading: true });
    const next  = chatReducer(state, {
      type: sendMessage.rejected.type,
      payload: undefined,
    });
    expect(next.error).toBe('An unexpected error occurred.');
  });
});

// ── Selector tests ────────────────────────────────────────────
describe('chatSlice selectors', () => {
  const rootState = {
    chat: buildState({
      messages: [{ id: 'x', role: 'user', content: 'Hi', timestamp: '' }],
      loading: true,
      error: 'Oops',
    }),
  };

  test('selectMessages returns messages array', () => {
    expect(selectMessages(rootState)).toHaveLength(1);
  });

  test('selectLoading returns loading boolean', () => {
    expect(selectLoading(rootState)).toBe(true);
  });

  test('selectError returns error string', () => {
    expect(selectError(rootState)).toBe('Oops');
  });
});
