import test from 'node:test';
import assert from 'node:assert/strict';

import { buildApiUrl } from '../src/services/api.js';
import { renewAuthToken } from '../src/features/auth/authApi.js';

test('renewAuthToken chama POST /auth/renew e normaliza a resposta', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        access_token: 'token-novo',
        token_type: 'bearer',
        expires_in: 3600,
      }),
    };
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const result = await renewAuthToken('token-antigo');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, buildApiUrl('/auth/renew'));
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.body, undefined);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer token-antigo');
  assert.deepEqual(result, {
    accessToken: 'token-novo',
    tokenType: 'bearer',
    expiresIn: 3600,
  });
});

test('renewAuthToken rejeita resposta sem access_token', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ token_type: 'bearer', expires_in: 3600 }),
  });

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await assert.rejects(() => renewAuthToken('token-antigo'), (error) => {
    assert.equal(error.status, 502);
    assert.match(error.message, /sem access_token/i);
    return true;
  });
});

test('renewAuthToken propaga status 401 e 403', async (t) => {
  const originalFetch = globalThis.fetch;
  let call = 0;
  globalThis.fetch = async () => {
    call += 1;
    return {
      ok: false,
      status: call === 1 ? 401 : 403,
      json: async () => ({ detail: call === 1 ? 'Sessao expirada' : 'Acesso negado' }),
    };
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await assert.rejects(() => renewAuthToken('token-1'), (error) => error.status === 401);
  await assert.rejects(() => renewAuthToken('token-2'), (error) => error.status === 403);
});

test('renewAuthToken propaga erro de rede', async (t) => {
  const originalFetch = globalThis.fetch;
  const networkError = new TypeError('network down');
  globalThis.fetch = async () => {
    throw networkError;
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await assert.rejects(() => renewAuthToken('token-antigo'), (error) => {
    assert.equal(error.cause, networkError);
    return true;
  });
});
