import test from 'node:test';
import assert from 'node:assert/strict';

import { createPrestador, deletePrestador, updatePrestador } from '../src/features/prestadores/prestadoresApi.js';

test('createPrestador envia POST autenticado para a rota de prestadores', async () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.window?.localStorage;
  const calls = [];

  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };

  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: 99, nome: 'TESTE NP7 RUNTIME' }),
    };
  };

  try {
    const result = await createPrestador({ nome: 'TESTE NP7 RUNTIME', tipo_prestador: 'Cirurgião dentista' });
    assert.equal(result.id, 99);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/cadastros\/prestadores$/);
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
    assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
    assert.match(calls[0].options.body, /TESTE NP7 RUNTIME/);
  } finally {
    global.fetch = originalFetch;
    if (originalLocalStorage) {
      global.window.localStorage = originalLocalStorage;
    }
  }
});

test('updatePrestador envia PUT autenticado para a rota de prestadores com row_id', async () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.window?.localStorage;
  const calls = [];

  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };

  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: 99, nome: 'TESTE NP9 ALTERA' }),
    };
  };

  try {
    const result = await updatePrestador(99, { nome: 'TESTE NP9 ALTERA', codigo: '006' });
    assert.equal(result.id, 99);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/cadastros\/prestadores\/99$/);
    assert.equal(calls[0].options.method, 'PUT');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
    assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
    assert.match(calls[0].options.body, /TESTE NP9 ALTERA/);
  } finally {
    global.fetch = originalFetch;
    if (originalLocalStorage) {
      global.window.localStorage = originalLocalStorage;
    }
  }
});

test('deletePrestador envia DELETE autenticado para a rota de prestadores com row_id', async () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.window?.localStorage;
  const calls = [];

  global.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-teste' : ''),
    },
  };

  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  try {
    const result = await deletePrestador(77);
    assert.deepEqual(result, { ok: true });
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/cadastros\/prestadores\/77$/);
    assert.equal(calls[0].options.method, 'DELETE');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
    assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
  } finally {
    global.fetch = originalFetch;
    if (originalLocalStorage) {
      global.window.localStorage = originalLocalStorage;
    }
  }
});
