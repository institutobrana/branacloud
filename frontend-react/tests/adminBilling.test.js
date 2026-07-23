import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ADMIN_SECTIONS, getAdminSectionByKey } from '../src/features/admin/adminNavigation.js';
import {
  ADMIN_BILLING_DEFAULT_LIMIT,
  ADMIN_BILLING_ENDPOINT,
  buildAdminBillingQuery,
  getAdminBilling,
} from '../src/features/admin/billing/services/adminBillingApi.js';
import {
  normalizeAdminBilling,
  normalizeAdminBillingItem,
} from '../src/features/admin/billing/normalizers/adminBillingNormalizer.js';
import {
  ADMIN_BILLING_FILTER_COLUMNS,
  ADMIN_BILLING_VISIBLE_COLUMNS,
  formatAdminBillingFooterLabel,
  processAdminBillingRows,
  toggleAdminBillingVisibleColumn,
} from '../src/features/admin/billing/constants/adminBillingColumns.js';
import {
  formatAdminBillingDate,
  formatAdminBillingMoney,
  formatAdminBillingPlan,
  formatAdminBillingStatus,
} from '../src/features/admin/billing/utils/adminBillingFormatters.js';
import {
  ADMIN_BILLING_CSV_HEADERS,
  buildAdminBillingCsv,
} from '../src/features/admin/billing/utils/adminBillingCsv.js';

const sourcePath = (path) => resolve(`frontend-react/${path}`);
const source = (path) => readFileSync(sourcePath(path), 'utf8');

test('admin billing query targets the real read endpoint without inventing backend search', () => {
  const params = buildAdminBillingQuery({ status: ' pending ', limit: 80, q: 'clinica' });

  assert.equal(ADMIN_BILLING_ENDPOINT, '/superadmin/cobrancas');
  assert.equal(params.get('status'), 'pending');
  assert.equal(params.get('limit'), '80');
  assert.equal(params.has('q'), false);
  assert.equal(buildAdminBillingQuery().get('limit'), String(ADMIN_BILLING_DEFAULT_LIMIT));
});

test('admin billing API uses authenticated GET only', async () => {
  globalThis.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-123' : null),
    },
  };
  globalThis.localStorage = {
    getItem: (key) => (key === 'auth_token' || key === 'brana_token' ? 'token-123' : null),
  };

  let requestUrl = '';
  let requestOptions = null;
  globalThis.fetch = async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return {
      ok: true,
      status: 200,
      json: async () => [{ id: 1, clinica_nome: 'Clinica Local', valor: 99.9 }],
    };
  };

  const payload = await getAdminBilling({ status: 'approved' });
  assert.equal(Array.isArray(payload), true);
  assert.match(requestUrl, /\/superadmin\/cobrancas\?/);
  assert.match(requestUrl, /status=approved/);
  assert.doesNotMatch(requestUrl, /[?&]q=/);
  assert.equal(requestOptions.method, 'GET');
  assert.equal(requestOptions.headers.get('Authorization'), 'Bearer token-123');

  const service = source('src/features/admin/billing/services/adminBillingApi.js');
  assert.doesNotMatch(service, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
});

test('admin billing API rejects missing token without calling fetch', async () => {
  globalThis.window = { localStorage: { getItem: () => null } };
  globalThis.localStorage = { getItem: () => null };
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return { ok: true, json: async () => [] };
  };

  await assert.rejects(() => getAdminBilling(), /Sessao expirada/);
  assert.equal(called, false);
});

test('admin billing normalizer maps the contracted read fields', () => {
  const row = normalizeAdminBillingItem({
    id: '10',
    clinica_id: '42',
    clinica_nome: ' Clinica Brana ',
    payment_id: 'pay_123',
    external_reference: 'ref_123',
    plano: 'MENSAL',
    status: 'approved',
    valor: '129.9',
    moeda: 'BRL',
    origem: 'checkout',
    criado_em: '2026-07-22T12:00:00Z',
    atualizado_em: '2026-07-22T12:10:00Z',
  });

  assert.equal(row.id, 10);
  assert.equal(row.clinicaId, 42);
  assert.equal(row.clinicaNome, 'Clinica Brana');
  assert.equal(row.paymentId, 'pay_123');
  assert.equal(row.externalReference, 'ref_123');
  assert.equal(row.valor, 129.9);
  assert.equal(row.moeda, 'BRL');
  assert.equal(row.criadoEm, '2026-07-22T12:00:00Z');
  assert.equal(normalizeAdminBilling([row]).totalFromBackend, 1);
});

test('admin billing formatters keep read-only financial data legible', () => {
  assert.equal(formatAdminBillingPlan('MENSAL'), 'Mensal');
  assert.equal(formatAdminBillingPlan('SUPERADMIN'), 'Super Admin');
  assert.equal(formatAdminBillingStatus('approved'), 'Aprovado');
  assert.equal(formatAdminBillingStatus('checkout_open'), 'Checkout aberto');
  assert.match(formatAdminBillingMoney(129.9), /129,90/);
  assert.match(formatAdminBillingDate('2026-07-22T12:00:00Z'), /22\/07\/2026/);
});

test('admin billing CSV is generated client-side from loaded rows', () => {
  const row = normalizeAdminBillingItem({
    id: 7,
    clinica_id: 15,
    clinica_nome: 'Clínica, Teste',
    payment_id: 'pay_7',
    external_reference: 'BRANA|15|MENSAL|20260722',
    plano: 'MENSAL',
    status: 'approved',
    valor: 129.9,
    moeda: 'BRL',
    origem: 'checkout',
    criado_em: '2026-07-22T12:00:00Z',
    atualizado_em: '2026-07-22T12:30:00Z',
  });
  const csv = buildAdminBillingCsv([row]);

  assert.equal(ADMIN_BILLING_CSV_HEADERS.includes('Payment ID'), true);
  assert.match(csv, /^ID;Clinica;Plano;Status;Valor;Origem;Data/);
  assert.match(csv, /7;"Clínica, Teste";Mensal;Aprovado;/);
  assert.match(csv, /pay_7/);
  assert.match(csv, /BRANA\|15\|MENSAL\|20260722/);
});

test('admin billing table state supports local search, filters, sorting, visible columns and footer', () => {
  const rows = [
    normalizeAdminBillingItem({
      id: 2,
      clinica_id: 20,
      clinica_nome: 'Beta',
      plano: 'ANUAL',
      status: 'pending',
      valor: 500,
      origem: 'checkout',
      criado_em: '2026-07-21T12:00:00Z',
    }),
    normalizeAdminBillingItem({
      id: 1,
      clinica_id: 10,
      clinica_nome: 'Alfa',
      plano: 'MENSAL',
      status: 'approved',
      valor: 100,
      origem: 'webhook',
      criado_em: '2026-07-22T12:00:00Z',
    }),
  ];

  const emptyFilters = Object.fromEntries(ADMIN_BILLING_FILTER_COLUMNS.map((column) => [column.key, '']));
  assert.deepEqual(processAdminBillingRows(rows, emptyFilters, {}, 'alfa').map((row) => row.id), [1]);
  assert.deepEqual(processAdminBillingRows(rows, { ...emptyFilters, status: 'pendente' }).map((row) => row.id), [2]);
  assert.deepEqual(processAdminBillingRows(rows, emptyFilters, { key: 'valor', order: 'desc' }).map((row) => row.id), [2, 1]);
  assert.deepEqual(processAdminBillingRows(rows, emptyFilters, { key: 'criadoEm', order: 'desc' }).map((row) => row.id), [1, 2]);
  assert.equal(toggleAdminBillingVisibleColumn({ id: true }, 'id').id, true);
  assert.equal(toggleAdminBillingVisibleColumn(ADMIN_BILLING_VISIBLE_COLUMNS, 'origem').origem, false);
  assert.equal(formatAdminBillingFooterLabel(0, 0), '0 cobrança(s)');
  assert.equal(formatAdminBillingFooterLabel(0, 2), '0 de 2 cobrança(s)');
  assert.equal(formatAdminBillingFooterLabel(1, 2, 7), '1 de 2 cobrança(s) - Selecionada #7');
});

test('admin billing route and menu are available in the global ADM shell', () => {
  const billingSection = getAdminSectionByKey('billing');
  const app = source('src/app/App.jsx');
  const adminRoutes = source('src/features/admin/AdminRoutes.jsx');
  const billingPage = source('src/features/admin/billing/BillingPage.jsx');

  assert.equal(billingSection.available, true);
  assert.equal(billingSection.status, null);
  assert.equal(ADMIN_SECTIONS.filter((section) => section.key === 'billing').length, 1);
  assert.match(app, /\/adm\/cobrancas/);
  assert.match(app, /'adm-cobrancas'/);
  assert.match(app, /renderAdminRoutes\('billing'\)/);
  assert.match(adminRoutes, /billing:\s*BillingPage/);
  assert.doesNotMatch(billingPage, /brana-shell-band/);
});

test('admin billing toolbar exposes only refresh, export CSV, details, view account and search', () => {
  const toolbar = source('src/features/admin/billing/components/BillingToolbarContent.jsx');
  const page = source('src/features/admin/billing/BillingPage.jsx');

  assert.match(toolbar, /materiais-estoque-toolbar-actions admin-billing-toolbar-actions/);
  assert.match(toolbar, /className="auxiliary-shell-button primary"/);
  assert.match(toolbar, /Atualizar[\s\S]*Exportar CSV[\s\S]*Ver detalhes[\s\S]*Ver conta/);
  assert.match(toolbar, /Input\.Search/);
  assert.match(toolbar, /Buscar cobrança/);
  assert.match(page, /downloadAdminBillingCsv\(tableState\.rows\)/);
  assert.match(page, /exportDisabled=\{!tableState\.rows\.length \|\| billing\.refreshing\}/);
  assert.match(page, /onAdminNavigate\?\.\('adm-clinicas', \{ selectedClinicId \}\)/);
  assert.match(page, /accountDisabled=\{!selectedBilling \|\| !\(Number\(selectedBilling\?\.clinicaId \|\| 0\) > 0\) \|\| billing\.refreshing\}/);
  assert.doesNotMatch(toolbar, /Checkout|Pix|Boleto|Sincronizar|Cancelar|Estornar/);
  assert.doesNotMatch(toolbar, /from '@ant-design\/icons'/);
});

test('admin billing table remains rendered for real empty results and filtered empty results', () => {
  const page = source('src/features/admin/billing/BillingPage.jsx');
  const table = source('src/features/admin/billing/components/BillingTable.jsx');
  const constants = source('src/features/admin/billing/constants/adminBillingColumns.js');

  assert.match(page, /const emptyText = billing\.rows\.length[\s\S]*Nenhuma cobrança corresponde aos filtros aplicados\.[\s\S]*Nenhuma cobrança encontrada\./);
  assert.match(page, /<BillingTable[\s\S]*rows=\{tableState\.rows\}[\s\S]*emptyText=\{emptyText\}/);
  assert.doesNotMatch(page, /!billing\.error && !billing\.rows\.length \? <BillingEmptyState/);
  assert.doesNotMatch(page, /billing\.rows\.length \? \(\s*<BillingTable/);
  assert.doesNotMatch(page, /BillingEmptyState/);

  assert.match(table, /locale=\{\{ emptyText \}\}/);
  assert.match(table, /footerLabel/);
  assert.match(table, /rowSelection=\{\{[\s\S]*type: 'radio'/);
  assert.match(table, /TableColumnFilterHeader/);
  assert.match(table, /onToggleColumn=\{onToggleVisibleColumn\}/);
  assert.match(table, /onSortAsc=\{\(\) => onSort\?\.\(columnKey, 'asc'\)\}/);

  for (const header of ['ID', 'Clínica', 'Plano', 'Status', 'Valor', 'Origem', 'Data']) {
    assert.match(constants, new RegExp(`label: '${header}'`));
  }
});

test('admin billing visible text uses UTF-8 instead of escaped unicode or mojibake', () => {
  const files = [
    'src/features/admin/billing/BillingPage.jsx',
    'src/features/admin/billing/components/BillingToolbarContent.jsx',
    'src/features/admin/billing/components/BillingLoadingState.jsx',
    'src/features/admin/billing/components/BillingErrorState.jsx',
    'src/features/admin/billing/components/BillingTable.jsx',
    'src/features/admin/billing/constants/adminBillingColumns.js',
    'src/features/admin/billing/services/adminBillingApi.js',
    'src/features/admin/billing/hooks/useAdminBilling.js',
  ].map(source);
  const combined = files.join('\n');

  assert.match(combined, /Cobranças/);
  assert.match(combined, /Clínica/);
  assert.match(combined, /Buscar cobrança/);
  assert.match(combined, /Nenhuma cobrança encontrada\./);
  assert.match(combined, /Nenhuma cobrança corresponde aos filtros aplicados\./);
  assert.match(combined, /última atualização/);
  assert.doesNotMatch(combined, /\\u00/);
  assert.doesNotMatch(combined, /cobran\\u|cobranÃ|ClÃ|NÃ|Ãƒ/);
});

test('admin billing implementation has no mutable financial actions or fake data', () => {
  const files = [
    'src/features/admin/billing/BillingPage.jsx',
    'src/features/admin/billing/components/BillingToolbarContent.jsx',
    'src/features/admin/billing/components/BillingTable.jsx',
    'src/features/admin/billing/services/adminBillingApi.js',
    'src/features/admin/billing/hooks/useAdminBilling.js',
    'src/features/admin/billing/utils/adminBillingCsv.js',
  ].map(source);
  const combined = files.join('\n');

  assert.doesNotMatch(combined, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
  assert.doesNotMatch(combined, /licenca\/checkout|licenca\/sincronizar|superadmin\/assinaturas|Mercado\s*Pago/i);
  assert.doesNotMatch(combined, /payload_json|fake|mock/i);
  assert.doesNotMatch(combined, /\/export|exportar-csv|superadmin\/cobrancas\/export/i);
  assert.doesNotMatch(combined, /Registrar pagamento|Alterar plano|Suspender|Ativar|checkout|webhook/i);
});
