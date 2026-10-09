import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';
import * as mappers from '../src/features/procedimentos/procedimentosEditorMappers.js';
import * as validators from '../src/features/procedimentos/procedimentosEditorValidators.js';

const jsx = await import('react/jsx-runtime');
const box = ({ children }) => React.createElement('div', null, children);
async function fixture(run, includePage = false) {
  const dom = new JSDOM('<div id="root"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  let serial = 0, input, rows = [], renders = 0, stateEvents = 0, hostProps;
  const timers = new Map(), requests = [];
  const records = Array.from({ length: 752 }, (_, i) => ({ id: i+1, codigo: i+1, tabela_id: 4, nome: i < 17 ? `Clareamento ${i}` : `Procedimento ${i}` }));
  const compile = (file, mocks) => {
    const module = { exports: {} };
    vm.runInNewContext(transformSync(fs.readFileSync(new URL(`../src/features/procedimentos/${file}`, import.meta.url), 'utf8'), { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code, {
      module, exports: module.exports, window: dom.window, CustomEvent: dom.window.CustomEvent,
      setTimeout: (callback, delay) => { assert.equal(delay, 200); const id = ++serial; timers.set(id, callback); return id; },
      clearTimeout: (id) => timers.delete(id),
      require: (id) => id === 'react' ? React : id === 'react/jsx-runtime' ? jsx : id.endsWith('.css') ? {} : mocks[id],
    });
    return module.exports;
  };
  const Search = compile('components/ProcedimentosSearchInput.jsx', { antd: { Input: { Search: (props) => {
    input = props;
    return React.createElement('input', { value: props.value, disabled: props.disabled, readOnly: true });
  } } } }).ProcedimentosSearchInput;
  const Page = includePage ? compile('ProcedimentosPage.jsx', {
    antd: { Typography: { Text: box, Paragraph: box }, Alert: box, message: { error() {}, warning() {}, success() {} } },
    '../../components/BranaCard.jsx': { BranaCard: box }, '../../components/BranaModal.jsx': { BranaModal: () => null },
    '../../components/TableColumnFilterHeader.jsx': { TableColumnFilterHeader: () => null },
    '../../components/BranaTable.jsx': { BranaTable: (props) => { renders++; rows = props.dataSource; return null; } },
    './procedimentosApi.js': {
      listarProcedimentosFiltros: async () => ({ tabelas: [{ id: 4, codigo: 4, nome: 'Fixture' }], especialidades: [{ codigo: '05', nome: 'Especialidade' }] }),
      listarProcedimentosGenericosCombos: async () => [], listarSimbolosGraficoProcedimentos: async () => [],
      listarProcedimentos: async (args) => { requests.push(args); return records.filter((row) => row.nome.toLowerCase().includes(args.q.toLowerCase())); },
    },
    './procedimentosEditorMappers.js': mappers, './procedimentosEditorValidators.js': validators,
    './components/ProcedimentoEditorModal.jsx': { ProcedimentoEditorModal: () => null },
    './components/ProcedimentoTabelaModal.jsx': { ProcedimentoTabelaModal: () => null, createTabelaForm: () => ({}) },
    './components/ProcedimentoReajusteModal.jsx': { ProcedimentoReajusteModal: () => null },
  }).ProcedimentosPage : null;
  const published = [];
  function Host(props) {
    hostProps = props;
    const [value, setValue] = React.useState('');
    React.useEffect(() => {
      const receive = (event) => { stateEvents++; setValue(event.detail.search); };
      window.addEventListener('brana-procedimentos-state', receive);
      return () => window.removeEventListener('brana-procedimentos-state', receive);
    }, []);
    return React.createElement(React.Fragment, null,
      React.createElement(Search, { value: includePage ? value : (props.value ?? ''), disabled: props.disabled, onSearch: (next) => {
        published.push(next);
        window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'search', value: next } }));
      } }), Page && React.createElement(Page));
  }
  const root = createRoot(document.querySelector('#root'));
  const render = async (props = {}) => act(async () => root.render(React.createElement(Host, props)));
  const type = async (value) => act(async () => input.onChange({ target: { value } }));
  const flush = async () => act(async () => { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach((fn) => fn()); });
  try {
    await render();
    requests.length = 0; renders = stateEvents = 0;
    await run({ input: () => input, rows: () => rows, stats: () => ({ requests: requests.length, renders, stateEvents }), requests,
      records, published, timers, type, flush, render, root, dom, props: () => hostProps });
  } finally {
    await act(async () => root.unmount());
    assert.equal(timers.size, 0, 'Unmount cancels pending queries');
    dom.window.close(); Object.assign(globalThis, previous);
  }
}

test('752 registros: 11 teclas imediatas, zero consultas/renders da Page durante digitação e uma consulta final', async () => fixture(async ({ type, flush, stats, requests, rows, input }) => {
  const word = 'Clareamento';
  for (let i=1; i<=word.length; i++) {
    await type(word.slice(0, i));
    assert.equal(input().value, word.slice(0, i));
    assert.equal(document.querySelector('input').value, word.slice(0, i));
    assert.deepEqual(stats(), { requests: 0, renders: 0, stateEvents: 0 });
  }
  await flush();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].q, word);
  assert.equal(rows().length, 17);
  assert.ok(rows().every((row) => row.nome.startsWith('Clareamento')));
  console.log(JSON.stringify({ measurement: 'AFTER', fixture_records: 752, keystrokes: word.length,
    api_requests: requests.length, table_renders: stats().renders, app_state_events: stats().stateEvents,
    final_results: rows().length, absolute_browser_latency_measured: false, production_requests: 0 }));
}, true));

test('limpar publica imediatamente, cancela debounce e recupera dataset inteiro sem limit', async () => fixture(async ({ type, flush, requests, rows, timers }) => {
  await type('Clareamento'); await flush();
  await type('Clareamento x'); await type('');
  assert.equal(timers.size, 0);
  assert.equal(requests.at(-1).q, '');
  assert.equal(rows().length, 752);
  assert.equal(new Set(rows().map((row) => row.id)).size, 752);
  assert.equal('limit' in requests.at(-1), false);
}, true));

test('Enter envia imediatamente uma vez e cancela consulta pendente', async () => fixture(async ({ type, input, published, timers, flush }) => {
  await type('Consulta');
  await act(async () => input().onSearch('Consulta'));
  assert.deepEqual(published, ['Consulta']);
  assert.equal(timers.size, 0);
  await flush();
  await act(async () => input().onSearch('Consulta'));
  assert.deepEqual(published, ['Consulta']);
}));

test('eco do query anterior não apaga texto mais recente ainda não publicado', async () => fixture(async ({ type, flush, render, input, published }) => {
  await type('Clare'); await flush();
  await type('Clareamento');
  await render({ value: 'Clare' });
  assert.equal(input().value, 'Clareamento');
  await flush();
  assert.deepEqual(published, ['Clare', 'Clareamento']);
}));

test('reset externo sincroniza draft e cancela query antigo', async () => fixture(async ({ type, render, input, timers, flush, published }) => {
  await type('Antigo');
  await render({ value: 'Outro' });
  assert.equal(input().value, 'Outro');
  assert.equal(timers.size, 0);
  await flush();
  assert.deepEqual(published, []);
}));

test('modal aberto cancela request pendente, input fica disabled', async () => fixture(async ({ type, render, input, timers, published, flush }) => {
  await type('Antigo');
  await render({ disabled: true });
  assert.equal(input().disabled, true);
  assert.equal(timers.size, 0);
  await flush(); assert.deepEqual(published, []);
}));

test('fechar modal retoma query do rascunho preservado, sem deixar texto e resultados divergentes', async () => fixture(async ({ type, render, input, timers, published, flush }) => {
  await type('Clareamento');
  await render({ disabled: true });
  assert.equal(timers.size, 0);
  assert.equal(input().value, 'Clareamento');
  await render({ disabled: false });
  assert.equal(input().value, 'Clareamento');
  assert.equal(timers.size, 1);
  await flush();
  assert.deepEqual(published, ['Clareamento']);
}));

test('unmount com query pendente não dispara chamada', async () => fixture(async ({ type, root, timers, published }) => {
  await type('Pendente');
  assert.equal(timers.size, 1);
  await act(async () => root.unmount());
  assert.equal(timers.size, 0);
  assert.deepEqual(published, []);
}));

test('consulta preserva tabela/especialidade e semântica case-insensitive vigente', async () => fixture(async ({ dom, type, flush, requests, rows }) => {
  await act(async () => window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'especialidade', value: '05' } })));
  await type('cLaReAmEnTo'); await flush();
  assert.equal(requests.at(-1).tabelaId, 4);
  assert.equal(requests.at(-1).especialidade, '05');
  assert.equal(rows().length, 17);
}, true));

test('App usa somente o query callback existente, não despacha evento por onChange do input', () => {
  const app = fs.readFileSync(new URL('../src/app/App.jsx', import.meta.url), 'utf8');
  const search = app.slice(app.indexOf('<ProcedimentosSearchInput'), app.indexOf('/>', app.indexOf('<ProcedimentosSearchInput')));
  assert.match(search, /onSearch=.*brana-procedimentos-toolbar-filter/);
  assert.doesNotMatch(search, /onChange/);
});
