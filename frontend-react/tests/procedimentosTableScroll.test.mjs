import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { Table } from 'antd';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';
import * as mappers from '../src/features/procedimentos/procedimentosEditorMappers.js';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const records = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, codigo: i + 1, nome: `Procedimento ${i + 1}`, tabela_id: 4 }));
const box = ({ children }) => React.createElement('div', null, children);

// Run the real page with synthetic data and a controlled DOM row measurement.
// No fetch, credentials, database or productive API is used.
async function withPage(run, dataset = records) {
  const dom = new JSDOM('<div id="page"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  let rowHeight = 27;
  dom.window.Element.prototype.getBoundingClientRect = function () {
    return { height: this.classList.contains('ant-table-row') ? rowHeight : 0 };
  };
  const observers = new Set();
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe() { observers.add(this); }
    disconnect() { observers.delete(this); }
  }
  const writes = [];
  const reads = [];
  const unexpectedWrite = () => { writes.push('unexpected'); throw Error('No writes allowed in scroll fixture'); };
  let table;
  let state;
  dom.window.addEventListener('brana-procedimentos-state', (event) => { state = event.detail; });
  const mocks = {
    react: React, 'react/jsx-runtime': await import('react/jsx-runtime'),
    antd: { Typography: { Text: box, Paragraph: box }, Alert: () => null, message: { error() {}, warning() {}, success() {} } },
    '../../components/BranaCard.jsx': { BranaCard: box },
    '../../components/BranaModal.jsx': { BranaModal: () => null },
    '../../components/TableColumnFilterHeader.jsx': { TableColumnFilterHeader: () => null },
    '../../components/BranaTable.jsx': { BranaTable: (props) => {
      table = props;
      return React.createElement('table', null, React.createElement('tbody', { className: 'ant-table-tbody' },
        props.dataSource.map((record) => React.createElement('tr', { key: record.id, className: 'ant-table-row' },
          React.createElement('td', null, record.nome)))));
    } },
    './procedimentosEditorMappers.js': mappers,
    './procedimentosEditorValidators.js': { validateProcedimentoForm: () => [] },
    './components/ProcedimentoEditorModal.jsx': { ProcedimentoEditorModal: () => null },
    './components/ProcedimentoTabelaModal.jsx': { ProcedimentoTabelaModal: () => null, createTabelaForm: () => ({}), validateTabelaForm: unexpectedWrite, buildTabelaPayload: unexpectedWrite },
    './components/ProcedimentoReajusteModal.jsx': { ProcedimentoReajusteModal: () => null, reajustePreviewKey: unexpectedWrite },
    './procedimentos.css': {},
    './procedimentosApi.js': {
      listarProcedimentosFiltros: async () => ({ tabelas: [{ id: 4, codigo: 4, nome: 'PARTICULAR' }], especialidades: [] }),
      listarProcedimentos: async (args) => {
        reads.push(args);
        return dataset.filter((record) => !args.q || record.nome.includes(args.q)).map((record) => ({ ...record }));
      },
      listarProcedimentosGenericosCombos: async () => [], listarSimbolosGraficoProcedimentos: async () => [],
      obterProcedimentoDetalhe: unexpectedWrite, obterProximoCodigoProcedimento: unexpectedWrite,
      salvarProcedimento: unexpectedWrite, excluirProcedimento: unexpectedWrite, criarTabelaProcedimentos: unexpectedWrite,
      atualizarTabelaProcedimentos: unexpectedWrite, excluirTabelaProcedimentos: unexpectedWrite,
      previewReajusteTabela: unexpectedWrite, aplicarReajusteTabela: unexpectedWrite,
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(transformSync(read('../src/features/procedimentos/ProcedimentosPage.jsx'), { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code, {
    module, exports: module.exports, window: dom.window, CustomEvent: dom.window.CustomEvent, ResizeObserver: Observer,
    require: (id) => { assert.ok(id in mocks, `Unexpected dependency ${id}`); return mocks[id]; },
  });
  const root = createRoot(document.querySelector('#page'));
  try {
    await act(async () => root.render(React.createElement(module.exports.ProcedimentosPage)));
    await run({ table: () => table, state: () => state, reads, writes, document: dom.window.document,
      search: (value) => dom.window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field: 'search', value } })),
      resize: (height) => { rowHeight = height; for (const observer of observers) observer.callback(); } });
  } finally {
    await act(async () => root.unmount());
    assert.equal(observers.size, 0, 'measurement observers must be disconnected');
    dom.window.close();
    Object.assign(globalThis, { window: previous.window, document: previous.document, IS_REACT_ACT_ENVIRONMENT: previous.act });
  }
}

test('scroll acompanha 15 alturas reais, inclusive alteração de densidade, sem paginação', async () => withPage(async ({ table, resize }) => {
  assert.equal(table().scroll.y, 27 * 15);
  assert.equal(table().pagination, false);
  await act(async () => resize(32));
  assert.equal(table().scroll.y, 480);
  await act(async () => resize(22.5));
  assert.equal(table().scroll.y, 337.5);
  await act(async () => resize(0));
  assert.equal(table().scroll.y, 337.5, 'hidden row must not collapse the body');
}));

test('todos os 200 registros permanecem; seleção além da linha 15 e toolbar são preservadas', async () => withPage(async ({ table, state, reads, writes }) => {
  assert.equal(table().dataSource.length, 200);
  assert.deepEqual(Array.from(table().dataSource, (row) => row.id), records.map((row) => row.id));
  assert.ok(reads.every((args) => !('limit' in args) && !('pageSize' in args)));
  await act(async () => table().rowSelection.onChange([200]));
  assert.equal(table().rowSelection.selectedRowKeys[0], 200);
  assert.equal(state().canEditProcedimento, true);
  assert.equal(state().canDeleteProcedimento, true);
  await act(async () => table().onRow(table().dataSource[99]).onClick());
  assert.equal(table().rowSelection.selectedRowKeys[0], 100);
  assert.match(table().onRow(table().dataSource[99]).className, /selected/);
  assert.deepEqual(writes, []);
}));

test('ordenação preserva dataset e seleção com scroll ativo', async () => withPage(async ({ table, writes }) => {
  await act(async () => table().rowSelection.onChange([200]));
  await act(async () => table().columns[0].title.props.onSortDesc());
  assert.equal(table().dataSource.length, 200);
  assert.equal(table().dataSource[0].id, 200);
  assert.equal(table().dataSource[199].id, 1);
  assert.equal(table().rowSelection.selectedRowKeys[0], 200);
  assert.equal(table().scroll.y, 405);
  assert.deepEqual(writes, []);
}));

test('BranaTable nativo mantém cabeçalho fora do corpo rolável e renderiza todos os registros', () => {
  const wrapper = read('../src/components/BranaTable.jsx');
  assert.match(wrapper, /<Table \{\.\.\.props\}/);
  const html = renderToStaticMarkup(React.createElement(Table, {
    rowKey: 'id', dataSource: records, columns: [{ title: 'Código', dataIndex: 'codigo' }, { title: 'Procedimento', dataIndex: 'nome' }],
    scroll: { y: 405 }, pagination: false,
  }));
  const dom = new JSDOM(html);
  try {
    const body = dom.window.document.querySelector('.ant-table-body');
    const header = dom.window.document.querySelector('.ant-table-header');
    assert.ok(header.querySelector('thead'));
    assert.ok(!body.contains(header));
    assert.equal(body.style.maxHeight, '405px');
    assert.equal(body.style.overflowY, 'scroll');
    assert.equal(body.querySelectorAll('tr.ant-table-row').length, 200);
  } finally { dom.window.close(); }
});

test('CSS de scroll permanece local; densidade e largura do shell não são redefinidas', () => {
  const css = read('../src/features/procedimentos/procedimentos.css');
  assert.match(css, /\.procedimentos-table \.ant-table-body\s*\{\s*scrollbar-gutter: stable;\s*\}/);
  assert.doesNotMatch(css, /\.procedimentos-table \.ant-table-body\s*\{[^}]*\b(height|width|left|position):/);
  const page = read('../src/features/procedimentos/ProcedimentosPage.jsx');
  assert.doesNotMatch(page, /slice\(0,\s*15\)|limit:\s*15|pageSize:\s*15|scrollIntoView/);
  assert.match(page, /const TABLE_VISIBLE_ROWS = 15;/);
});

test('frame mais amplo é exclusivo de Procedimentos; coluna de nome usa espaço disponível', async () => withPage(async ({ table }) => {
  const css = read('../src/features/procedimentos/procedimentos.css');
  const frame = css.match(/\.procedimentos-list-frame\s*\{([^}]+)\}/)[1];
  assert.match(frame, /width: min\(1200px, 100%\)/);
  assert.match(frame, /min-width: 0/);
  assert.doesNotMatch(frame, /left:|transform:|margin-left:|padding-left:/);
  assert.match(css, /\.procedimentos-page \.procedimentos-main-grid\s*\{\s*width: 100%;\s*max-width: none;/);
  assert.doesNotMatch(css, /\.procedimentos-genericos-grid\s*\{/);
  const columns = table().columns;
  assert.deepEqual(Array.from(columns, (column) => column.key), ['codigo', 'nome', 'especialidade', 'tempo', 'preco', 'custo', 'custo_lab']);
  assert.equal(columns.find((column) => column.key === 'nome').width, undefined);
  assert.equal(columns.at(-1).dataIndex, 'custo_lab');
  assert.equal(columns.at(-1).width, 104);
  assert.equal(table().scroll.x, 900);
  // At the minimum readable width there is still room for the flexible name,
  // selection and scrollbar; no fixed-width sum forces overflow on desktop.
  const fixedWidth = columns.reduce((sum, column) => sum + (column.width || 0), 0);
  assert.equal(fixedWidth, 612);
  assert.ok(table().scroll.x - fixedWidth - 26 - 24 >= 200);
}));

test('scroll responsivo usa largura mínima, não max-content; tabela cresce até preencher o frame', async () => withPage(async ({ table }) => {
  const html = renderToStaticMarkup(React.createElement(Table, {
    rowKey: 'id', dataSource: records, columns: table().columns.map(({ key, dataIndex, width }) => ({ key, dataIndex, width, title: key })),
    scroll: { ...table().scroll }, pagination: false,
  }));
  const dom = new JSDOM(html);
  try {
    const bodyTable = dom.window.document.querySelector('.ant-table-body table');
    assert.equal(bodyTable.style.width, '900px');
    assert.equal(bodyTable.style.minWidth, '100%');
    assert.equal(dom.window.document.querySelector('.ant-table-body').style.overflowX, 'auto');
    assert.equal(bodyTable.querySelectorAll('tbody tr.ant-table-row').length, 200);
    assert.equal(bodyTable.querySelector('tbody tr.ant-table-row').children.length, 7);
  } finally { dom.window.close(); }
}));

for (const count of [0, 1, 59, 200]) {
  test(`rodapé fora do corpo rolável reflete o dataset de ${count} registros`, async () => withPage(async ({ table, document, reads, writes }) => {
    const footer = document.querySelector('.procedimentos-table-footer');
    const grid = document.querySelector('[role="grid"]');
    assert.equal(footer.textContent, `${count} ${count === 1 ? 'procedimento' : 'procedimentos'}`);
    assert.equal(footer.getAttribute('aria-live'), 'polite');
    assert.ok(!grid.contains(footer));
    assert.equal(grid.nextElementSibling, footer);
    assert.equal(footer.parentElement.className, 'procedimentos-list-frame');
    assert.equal(table().dataSource.length, count);
    assert.equal(reads.length, 1, 'total does not request a second API count');
    assert.deepEqual(writes, []);
  }, records.slice(0, count)));
}

test('rodapé acompanha resultado da pesquisa e sua remoção, sem chamada de contagem', async () => withPage(async ({ search, table, document, reads, writes }) => {
  await act(async () => search('Procedimento 200'));
  assert.equal(table().dataSource.length, 1);
  assert.equal(document.querySelector('.procedimentos-table-footer').textContent, '1 procedimento');
  assert.equal(reads.length, 2);
  await act(async () => search(''));
  assert.equal(table().dataSource.length, 200);
  assert.equal(document.querySelector('.procedimentos-table-footer').textContent, '200 procedimentos');
  assert.equal(reads.length, 3);
  assert.deepEqual(writes, []);
}));
