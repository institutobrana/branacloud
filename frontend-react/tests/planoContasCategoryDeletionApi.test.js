import test from 'node:test';
import assert from 'node:assert/strict';

import {
  excluirPlanoContasCategoria,
  migrarEExcluirPlanoContasCategoria,
} from '../src/features/planoContas/planoContasApi.js';

function mockToken() {
  globalThis.window = {
    localStorage: {
      getItem: () => 'test-token',
    },
  };
}

test('excluirPlanoContasCategoria envia DELETE na URL real', async () => {
  mockToken();
  const originalFetch = globalThis.fetch;
  let captured = null;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return {
      ok: true,
      json: async () => ({ detail: 'Categoria excluída.' }),
    };
  };

  try {
    const result = await excluirPlanoContasCategoria(91);
    assert.equal(result.ok, true);
    assert.equal(captured.url, '/api/cadastros/categorias/91');
    assert.equal(captured.options.method, 'DELETE');
    assert.equal(captured.options.headers.get('Authorization'), 'Bearer test-token');
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
  }
});

test('migrarEExcluirPlanoContasCategoria envia somente categoria_destino_id', async () => {
  mockToken();
  const originalFetch = globalThis.fetch;
  let captured = null;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return {
      ok: true,
      json: async () => ({ detail: 'Categoria migrada e excluída.' }),
    };
  };

  try {
    const result = await migrarEExcluirPlanoContasCategoria(91, 261);
    assert.equal(result.ok, true);
    assert.equal(captured.url, '/api/cadastros/categorias/91/migrar-e-excluir');
    assert.equal(captured.options.method, 'POST');
    assert.deepEqual(JSON.parse(captured.options.body), { categoria_destino_id: 261 });
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
  }
});

test('excluirPlanoContasCategoria classifica categoria em uso', async () => {
  mockToken();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 409,
    json: async () => ({ detail: 'Categoria em uso por lançamentos.' }),
  });

  try {
    await assert.rejects(
      () => excluirPlanoContasCategoria(91),
      (error) => error.kind === 'category-in-use' && error.status === 409,
    );
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
  }
});

test('migrarEExcluirPlanoContasCategoria valida ids antes da chamada', async () => {
  mockToken();
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return {
      ok: true,
      json: async () => ({ detail: 'ok' }),
    };
  };

  try {
    await assert.rejects(() => migrarEExcluirPlanoContasCategoria(0, 261), /ID válido/);
    await assert.rejects(() => migrarEExcluirPlanoContasCategoria(91, 0), /categoria destino válida/);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
  }
});

for (const [status, detail] of [
  [400, 'Requisição inválida.'],
  [401, 'Não autenticado.'],
  [403, 'Sem permissão.'],
  [404, 'Não encontrado.'],
  [409, 'Categoria em uso por lançamentos.'],
]) {
  test(`excluirPlanoContasCategoria classifica HTTP ${status}`, async () => {
    mockToken();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
      ok: false,
      status,
      json: async () => ({ detail }),
    });

    try {
      await assert.rejects(
        () => excluirPlanoContasCategoria(91),
        (error) => error.status === status && String(error.message || '').length > 0,
      );
    } finally {
      globalThis.fetch = originalFetch;
      delete globalThis.window;
    }
  });
}

test('migrarEExcluirPlanoContasCategoria normaliza falha de rede', async () => {
  mockToken();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error('offline');
  };

  try {
    await assert.rejects(
      () => migrarEExcluirPlanoContasCategoria(91, 261),
      (error) => /conexão/i.test(error.message),
    );
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.window;
  }
});
