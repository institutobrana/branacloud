import assert from 'node:assert/strict';
import test from 'node:test';
import { salvarRespostaAnamnese } from './anamneseApi.js';

test('salva resposta pelo PUT existente com payload minimo', async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => { request = { url, options }; return new Response(JSON.stringify({ detail: 'Resposta salva.' }), { status: 200, headers: { 'Content-Type': 'application/json' } }); };
  try {
    await salvarRespostaAnamnese(42, { pergunta_id: 7, resposta: 'sim' });
    assert.match(request.url, /\/anamnese\/pacientes\/42\/respostas/);
    assert.equal(request.options.method, 'PUT');
    assert.deepEqual(JSON.parse(request.options.body), { pergunta_id: 7, resposta: 'sim' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
