import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ADMIN_USERS_EXPORT_DEFAULT_LIMIT,
  ADMIN_USERS_EXPORT_ENDPOINT,
  exportAdminUsersCsv,
  getAdminUsersCsvFileName,
  isAdminUsersCsvContentType,
} from '../src/features/admin/users/services/adminUsersApi.js';
import {
  buildAdminUsersCsvFallbackFileName,
  downloadAdminUsersCsv,
  sanitizeAdminUsersCsvFileName,
} from '../src/features/admin/users/utils/adminUsersCsvDownload.js';

const sourcePath = (path) => resolve(`frontend-react/${path}`);
const source = (path) => readFileSync(sourcePath(path), 'utf8');

test('admin users CSV export uses authenticated GET with current backend search only', async () => {
  globalThis.window = {
    localStorage: {
      getItem: (key) => (key === 'brana_token' ? 'token-456' : null),
    },
  };
  globalThis.localStorage = {
    getItem: (key) => (key === 'auth_token' || key === 'brana_token' ? 'token-456' : null),
  };

  let requestUrl = '';
  let requestOptions = null;
  const csvBlob = new Blob(['usuario_id;nome\n1;Ana\n'], { type: 'text/csv;charset=utf-8' });
  globalThis.fetch = async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return {
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="usuarios_plataforma_20260721_120000.csv"',
      }),
      blob: async () => csvBlob,
    };
  };

  const result = await exportAdminUsersCsv({ q: ' Ana ' });

  assert.equal(ADMIN_USERS_EXPORT_ENDPOINT, '/superadmin/usuarios/export.csv');
  assert.equal(ADMIN_USERS_EXPORT_DEFAULT_LIMIT, 5000);
  assert.match(requestUrl, /\/superadmin\/usuarios\/export\.csv\?/);
  assert.match(requestUrl, /q=Ana/);
  assert.match(requestUrl, /limit=5000/);
  assert.equal(requestOptions.method, 'GET');
  assert.equal(requestOptions.headers.get('Authorization'), 'Bearer token-456');
  assert.equal(result.blob, csvBlob);
  assert.equal(result.fileName, 'usuarios_plataforma_20260721_120000.csv');
});

test('admin users CSV export rejects invalid content and empty files', async () => {
  globalThis.window = { localStorage: { getItem: () => 'token-789' } };
  globalThis.localStorage = { getItem: () => 'token-789' };

  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
    blob: async () => new Blob(['<html>erro</html>'], { type: 'text/html' }),
  });
  await assert.rejects(() => exportAdminUsersCsv(), /Resposta invalida/);

  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'text/csv; charset=utf-8' }),
    blob: async () => new Blob([], { type: 'text/csv' }),
  });
  await assert.rejects(() => exportAdminUsersCsv(), /vazio/);
});

test('admin users CSV export surfaces backend errors without parsing CSV bodies', async () => {
  globalThis.window = { localStorage: { getItem: () => 'token-789' } };
  globalThis.localStorage = { getItem: () => 'token-789' };

  globalThis.fetch = async () => ({
    ok: false,
    status: 403,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ detail: 'Acesso restrito ao ADM.' }),
  });

  await assert.rejects(() => exportAdminUsersCsv(), /Acesso restrito ao ADM/);
});

test('admin users CSV filename parsing, content type and browser download are safe', () => {
  const fixedDate = new Date('2026-07-21T12:00:00.000Z');
  assert.equal(buildAdminUsersCsvFallbackFileName(fixedDate), 'usuarios-adm-2026-07-21.csv');
  assert.equal(getAdminUsersCsvFileName('attachment; filename="usuarios.csv"'), 'usuarios.csv');
  assert.equal(getAdminUsersCsvFileName("attachment; filename*=UTF-8''usuarios%20adm.csv"), 'usuarios adm.csv');
  assert.equal(isAdminUsersCsvContentType('text/csv; charset=utf-8'), true);
  assert.equal(isAdminUsersCsvContentType('text/html; charset=utf-8'), false);
  assert.equal(sanitizeAdminUsersCsvFileName('../relatorio.html', fixedDate), 'usuarios-adm-2026-07-21.csv');
  assert.equal(sanitizeAdminUsersCsvFileName('usuarios:adm.csv', fixedDate), 'usuarios-adm.csv');

  let clicked = 0;
  let appended = false;
  let removed = false;
  let revoked = '';
  const link = {
    style: {},
    click: () => {
      clicked += 1;
    },
    remove: () => {
      removed = true;
    },
  };
  const documentRef = {
    body: {
      appendChild: (node) => {
        appended = node === link;
      },
    },
    createElement: (tag) => {
      assert.equal(tag, 'a');
      return link;
    },
  };
  const urlRef = {
    createObjectURL: (blob) => {
      assert.equal(blob.size, 8);
      return 'blob:usuarios';
    },
    revokeObjectURL: (url) => {
      revoked = url;
    },
  };

  const downloaded = downloadAdminUsersCsv({
    blob: new Blob(['id;nome\n'], { type: 'text/csv' }),
    fileName: 'usuarios.csv',
    documentRef,
    urlRef,
    date: fixedDate,
  });

  assert.equal(downloaded, 'usuarios.csv');
  assert.equal(link.download, 'usuarios.csv');
  assert.equal(link.href, 'blob:usuarios');
  assert.equal(clicked, 1);
  assert.equal(appended, true);
  assert.equal(removed, true);
  assert.equal(revoked, 'blob:usuarios');
});

test('admin users toolbar keeps read-only order and export preserves table state', () => {
  const toolbar = source('src/features/admin/users/components/UsersToolbarContent.jsx');
  const usersPage = source('src/features/admin/users/UsersPage.jsx');
  const exportHook = source('src/features/admin/users/hooks/useExportAdminUsersCsv.js');
  const service = source('src/features/admin/users/services/adminUsersApi.js');
  const combined = [toolbar, usersPage, exportHook, service].join('\n');

  assert.ok(toolbar.indexOf('Atualizar') < toolbar.indexOf('Exportar CSV'));
  assert.ok(toolbar.indexOf('Exportar CSV') < toolbar.indexOf('Buscar usuário'));
  assert.match(toolbar, /className="auxiliary-shell-button"/);
  assert.match(toolbar, /aria-busy=\{exporting\}/);
  assert.match(toolbar, /disabled=\{exporting\}/);
  assert.doesNotMatch(toolbar, /Button size=/);
  assert.match(usersPage, /exportCsv\(\{ q: users\.query \}\)/);
  const exportHandler = usersPage.slice(usersPage.indexOf('const handleExportCsv'), usersPage.indexOf('const toolbar'));
  assert.doesNotMatch(exportHandler, /setSelectedId|setSortState|applyFilter|clearFilter|refresh\(/);
  assert.match(exportHook, /exportingRef\.current/);
  assert.match(exportHook, /if \(exportingRef\.current\) return null/);
  assert.doesNotMatch(combined, /Novo usuario|Novo administrador|Alterar|Ativar|Inativar|Redefinir senha|Excluir|Salvar|Editar/);
  assert.doesNotMatch(combined, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
  assert.doesNotMatch(combined, /window\.(alert|confirm|prompt)|console\.log/);
  assert.doesNotMatch(combined, /token=.*|access_token/);
});
