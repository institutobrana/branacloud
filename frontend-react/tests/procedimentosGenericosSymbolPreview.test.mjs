import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { transformSync } from 'esbuild';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

// Execute the actual local implementation without importing the modal's API/services.
const source = fs.readFileSync(new URL('../src/features/procedimentosGenericos/ProcedimentoGenericoModal.jsx', import.meta.url), 'utf8');
const helpers = source.slice(source.indexOf('function findSimboloByValue('), source.indexOf('function SymbolPreview('));
const context = vm.createContext({});
vm.runInContext(helpers, context);
const resolve = (items, state, options) => Array.from(context.resolveGenericSymbolPreviewCandidates(items, state, options));
const symbol = { legacy_id: 1, codigo: 'sim_outras.bmp', icone: 'sim_outras.bmp', imagem_url: '/desktop-assets/easy/sim_outras.bmp' };
const state = { simbolo_grafico: 'sim_outras.bmp' };

test('preserva URL canonica e a prioriza fora do Vite', () => {
  assert.deepEqual(resolve([symbol], state, { baseUrl: '/react/' }), [
    '/desktop-assets/easy/sim_outras.bmp', '/react/assets/easy/sim_outras.bmp',
  ]);
});

test('Vite prioriza copia existente sob /app/ sem descartar a canonica', () => {
  const candidates = resolve([symbol], state, { baseUrl: '/app/', preferBundledAssets: true });
  assert.deepEqual(candidates, ['/app/assets/easy/sim_outras.bmp', '/desktop-assets/easy/sim_outras.bmp']);
  assert.equal(candidates.includes('/assets/easy/sim_outras.bmp'), false);
});

test('respeita outras bases e normaliza imagem_url publica antiga', () => {
  for (const base of ['/app/', '/react/', '/clinica/', '/']) {
    const candidates = resolve([{ ...symbol, imagem_url: '/assets/easy/sim_outras.bmp' }], state, { baseUrl: base });
    assert.equal(candidates[0], `${base}assets/easy/sim_outras.bmp`);
    assert.equal(new Set(candidates).size, candidates.length);
  }
});

test('preserva URL absoluta/customizada, data e blob sem hardcoded host', () => {
  for (const imagem_url of ['https://assets.example.test/sim_outras.bmp', 'data:image/png;base64,abc', 'blob:https://example.test/id']) {
    assert.equal(resolve([{ ...symbol, imagem_url }], state, { baseUrl: '/app/', preferBundledAssets: true })[0], imagem_url);
  }
});

test('resolve identificador legado, familia, aliases e ignora selecao vazia', () => {
  assert.deepEqual(resolve([symbol], { simbolo_grafico_legacy_id: 1 }, { baseUrl: '/app/', preferBundledAssets: true }), resolve([symbol], state, { baseUrl: '/app/', preferBundledAssets: true }));
  assert.deepEqual(resolve([symbol], {}, { baseUrl: '/app/' }), []);
  assert.deepEqual(resolve([], { simbolo_grafico: '123' }), []);
  assert.equal(resolve([{ codigo: 'esp_cirur.bmp' }], { simbolo_grafico: 'esp_cirur.bmp' }, { baseUrl: '/app/' })[0], '/app/assets/fichaClinica/odontograma/especialidades/esp_cirur.bmp');
  assert.equal(resolve([{ codigo: 'int_restdo.bmp' }], { simbolo_grafico: 'int_restdo.bmp' }, { baseUrl: '/app/' })[0], '/app/assets/easy/int_RestDO.bmp');
});

const previewSource = source.slice(source.indexOf('function SymbolPreview('), source.indexOf('export function ProcedimentoGenericoModal('));
const compiled = transformSync(`
  import React, { useEffect, useMemo, useState } from 'react';
  const Typography = { Text: ({ children, type, ...props }) => <span {...props}>{children}</span> };
  ${helpers}
  ${previewSource}
  export { SymbolPreview };
`, {
  loader: 'jsx', format: 'cjs',
  define: { 'import.meta.env.BASE_URL': '"/app/"', 'import.meta.env.DEV': 'true' },
}).code;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports, require: createRequire(import.meta.url) });
const { SymbolPreview } = module.exports;

test('candidato com erro cede ao seguinte; esgotamento e recuperacao sao controlados', async () => {
  const dom = new JSDOM('<div id="preview"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const container = dom.window.document.querySelector('#preview');
  const root = createRoot(container);
  try {
    const custom = [{ ...symbol, imagem_url: 'https://assets.example.test/broken.bmp' }];
    await act(async () => root.render(React.createElement(SymbolPreview, { simbolos: custom, state })));
    assert.equal(container.querySelector('img').getAttribute('src'), custom[0].imagem_url);
    await act(async () => container.querySelector('img').dispatchEvent(new dom.window.Event('error')));
    assert.equal(container.querySelector('img').getAttribute('src'), '/app/assets/easy/sim_outras.bmp');
    assert.notEqual(container.querySelector('img').getAttribute('src'), custom[0].imagem_url);
    await act(async () => container.querySelector('img').dispatchEvent(new dom.window.Event('error')));
    assert.equal(container.querySelector('img'), null);
    assert.equal(container.querySelector('[role="status"]').textContent, 'Sem imagem');
    await act(async () => root.render(React.createElement(SymbolPreview, { simbolos: [symbol], state })));
    assert.equal(container.querySelector('img').getAttribute('src'), '/app/assets/easy/sim_outras.bmp');
    await act(async () => root.render(React.createElement(SymbolPreview, { simbolos: [], state: {} })));
    assert.equal(container.textContent, '');
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    globalThis.window = previous.window;
    globalThis.document = previous.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act;
  }
});

test('campos de auditoria tem regra local, altura fixa e ciano light/dark', () => {
  const css = fs.readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
  const light = css.match(/\.procedimento-generico-modal \.procedimento-generico-date-box\s*\{([^}]+)\}/)?.[1];
  const dark = css.match(/:root\[data-brana-theme='dark'\] \.procedimento-generico-modal \.procedimento-generico-date-box\s*\{([^}]+)\}/)?.[1];
  assert.match(light, /min-height:\s*28px/);
  assert.match(light, /height:\s*28px/);
  assert.match(light, /background:\s*#54e5e9/);
  assert.match(light, /padding:\s*0 10px/);
  assert.match(dark, /background:\s*#34d7df/);
});

test('cascata light/dark preserva padding e altura inclusive no campo vazio', () => {
  const css = fs.readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');
  const light = css.match(/\.procedimento-generico-modal \.procedimento-generico-date-box\s*\{[^}]+\}/)[0];
  const dark = css.match(/:root\[data-brana-theme='dark'\] \.procedimento-generico-modal \.procedimento-generico-date-box\s*\{[^}]+\}/)[0];
  const dom = new JSDOM(`<style>${light}\n${dark}</style><div class="procedimento-generico-modal"><div class="procedimento-generico-date-box">2023-11-25</div><div class="procedimento-generico-date-box"> </div></div>`);
  try {
    for (const [theme, color] of [['light', 'rgb(84, 229, 233)'], ['dark', 'rgb(52, 215, 223)']]) {
      dom.window.document.documentElement.dataset.branaTheme = theme;
      for (const field of dom.window.document.querySelectorAll('.procedimento-generico-date-box')) {
        const style = dom.window.getComputedStyle(field);
        assert.equal(style.backgroundColor, color);
        assert.equal(style.height, '28px');
        assert.equal(style.minHeight, '28px');
        assert.equal(style.padding, '0px 10px');
        assert.equal(style.alignItems, 'center');
      }
    }
  } finally {
    dom.window.close();
  }
});
