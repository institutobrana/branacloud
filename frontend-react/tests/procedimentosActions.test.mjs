// Actual React page/modal execution with fake APIs only: no productive requests.
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

const box = ({ children }) => React.createElement('div', null, children);
const Form = box;
Form.Item = ({ children, label }) => React.createElement('label', null, label, children);
const antd = {
  Typography: { Text: box, Paragraph: box }, Form, Space: box,
  Alert: ({ message }) => React.createElement('div', { role: 'alert' }, message),
  message: { error() {}, warning() {}, success() {} },
  Button: ({ children, onClick, disabled, loading }) => React.createElement('button', { type: 'button', disabled: disabled || loading, onClick }, children),
  Input: ({ value, onChange, disabled, ...props }) => React.createElement('input', { ...props, disabled, value: value ?? '', onChange }),
  Select: ({ options, value, onChange, disabled, ...props }) => React.createElement('select', { ...props, disabled, value: value ?? '', onChange: (event) => onChange(Number.isNaN(Number(event.target.value)) ? event.target.value : Number(event.target.value)) },
    React.createElement('option', { value: '' }, ''), options.map((item) => React.createElement('option', { key: item.value, value: item.value, disabled: item.disabled }, item.label))),
  Checkbox: ({ children, checked, onChange }) => React.createElement('label', null, React.createElement('input', { type: 'checkbox', checked, onChange }), children),
  Table: ({ dataSource }) => React.createElement('div', null, JSON.stringify(dataSource)),
};
const jsx = await import('react/jsx-runtime');
function compile(file, mocks = {}, context = {}) {
  const source = fs.readFileSync(new URL(`../src/features/procedimentos/${file}`, import.meta.url), 'utf8');
  const module = { exports: {} };
  vm.runInNewContext(transformSync(source, { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code, {
    module, exports: module.exports, ...context,
    require: (id) => {
      if (id === 'react') return React;
      if (id === 'react/jsx-runtime') return jsx;
      if (id === 'antd') return antd;
      if (id.endsWith('.css')) return {};
      if (!(id in mocks)) throw Error(`Unexpected dependency ${id}`);
      return mocks[id];
    },
  });
  return module.exports;
}
function Modal({ open, title, children, onOk, onCancel, okText = 'Confirmar', cancelText = 'Cancelar', confirmLoading, footer }) {
  return open ? React.createElement('section', { role: 'dialog', 'aria-label': title }, title, children,
    footer === null ? null : React.createElement(React.Fragment, null,
      React.createElement('button', { disabled: confirmLoading, onClick: onOk }, okText),
      React.createElement('button', { disabled: confirmLoading, onClick: onCancel }, cancelText))) : null;
}
const tabelaModule = compile('components/ProcedimentoTabelaModal.jsx', { '../../../components/BranaModal.jsx': { BranaModal: Modal } });
const reajusteModule = compile('components/ProcedimentoReajusteModal.jsx', { '../../../components/BranaModal.jsx': { BranaModal: Modal } });
const initialTables = [
  { id: 4, codigo: 4, nome: 'PARTICULAR', nro_indice: 255, fonte_pagadora: 'convenio', nro_credenciamento: 'ABC', tipo_tiss_id: 9, inativo: false },
  { id: 8, codigo: 8, nome: 'Outra', nro_indice: 3, fonte_pagadora: 'particular', tipo_tiss_id: 1, inativo: false },
  { id: 9, codigo: 9, nome: 'Inativa', nro_indice: 255, tipo_tiss_id: 1, inativo: true },
];
const initialRecords = [{ id: 701, codigo: 1, nome: 'Consulta', tabela_id: 4, preco: 100 }, { id: 702, codigo: 2, nome: 'Outro', tabela_id: 4 }];
const preview = { tabela: { id: 88, codigo: 4 }, total: 2, amostra: [{ id: 701, nome: 'Consulta', preco_before: 100, preco_after: 101 }] };

async function withPage(run, overrides = {}) {
  const dom = new JSDOM('<div id="page"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const calls = [];
  let tables = structuredClone(initialTables);
  let records = structuredClone(initialRecords);
  const api = {
    listarProcedimentosFiltros: async () => ({ tabelas: tables, especialidades: [], indices: [{ id: 255, sigla: 'R$', nome: 'Real' }], tiposTiss: [{ id: 9, codigo: '01', nome: 'TISS' }] }),
    listarProcedimentos: async (args) => { calls.push(['list', args]); return records; },
    listarProcedimentosGenericosCombos: async () => [],
    listarSimbolosGraficoProcedimentos: async () => [],
    obterProximoCodigoProcedimento: async (id) => { calls.push(['next', id]); return 3; },
    obterProcedimentoDetalhe: async (id) => ({ ...records.find((item) => item.id === id), simbolo_grafico: 'old.bmp', simbolo_grafico_legacy_id: 77, mostrar_simbolo: true }),
    salvarProcedimento: async (args) => { calls.push(['saveProcedure', args]); return { id: 703 }; },
    excluirProcedimento: async (id) => { calls.push(['deleteProcedure', id]); records = records.filter((item) => item.id !== id); },
    criarTabelaProcedimentos: async (payload) => { calls.push(['createTable', payload]); const saved = { ...payload, id: 10, codigo: 10 }; tables = [...tables, saved]; return saved; },
    atualizarTabelaProcedimentos: async (codigo, payload) => { calls.push(['updateTable', codigo, payload]); tables = tables.map((item) => item.codigo === codigo ? { ...item, ...payload } : item); return tables.find((item) => item.codigo === codigo); },
    excluirTabelaProcedimentos: async (codigo) => { calls.push(['deleteTable', codigo]); tables = tables.filter((item) => item.codigo !== codigo); },
    previewReajusteTabela: async (args) => { calls.push(['preview', args]); return preview; },
    aplicarReajusteTabela: async (args) => { calls.push(['apply', args]); },
    ...overrides,
  };
  const modals = {};
  let table;
  let state;
  const capture = (name, Component) => (props) => { modals[name] = props; return React.createElement(Component, props); };
  dom.window.addEventListener('brana-procedimentos-state', (event) => { state = event.detail; });
  const page = compile('ProcedimentosPage.jsx', {
    '../../components/BranaCard.jsx': { BranaCard: box },
    '../../components/BranaModal.jsx': { BranaModal: capture('delete', Modal) },
    '../../components/TableColumnFilterHeader.jsx': { TableColumnFilterHeader: () => null },
    '../../components/BranaTable.jsx': { BranaTable: (props) => { table = props; return box({ children: null }); } },
    './procedimentosApi.js': api,
    './procedimentosEditorMappers.js': mappers,
    './procedimentosEditorValidators.js': validators,
    './components/ProcedimentoEditorModal.jsx': { ProcedimentoEditorModal: capture('editor', () => null) },
    './components/ProcedimentoTabelaModal.jsx': { ...tabelaModule, ProcedimentoTabelaModal: capture('table', tabelaModule.ProcedimentoTabelaModal) },
    './components/ProcedimentoReajusteModal.jsx': { ...reajusteModule, ProcedimentoReajusteModal: capture('reprice', reajusteModule.ProcedimentoReajusteModal) },
  }, { window: dom.window, CustomEvent: dom.window.CustomEvent });
  const root = createRoot(document.querySelector('#page'));
  const action = (value) => window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-action', { detail: { action: value } }));
  const filter = (field, value) => window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-filter', { detail: { field, value } }));
  const click = (label) => { const button = [...document.querySelectorAll('button')].find((item) => item.textContent === label); assert.ok(button, `Missing button ${label}`); button.click(); };
  try {
    await act(async () => root.render(React.createElement(page.ProcedimentosPage)));
    await run({ calls, api, action, filter, click, modal: (name) => modals[name], table: () => table, state: () => state });
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    Object.assign(globalThis, { window: previous.window, document: previous.document, IS_REACT_ACT_ENVIRONMENT: previous.act });
  }
}
const writes = (calls) => calls.filter(([name]) => ['deleteProcedure', 'createTable', 'updateTable', 'deleteTable', 'apply', 'saveProcedure'].includes(name));

test('sem seleção: eliminar não abre confirmação; tabela inativa bloqueia procedimentos/reajuste', async () => withPage(async ({ table, state, action, modal, filter, calls }) => {
  await act(async () => table().rowSelection.onChange([]));
  assert.equal(state().canDeleteProcedimento, false);
  await act(async () => action('eliminar'));
  assert.equal(modal('delete').open, false);
  await act(async () => filter('tabela', 9));
  assert.equal(state().canCreateProcedimento, false);
  assert.equal(state().canReajusteTabela, false);
  assert.equal(state().canEditTabela, true);
  await act(async () => action('reajusta-tabela'));
  assert.equal(modal('reprice').open, false);
  assert.equal(writes(calls).length, 0);
}));

test('eliminar procedimento: confirmação nominal, cancelamento sem request, PK correta e recarga', async () => withPage(async ({ action, modal, calls, click, table }) => {
  await act(async () => table().rowSelection.onChange([702]));
  await act(async () => action('eliminar'));
  assert.match(document.querySelector('[role="dialog"]').textContent, /Outro.*2/);
  await act(async () => click('Não'));
  assert.equal(writes(calls).length, 0);
  await act(async () => action('eliminar'));
  await act(async () => click('Sim'));
  assert.deepEqual(calls.find(([name]) => name === 'deleteProcedure'), ['deleteProcedure', 702]);
  assert.equal(modal('delete').open, false);
  assert.equal(table().rowSelection.selectedRowKeys[0], 701);
  assert.ok(calls.filter(([name]) => name === 'list').length >= 2);
}));

test('erro do DELETE permanece na confirmação sem limpar seleção', async () => withPage(async ({ action, click, table }) => {
  await act(async () => action('eliminar'));
  await act(async () => click('Sim'));
  assert.match(document.querySelector('[role="alert"]').textContent, /Servidor recusou/);
  assert.equal(table().rowSelection.selectedRowKeys[0], 701);
}, { excluirProcedimento: async () => { throw Error('Servidor recusou a exclusão'); } }));

test('nova tabela: cancela sem escrita; nome obrigatório; cópia limitada às tabelas disponíveis', async () => withPage(async ({ action, modal, calls, click }) => {
  await act(async () => action('nova-tabela'));
  assert.equal(modal('table').mode, 'new');
  await act(async () => click('Cancela'));
  assert.equal(writes(calls).length, 0);
  await act(async () => action('nova-tabela'));
  await act(async () => click('Ok'));
  assert.match(modal('table').error, /nome/);
  await act(async () => { modal('table').onChange('nome', ' Nova '); modal('table').onChange('copiar', true); modal('table').onChange('copiar_de_tabela_id', 999); });
  await act(async () => click('Ok'));
  assert.match(modal('table').error, /origem/);
  assert.equal(writes(calls).length, 0);
  await act(async () => modal('table').onChange('copiar_de_tabela_id', 4));
  await act(async () => click('Ok'));
  const payload = calls.find(([name]) => name === 'createTable')[1];
  assert.equal(payload.nome, 'Nova');
  assert.equal(payload.copiar_de_tabela_id, '4');
  assert.equal(modal('table').open, false);
  assert.equal(calls.at(-1)[1].tabelaId, 10);
}));

test('nova tabela: origem sempre visível; checkbox habilita/desabilita sem recriar o combo nem gravar', async () => withPage(async ({ action, modal, calls, click }) => {
  await act(async () => action('nova-tabela'));
  assert.ok(document.querySelector('[role="dialog"][aria-label="Insere nova tabela"]'));
  const origin = document.querySelector('[aria-label="Tabela de origem"]');
  const copy = [...document.querySelectorAll('label')]
    .find((item) => item.textContent === 'Copiar procedimentos de outra tabela')?.querySelector('input');
  assert.ok(origin?.isConnected);
  assert.ok(copy);
  assert.equal(copy.checked, false);
  assert.equal(origin.disabled, true);
  assert.equal(origin.matches(':disabled'), true);

  await act(async () => copy.click());
  assert.equal(copy.checked, true);
  assert.equal(document.querySelector('[aria-label="Tabela de origem"]'), origin);
  assert.equal(origin.disabled, false);
  await act(async () => {
    origin.value = '4';
    origin.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  assert.equal(modal('table').form.copiar_de_tabela_id, 4);

  await act(async () => copy.click());
  assert.equal(copy.checked, false);
  assert.equal(document.querySelector('[aria-label="Tabela de origem"]'), origin);
  assert.equal(origin.disabled, true);
  assert.ok(origin.isConnected);
  assert.equal(tabelaModule.buildTabelaPayload(modal('table').form, 'new').copiar_de_tabela_id, null);
  assert.equal(writes(calls).length, 0);
  await act(async () => click('Cancela'));
  assert.equal(writes(calls).length, 0);
}));

test('duplicidade: mensagem do backend preservada no modal de tabela', async () => withPage(async ({ action, modal, click }) => {
  await act(async () => action('nova-tabela'));
  await act(async () => modal('table').onChange('nome', 'PARTICULAR'));
  await act(async () => click('Ok'));
  assert.equal(modal('table').error, 'Ja existe uma tabela com esse nome.');
  assert.equal(modal('table').open, true);
}, { criarTabelaProcedimentos: async () => { throw Error('Ja existe uma tabela com esse nome.'); } }));

test('altera tabela hidrata todos os metadados; PATCH usa código público e não inclui origem da cópia', async () => withPage(async ({ action, modal, calls, click }) => {
  await act(async () => action('altera-tabela'));
  assert.equal(modal('table').form.nro_credenciamento, 'ABC');
  assert.equal(modal('table').form.nro_indice, 255);
  assert.equal(modal('table').form.tipo_tiss_id, 9);
  assert.equal(document.querySelector('[aria-label="Tabela de origem"]'), null);
  await act(async () => modal('table').onChange('nome', 'Renomeada'));
  await act(async () => click('Ok'));
  const saved = calls.find(([name]) => name === 'updateTable');
  assert.equal(saved[1], 4);
  assert.equal(saved[2].nro_credenciamento, 'ABC');
  assert.equal('copiar_de_tabela_id' in saved[2], false);
}));

test('sem tabela selecionada: não abre alteração/exclusão/reajuste, mas permite Nova tabela', async () => withPage(async ({ filter, state, action, modal, calls }) => {
  await act(async () => filter('tabela', null));
  assert.equal(state().canEditTabela, false);
  assert.equal(state().canCreateTabela, true);
  for (const name of ['altera-tabela', 'elimina-tabela', 'reajusta-tabela']) await act(async () => action(name));
  assert.equal(modal('table').open, false);
  assert.equal(modal('delete').open, false);
  assert.equal(modal('reprice').open, false);
  assert.equal(writes(calls).length, 0);
}));

test('elimina tabela: aviso nominal, cancelamento, código público e seleção consistente após exclusão', async () => withPage(async ({ action, modal, calls, click, state }) => {
  await act(async () => action('elimina-tabela'));
  assert.match(document.querySelector('[role="dialog"]').textContent, /PARTICULAR.*Todos os procedimentos/);
  await act(async () => click('Não'));
  assert.equal(writes(calls).length, 0);
  await act(async () => action('elimina-tabela'));
  await act(async () => click('Sim'));
  assert.deepEqual(calls.find(([name]) => name === 'deleteTable'), ['deleteTable', 4]);
  assert.equal(state().selectedTabelaId, 8);
  assert.equal(modal('delete').open, false);
}));

test('proteção da única tabela é apresentada sem fechar confirmação', async () => withPage(async ({ action, click, modal }) => {
  await act(async () => action('elimina-tabela'));
  await act(async () => click('Sim'));
  assert.match(document.querySelector('[role="alert"]').textContent, /unica tabela/);
  assert.equal(modal('delete').open, true);
}, { excluirTabelaProcedimentos: async () => { throw Error('Nao e possivel excluir a unica tabela existente.'); } }));

test('reajuste: preview GET, Aplicar só abre confirmação; Não e Cancela não gravam', async () => withPage(async ({ action, calls, click }) => {
  await act(async () => action('reajusta-tabela'));
  await act(async () => click('Aplicar'));
  assert.equal(document.querySelector('[aria-label="Confirmar reajuste"]'), null);
  await act(async () => click('Preview'));
  assert.equal(calls.filter(([name]) => name === 'preview').length, 1);
  await act(async () => click('Aplicar'));
  assert.ok(document.querySelector('[aria-label="Confirmar reajuste"]'));
  assert.equal(writes(calls).length, 0);
  await act(async () => click('Não'));
  await act(async () => click('Cancela'));
  assert.equal(writes(calls).length, 0);
}));

test('reajuste: percentual inválido continua bloqueando preview sem request', async () => withPage(async ({ action, modal, calls, click }) => {
  await act(async () => action('reajusta-tabela'));
  await act(async () => modal('reprice').onChange('percentual', 'abc'));
  await act(async () => click('Preview'));
  assert.match(modal('reprice').error, /percentual maior que zero/);
  assert.equal(calls.filter(([name]) => name === 'preview').length, 0);
  assert.equal(writes(calls).length, 0);
}));

for (const [field, value] of [['percentual', '2,00'], ['modo', 'diminuir'], ['tabela_id', 8]]) {
  test(`reajuste: mudar ${field} invalida preview e confirmação anterior`, async () => withPage(async ({ action, modal, calls, click }) => {
    await act(async () => action('reajusta-tabela'));
    await act(async () => click('Preview'));
    await act(async () => click('Aplicar'));
    await act(async () => modal('reprice').onChange(field, value));
    assert.equal(modal('reprice').preview, null);
    assert.equal(document.querySelector('[aria-label="Confirmar reajuste"]'), null);
    await act(async () => modal('reprice').onApply());
    assert.equal(writes(calls).length, 0);
  }));
}

test('reajuste: confirmação envia confirmar=true e código público, nunca PK do preview', async () => withPage(async ({ action, calls, click, modal }) => {
  await act(async () => action('reajusta-tabela'));
  await act(async () => click('Preview'));
  await act(async () => click('Aplicar'));
  await act(async () => click('Sim, aplicar'));
  const payload = calls.find(([name]) => name === 'apply')[1];
  assert.equal(payload.confirmar, true);
  assert.equal(payload.tabela_id, '4');
  assert.equal(payload.percentual, '1,00');
  assert.equal(modal('reprice').open, false);
  assert.ok(calls.filter(([name]) => name === 'list').length >= 2);
}));

test('reajuste: erro de aplicação preservado e preview invalidado para impedir reaplicação silenciosa', async () => withPage(async ({ action, click, modal }) => {
  await act(async () => action('reajusta-tabela'));
  await act(async () => click('Preview'));
  await act(async () => click('Aplicar'));
  await act(async () => click('Sim, aplicar'));
  assert.equal(modal('reprice').error, 'Valores negativos bloqueados.');
  assert.equal(modal('reprice').preview, null);
}, { aplicarReajusteTabela: async () => { throw Error('Valores negativos bloqueados.'); } }));

test('reajuste: resposta tardia de preview não valida um formulário alterado', async () => {
  let resolve;
  await withPage(async ({ action, click, modal }) => {
    await act(async () => action('reajusta-tabela'));
    await act(async () => click('Preview'));
    await act(async () => modal('reprice').onChange('percentual', '9,00'));
    await act(async () => resolve(preview));
    assert.equal(modal('reprice').preview, null);
  }, { previewReajusteTabela: () => new Promise((next) => { resolve = next; }) });
});

test('Nova intervenção e Altera continuam abrindo; símbolo existente fora do combo é preservado ao cancelar', async () => withPage(async ({ action, modal, calls }) => {
  await act(async () => action('novo'));
  assert.equal(modal('editor').mode, 'new');
  assert.equal(modal('editor').form.codigo, '3');
  await act(async () => modal('editor').onClose());
  await act(async () => action('alterar'));
  assert.equal(modal('editor').mode, 'edit');
  assert.equal(modal('editor').form.id, 701);
  assert.equal(modal('editor').form.simbolo_grafico_legacy_id, 77);
  assert.equal(modal('editor').form.simbolo_grafico, 'old.bmp');
  await act(async () => modal('editor').onClose());
  assert.equal(writes(calls).length, 0);
}));

test('Nova intervenção preserva a especialidade preselecionada do filtro ao criar', async () => withPage(async ({ action, modal, filter, calls }) => {
  await act(async () => filter('especialidade', '05'));
  await act(async () => action('novo'));
  assert.equal(modal('editor').form.especialidade, '05');
  await act(async () => modal('editor').onChangeField('nome', 'Novo'));
  await act(async () => modal('editor').onSave());
  assert.equal(calls.find(([name]) => name === 'saveProcedure')[1].payload.especialidade, '05');
}));

test('confirmação congela seleção e bloqueia dupla gravação', async () => {
  let resolve;
  let count = 0;
  await withPage(async ({ action, modal, filter, state }) => {
    await act(async () => action('eliminar'));
    await act(async () => filter('tabela', 8));
    assert.equal(state().selectedTabelaId, 4);
    await act(async () => { modal('delete').onOk(); modal('delete').onOk(); });
    assert.equal(count, 1);
    await act(async () => resolve());
  }, { excluirProcedimento: () => { count++; return new Promise((next) => { resolve = next; }); } });
});

test('resposta antiga de outra tabela não repõe seleção nem permite eliminar a linha errada', async () => {
  let resolveOld;
  await withPage(async ({ filter, table, action, modal }) => {
    await act(async () => filter('tabela', 8));
    assert.equal(table().dataSource[0].id, 803);
    await act(async () => resolveOld([{ id: 701, codigo: 1, nome: 'Tabela antiga' }]));
    assert.equal(table().dataSource[0].id, 803);
    await act(async () => action('eliminar'));
    assert.match(document.querySelector('[role="dialog"]').textContent, /Tabela nova/);
    assert.equal(modal('delete').open, true);
  }, { listarProcedimentos: ({ tabelaId }) => tabelaId === 4
    ? new Promise((resolve) => { resolveOld = resolve; })
    : Promise.resolve([{ id: 803, codigo: 3, nome: 'Tabela nova' }]) });
});

test('salvar outro campo do editor mantém par fora do combo sem transportar flag histórico', async () => withPage(async ({ action, modal, calls, api }) => {
  await act(async () => action('alterar'));
  let stored = { ...modal('editor').form };
  api.salvarProcedimento = async (args) => { calls.push(['saveProcedure', args]); stored = { ...stored, ...args.payload }; return stored; };
  api.obterProcedimentoDetalhe = async () => stored;
  const before = { symbol: modal('editor').form.simbolo_grafico, legacy: modal('editor').form.simbolo_grafico_legacy_id };
  assert.equal('mostrar_simbolo' in modal('editor').form, false);
  await act(async () => modal('editor').onChangeField('nome', 'Nome atualizado'));
  await act(async () => modal('editor').onSave());
  const saved = calls.find(([name]) => name === 'saveProcedure')[1];
  assert.equal('simbolo_grafico' in saved.payload, false);
  assert.equal('simbolo_grafico_legacy_id' in saved.payload, false);
  assert.equal('mostrar_simbolo' in saved.payload, false);
  await act(async () => action('alterar'));
  assert.equal(modal('editor').form.simbolo_grafico, before.symbol);
  assert.equal(modal('editor').form.simbolo_grafico_legacy_id, before.legacy);
  assert.equal('mostrar_simbolo' in modal('editor').form, false);
}));
