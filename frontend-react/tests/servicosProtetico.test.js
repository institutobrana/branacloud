import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { listarProteticos, listarServicosProtetico } from '../src/features/servicosProtetico/servicosProteticoApi.js';
import { filterServicos, sortServicos } from '../src/features/servicosProtetico/utils/servicosProteticoFilters.js';
import { formatMoney } from '../src/features/servicosProtetico/utils/servicosProteticoFormatters.js';
import { normalizeProtetico, normalizeServico } from '../src/features/servicosProtetico/utils/servicosProteticoMappers.js';
import { createRequestSequenceGate } from '../src/features/servicosProtetico/utils/servicosProteticoRace.js';
import { INITIAL_VISIBLE_COLUMNS, toggleVisibleColumnMap } from '../src/features/servicosProtetico/hooks/useServicosProtetico.js';

test('normalizeProtetico preserva id e nome', () => {
  assert.deepEqual(normalizeProtetico({ id: '7', nome: '  Laboratório A  ' }), { id: 7, nome: 'Laboratório A' });
});

test('normalizeServico preserva id, zero e campos principais', () => {
  assert.deepEqual(normalizeServico({ id: '12', protetico_id: '3', nome: '  Acrilização  ', indice: '0', preco: '0', prazo: '0' }), {
    id: 12,
    protetico_id: 3,
    codigo: 12,
    nome: 'Acrilização',
    indice: 0,
    preco: 0,
    prazo: 0,
  });
});

test('formatMoney usa pt-BR e preserva zero', () => {
  assert.equal(formatMoney(0), '0,00');
  assert.equal(formatMoney(12.5), '12,50');
});

test('filterServicos combina filtros em AND', () => {
  const items = [
    { codigo: 10, nome: 'Acrilização total', indice: 1.5, preco: 20, prazo: 3 },
    { codigo: 11, nome: 'Acrilização parcial', indice: 1.5, preco: 25, prazo: 3 },
  ];

  assert.deepEqual(filterServicos(items, { nome: 'acrilização', preco: '25,00' }).map((item) => item.codigo), [11]);
});

test('filterServicos encontra serviço por codigo, nome, indice, preco e prazo', () => {
  const items = [
    { codigo: 10, nome: 'Acrilização total', indice: 1.5, preco: 20, prazo: 3 },
    { codigo: 11, nome: 'Prótese parcial', indice: 2.25, preco: 30, prazo: 7 },
  ];

  assert.equal(filterServicos(items, { codigo: '10' }).length, 1);
  assert.equal(filterServicos(items, { nome: 'acrilização' }).length, 1);
  assert.equal(filterServicos(items, { indice: '1,50' }).length, 1);
  assert.equal(filterServicos(items, { preco: '30,00' }).length, 1);
  assert.equal(filterServicos(items, { prazo: '7' }).length, 1);
});

test('filterServicos ignora maiusculas e acentos no nome', () => {
  const items = [{ codigo: 10, nome: 'Acrilização', indice: 1, preco: 1, prazo: 1 }];
  assert.equal(filterServicos(items, { nome: 'ACRILIZACAO' }).length, 1);
});

test('sortServicos ordena por nome e por valor numerico', () => {
  const items = [
    { codigo: 2, nome: 'B', indice: 3, preco: 20, prazo: 2 },
    { codigo: 1, nome: 'A', indice: 1, preco: 10, prazo: 1 },
  ];
  assert.deepEqual(sortServicos(items, { key: 'nome', order: 'asc' }).map((item) => item.codigo), [1, 2]);
  assert.deepEqual(sortServicos(items, { key: 'preco', order: 'desc' }).map((item) => item.codigo), [2, 1]);
});

test('toggleVisibleColumnMap alterna visibilidade e preserva pelo menos uma coluna', () => {
  const hiddenCodigo = toggleVisibleColumnMap(INITIAL_VISIBLE_COLUMNS, 'codigo');
  assert.equal(hiddenCodigo.codigo, false);
  assert.equal(hiddenCodigo.nome, true);

  const restoredCodigo = toggleVisibleColumnMap(hiddenCodigo, 'codigo');
  assert.equal(restoredCodigo.codigo, true);

  const withoutLastGuard = toggleVisibleColumnMap({ codigo: false, nome: false, indice: false, preco: false, prazo: true }, 'prazo');
  assert.equal(withoutLastGuard.prazo, true);
});

test('createRequestSequenceGate invalida respostas antigas', () => {
  const gate = createRequestSequenceGate();
  const first = gate.next();
  const second = gate.next();
  assert.equal(gate.isCurrent(first), false);
  assert.equal(gate.isCurrent(second), true);
  gate.bump();
  assert.equal(gate.isCurrent(second), false);
});

test('listarProteticos envia Authorization e normaliza resposta', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => 'token-x' } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ([{ id: '9', nome: ' Protético 1 ' }]),
    };
  };

  try {
    const result = await listarProteticos();
    assert.deepEqual(result, [{ id: 9, nome: 'Protético 1' }]);
    assert.equal(calls[0].url, '/api/proteticos');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-x');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('listarServicosProtetico retorna lista vazia para id invalido', async () => {
  const result = await listarServicosProtetico(null);
  assert.deepEqual(result, []);
});

test('listarServicosProtetico normaliza payload real', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => 'token-y' } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ([{ id: 21, protetico_id: 7, nome: 'Serviço 1', indice: '1.25', preco: '10', prazo: '4' }]),
    };
  };

  try {
    const result = await listarServicosProtetico(7);
    assert.deepEqual(result, [{ id: 21, protetico_id: 7, codigo: 21, nome: 'Serviço 1', indice: 1.25, preco: 10, prazo: 4 }]);
    assert.equal(calls[0].url, '/api/proteticos/7/servicos');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('listarProteticos falha sem token', async () => {
  const originalWindow = globalThis.window;
  globalThis.window = { localStorage: { getItem: () => '' } };

  try {
    await assert.rejects(() => listarProteticos(), /Sessao expirada/);
  } finally {
    globalThis.window = originalWindow;
  }
});

test('ServicosProteticoTable integra footer ao mesmo shell visual', () => {
  const source = readFileSync(new URL('../src/features/servicosProtetico/components/ServicosProteticoTable.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('servicos-protetico-table-shell'));
  assert.ok(source.includes('servicos-protetico-table-frame'));
  assert.ok(source.includes('servicos-protetico-table-grid'));
  assert.ok(source.includes('servicos-protetico-table-footer'));
  assert.ok(source.includes('footerLabel'));
  assert.ok(source.includes('draftFilters'));
  assert.ok(source.includes('onFilterApply'));
  assert.ok(source.includes('resolvedColumns'));
  assert.ok(source.includes('visibleColumns'));
  assert.ok(source.includes("scroll={{ y: TABLE_SCROLL_Y }}"));
  assert.ok(source.includes('ellipsis: true'));
  assert.ok(!source.includes("filterDropdown: () => null"));
  assert.ok(!source.includes('servicos-protetico-summary'));
  assert.ok(!source.includes('totalItems'));
});

test('ServicosProteticoPage remove shell externo residual', () => {
  const source = readFileSync(new URL('../src/features/servicosProtetico/ServicosProteticoPage.jsx', import.meta.url), 'utf8');

  assert.ok(source.includes('footerLabel={serviceCountLabel}'));
  assert.ok(source.includes('serviceCountLabel'));
  assert.ok(source.includes('onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}'));
  assert.ok(source.includes('visibleColumns={visibleColumns}'));
  assert.ok(source.includes('onToggleVisibleColumn={handleToggleVisibleColumn}'));
  assert.ok(!source.includes('BranaCard'));
  assert.ok(!source.includes('servicos-protetico-page-footer'));
});

test('ServicosProteticoCSS integra moldura e footer', () => {
  const css = readFileSync(new URL('../src/features/servicosProtetico/servicosProtetico.css', import.meta.url), 'utf8');
  const globals = readFileSync(new URL('../src/styles/globals.css', import.meta.url), 'utf8');

  assert.ok(css.includes('width: min(82vw, 1040px);'));
  assert.ok(css.includes('max-width: calc(100% - 120px);'));
  assert.ok(css.includes('min-width: 860px;'));
  assert.ok(css.includes('margin-inline: auto;'));
  assert.ok(css.includes('border-radius: 10px;'));
  assert.ok(css.includes('.servicos-protetico-table-frame'));
  assert.ok(css.includes('.servicos-protetico-table-footer'));
  assert.ok(css.includes('height: 32px;'));
  assert.ok(css.includes('scrollbar-gutter: stable;'));
  assert.ok(css.includes('border-top: 1px solid'));
  assert.ok(css.includes('background: var(--brana-surface-card);'));
  assert.ok(globals.includes('.auxiliary-filter-menu-filter'));
  assert.ok(globals.includes('.auxiliary-filter-menu-actions'));
});

test('ServicosProteticoCSS amplia o combo de protetico sem quebrar responsividade', () => {
  const css = readFileSync(new URL('../src/features/servicosProtetico/servicosProtetico.css', import.meta.url), 'utf8');
  assert.ok(css.includes('width: clamp(300px, 26vw, 360px) !important;'));
  assert.ok(css.includes('max-width: min(360px, 100%);'));
  assert.ok(css.includes('width: clamp(280px, 24vw, 320px) !important;'));
  assert.ok(css.includes('width: min(100%, 280px) !important;'));
});
