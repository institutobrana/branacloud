import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ADMIN_SECTIONS, getAdminSectionByKey } from '../src/features/admin/adminNavigation.js';
import {
  ADMIN_AUDIT_DEFAULT_LIMIT,
  ADMIN_AUDIT_ENDPOINT,
  buildAdminAuditQuery,
  getAdminAudit,
} from '../src/features/admin/audit/services/adminAuditApi.js';
import {
  normalizeAdminAudit,
  normalizeAdminAuditItem,
} from '../src/features/admin/audit/normalizers/adminAuditNormalizer.js';
import {
  ADMIN_AUDIT_FILTER_COLUMNS,
  ADMIN_AUDIT_VISIBLE_COLUMNS,
  formatAdminAuditFooterLabel,
  processAdminAuditRows,
  toggleAdminAuditVisibleColumn,
} from '../src/features/admin/audit/constants/adminAuditColumns.js';
import {
  formatAdminAuditAction,
  formatAdminAuditActor,
  formatAdminAuditDate,
  formatAdminAuditTarget,
} from '../src/features/admin/audit/utils/adminAuditFormatters.js';
import { ADMIN_AUDIT_CSV_HEADERS, buildAdminAuditCsv } from '../src/features/admin/audit/utils/adminAuditCsv.js';
import { buildAdminAuditDetailsSections } from '../src/features/admin/audit/utils/adminAuditDetails.js';

const sourcePath = (path) => resolve(`frontend-react/${path}`);
const source = (path) => readFileSync(sourcePath(path), 'utf8');

test('admin audit query targets the real read endpoint with the contracted limit', () => {
  const params = buildAdminAuditQuery({ limit: 80 });
  assert.equal(ADMIN_AUDIT_ENDPOINT, '/superadmin/auditoria');
  assert.equal(params.get('limit'), '80');
  assert.equal(buildAdminAuditQuery().get('limit'), String(ADMIN_AUDIT_DEFAULT_LIMIT));
});

test('admin audit API uses authenticated GET only', async () => {
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
      json: async () => [{ id: 1, acao: 'teste', actor_email: 'a@b.com', alvo_tipo: 'clinica', alvo_id: 2 }],
    };
  };

  const payload = await getAdminAudit();
  assert.equal(Array.isArray(payload), true);
  assert.match(requestUrl, /\/superadmin\/auditoria\?/);
  assert.equal(requestOptions.method, 'GET');
  assert.equal(requestOptions.headers.get('Authorization'), 'Bearer token-123');
});

test('admin audit normalizer maps the contracted read fields', () => {
  const row = normalizeAdminAuditItem({
    id: '10',
    actor_user_id: '77',
    actor_email: ' auditor@brana.test ',
    acao: 'clinica_status_update',
    alvo_tipo: 'clinica',
    alvo_id: '42',
    detalhes_json: { status: 'Ativo' },
    ip: '127.0.0.1',
    criado_em: '2026-07-23T12:00:00Z',
  });

  assert.equal(row.id, 10);
  assert.equal(row.actorUserId, 77);
  assert.equal(row.actorEmail, 'auditor@brana.test');
  assert.equal(row.acao, 'clinica_status_update');
  assert.equal(row.alvoTipo, 'clinica');
  assert.equal(row.alvoId, 42);
  assert.equal(row.ip, '127.0.0.1');
  assert.equal(normalizeAdminAudit([row]).totalFromBackend, 1);
});

test('admin audit formatters keep read-only event data legible', () => {
  assert.equal(formatAdminAuditAction('clinica_status_update'), 'clinica_status_update');
  assert.equal(formatAdminAuditActor('gleisson@brana.test'), 'gleisson@brana.test');
  assert.equal(formatAdminAuditTarget('clinica', 42), 'clinica #42');
  assert.match(formatAdminAuditDate('2026-07-23T12:00:00Z'), /23\/07\/2026/);
});

test('admin audit table state supports local search, filters, sorting, visible columns and footer', () => {
  const rows = [
    normalizeAdminAuditItem({
      id: 2,
      actor_email: 'beta@brana.test',
      acao: 'usuario_status_update',
      alvo_tipo: 'usuario',
      alvo_id: 20,
      criado_em: '2026-07-22T12:00:00Z',
    }),
    normalizeAdminAuditItem({
      id: 1,
      actor_email: 'alfa@brana.test',
      acao: 'clinica_plano_update',
      alvo_tipo: 'clinica',
      alvo_id: 10,
      criado_em: '2026-07-23T12:00:00Z',
    }),
  ];

  const emptyFilters = Object.fromEntries(ADMIN_AUDIT_FILTER_COLUMNS.map((column) => [column.key, '']));
  assert.deepEqual(processAdminAuditRows(rows, emptyFilters, {}, 'alfa').map((row) => row.id), [1]);
  assert.deepEqual(processAdminAuditRows(rows, { ...emptyFilters, acao: 'plano' }).map((row) => row.id), [1]);
  assert.deepEqual(processAdminAuditRows(rows, emptyFilters, { key: 'criadoEm', order: 'desc' }).map((row) => row.id), [1, 2]);
  assert.equal(toggleAdminAuditVisibleColumn({ id: true }, 'id').id, true);
  assert.equal(toggleAdminAuditVisibleColumn(ADMIN_AUDIT_VISIBLE_COLUMNS, 'alvo').alvo, false);
  assert.equal(formatAdminAuditFooterLabel(0, 0), '0 evento(s)');
  assert.equal(formatAdminAuditFooterLabel(0, 2), '0 de 2 evento(s)');
  assert.equal(formatAdminAuditFooterLabel(1, 2, 7), '1 de 2 evento(s) - Selecionado #7');
});

test('admin audit route and menu are available in the global ADM shell', () => {
  const auditSection = getAdminSectionByKey('audit');
  const app = source('src/app/App.jsx');
  const adminRoutes = source('src/features/admin/AdminRoutes.jsx');
  const auditPage = source('src/features/admin/audit/AuditPage.jsx');

  assert.equal(auditSection.available, true);
  assert.equal(auditSection.status, null);
  assert.equal(ADMIN_SECTIONS.filter((section) => section.key === 'audit').length, 1);
  assert.match(app, /\/adm\/auditoria/);
  assert.match(app, /'adm-auditoria'/);
  assert.match(app, /renderAdminRoutes\('audit'\)/);
  assert.match(adminRoutes, /audit:\s*AuditPage/);
  assert.match(auditPage, /AuditToolbarContent/);
  assert.match(auditPage, /AuditTable/);
});

test('admin audit toolbar exposes refresh, export CSV, details and search only', () => {
  const toolbar = source('src/features/admin/audit/components/AuditToolbarContent.jsx');
  const page = source('src/features/admin/audit/AuditPage.jsx');

  assert.match(toolbar, /Atualizar[\s\S]*Exportar CSV[\s\S]*Ver detalhes[\s\S]*Buscar evento/);
  assert.match(toolbar, /className="auxiliary-shell-button primary"/);
  assert.match(toolbar, /Input\.Search/);
  assert.doesNotMatch(toolbar, /Ver conta|Checkout|Pix|Boleto/i);
  assert.doesNotMatch(toolbar, /from '@ant-design\/icons'/);
  assert.match(page, /AuditTable/);
  assert.match(page, /AuditDetailsModal/);
  assert.match(page, /emptyText=\{emptyText\}/);
});

test('admin audit CSV is generated client-side from loaded rows', () => {
  const row = normalizeAdminAuditItem({
    id: 7,
    actor_email: 'auditor@brana.test',
    acao: 'clinica_status_update',
    alvo_tipo: 'clinica',
    alvo_id: 15,
    criado_em: '2026-07-23T12:00:00Z',
  });
  const csv = buildAdminAuditCsv([row]);

  assert.equal(ADMIN_AUDIT_CSV_HEADERS.join(';'), 'ID;Data;Ação;Autor;Alvo');
  assert.match(csv, /^\uFEFFID;Data;Ação;Autor;Alvo/);
  assert.match(csv, /7;23\/07\/2026/);
  assert.match(csv, /clinica_status_update/);
  assert.match(csv, /auditor@brana.test/);
  assert.match(csv, /clinica #15/);
});

test('admin audit details are built from a strict whitelist and hide raw payloads', () => {
  const sections = buildAdminAuditDetailsSections({
    id: 7,
    actorUserId: 99,
    actorEmail: 'auditor@brana.test',
    acao: 'clinica_status_update',
    alvoTipo: 'clinica',
    alvoId: 15,
    detalhesJson: {
      status: 'Ativo',
      plano: 'Mensal',
      mensagem: 'Atualizado com sucesso',
      token: 'secret',
      payload_json: { hidden: true },
      clinic_id: 99,
    },
    ip: '127.0.0.1',
    criadoEm: '2026-07-23T12:00:00Z',
  });

  const labels = sections.flatMap((section) => section.items.map((item) => item.label));

  assert.equal(sections[0].title, 'Evento');
  assert.equal(sections[1].title, 'Autor');
  assert.equal(sections[2].title, 'Alvo');
  assert.equal(sections[3].title, 'Contexto seguro');
  assert.match(labels.join(' '), /Status/);
  assert.match(labels.join(' '), /Plano/);
  assert.match(labels.join(' '), /Mensagem/);
  assert.doesNotMatch(labels.join(' '), /Token|Payload|Before|After|Authorization|Senha/i);
  assert.doesNotMatch(sections.flatMap((section) => section.items.map((item) => String(item.value))).join(' '), /secret|hidden|clinic_id/i);
});

test('admin audit implementation has no mutable actions or fake data', () => {
  const files = [
    'src/features/admin/audit/AuditPage.jsx',
    'src/features/admin/audit/components/AuditToolbarContent.jsx',
    'src/features/admin/audit/components/AuditTable.jsx',
    'src/features/admin/audit/services/adminAuditApi.js',
    'src/features/admin/audit/hooks/useAdminAudit.js',
  ].map(source);
  const combined = files.join('\n');

  assert.doesNotMatch(combined, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
  assert.doesNotMatch(combined, /superadmin\/auditoria\/export|Ver conta/i);
  assert.doesNotMatch(combined, /fake|mock|payload_json/i);
  assert.doesNotMatch(combined, /Registrar|Alterar|Excluir|Checkout|webhook|Sincronizar/i);
});
