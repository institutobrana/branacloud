import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

const source = fs.readFileSync(new URL('../src/features/procedimentosGenericos/procedimentosGenericosApi.js', import.meta.url), 'utf8');
const modal = fs.readFileSync(new URL('../src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx', import.meta.url), 'utf8');
const helpers = modal.slice(modal.indexOf('function buildEmptyState('), modal.indexOf('function buildCustoTotals('));
const context = vm.createContext({});
vm.runInContext(helpers, context);
const payload = (code) => context.buildPayload({ ...context.buildEmptyState(code), descricao: 'Literal' });

function apiFixture() {
  const records = new Map();
  const requests = [];
  const module = { exports: {} };
  let nextId = 1;
  const fetch = async (url, options) => {
    requests.push({ url, options });
    const id = Number(url.split('/').at(-1));
    let result;
    if (options.method) {
      result = { ...JSON.parse(options.body), id: options.method === 'POST' ? nextId++ : id };
      records.set(result.id, result);
    } else {
      result = url.includes('/detalhe/') ? records.get(id) : Array.from(records.values());
    }
    return { ok: true, json: async () => result };
  };
  vm.runInNewContext(transformSync(source, { format: 'cjs' }).code, {
    module, exports: module.exports, fetch, URLSearchParams,
    window: { localStorage: { getItem: () => 'fixture-token' } },
    require: (id) => {
      assert.equal(id, '../../services/api.js');
      return { buildApiUrl: (path) => path };
    },
  });
  return { api: module.exports, requests };
}

test('modal keeps all seven literal pairs in state and payload', () => {
  for (let number = 200; number <= 206; number++) {
    const a = String(number).padStart(5, '0');
    const b = String(number).padStart(4, '0');
    assert.equal(payload(a).codigo, a);
    assert.equal(payload(b).codigo, b);
    assert.notEqual(payload(a).codigo, payload(b).codigo);
  }
});

test('modal preserves short textual identities and trims only outside spaces', () => {
  assert.equal(payload('0001').codigo, '0001');
  assert.equal(payload('1').codigo, '1');
  assert.equal(payload(' 00200 ').codigo, '00200');
});

test('actual API client keeps create -> GET -> edit -> reload codes distinct', async () => {
  const { api, requests } = apiFixture();
  for (let number = 200; number <= 206; number++) {
    for (const size of [5, 4]) {
      const code = String(number).padStart(size, '0');
      const created = await api.salvarProcedimentoGenerico({ payload: payload(code) });
      const loaded = await api.obterProcedimentoGenericoDetalhe(created.id);
      assert.equal(loaded.codigo, code);
      await api.salvarProcedimentoGenerico({ id: loaded.id, payload: payload(loaded.codigo) });
      assert.equal((await api.obterProcedimentoGenericoDetalhe(created.id)).codigo, code);
    }
  }
  const all = await api.listarProcedimentosGenericos({ q: '00200' });
  assert.equal(all.length, 14);
  assert.equal(new Set(all.map((row) => row.id)).size, 14);
  assert.equal(new Set(all.map((row) => row.codigo)).size, 14);
  assert.ok(requests.at(-1).url.endsWith('?q=00200'));
  assert.equal(typeof JSON.parse(requests.find((r) => r.options.method).options.body).codigo, 'string');
});

test('generic code input uses literal event text, not numeric input/parse', () => {
  const input = modal.match(/<Form.Item[^>]*label="Código genérico:"[\s\S]*?<\/Form.Item>/)?.[0];
  assert.ok(input);
  assert.match(input, /updateField\('codigo', event.target.value\)/);
  assert.doesNotMatch(input, /InputNumber|type="number"|parseInt|Number\(/);
});
