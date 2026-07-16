import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { listarProteticos, listarServicosProtetico, criarServicoProtetico, alterarServicoProtetico } from '../src/features/servicosProtetico/servicosProteticoApi.js';
import { filterServicos, sortServicos } from '../src/features/servicosProtetico/utils/servicosProteticoFilters.js';
import { formatMoney } from '../src/features/servicosProtetico/utils/servicosProteticoFormatters.js';
import { buildServicoProteticoCreatePayload } from '../src/features/servicosProtetico/utils/servicosProteticoCreatePayload.js';
import { validateServicoProteticoValues } from '../src/features/servicosProtetico/utils/servicosProteticoValidators.js';
import { normalizeProtetico, normalizeServico } from '../src/features/servicosProtetico/utils/servicosProteticoMappers.js';
import { createRequestSequenceGate } from '../src/features/servicosProtetico/utils/servicosProteticoRace.js';
import { INITIAL_VISIBLE_COLUMNS, toggleVisibleColumnMap } from '../src/features/servicosProtetico/hooks/useServicosProtetico.js';

test('normalizeProtetico preserva id e nome', () => {
  assert.deepEqual(normalizeProtetico({ id: '7', nome: '  Laboratório A  ' }), { id: 7, nome: 'Laboratório A' });
});

test('normalizeServico preserva id e campos do contrato', () => {
  assert.deepEqual(
    normalizeServico({
      id: '12',
      protetico_id: '3',
      nome: '  Acrilização  ',
      codigo: '  PRT-001  ',
      descricao: '  Linha 1  ',
      indice: 'R$',
      preco: '0',
      prazo: '0',
    }),
    {
      id: 12,
      protetico_id: 3,
      codigo: 'PRT-001',
      descricao: 'Linha 1',
      nome: 'Acrilização',
      indice: 'R$',
      preco: 0,
      prazo: 0,
    },
  );
});

test('formatMoney usa pt-BR e preserva zero', () => {
  assert.equal(formatMoney(0), '0,00');
  assert.equal(formatMoney(12.5), '12,50');
});

test('filterServicos combina filtros em AND', () => {
  const items = [
    { codigo: '10', nome: 'Acrilização total', indice: '1.5', preco: 20, prazo: 3 },
    { codigo: '11', nome: 'Acrilização parcial', indice: '1.5', preco: 25, prazo: 3 },
  ];

  assert.deepEqual(filterServicos(items, { nome: 'acrilização', preco: '25,00' }).map((item) => item.codigo), ['11']);
});

test('filterServicos encontra serviço por codigo, nome, indice, preco e prazo', () => {
  const items = [
    { codigo: '10', nome: 'Acrilização total', indice: '1.5', preco: 20, prazo: 3 },
    { codigo: '11', nome: 'Prótese parcial', indice: '2.25', preco: 30, prazo: 7 },
  ];

  assert.equal(filterServicos(items, { codigo: '10' }).length, 1);
  assert.equal(filterServicos(items, { nome: 'acrilização' }).length, 1);
  assert.equal(filterServicos(items, { indice: '1,50' }).length, 1);
  assert.equal(filterServicos(items, { preco: '30,00' }).length, 1);
  assert.equal(filterServicos(items, { prazo: '7' }).length, 1);
});

test('filterServicos ignora maiúsculas e acentos no nome', () => {
  const items = [{ codigo: '10', nome: 'Acrilização', indice: '1', preco: 1, prazo: 1 }];
  assert.equal(filterServicos(items, { nome: 'ACRILIZACAO' }).length, 1);
});

test('sortServicos ordena por nome e por valor numerico', () => {
  const items = [
    { codigo: '2', nome: 'B', indice: '3', preco: 20, prazo: 2 },
    { codigo: '1', nome: 'A', indice: '1', preco: 10, prazo: 1 },
  ];
  assert.deepEqual(sortServicos(items, { key: 'nome', order: 'asc' }).map((item) => item.codigo), ['1', '2']);
  assert.deepEqual(sortServicos(items, { key: 'preco', order: 'desc' }).map((item) => item.codigo), ['2', '1']);
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
      json: async () => ([{ id: 21, protetico_id: 7, nome: 'Serviço 1', codigo: 'PRT-021', descricao: 'Obs', indice: 'R$', preco: '10', prazo: '4' }]),
    };
  };

  try {
    const result = await listarServicosProtetico(7);
    assert.deepEqual(result, [{ id: 21, protetico_id: 7, codigo: 'PRT-021', descricao: 'Obs', nome: 'Serviço 1', indice: 'R$', preco: 10, prazo: 4 }]);
    assert.equal(calls[0].url, '/api/proteticos/7/servicos');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('buildServicoProteticoCreatePayload normaliza valores pt-BR', () => {
  assert.deepEqual(
    buildServicoProteticoCreatePayload({
      codigo: '  PRT-001  ',
      nome: '  Acrilização  ',
      indice: ' R$ ',
      preco: '1.234,50',
      prazo: ' 07 ',
      descricao: '  Texto\nlinha 2  ',
    }),
    {
      codigo: 'PRT-001',
      nome: 'Acrilização',
      indice: 'R$',
      preco: 1234.5,
      prazo: 7,
      descricao: 'Texto\nlinha 2',
    },
  );
});

test('validateServicoProteticoValues acusa campos obrigatorios e formatos invalidos', () => {
  const invalid = validateServicoProteticoValues({ codigo: '', nome: '', indice: '', preco: 'abc', prazo: 'x' });
  assert.equal(invalid.valid, false);
  assert.equal(Boolean(invalid.errors.codigo), true);
  assert.equal(Boolean(invalid.errors.nome), true);
  assert.equal(Boolean(invalid.errors.indice), true);
  assert.equal(Boolean(invalid.errors.preco), true);
  assert.equal(Boolean(invalid.errors.prazo), true);
});

test('criarServicoProtetico envia POST com payload normalizado', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => 'token-z' } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: 31, protetico_id: 7, nome: 'Servico 1', codigo: 'PRT-031', descricao: 'Obs', indice: 'R$', preco: 10, prazo: 5 }),
    };
  };

  try {
    const result = await criarServicoProtetico(7, { codigo: 'PRT-031', nome: 'Servico 1', indice: 'R$', preco: 10, prazo: 5, descricao: 'Obs' });
    assert.deepEqual(result, { id: 31, protetico_id: 7, codigo: 'PRT-031', descricao: 'Obs', nome: 'Servico 1', indice: 'R$', preco: 10, prazo: 5 });
    assert.equal(calls[0].url, '/api/proteticos/7/servicos');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-z');
    assert.equal(JSON.parse(calls[0].options.body).codigo, 'PRT-031');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
  }
});

test('alterarServicoProtetico envia PUT com payload normalizado', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => 'token-w' } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ id: 31, protetico_id: 7, nome: 'Servico 1', codigo: 'PRT-031', descricao: 'Obs', indice: 'R$', preco: 10, prazo: 5 }),
    };
  };

  try {
    const result = await alterarServicoProtetico(31, { codigo: 'PRT-031', nome: 'Servico 1', indice: 'R$', preco: 10, prazo: 5, descricao: 'Obs' });
    assert.deepEqual(result, { id: 31, protetico_id: 7, codigo: 'PRT-031', descricao: 'Obs', nome: 'Servico 1', indice: 'R$', preco: 10, prazo: 5 });
    assert.equal(calls[0].url, '/api/proteticos/servicos/31');
    assert.equal(calls[0].options.method, 'PUT');
    assert.equal(calls[0].options.headers.Authorization, 'Bearer token-w');
    assert.equal(JSON.parse(calls[0].options.body).codigo, 'PRT-031');
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
  assert.ok(source.includes('error={modalError}'));
  assert.ok(source.includes('useServicoProteticoUpdate'));
  assert.ok(source.includes("mode: 'edit'"));
  assert.ok(source.includes('onRowDoubleClick={openEditModal}'));
  assert.ok(source.includes("action === 'altera-servico'"));
  assert.ok(source.includes('updateServico(service.id, payload)'));
  assert.ok(!source.includes('BranaCard'));
  assert.ok(!source.includes('servicos-protetico-page-footer'));
});

test('ServicoProteticoForm compacta Indice e Preco na mesma linha', () => {
  const source = readFileSync(new URL('../src/features/servicosProtetico/components/ServicoProteticoForm.jsx', import.meta.url), 'utf8');

  assert.ok(source.includes('servicos-protetico-form-row'));
  assert.ok(source.includes('servicos-protetico-form-item-half'));
  assert.ok(source.includes('name="indice"'));
  assert.ok(source.includes('name="preco"'));
  assert.ok(source.indexOf('name="indice"') < source.indexOf('name="preco"'));
  assert.ok(source.includes('autoSize={{ minRows: 2, maxRows: 4 }}'));
});

test('ServicoProteticoModal preserva contrato e reduz altura visual', () => {
  const source = readFileSync(new URL('../src/features/servicosProtetico/components/ServicoProteticoModal.jsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/features/servicosProtetico/servicosProtetico.css', import.meta.url), 'utf8');

  assert.ok(source.includes('width={420}'));
  assert.ok(source.includes('className="servicos-protetico-modal"'));
  assert.ok(source.includes('message={error}'));
  assert.ok(source.includes("mode = 'create'"));
  assert.ok(source.includes("title={isEditMode ? 'Altera serviço de protético' : 'Novo serviço de protético'}"));
  assert.ok(css.includes('.servicos-protetico-modal .ant-modal-body'));
  assert.ok(css.includes('.servicos-protetico-form-row'));
  assert.ok(css.includes('.servicos-protetico-form-item'));
  assert.ok(css.includes('.servicos-protetico-modal-actions'));
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
