import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ADMIN_USERS_DEFAULT_LIMIT,
  ADMIN_USERS_ENDPOINT,
  buildAdminUsersQuery,
  getAdminUsers,
} from '../src/features/admin/users/services/adminUsersApi.js';
import {
  normalizeAdminUser,
  normalizeAdminUsers,
} from '../src/features/admin/users/normalizers/adminUsersNormalizer.js';
import {
  ADMIN_USERS_FILTER_COLUMNS,
  ADMIN_USERS_VISIBLE_COLUMNS,
  formatAdminUsersFooterLabel,
  processAdminUsersRows,
  toggleAdminUserVisibleColumn,
} from '../src/features/admin/users/constants/adminUsersColumns.js';
import {
  formatAdminUserPresence,
  formatAdminUserPresenceTooltip,
} from '../src/features/admin/users/utils/adminUsersFormatters.js';
import { ADMIN_SECTIONS, getAdminSectionByKey } from '../src/features/admin/adminNavigation.js';

const sourcePath = (path) => resolve(`frontend-react/${path}`);
const source = (path) => readFileSync(sourcePath(path), 'utf8');

test('admin users query targets the real read endpoint with search and limit', () => {
  const params = buildAdminUsersQuery({ q: ' ana ', limit: 25 });
  assert.equal(ADMIN_USERS_ENDPOINT, '/superadmin/usuarios');
  assert.equal(params.get('q'), 'ana');
  assert.equal(params.get('limit'), '25');
  assert.equal(buildAdminUsersQuery().get('limit'), String(ADMIN_USERS_DEFAULT_LIMIT));
});

test('admin users API uses authenticated GET only', async () => {
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
      json: async () => [{ id: 1, nome: 'Ana', email: 'ana@local.test' }],
    };
  };

  const payload = await getAdminUsers({ q: 'Ana' });
  assert.equal(Array.isArray(payload), true);
  assert.match(requestUrl, /\/superadmin\/usuarios\?/);
  assert.match(requestUrl, /q=Ana/);
  assert.equal(requestOptions.method, 'GET');
  assert.equal(requestOptions.headers.get('Authorization'), 'Bearer token-123');

  const service = source('src/features/admin/users/services/adminUsersApi.js');
  assert.doesNotMatch(service, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
});

test('admin users API rejects missing token without calling fetch', async () => {
  globalThis.window = { localStorage: { getItem: () => null } };
  globalThis.localStorage = { getItem: () => null };
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return { ok: true, json: async () => [] };
  };

  await assert.rejects(() => getAdminUsers(), /Sessão expirada/);
  assert.equal(called, false);
});

test('admin users normalizer maps backend fields without inventing setup status', () => {
  const row = normalizeAdminUser({
    id: 7,
    nome: '  Usuário Teste ',
    email: 'u@local.test',
    ativo: true,
    is_admin: false,
    is_owner_account: true,
    is_system_user: true,
    last_seen_at: '2026-07-22T12:00:00+00:00',
    is_online: true,
    clinica_id: 42,
    clinica_nome: 'Clínica Local',
    clinica_plano: 'SUPERADMIN',
    clinica_trial_ate: '2026-12-31',
  });

  assert.equal(row.id, 7);
  assert.equal(row.nome, 'Usuário Teste');
  assert.equal(row.clinicaId, 42);
  assert.equal(row.isAdmin, false);
  assert.equal(row.isOwnerAccount, true);
  assert.equal(row.isSystemUser, true);
  assert.equal(row.lastSeenAt, null);
  assert.equal(row.isOnline, false);
  assert.equal(row.setupCompleted, null);
  assert.equal(normalizeAdminUsers([row]).totalFromBackend, 1);
});

test('admin users online column replaces protection column in the main table', () => {
  const table = source('src/features/admin/users/components/UsersTable.jsx');
  const constants = source('src/features/admin/users/constants/adminUsersColumns.js');
  const onlineIndex = ADMIN_USERS_FILTER_COLUMNS.findIndex((column) => column.key === 'online');
  const statusIndex = ADMIN_USERS_FILTER_COLUMNS.findIndex((column) => column.key === 'status');
  const protectionIndex = ADMIN_USERS_FILTER_COLUMNS.findIndex((column) => column.key === 'protecao');

  assert.equal(onlineIndex, statusIndex + 1);
  assert.equal(protectionIndex, -1);
  assert.equal(ADMIN_USERS_VISIBLE_COLUMNS.online, true);
  assert.equal('protecao' in ADMIN_USERS_VISIBLE_COLUMNS, false);
  assert.match(table, /renderHeader\('online', 'Online'\)/);
  assert.match(table, /formatAdminUserPresenceTooltip/);
  assert.doesNotMatch(table, /renderHeader\('protecao'/);
  assert.doesNotMatch(constants, /key:\s*'protecao'/);
});

test('admin users presence labels, filter and sorting use backend presence fields', () => {
  const rows = [
    normalizeAdminUser({ id: 1, nome: 'Online', last_seen_at: '2026-07-22T12:05:00Z', is_online: true }),
    normalizeAdminUser({ id: 2, nome: 'Offline', last_seen_at: '2026-07-22T11:00:00Z', is_online: false }),
    normalizeAdminUser({ id: 3, nome: 'Never', last_seen_at: null, is_online: false }),
    normalizeAdminUser({ id: 4, nome: 'Sistema', is_system_user: true, last_seen_at: '2026-07-22T12:05:00Z', is_online: true }),
  ];

  assert.equal(formatAdminUserPresence(rows[0]), 'Online');
  assert.equal(formatAdminUserPresence(rows[1]), 'Offline');
  assert.equal(formatAdminUserPresence(rows[2]), 'Nunca acessou');
  assert.equal(formatAdminUserPresence(rows[3]), 'Não aplicável');
  assert.match(formatAdminUserPresenceTooltip(rows[0]), /Última atividade:/);
  assert.equal(formatAdminUserPresenceTooltip(rows[2]), 'Sem atividade registrada');
  assert.equal(formatAdminUserPresenceTooltip(rows[3]), 'Usuário sistêmico sem sessão interativa');
  assert.deepEqual(processAdminUsersRows(rows, { online: 'offline' }).map((row) => row.id), [2]);
  assert.deepEqual(processAdminUsersRows(rows, {}, { key: 'online', order: 'desc' }).map((row) => row.id), [1, 2, 3, 4]);
});

test('admin users table state supports filters, sorting, visible columns and footer', () => {
  const rows = [
    normalizeAdminUser({ id: 2, nome: 'Bruno', email: 'b@test', ativo: false, is_admin: false, clinica_nome: 'Beta' }),
    normalizeAdminUser({ id: 1, nome: 'Ana', email: 'a@test', ativo: true, is_admin: true, clinica_nome: 'Alfa' }),
  ];

  assert.deepEqual(
    processAdminUsersRows(rows, { ...Object.fromEntries(ADMIN_USERS_FILTER_COLUMNS.map((c) => [c.key, ''])), perfil: 'administrador' }).map(
      (row) => row.id,
    ),
    [1],
  );
  assert.deepEqual(processAdminUsersRows(rows, {}, { key: 'nome', order: 'desc' }).map((row) => row.id), [2, 1]);
  assert.equal(toggleAdminUserVisibleColumn({ id: true }, 'id').id, true);
  assert.equal(toggleAdminUserVisibleColumn(ADMIN_USERS_VISIBLE_COLUMNS, 'trialAte').trialAte, true);
  assert.equal(formatAdminUsersFooterLabel(1, 2, 7), '1 de 2 usuário(s) · Selecionado #7');
});

test('admin users navigation and route are available without local shell band', () => {
  const usersSection = getAdminSectionByKey('users');
  const usersPage = source('src/features/admin/users/UsersPage.jsx');
  const app = source('src/app/App.jsx');

  assert.equal(usersSection.available, true);
  assert.equal(usersSection.status, null);
  assert.equal(ADMIN_SECTIONS.filter((section) => section.key === 'users').length, 1);
  assert.match(app, /'adm-usuarios'/);
  assert.match(app, /renderAdminRoutes\('users'\)/);
  assert.match(app, /className="brana-shell-band auxiliary-shell-band admin-shell-band"/);
  assert.doesNotMatch(usersPage, /brana-shell-band/);
});

test('admin users toolbar follows shared auxiliary shell visual contract', () => {
  const toolbar = source('src/features/admin/users/components/UsersToolbarContent.jsx');
  const usersPage = source('src/features/admin/users/UsersPage.jsx');
  const adminCss = source('src/features/admin/admin.css');

  assert.match(toolbar, /materiais-estoque-toolbar-actions admin-users-toolbar-actions/);
  assert.match(toolbar, /className="auxiliary-shell-button primary"/);
  assert.match(toolbar, /className="auxiliary-shell-button"/);
  assert.match(toolbar, /Ver detalhes[\s\S]*Ver conta[\s\S]*Input\.Search/);
  assert.match(toolbar, /Input\.Search/);
  assert.doesNotMatch(toolbar, /from '@ant-design\/icons'/);
  assert.doesNotMatch(toolbar, /Button size=/);
  assert.doesNotMatch(toolbar, /ReloadOutlined|DownloadOutlined|EyeOutlined|SearchOutlined/);
  assert.match(usersPage, /users\.rows\.find\(\(row\) => Number\(row\.id\) === Number\(users\.selectedId\)\)/);
  assert.match(usersPage, /detailsDisabled=\{!selectedUser\}/);
  assert.match(usersPage, /accountDisabled=\{!selectedUser \|\| !\(Number\(selectedUser\?\.clinicaId \|\| 0\) > 0\) \|\| users\.refreshing\}/);
  assert.match(usersPage, /onAdminNavigate\?\.\('adm-clinicas', \{ selectedClinicId \}\)/);
  assert.match(usersPage, /const selectedClinicId = Number\(selectedUser\?\.clinicaId \|\| 0\) \|\| 0/);
  assert.doesNotMatch(usersPage, /clinicaNome|clinicaEmail|window\.location|location\.href|window\.open/);
  assert.match(adminCss, /\.admin-users-toolbar-actions \.auxiliary-shell-button:disabled/);
  assert.match(adminCss, /\.admin-users-toolbar-actions \.auxiliary-shell-button:focus-visible/);
});

test('admin users implementation has no future write actions or dead mutable UI', () => {
  const files = [
    'src/features/admin/users/UsersPage.jsx',
    'src/features/admin/users/components/UsersToolbarContent.jsx',
    'src/features/admin/users/components/UsersTable.jsx',
    'src/features/admin/users/services/adminUsersApi.js',
    'src/features/admin/users/hooks/useAdminUsers.js',
  ].map(source);
  const combined = files.join('\n');

  assert.doesNotMatch(combined, /Novo usuário|Alterar|Ativar|Inativar|Reset|Excluir|Ações|Salvar|Editar/);
  assert.doesNotMatch(combined, /window\.(alert|confirm|prompt)|console\.log/);
  assert.doesNotMatch(combined, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
  assert.doesNotMatch(combined, /mock|fake/i);
});
