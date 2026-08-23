import test from 'node:test';
import assert from 'node:assert/strict';
import { deleteAgendaBloqueio } from '../src/features/agendaConfiguracao/agendaConfiguracaoApi.js';

test('agenda configuracao remove bloqueio pela rota operacional do prestador', async () => {
  const originalFetch = global.fetch;
  global.window = { localStorage: { getItem: (key) => (key === 'brana_token' ? 'token-teste' : '') } };
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ ok: true }) };
  };
  try {
    const result = await deleteAgendaBloqueio(11, 7);
    assert.deepEqual(result, { ok: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.method, 'DELETE');
    assert.match(calls[0].url, /\/agenda-legado\/prestadores\/11\/bloqueios\/7$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-teste');
  } finally {
    global.fetch = originalFetch;
  }
});
