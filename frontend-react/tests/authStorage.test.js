import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AUTH_TOKEN_STORAGE_KEY,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from '../src/features/auth/authStorage.js';

test('authStorage usa uma unica chave e grava somente o token', () => {
  const store = new Map();
  const previousWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: (key) => store.get(key) || '',
      setItem: (key, value) => {
        store.set(key, value);
      },
      removeItem: (key) => {
        store.delete(key);
      },
    },
  };

  try {
    setAuthToken('token-123');
    assert.equal(store.get(AUTH_TOKEN_STORAGE_KEY), 'token-123');
    assert.equal(getAuthToken(), 'token-123');
    clearAuthToken();
    assert.equal(store.has(AUTH_TOKEN_STORAGE_KEY), false);
  } finally {
    globalThis.window = previousWindow;
  }
});
