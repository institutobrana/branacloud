import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';
import * as mappers from '../src/features/procedimentos/procedimentosEditorMappers.js';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const app = read('../src/app/App.jsx');
const page = read('../src/features/procedimentos/ProcedimentosPage.jsx');
const api = read('../src/features/procedimentos/procedimentosApi.js');
const start = app.indexOf('  const procedimentosTopBar = useMemo(() => {');
const end = app.indexOf('  }, [procedimentosToolbarState, screen]);', start);
assert(start >= 0 && end > start);
assert.match(app.slice(end), /procedimentosTopBar/);
const fragment = app.slice(start, end).replace(
  'const procedimentosTopBar = useMemo(() => {',
  'function Toolbar({ procedimentosToolbarState }) { const screen = "procedimentos";',
);
const compiled = transformSync(`${fragment}\n}\nexport { Toolbar };`, {
  loader: 'jsx', format: 'cjs', jsx: 'automatic',
}).code;

// Execute the active toolbar's JSX/options/events. AntD presentation remains
// subject to manual homologation; this native adapter exposes its exact props.
async function withToolbar(tabelas, selectedTabelaId, check) {
  const dom = new JSDOM('<div id="toolbar"></div>');
  const previous = {
    window: globalThis.window, document: globalThis.document,
    act: globalThis.IS_REACT_ACT_ENVIRONMENT,
  };
  Object.assign(globalThis, {
    window: dom.window, document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  let props;
  function Select(input) {
    if (input.placeholder !== 'Tabela') return null;
    props = input;
    return React.createElement('select', {
      'data-testid': 'table-selector', value: input.value ?? '',
      disabled: input.disabled,
      onChange: (event) => input.onChange(
        input.options.find((option) => String(option.value) === event.target.value).value,
      ),
    }, input.options.map((option) => React.createElement('option', {
      key: option.value, value: option.value,
    }, option.label)));
  }
  const module = { exports: {} };
  const jsx = await import('react/jsx-runtime');
  vm.runInNewContext(compiled, {
    module, exports: module.exports, window: dom.window,
    CustomEvent: dom.window.CustomEvent, Select,
    ProcedimentosSearchInput: () => null, Input: { Search: () => null },
    require: (id) => id === 'react/jsx-runtime' ? jsx : React,
  });
  const root = createRoot(document.querySelector('#toolbar'));
  const render = async (selectedId, tables = tabelas) => act(async () => root.render(
    React.createElement(module.exports.Toolbar, {
      procedimentosToolbarState: {
        tabelas: tables, especialidades: [], selectedTabelaId: selectedId,
        modalOpen: false, loadingListas: false,
      },
    }),
  ));
  try {
    await render(selectedTabelaId);
    await check({ dom, render, getProps: () => props,
      select: () => document.querySelector('[data-testid="table-selector"]') });
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    Object.assign(globalThis, {
      window: previous.window, document: previous.document,
      IS_REACT_ACT_ENVIRONMENT: previous.act,
    });
  }
}

const table = (id, nome) => Object.freeze({ id, codigo: id, nome });
for (const [scope, tables, selected] of [
  ['ID1', [table(1, 'Tabela Exemplo'), table(4, 'PARTICULAR')], 1],
  ['ID4', [table(1, 'Tabela Exemplo'), table(4, 'PARTICULAR'), table(5, 'Histórico recuperado')], 5],
  ['clínicas padrão atuais/futuras', [table(4, 'PARTICULAR'), table(10, 'EASY - Particular')], 4],
]) {
  test(`${scope}: label somente nome; value e código internos preservados`, async () => {
    const before = JSON.stringify(tables);
    await withToolbar(tables, selected, async ({ select, getProps }) => {
      assert.deepEqual([...select().options].map((option) => option.text), tables.map((item) => item.nome));
      assert.deepEqual([...select().options].map((option) => option.value), tables.map((item) => String(item.id)));
      assert.equal(getProps().value, selected);
      assert.equal(select().selectedOptions[0].text, tables.find((item) => item.id === selected).nome);
      assert.equal(JSON.stringify(tables), before);
      assert.ok(tables.every((item) => item.codigo === item.id));
    });
  });
}

test('nomes duplicados mantêm identidades distintas e despacham o ID escolhido', async () => {
  await withToolbar([table(4, 'Mesmo nome'), table(5, 'Mesmo nome')], 4,
    async ({ dom, select, getProps, render }) => {
      const received = [];
      dom.window.addEventListener('brana-procedimentos-toolbar-filter', (event) => received.push(event.detail));
      await act(async () => {
        select().value = '5';
        select().dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      assert.equal(received.length, 1);
      assert.equal(received[0].field, 'tabela');
      assert.equal(received[0].value, 5);
      await render(received[0].value);
      assert.equal(getProps().value, 5);
      assert.equal(select().value, '5');
    });
});

test('troca, reload e retorno resolvem pela identidade, não por nome ou ordem', async () => {
  const tables = [table(4, 'PARTICULAR'), table(5, 'Histórico recuperado')];
  await withToolbar(tables, 4, async ({ dom, select, render }) => {
    let selected = 4;
    dom.window.addEventListener('brana-procedimentos-toolbar-filter', (event) => {
      selected = event.detail.value;
    });
    await act(async () => {
      select().value = '5';
      select().dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    });
    await render(selected, [...tables].reverse().map((item) => ({ ...item })));
    assert.equal(select().value, '5');
    assert.equal(select().selectedOptions[0].text, 'Histórico recuperado');
    await render(4, [...tables].reverse());
    assert.equal(select().selectedOptions[0].text, 'PARTICULAR');
  });
  assert.match(page, /item\.id === \(preferredId \?\? selectedTabelaId\)/);
  assert.match(page, /setSelectedTabelaId\(Number\(value \|\| 0\) \|\| null\)/);
});

test('inclusão e edição mantêm tabela_id no payload e na hidratação', () => {
  for (const id of [1, 4, 5, 10]) {
    const form = mappers.createEmptyProcedimentoForm({ tabelaId: id, codigo: '12', nome: 'Teste' });
    const payload = mappers.buildProcedimentoPayload(form);
    assert.equal(payload.tabela_id, String(id));
    const reloaded = mappers.hydrateProcedimentoForm({ ...payload, id: 100 });
    assert.equal(reloaded.tabela_id, id);
    assert.equal(mappers.buildProcedimentoPayload(reloaded).tabela_id, String(id));
  }
});

test('API real com fetch mock: filtros, save e reload preservam código público', async () => {
  const requests = [];
  let saved;
  const module = { exports: {} };
  const window = { localStorage: { getItem: () => 'isolated-test-token' } };
  const fetch = async (url, options = {}) => {
    requests.push({ url, options });
    let data = [];
    if (url.endsWith('/filtros')) data = { tabelas: [
      { id: '4', codigo: 4, nome: 'Mesmo nome' },
      { id: '5', codigo: 5, nome: 'Mesmo nome' },
    ] };
    if (options.body) { saved = JSON.parse(options.body); data = { ...saved, id: 100 }; }
    if (url.endsWith('/100') && !options.body) data = { ...saved, id: 100 };
    return { ok: true, json: async () => data };
  };
  const code = transformSync(api, { loader: 'js', format: 'cjs' }).code;
  vm.runInNewContext(code, {
    module, exports: module.exports, window, fetch, URLSearchParams,
    require: (id) => id.includes('services/api') ? { buildApiUrl: (p) => '/api' + p }
      : id.includes('EditorMappers') ? mappers : { normalizeProcedimentosFinanceiroResponse: (v) => v },
  });
  const methods = module.exports;
  const filters = await methods.listarProcedimentosFiltros();
  assert.equal(filters.tabelas[0].id, 4);
  assert.equal(filters.tabelas[1].id, 5);
  assert.equal(filters.tabelas[1].codigo, 5);
  await methods.listarProcedimentos({ tabelaId: 5, especialidade: '01', q: 'Teste' });
  assert.match(requests.at(-1).url, /tabela_id=5&especialidade=01&q=Teste$/);
  const payload = mappers.buildProcedimentoPayload(
    mappers.createEmptyProcedimentoForm({ tabelaId: 5, codigo: '12', nome: 'Teste' }),
  );
  await methods.salvarProcedimento({ payload });
  assert.equal(requests.at(-1).options.method, 'POST');
  assert.equal(saved.tabela_id, '5');
  await methods.salvarProcedimento({ id: 100, payload: { ...payload, nome: 'Editado' } });
  assert.equal(requests.at(-1).options.method, 'PUT');
  assert.equal((await methods.obterProcedimentoDetalhe(100)).tabela_id, 5);
  assert.equal((await methods.listarProcedimentosFiltros()).tabelas[1].id, 5);
});
