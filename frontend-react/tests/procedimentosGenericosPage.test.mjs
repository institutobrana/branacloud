import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';

const source = fs.readFileSync(new URL('../src/features/procedimentosGenericos/ProcedimentosGenericosPage.jsx', import.meta.url), 'utf8');
const compiled = transformSync(source, { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code;
const records = Array.from({ length: 591 }, (_, index) => ({ id: index + 1, codigo: String(index + 1).padStart(4, '0'), descricao: `Procedimento ${index + 1}`, especialidade: '', inativo: false }));

async function withPage(run) {
  const dom = new JSDOM('<div id="page"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let tableProps;
  let modalProps;
  const box = ({ children, ...props }) => React.createElement('div', props, children);
  const mocks = {
    react: React,
    'react/jsx-runtime': await import('react/jsx-runtime'),
    antd: { Space: box, Typography: { Text: ({ children }) => React.createElement('span', null, children) }, message: { error() {}, warning() {} } },
    '../../components/BranaCard.jsx': { BranaCard: box },
    '../../components/TableColumnFilterHeader.jsx': { TableColumnFilterHeader: () => null },
    './procedimentosGenericosApi.js': {
      listarProcedimentosGenericos: async () => records,
      listarProcedimentosGenericosEspecialidades: async () => [],
    },
    './ProcedimentoGenericoFasesModal.jsx': { ProcedimentoGenericoFasesModal: () => null },
    './ProcedimentoGenericoMateriaisModal.jsx': { ProcedimentoGenericoMateriaisModal: () => null },
    './ProcedimentoGenericoModal.jsx': { ProcedimentoGenericoModal: (props) => {
      modalProps = props;
      return props.open ? React.createElement('div', { role: 'dialog', 'data-record-id': props.itemId }, `Altera ${props.itemId}`) : null;
    } },
    '../../components/BranaTable.jsx': { BranaTable: (props) => {
      tableProps = props;
      return React.createElement('table', null, React.createElement('tbody', null, props.dataSource.map((record) => {
        const row = props.onRow(record);
        return React.createElement('tr', { ...row, key: record.id, 'data-record-id': record.id },
          React.createElement('td', null, React.createElement('input', { type: 'radio', checked: props.rowSelection.selectedRowKeys.includes(record.id), onChange: () => props.rowSelection.onChange([record.id]) })),
          React.createElement('td', null, record.descricao));
      })));
    } },
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, window: dom.window, CustomEvent: dom.window.CustomEvent, require: (id) => {
    if (!(id in mocks)) throw new Error(`Unexpected dependency: ${id}`);
    return mocks[id];
  } });
  const container = document.querySelector('#page');
  const root = createRoot(container);
  const toolbarAlter = () => window.dispatchEvent(new dom.window.CustomEvent('brana-procedimentos-genericos-toolbar-action', { detail: { action: 'alterar' } }));
  const event = (element, type) => element.dispatchEvent(new dom.window.MouseEvent(type, { bubbles: true }));
  try {
    await act(async () => root.render(React.createElement(module.exports.ProcedimentosGenericosPage, {})));
    await run({ container, event, toolbarAlter, table: () => tableProps, modal: () => modalProps });
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    globalThis.window = previous.window;
    globalThis.document = previous.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act;
  }
}

test('A selecionado: duplo clique em B abre B e atualiza selecao/foco', async () => withPage(async ({ container, event, table, modal }) => {
  assert.deepEqual(Array.from(table().rowSelection.selectedRowKeys), [1]);
  await act(async () => event(container.querySelector('tr[data-record-id="2"] td:last-child'), 'dblclick'));
  assert.deepEqual(Array.from(table().rowSelection.selectedRowKeys), [2]);
  assert.equal(modal().mode, 'editar');
  assert.equal(modal().itemId, 2);
  assert.equal(modal().focusToken, 1);
  assert.equal(container.querySelector('[role="dialog"]').dataset.recordId, '2');
}));

test('clique simples seleciona B sem abrir modal', async () => withPage(async ({ container, event, table }) => {
  await act(async () => event(container.querySelector('tr[data-record-id="2"] td:last-child'), 'click'));
  assert.deepEqual(Array.from(table().rowSelection.selectedRowKeys), [2]);
  assert.equal(container.querySelector('[role="dialog"]'), null);
}));

test('Alterar usa selecionado e mantem a mesma abertura/foco', async () => withPage(async ({ container, event, toolbarAlter, modal }) => {
  await act(async () => event(container.querySelector('tr[data-record-id="3"] td:last-child'), 'click'));
  await act(async () => toolbarAlter());
  assert.equal(modal().itemId, 3);
  assert.equal(modal().mode, 'editar');
  assert.equal(modal().focusToken, 1);
}));

test('radio seleciona e duplo clique no controle nao abre nem duplica modal', async () => withPage(async ({ container, event, table, modal }) => {
  const radio = container.querySelector('tr[data-record-id="2"] input');
  await act(async () => radio.click());
  assert.deepEqual(Array.from(table().rowSelection.selectedRowKeys), [2]);
  await act(async () => event(radio, 'dblclick'));
  assert.equal(container.querySelector('[role="dialog"]'), null);
  assert.equal(modal().focusToken, 0);
}));

test('viewport limitada sem paginacao/truncamento: todos os 591 registros e contador fora da tabela', async () => withPage(async ({ container, table }) => {
  assert.equal(table().scroll.y, 480);
  assert.equal(table().pagination, false);
  assert.equal(table().dataSource.length, records.length);
  assert.equal(container.querySelectorAll('tbody tr').length, records.length);
  const footer = container.querySelector('.procedimentos-genericos-table-footer');
  assert.equal(footer.textContent.trim(), '591 procedimentos genéricos');
  assert.equal(footer.closest('table'), null);
}));

test('gap de auditoria local e colunas equivalentes nos dois temas', () => {
  const css = fs.readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
  const rule = css.match(/\.procedimento-generico-modal \.procedimento-generico-dates\s*\{[^}]+\}/)[0];
  const dom = new JSDOM(`<style>${rule}</style><div class="procedimento-generico-modal"><div class="procedimento-generico-dates"></div></div><div id="other" class="procedimento-generico-dates"></div>`);
  try {
    for (const theme of ['light', 'dark']) {
      dom.window.document.documentElement.dataset.branaTheme = theme;
      const style = dom.window.getComputedStyle(dom.window.document.querySelector('.procedimento-generico-modal .procedimento-generico-dates'));
      assert.equal(style.display, 'grid');
      assert.equal(style.gap, '0 8px');
      assert.equal(style.gridTemplateColumns, 'repeat(2, minmax(0, 1fr))');
      assert.notEqual(dom.window.getComputedStyle(dom.window.document.querySelector('#other')).gap, '0 8px');
    }
  } finally { dom.window.close(); }
});

test('modal real preserva campos, tres abas card, preview e ordem/handlers das acoes', async () => {
  const dom = new JSDOM('<div id="modal"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let closed = 0;
  let writes = 0;
  let saved = 0;
  let modalProps;
  let tabsProps;
  const costInputs = {};
  const fields = {};
  const form = { setFieldsValue: (values) => Object.assign(fields, values), setFieldValue: (key, value) => { fields[key] = value; }, resetFields() {}, validateFields: async () => fields };
  const Form = ({ children, className }) => React.createElement('form', { className }, children);
  Form.useForm = () => [form];
  Form.Item = ({ children, label, name, className }) => React.createElement('div', { className }, label ? React.createElement('label', { htmlFor: name }, label) : null, React.isValidElement(children) && name ? React.cloneElement(children, { id: name, value: fields[name] ?? children.props.value }) : children);
  const Input = ({ value, onChange, type, ...props }) => {
    if (props['aria-label']) costInputs[props['aria-label']] = { onChange, value };
    return React.createElement('input', { ...props, value: value ?? '', onChange: onChange || (() => {}), type });
  };
  Input.TextArea = ({ value, onChange, ...props }) => React.createElement('textarea', { ...props, value: value ?? '', onChange });
  const mocks = {
    react: React,
    'react/jsx-runtime': await import('react/jsx-runtime'),
    antd: { Form, Input, message: { error() {}, success() {} },
      Typography: { Text: ({ children, role }) => React.createElement('span', { role }, children) },
      Button: ({ children, onClick }) => React.createElement('button', { onClick, type: 'button' }, children),
      Checkbox: ({ children, checked, onChange }) => React.createElement('label', null, React.createElement('input', { type: 'checkbox', checked, onChange }), children),
      Select: ({ options, value, onChange, id }) => React.createElement('select', { id, value: value ?? '', onChange: (event) => onChange?.(event.target.value) }, React.createElement('option', { value: '' }, ''), options?.map((option) => React.createElement('option', { key: option.value, value: option.value }, option.label))),
      Table: ({ dataSource }) => React.createElement('div', null, JSON.stringify(dataSource)),
      Tabs: (props) => { tabsProps = props; return React.createElement('div', null, props.items.map(item => React.createElement('button', { key: item.key, role: 'tab', onClick: () => props.onChange(item.key) }, item.label)), React.createElement('div', { role: 'tabpanel' }, props.items.find(item => item.key === props.activeKey)?.children)); },
    },
    '../../components/BranaModal.jsx': { BranaModal: (props) => { modalProps = props; return React.createElement('div', { role: 'dialog' }, props.title, props.children); } },
    './procedimentosGenericosApi.js': {
      carregarCenarioProcedimentoGenerico: async () => ({ cfph: 0, cfpm: 0 }),
      listarProcedimentosGenericosEspecialidades: async () => [],
      listarSimbolosGraficoGenericos: async () => [{ legacy_id: 1, codigo: 'sim_outras.bmp', imagem_url: '/desktop-assets/easy/sim_outras.bmp' }],
      obterProcedimentoGenericoDetalhe: async () => ({ id: 1, codigo: '0001', descricao: 'Procedimento 1', especialidade: '', peso: 0, observacoes: '', inativo: false, simbolo_grafico: 'sim_outras.bmp', fases: [], materiais: [], vinculos: [] }),
      obterProximoCodigoProcedimentoGenerico: async () => '0002',
      salvarProcedimentoGenerico: async () => { writes++; },
    },
  };
  const modalSource = fs.readFileSync(new URL('../src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx', import.meta.url), 'utf8');
  const code = transformSync(modalSource, { loader: 'jsx', format: 'cjs', jsx: 'automatic', define: { 'import.meta.env.BASE_URL': '"/app/"', 'import.meta.env.DEV': 'true' } }).code;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: (id) => { if (!(id in mocks)) throw new Error(`Unexpected dependency: ${id}`); return mocks[id]; } });
  const root = createRoot(document.querySelector('#modal'));
  const click = async (name) => act(async () => Array.from(document.querySelectorAll('button')).find(e => e.textContent === name).click());
  try {
    await act(async () => root.render(React.createElement(module.exports.ProcedimentoGenericoModal, { open: true, mode: 'editar', itemId: 1, onClose: () => closed++, onSaved: () => saved++ })));
    assert.equal(modalProps.title, 'Altera procedimento genérico');
    assert.equal(tabsProps.type, 'card');
    assert.deepEqual(Array.from(document.querySelectorAll('[role="tab"]'), e => e.textContent), ['Principal', 'Custos diretos', 'Vínculos']);
    const labels = Array.from(document.querySelectorAll('label'), e => e.textContent);
    assert.deepEqual(labels, ['Nome do procedimento genérico:', 'Código genérico:', 'Especialidade:', 'Símbolo gráfico:', 'Peso:', 'Observações:', 'Inativar procedimento']);
    for (const label of document.querySelectorAll('label[for]')) assert.ok(document.getElementById(label.htmlFor), label.textContent);
    assert.equal(document.querySelector('img').getAttribute('src'), '/app/assets/easy/sim_outras.bmp');
    const preview = document.querySelector('img').getAttribute('src');
    assert.equal(document.querySelectorAll('.procedimento-generico-date-box').length, 2);
    await click('Custos diretos');
    assert.match(document.querySelector('[role="tabpanel"]').textContent, /Custo total:/);
    const rows = Array.from(document.querySelectorAll('.procedimento-generico-cost-row'));
    assert.deepEqual(rows.map(row => row.querySelector('.procedimento-generico-cost-label').textContent), ['Custo da hora clínica:', 'Tempo total de execução:', 'Custo fixo da intervenção:', 'Custo de protético:', 'Custo de materiais:', 'Custo total:']);
    for (const [index, row] of rows.entries()) {
      const field = row.querySelector('.procedimento-generico-cost-value');
      if (index === 1 || index === 3) {
        assert.ok(field.querySelector('input'));
        assert.equal(field.querySelector('input').readOnly, false);
        assert.equal(field.querySelector('input').disabled, false);
        assert.equal(field.classList.contains('is-readonly'), false);
      } else {
        assert.equal(field.tagName, 'OUTPUT');
        assert.equal(field.classList.contains('is-readonly'), true);
        assert.equal(field.querySelector('input'), null);
        assert.equal(field.getAttribute('aria-label'), row.querySelector('.procedimento-generico-cost-label').textContent);
      }
    }
    await act(async () => costInputs['Tempo total de execução:'].onChange({ target: { value: '60' } }));
    await act(async () => costInputs['Custo de protético:'].onChange({ target: { value: '12,50' } }));
    assert.equal(costInputs['Tempo total de execução:'].value, '60');
    assert.equal(costInputs['Custo de protético:'].value, '12,50');
    await click('Vínculos');
    assert.match(document.querySelector('[role="tabpanel"]').textContent, /0 itens vinculados/);
    await click('Principal');
    assert.equal(document.querySelector('img').getAttribute('src'), preview);
    assert.deepEqual(Array.from(document.querySelectorAll('.procedimento-generico-modal-actions button'), e => e.textContent), ['Ok', 'Cancela']);
    await click('Ok');
    assert.equal(writes, 1);
    assert.equal(saved, 1);
    assert.equal(closed, 1);
    await click('Cancela');
    assert.equal(closed, 2);
    assert.equal(writes, 1);
    modalProps.onCancel();
    assert.equal(closed, 3);
    assert.equal(writes, 1);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    globalThis.window = previous.window;
    globalThis.document = previous.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act;
  }
});

test('readonly de custos usa ciano local light/dark sem aplicar ao editavel', () => {
  const css = fs.readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
  const light = css.match(/\.procedimento-generico-modal \.procedimento-generico-cost-value\.is-readonly\s*\{[^}]+\}/)[0];
  const dark = css.match(/:root\[data-brana-theme='dark'\] \.procedimento-generico-modal \.procedimento-generico-cost-value\.is-readonly\s*\{[^}]+\}/)[0];
  const dom = new JSDOM(`<style>${light}\n${dark}</style><div class="procedimento-generico-modal"><output class="procedimento-generico-cost-value is-readonly"></output><div class="procedimento-generico-cost-value is-editable"><input></div></div><output id="outside" class="procedimento-generico-cost-value is-readonly"></output>`);
  try {
    for (const [theme, color] of [['light', 'rgb(84, 229, 233)'], ['dark', 'rgb(52, 215, 223)']]) {
      dom.window.document.documentElement.dataset.branaTheme = theme;
      assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('.procedimento-generico-modal output')).backgroundColor, color);
      assert.notEqual(dom.window.getComputedStyle(dom.window.document.querySelector('.is-editable')).backgroundColor, color);
      assert.notEqual(dom.window.getComputedStyle(dom.window.document.querySelector('#outside')).backgroundColor, color);
    }
  } finally { dom.window.close(); }
});

test('compactacao de labels fica local e nao reduz altura dos inputs', () => {
  const css = fs.readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
  const rule = css.match(/\.procedimento-generico-modal \.procedimento-generico-modal-form \.ant-form-item-label\s*\{[^}]+\}/)[0];
  const dom = new JSDOM(`<style>${rule}</style><div class="procedimento-generico-modal"><form class="procedimento-generico-modal-form"><div class="ant-form-item-label"></div></form></div><div id="outside" class="ant-form-item-label"></div>`);
  try {
    assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('.procedimento-generico-modal .ant-form-item-label')).padding, '0px 0px 2px');
    assert.notEqual(dom.window.getComputedStyle(dom.window.document.querySelector('#outside')).paddingBottom, '2px');
    assert.match(css, /\.procedimento-generico-modal \.ant-input,[\s\S]*?min-height:\s*28px/);
  } finally { dom.window.close(); }
});
