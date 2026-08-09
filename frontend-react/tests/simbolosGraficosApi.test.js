import test from 'node:test';
import assert from 'node:assert/strict';
import { createSimboloGrafico, deleteSimboloGrafico, listSimbolosGraficos, listSimbolosGraficosLibrary, updateSimboloGrafico } from '../src/features/simbolosGraficos/simbolosGraficosApi.js';

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;

function setupFetch(responseFactory, token = 'token-123') {
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => token } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return responseFactory(url, options);
  };
  return calls;
}

function teardown() {
  globalThis.fetch = originalFetch;
  globalThis.window = originalWindow;
}

test.afterEach(teardown);

test('listSimbolosGraficos usa GET e endpoint exato', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => [{ id: 7, descricao: 'Sorriso' }],
  }));

  const result = await listSimbolosGraficos({ q: '  sorriso  ', scope: '' });

  assert.deepEqual(result, [{ id: 7, descricao: 'Sorriso' }]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos\?q=sorriso$/);
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
  assert.ok(calls[0].options.headers.Authorization.includes('token-123'));
});

test('listSimbolosGraficos omite params vazios e nao envia tenant arbitrario', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => [],
  }));

  await listSimbolosGraficos({ q: '', scope: '   ' });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/cadastros/simbolos-graficos');
  assert.doesNotMatch(calls[0].url, /clinica_id|tenantId|userId/i);
  assert.doesNotMatch(JSON.stringify(calls[0].options), /clinica_id|tenantId|userId/i);
});

test('listSimbolosGraficos propaga erro controlado do cliente compartilhado', async () => {
  setupFetch(async () => ({
    ok: false,
    status: 403,
    json: async () => ({ detail: 'Sem permissao.' }),
  }));

  await assert.rejects(
    () => listSimbolosGraficos(),
    (error) => error.status === 403 && error.message === 'Sem permissao.',
  );
});

test('listSimbolosGraficosLibrary usa GET no catalogo oficial', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => [
      { id: 11, codigo: 'SYM-11', descricao: 'Icone 11', imagem_url: '/img/11.png', tipo_simbolo: 1, tipo_marca: 2 },
    ],
  }));

  const result = await listSimbolosGraficosLibrary();

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'GET');
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos\?scope=catalogo$/);
  assert.deepEqual(result, [
    { id: 11, codigo: 'SYM-11', descricao: 'Icone 11', imagem_url: '/img/11.png', tipo_simbolo: 1, tipo_marca: 2 },
  ]);
});

test('createSimboloGrafico usa POST no endpoint correto e envia apenas o payload basico', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => ({ id: 23, descricao: 'Novo símbolo' }),
  }));

  const payload = {
    descricao: 'Novo símbolo',
    codigo: 'sim_23.bmp',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
  };

  const result = await createSimboloGrafico(payload);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'POST');
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos$/);
  assert.equal(calls[0].options.body, JSON.stringify(payload));
  assert.doesNotMatch(JSON.stringify(calls[0].options), /clinica_id|tenantId|userId|bitmap|sobreposicao|icone/i);
  assert.deepEqual(result, { id: 23, descricao: 'Novo símbolo' });
});

test('updateSimboloGrafico usa PUT no endpoint correto e nao envia tenant', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => ({ detail: 'Simbolo atualizado.', id: 23, codigo: 'sim_23.bmp', descricao: 'Símbolo alterado' }),
  }));

  const payload = {
    descricao: 'Símbolo alterado',
    codigo: 'sim_23.bmp',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
    imagem_custom: '/api/desktop-assets/easy/sim_23.bmp',
  };

  const result = await updateSimboloGrafico(23, payload);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'PUT');
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos\/23$/);
  assert.equal(calls[0].options.body, JSON.stringify(payload));
  assert.doesNotMatch(JSON.stringify(calls[0].options), /clinica_id|tenantId|userId/i);
  assert.deepEqual(result, { detail: 'Simbolo atualizado.', id: 23, codigo: 'sim_23.bmp', descricao: 'Símbolo alterado' });
});

test('deleteSimboloGrafico usa DELETE no endpoint correto e normaliza resposta vazia', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => null,
  }));

  const result = await deleteSimboloGrafico(23);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'DELETE');
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos\/23$/);
  assert.doesNotMatch(JSON.stringify(calls[0].options), /clinica_id|tenantId|userId/i);
  assert.deepEqual(result, { detail: 'Simbolo excluido.' });
});

test('deleteSimboloGrafico propaga 409 de bloqueio com mensagem do backend', async () => {
  const calls = setupFetch(async () => ({
    ok: false,
    status: 409,
    json: async () => ({ detail: 'Simbolos de sistema nao podem ser excluidos.' }),
  }));

  await assert.rejects(
    () => deleteSimboloGrafico(1),
    (error) => error.status === 409 && error.message === 'Simbolos de sistema nao podem ser excluidos.',
  );

  assert.equal(calls.length, 1);
});

test('deleteSimboloGrafico propaga 404 quando o simbolo nao existe', async () => {
  const calls = setupFetch(async () => ({
    ok: false,
    status: 404,
    json: async () => ({ detail: 'Simbolo nao encontrado.' }),
  }));

  await assert.rejects(
    () => deleteSimboloGrafico(999),
    (error) => error.status === 404 && error.message === 'Simbolo nao encontrado.',
  );

  assert.equal(calls.length, 1);
});
