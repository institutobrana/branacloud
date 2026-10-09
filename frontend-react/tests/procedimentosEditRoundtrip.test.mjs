// Real React page/panel/hook and mapper/validator with fake APIs only.
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
import * as constants from '../src/features/procedimentos/procedimentosEditorConstants.js';
import * as materialMappers from '../src/features/procedimentos/procedimentosMateriaisMappers.js';

const source = (name) => fs.readFileSync(new URL(`../src/features/procedimentos/${name}`, import.meta.url), 'utf8');
const jsx = await import('react/jsx-runtime');
const box = ({ children }) => React.createElement('div', null, children);
const snapshot = JSON.parse(fs.readFileSync(new URL('../../backend/scripts/easy_simbolos_catalogo_atual_snapshot.json', import.meta.url), 'utf8'));
const expectedIds = [...Array.from({ length: 59 }, (_, i) => i + 1), 77, 78, 79, 81];
const combo = mappers.buildProcedimentoSymbolCombo(snapshot.filter((row) => expectedIds.includes(row.nrosim)).map((row) => ({
  id: 1000 + row.nrosim, legacy_id: row.nrosim, codigo: row.codigo, descricao: row.descricao,
})));
const original = { id: 701, codigo: 1, nome: 'Teste', tabela_id: 4, procedimento_generico_id: 20,
  especialidade: '05', simbolo_grafico: 'sim_outras.bmp', simbolo_grafico_legacy_id: 58,
  mostrar_simbolo: false, garantia_meses: 12, forma_cobranca: 'INTERVENCAO', valor_repasse: 25,
  preco: 100, custo: 17, custo_lab: 45, tempo: 30, inativo: true, preferido: true,
  observacoes: 'Nota', data_inclusao: '01/01/2026', data_alteracao: '02/01/2026' };

function compile(name, mocks, context = {}) {
  const module = { exports: {} };
  vm.runInNewContext(transformSync(source(name), { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code, {
    module, exports: module.exports, ...context,
    require: (id) => {
      if (id === 'react') return React;
      if (id === 'react/jsx-runtime') return jsx;
      if (id.endsWith('.css')) return {};
      assert.ok(id in mocks, `Unexpected dependency ${id}`);
      return mocks[id];
    },
  });
  return module.exports;
}

async function withWorld(run) {
  const dom = new JSDOM('<div id="root"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const root = createRoot(document.querySelector('#root'));
  try { await run({ dom, root }); }
  finally { await act(async () => root.unmount()); dom.window.close(); Object.assign(globalThis, previous); }
}

async function withPage(run) {
  await withWorld(async ({ dom, root }) => {
    let stored = structuredClone(original);
    let editor;
    let warning;
    const writes = [];
    const api = {
      listarProcedimentosFiltros: async () => ({ tabelas: [{ id: 4, codigo: 4, nome: 'Teste', inativo: false }], especialidades: [{ codigo: '05', nome: 'A' }, { codigo: '06', nome: 'B' }] }),
      listarProcedimentos: async () => [stored], listarProcedimentosGenericosCombos: async () => [{ value: 20 }, { value: 21 }],
      listarSimbolosGraficoProcedimentos: async () => combo, obterProcedimentoDetalhe: async () => stored,
      obterProximoCodigoProcedimento: async () => 2,
      salvarProcedimento: async (args) => { writes.push(structuredClone(args)); stored = { ...stored, ...args.payload }; return stored; },
    };
    const antd = { Typography: { Text: box, Paragraph: box }, message: { error() {}, success() {}, warning() {} }, Alert: box };
    const Page = compile('ProcedimentosPage.jsx', {
      antd, '../../components/BranaCard.jsx': { BranaCard: box }, '../../components/BranaModal.jsx': { BranaModal: (props) => { if (props.title === 'Aviso') warning = props; return null; } },
      '../../components/BranaTable.jsx': { BranaTable: () => null }, '../../components/TableColumnFilterHeader.jsx': { TableColumnFilterHeader: () => null },
      './procedimentosApi.js': api, './procedimentosEditorMappers.js': mappers, './procedimentosEditorValidators.js': validators,
      './components/ProcedimentoEditorModal.jsx': { ProcedimentoEditorModal: (props) => { editor = props; return null; } },
      './components/ProcedimentoTabelaModal.jsx': { ProcedimentoTabelaModal: () => null, createTabelaForm: () => ({}) },
      './components/ProcedimentoReajusteModal.jsx': { ProcedimentoReajusteModal: () => null },
    }, { window: dom.window, CustomEvent: dom.window.CustomEvent }).ProcedimentosPage;
    const action = async (value) => act(async () => dom.window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-toolbar-action', { detail: { action: value } })));
    await act(async () => root.render(React.createElement(Page)));
    await action('alterar');
    await run({ editor: () => editor, warning: () => warning, writes, stored: () => stored, api, action });
  });
}

const cases = [
  ['nome', ' Novo nome ', 'nome', 'Novo nome'], ['codigo', '7', 'codigo', 7],
  ['procedimento_generico_id', 21, 'procedimento_generico_id', 21],
  ['especialidade', '06', 'especialidade', '06'], ['simbolo_catalogo_id', 1081, 'simbolo_grafico_legacy_id', 81],
  ['garantia_meses', '24', 'garantia_meses', 24], ['forma_cobranca', 'ELEMENTO_FACE', 'forma_cobranca', 'ELEMENTO_FACE'],
  ['valor_repasse', '1.750,90', 'valor_repasse', 1750.9], ['valor_paciente', '245,30', 'preco', 245.3],
  ['custo_lab', '72,35', 'custo_lab', 72.35], ['tempo', '45', 'tempo', 45],
  ['inativo', false, 'inativo', false], ['preferido', false, 'preferido', false],
  ['observacoes', ' Nova nota ', 'observacoes', 'Nova nota'],
];
for (const mode of ['novo', 'alterar']) {
  for (const [field, label] of validators.PROCEDIMENTO_REQUIRED_FIELDS) {
    test(`modal real ${mode}: aviso ${label}, OK mantém editor e rascunho, zero requests`, async () => withPage(async ({ editor, warning, writes, action }) => {
      await act(async () => editor().onClose());
      await action(mode);
      if (mode === 'novo') {
        for (const [key, value] of Object.entries(original)) {
          if (['nome', 'procedimento_generico_id', 'especialidade', 'forma_cobranca'].includes(key)) await act(async () => editor().onChangeField(key, value));
        }
        await act(async () => editor().onChangeField('simbolo_catalogo_id', 1058));
      }
      await act(async () => editor().onChangeField('observacoes', 'Rascunho mantido'));
      await act(async () => editor().onChangeField(field === 'simbolo_grafico' ? 'simbolo_catalogo_id' : field, ''));
      const before = editor().form;
      await act(async () => editor().onSave());
      assert.equal(writes.length, 0);
      assert.equal(warning().open, true);
      assert.equal(warning().children.props.children, `Campo ${label} não pode ser nulo.`);
      assert.equal(editor().open, true);
      await act(async () => warning().onOk());
      assert.equal(warning().open, false);
      assert.equal(editor().open, true);
      assert.equal(editor().form, before);
    }));
  }
}

test('novo real envia cobrança default e todos os campos necessários sem exigir dirty em cada controle', async () => withPage(async ({ editor, writes, action }) => {
  await act(async () => editor().onClose());
  await action('novo');
  assert.equal(editor().form.procedimento_generico_id, null);
  assert.equal(editor().form.forma_cobranca, 'INTERVENCAO');
  for (const [field, value] of [['nome', 'Novo completo'], ['procedimento_generico_id', 20], ['especialidade', '05'], ['simbolo_catalogo_id', 1058]]) await act(async () => editor().onChangeField(field, value));
  await act(async () => editor().onSave());
  assert.equal(writes.length, 1);
  assert.equal(writes[0].payload.forma_cobranca, 'INTERVENCAO');
  assert.equal(writes[0].payload.simbolo_grafico_legacy_id, 58);
}));
for (const [field, value, key, expected] of cases) {
  test(`round-trip React ${field}: LOAD EDIT SAVE RELOAD`, async () => withPage(async ({ editor, writes, action }) => {
    await act(async () => editor().onChangeField(field, value));
    await act(async () => editor().onSave());
    assert.equal(writes.length, 1);
    assert.equal(writes[0].payload[key], expected);
    assert.equal('custo' in writes[0].payload, false);
    assert.equal('data_inclusao' in writes[0].payload, false);
    assert.equal('data_alteracao' in writes[0].payload, false);
    await action('alterar');
    const reloaded = key === 'preco' ? mappers.parseMoneyInput(editor().form.valor_paciente)
      : ['valor_repasse', 'custo_lab'].includes(key) ? mappers.parseMoneyInput(editor().form[key]) : editor().form[key];
    assert.equal(reloaded, expected);
  }));
}

test('limpeza/zero/false opcionais entram; campos não editados são omitidos', async () => withPage(async ({ editor, writes, action }) => {
  for (const [field, value] of [['custo_lab', ''], ['tempo', ''], ['observacoes', '  ']]) {
    await act(async () => editor().onChangeField(field, value));
  }
  await act(async () => editor().onSave());
  const payload = writes[0].payload;
  assert.equal(payload.custo_lab, 0); assert.equal(payload.tempo, 0);
  assert.equal('especialidade' in payload, false); assert.equal(payload.observacoes, null);
  assert.equal('mostrar_simbolo' in payload, false); assert.equal('simbolo_grafico' in payload, false);
  assert.equal('preco' in payload, false); assert.equal('inativo' in payload, false);
  await action('alterar');
  assert.equal(mappers.parseMoneyInput(editor().form.custo_lab), 0);
  assert.equal('mostrar_simbolo' in editor().form, false);
}));

for (const [field, key, expected] of [['valor_paciente', 'preco', 0], ['valor_repasse', 'valor_repasse', 0], ['garantia_meses', 'garantia_meses', 0], ['forma_cobranca', 'forma_cobranca', null], ['procedimento_generico_id', 'procedimento_generico_id', null]]) {
  test(`limpar ${field}: opcional persiste, obrigatório bloqueia sem escrita`, async () => withPage(async ({ editor, writes, action }) => {
    await act(async () => editor().onChangeField(field, ''));
    await act(async () => editor().onSave());
    if (expected === null) {
      assert.equal(writes.length, 0);
      assert.equal(editor().open, true);
      return;
    }
    assert.equal(writes[0].payload[key], expected);
    await action('alterar');
    const value = ['valor_paciente', 'valor_repasse'].includes(field) ? mappers.parseMoneyInput(editor().form[field]) : editor().form[field];
    assert.equal(value, expected);
  }));
}

test('checkboxes persistem true e false em save/reload', async () => withPage(async ({ editor, action }) => {
  for (const value of [false, true]) {
    for (const field of ['inativo', 'preferido']) await act(async () => editor().onChangeField(field, value));
    await act(async () => editor().onSave());
    await action('alterar');
    for (const field of ['inativo', 'preferido']) assert.equal(editor().form[field], value);
  }
}));

test('código/nome vazios continuam bloqueados pela validação vigente', () => {
  const form = { ...mappers.createEmptyProcedimentoForm({ tabelaId: 4, codigo: '1', nome: 'Teste' }), ...original };
  for (const codigo of ['', 'abc', '1.5']) assert.match(validators.validateProcedimentoForm({ ...form, codigo }).join(' '), /codigo valido/);
  assert.match(validators.validateProcedimentoForm({ ...form, nome: '   ' }).join(' '), /Campo Nome não pode ser nulo/);
});

test('cancelar não grava; reabrir limpa dirty fields; inclusão/alteração não entram no payload', async () => withPage(async ({ editor, writes, action }) => {
  await act(async () => editor().onChangeField('custo_lab', '0'));
  await act(async () => editor().onClose());
  assert.equal(writes.length, 0);
  await action('alterar');
  await act(async () => editor().onChangeField('nome', 'Só nome'));
  await act(async () => editor().onSave());
  assert.deepEqual(Object.keys(writes[0].payload).sort(), ['codigo', 'nome', 'tabela_id']);
}));

for (const field of ['valor_paciente', 'valor_repasse', 'custo_lab']) {
  test(`dinheiro inválido em ${field} bloqueia save sem virar zero`, async () => withPage(async ({ editor, writes }) => {
    await act(async () => editor().onChangeField(field, 'abc'));
    await act(async () => editor().onSave());
    assert.equal(writes.length, 0); assert.match(editor().error, /valido/);
    assert.equal(editor().form[field], 'abc');
  }));
}

test('parse monetário preserva decimal/zero/vazio e sinaliza inválidos não finitos', () => {
  for (const [raw, expected] of [['', 0], ['0', 0], ['0,00', 0], ['100,50', 100.5], ['1.750,90', 1750.9], ['245.30', 245.3]]) assert.equal(mappers.parseMoneyInput(raw), expected);
  for (const raw of ['abc', 'Infinity', 'NaN', '1,2,3', 'R$']) assert.ok(Number.isNaN(mappers.parseMoneyInput(raw)));
});

test('hidratação não corrige par parcial/inconsistente e descarta flag histórico do formulário/payload', () => {
  for (const originalPair of [{ simbolo_grafico: 'wrong.bmp', simbolo_grafico_legacy_id: 58 }, { simbolo_grafico: '', simbolo_grafico_legacy_id: 58 }, { simbolo_grafico: 'sim_outras.bmp', simbolo_grafico_legacy_id: null }]) {
    const hydrated = mappers.hydrateProcedimentoSymbolState(combo, originalPair);
    assert.equal(hydrated.simbolo_grafico, originalPair.simbolo_grafico);
    assert.equal(hydrated.simbolo_grafico_legacy_id, originalPair.simbolo_grafico_legacy_id);
  }
  assert.equal('mostrar_simbolo' in mappers.extractProcedimentoSymbolPayload(combo, original), false);
  assert.equal('mostrar_simbolo' in mappers.hydrateProcedimentoForm(original), false);
  assert.equal('mostrar_simbolo' in mappers.createEmptyProcedimentoForm(), false);
  assert.equal('mostrar_simbolo' in mappers.buildProcedimentoPayload(original), false);
});

test('panel real: não há Mostrar símbolo, auditorias readonly/ciano e blur inválido não apaga', async () => withWorld(async ({ root }) => {
  let controls = [];
  const input = (props) => { const i = controls.push(props)-1; return React.createElement('input', { 'data-control': i, value: props.value ?? '', disabled: props.disabled, readOnly: true }); };
  input.TextArea = input;
  const select = () => null;
  const checkbox = (props) => { const i = controls.push(props)-1; return React.createElement('label', null, props.children, React.createElement('input', { 'data-control': i, type: 'checkbox', checked: props.checked, disabled: props.disabled, readOnly: true })); };
  const Panel = compile('components/ProcedimentoCadastroPanel.jsx', {
    antd: { Input: input, Select: select, Checkbox: checkbox }, '../procedimentosEditorMappers.js': mappers, '../procedimentosEditorConstants.js': constants,
  }).ProcedimentoCadastroPanel;
  const changes = [];
  await act(async () => root.render(React.createElement(Panel, { form: { ...original, custo_lab: 'abc' }, especialidadeOptions: [], procedimentoGenericoOptions: [], simboloOptions: combo, onChange: (...args) => changes.push(args) })));
  const control = (label) => {
    const element = [...document.querySelectorAll('label')].find((node) => node.textContent === label);
    assert.ok(element, label); return controls[Number(element.querySelector('input').dataset.control)];
  };
  assert.equal(control('Inclusão').readOnly, true); assert.equal(control('Alteração').readOnly, true);
  assert.equal(document.querySelectorAll('.ficha-dados-readonly-cyan').length, 2);
  assert.doesNotMatch(document.body.textContent, /Mostrar símbolo/);
  control('Custo de laboratório').onBlur();
  assert.deepEqual(changes, []);
}));

test('flag histórico não entra no estado de edição/criação nem no save/reload', async () => withPage(async ({ editor, writes, action, stored }) => {
  assert.equal('mostrar_simbolo' in editor().form, false);
  await act(async () => editor().onChangeField('simbolo_catalogo_id', 1081));
  await act(async () => editor().onSave());
  assert.equal('mostrar_simbolo' in writes[0].payload, false);
  assert.equal(stored().mostrar_simbolo, false); // Historical metadata untouched, not an option.
  await action('alterar');
  assert.equal(editor().form.simbolo_grafico_legacy_id, 81);
  assert.equal('mostrar_simbolo' in editor().form, false);
  await act(async () => editor().onClose());
  await action('novo');
  assert.equal('mostrar_simbolo' in editor().form, false);
}));

test('hook de materiais mantém identidade original, quantidade e bloqueia substituição sem request', async () => withWorld(async ({ root }) => {
  let hook;
  let own = { material_id: 1, codigo: 'M1', nome: 'Próprio', quantidade: 2, custo_und: 3, custo_total: 6, origem: 'proprio' };
  const calls = [];
  const api = {
    listarProcedimentoMateriais: async () => ({ itens: own ? [own] : [] }),
    listarMateriaisListas: async () => [{ id: 1, nome: 'Lista' }],
    listarMateriaisDaLista: async () => [1, 2].map((id) => ({ id, codigo: `M${id}`, nome: `Material ${id}`, custo: 3 })),
    atualizarVinculoMaterialProcedimento: async (args) => { calls.push(structuredClone(args)); own = { ...own, quantidade: args.quantidade }; },
    desvincularMaterialProcedimento: async () => { own = null; },
    vincularMaterialProcedimento: async () => { throw Error('Unexpected POST'); },
  };
  const { useProcedimentoMateriais } = compile('hooks/useProcedimentoMateriais.js', { '../procedimentosMateriaisApi.js': api, '../procedimentosMateriaisMappers.js': materialMappers });
  function Runner() { hook = useProcedimentoMateriais({ procedimentoId: 701, open: true }); return null; }
  await act(async () => root.render(React.createElement(Runner)));
  await act(async () => hook.actions.openEditor({ mode: 'edit', vinculo: own }));
  await act(async () => hook.actions.updateEditorField('quantidade', '3,5'));
  await act(async () => hook.actions.saveEditor());
  assert.deepEqual(calls, [{ procedimentoId: 701, codigo: 'M1', quantidade: 3.5 }]);
  assert.equal(hook.state.items[0].quantidade, 3.5);
  await act(async () => hook.actions.openEditor({ mode: 'edit', vinculo: own }));
  await act(async () => hook.actions.syncEditorWithMaterial({ id: 2, codigo: 'M2', custo: 3 }));
  await act(async () => hook.actions.saveEditor());
  assert.equal(calls.length, 1); assert.match(hook.state.editor.error, /somente a quantidade/);
  await act(async () => hook.actions.deleteSelected());
  assert.equal(hook.state.items.length, 0);
}));
