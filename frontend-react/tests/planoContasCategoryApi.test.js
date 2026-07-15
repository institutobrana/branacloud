import test from 'node:test';
import assert from 'node:assert/strict';

import {
  atualizarPlanoContasCategoria,
  criarPlanoContasCategoria,
} from '../src/features/planoContas/planoContasApi.js';

test('criarPlanoContasCategoria envia POST com payload enxuto', async () => {
  const originalFetch = globalThis.fetch;
  let captured = null;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return {
      ok: true,
      json: async () => ({ id: 21, nome: 'Caixa', tipo: 'Analitica', grupo_id: 11, tributavel: true }),
    };
  };

  try {
    const result = await criarPlanoContasCategoria({
      nome: '  Caixa  ',
      tipo: '  Analitica  ',
      grupo_id: '11',
      tributavel: true,
      extra: 'ignorado',
    });
    assert.equal(result.id, 21);
    assert.equal(captured.url, '/api/cadastros/categorias');
    assert.equal(captured.options.method, 'POST');
    assert.deepEqual(JSON.parse(captured.options.body), {
      nome: 'Caixa',
      tipo: 'Analitica',
      grupo_id: 11,
      tributavel: true,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('atualizarPlanoContasCategoria envia PUT com id explicito', async () => {
  const originalFetch = globalThis.fetch;
  let captured = null;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return {
      ok: true,
      json: async () => ({ detail: 'Categoria atualizada.' }),
    };
  };

  try {
    const result = await atualizarPlanoContasCategoria(88, {
      nome: 'Caixa Geral',
      tipo: 'Analitica',
      grupo_id: 11,
      tributavel: false,
    });
    assert.equal(result.detail, 'Categoria atualizada.');
    assert.equal(captured.url, '/api/cadastros/categorias/88');
    assert.equal(captured.options.method, 'PUT');
    assert.deepEqual(JSON.parse(captured.options.body), {
      nome: 'Caixa Geral',
      tipo: 'Analitica',
      grupo_id: 11,
      tributavel: false,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('criarPlanoContasCategoria preserva erro de categoria em uso', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: () => 'token',
    },
  };
  globalThis.fetch = async () => ({
    ok: false,
    status: 409,
    json: async () => ({ detail: 'Categoria em uso por lançamentos.' }),
  });

  try {
    await assert.rejects(
      () => criarPlanoContasCategoria({ nome: 'Caixa', tipo: 'Analitica', grupo_id: 11, tributavel: true }),
      (error) => error.status === 409 && /Categoria em uso/i.test(error.message),
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('atualizarPlanoContasCategoria trata resposta sem json', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: () => 'token',
    },
  };
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => {
      throw new Error('sem json');
    },
  });

  try {
    const result = await atualizarPlanoContasCategoria(88, {
      nome: 'Caixa Geral',
      tipo: 'Analitica',
      grupo_id: 11,
      tributavel: false,
    });
    assert.equal(result, null);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});
