import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const app = read('../src/app/App.jsx');
const css = read('../src/features/procedimentos/procedimentos.css');
const globalCss = read('../src/styles/globals.css');
const page = read('../src/features/procedimentos/ProcedimentosPage.jsx');

test('Procedimentos herda deslocamento do shell: nenhum override local nem offset hardcoded', () => {
  assert.doesNotMatch(css, /\.procedimentos-shell-band\.auxiliary-shell-band/);
  const band = css.match(/\.procedimentos-shell-band\s*\{([^}]+)\}/)[1];
  assert.doesNotMatch(band, /padding-left|margin-left|transform|\bleft\s*:/);
  assert.match(app, /className="brana-shell-band auxiliary-shell-band procedimentos-shell-band"/);
  assert.match(page, /className="auxiliary-shell-frame procedimentos-genericos-frame"/);
});

for (const expanded of [false, true]) {
  for (const panel of [false, true]) {
    test(`contrato estrutural: rail ${expanded ? 'expandido' : 'fechado'}, painel ${panel ? 'aberto' : 'fechado'}`, () => {
      assert.match(app, /'--brana-rail-width': railExpanded \? '184px' : '72px'/);
      assert.match(app, /'--brana-panel-width': panelGroup \? '272px' : '0px'/);
      const selector = panel ? '.brana-shell-body.has-panel > .brana-shell-band' : '.brana-shell-body > .brana-shell-band';
      const start = globalCss.indexOf(`${selector} {`);
      assert.notEqual(start, -1);
      const rule = globalCss.slice(start, globalCss.indexOf('}', start));
      assert.match(rule, /padding-left: .*var\(--brana-rail-width/);
      if (panel) assert.match(rule, /calc\(.*var\(--brana-panel-width/);
      assert.match(globalCss, /grid-template-columns: var\(--brana-rail-width.*var\(--brana-panel-width/);
      assert.match(app, /className=.*brana-shell-body/);
    });
  }
}

test('não altera grid compartilhado homologado nem implementa scroll do Plan B', () => {
  assert.match(globalCss, /width: min\(1032px, 100%\)/);
  const table = page.slice(page.indexOf('<BranaTable'), page.indexOf('locale={{ emptyText:', page.indexOf('<BranaTable')));
  assert.doesNotMatch(table, /scroll=|480|height=/);
  assert.match(table, /pagination=\{false\}/);
  assert.match(table, /dataSource=\{rows\}/);
});

test('toolbar real despacha as sete ações existentes e reflete somente flags da Page', async () => {
  const initialState = app.slice(app.indexOf('const [procedimentosToolbarState'), app.indexOf('const [materiaisEstoqueToolbarState'));
  assert.match(initialState, /canCreateTabela: false/);
  assert.match(initialState, /canDeleteProcedimento: false/);
  const start = app.indexOf('  const procedimentosTopBar = useMemo(() => {');
  const end = app.indexOf('  }, [procedimentosToolbarState, screen]);', start);
  const fragment = app.slice(start, end).replace('const procedimentosTopBar = useMemo(() => {', 'function Toolbar({ procedimentosToolbarState }) { const screen = "procedimentos";');
  const compiled = transformSync(`${fragment}\n}\nexport { Toolbar };`, { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code;
  const dom = new JSDOM('<div id="toolbar"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  const module = { exports: {} };
  const stub = () => null;
  const jsx = await import('react/jsx-runtime');
  vm.runInNewContext(compiled, { module, exports: module.exports, window: dom.window, CustomEvent: dom.window.CustomEvent, Select: stub, Input: { Search: stub }, require: (id) => id === 'react/jsx-runtime' ? jsx : React });
  const flags = ['canCreateProcedimento', 'canEditProcedimento', 'canDeleteProcedimento', 'canCreateTabela', 'canEditTabela', 'canDeleteTabela', 'canReajusteTabela'];
  const state = { tabelas: [{ id: 4, codigo: 4, nome: 'PARTICULAR' }], especialidades: [], selectedTabelaId: 4, ...Object.fromEntries(flags.map((flag) => [flag, true])) };
  const received = [];
  dom.window.addEventListener('brana-procedimentos-toolbar-action', (event) => received.push(event.detail.action));
  const root = createRoot(document.querySelector('#toolbar'));
  try {
    await act(async () => root.render(React.createElement(module.exports.Toolbar, { procedimentosToolbarState: state })));
    const buttons = [...document.querySelectorAll('button')];
    assert.equal(buttons.length, 8);
    await act(async () => buttons.slice(0, 7).forEach((button) => button.click()));
    assert.deepEqual(received, ['novo', 'alterar', 'eliminar', 'nova-tabela', 'altera-tabela', 'elimina-tabela', 'reajusta-tabela']);
    assert.equal(buttons[7].disabled, true); // Printing is outside Plan A.
    await act(async () => root.render(React.createElement(module.exports.Toolbar, { procedimentosToolbarState: { ...state, ...Object.fromEntries(flags.map((flag) => [flag, false])) } })));
    assert.ok([...document.querySelectorAll('button')].every((button) => button.disabled));
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    Object.assign(globalThis, { window: previous.window, document: previous.document, IS_REACT_ACT_ENVIRONMENT: previous.act });
  }
});
