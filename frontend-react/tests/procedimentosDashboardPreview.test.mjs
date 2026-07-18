import assert from 'node:assert/strict';

const calls = [];

globalThis.window = {
  localStorage: {
    getItem(key) {
      assert.equal(key, 'brana_token');
      return 'token-test';
    },
  },
};

globalThis.fetch = async (url, options = {}) => {
  calls.push({ url, options });
  return {
    ok: true,
    status: 200,
    async json() {
      return {
        itens: [{ id: 7, preco: 123, tempo: 45, lucro_liquido: 10 }],
        grafico: [{ id: 7, preco: 123, tempo: 45, lucro_liquido: 10 }],
      };
    },
  };
};

const { obterProcedimentosDashboardPreview } = await import('../src/features/procedimentos/procedimentosApi.js');

const payload = {
  procedimento_id: 7,
  tabela_id: 1,
  procedimento_generico_id: null,
  preco: 123,
  tempo: 45,
  custo_lab: 0,
  custo: 0,
  materiais: [{ material_id: 3, quantidade: 2, custo_und: 5 }],
};

const response = await obterProcedimentosDashboardPreview(payload);

assert.equal(calls.length, 1);
assert.equal(calls[0].url, '/api/procedimentos/dashboard-preview');
assert.equal(calls[0].options.method, 'POST');
assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
assert.equal(calls[0].options.headers.Authorization, 'Bearer token-test');
assert.deepEqual(JSON.parse(calls[0].options.body), payload);
assert.equal(response.items[0].id, 7);
assert.equal(response.items[0].preco, 123);
assert.equal(response.grafico[0].lucro_liquido, 10);

console.log('procedimentosDashboardPreview.test.mjs ok');
