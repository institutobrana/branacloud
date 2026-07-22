import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAdminOverview } from '../src/features/admin/overview/adminOverviewApi.js';
import { normalizeAdminOverview, ADMIN_OVERVIEW_METRICS } from '../src/features/admin/overview/utils/adminOverviewNormalizer.js';
import { formatCurrency, formatInteger, formatLastAccess } from '../src/features/admin/overview/utils/adminOverviewFormatters.js';
import { clearToken, setToken } from '../src/features/auth/authStorage.js';

test('admin overview api calls the real overview endpoint with GET and Bearer token', async () => {
  const calls = [];
  const originalFetch = global.fetch;
  const originalWindow = global.window;
  const storage = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => storage.get(key) || '',
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
  };
  setToken('token-teste');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ total_clinicas: 3 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const data = await getAdminOverview();
    assert.equal(data.total_clinicas, 3);
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/overview$/);
    assert.equal(calls[0].options.method, 'GET');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-teste');
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin overview api rejects when session token is absent', async () => {
  const originalWindow = global.window;
  global.window = {
    localStorage: {
      getItem: () => '',
      setItem: () => {},
      removeItem: () => {},
    },
  };
  clearToken();
  await assert.rejects(
    getAdminOverview(),
    (error) => error.status === 401 && /Sessao expirada/.test(error.message),
  );
  global.window = originalWindow;
});

test('admin overview normalizer preserves backend metrics without inventing formulas', () => {
  const normalized = normalizeAdminOverview({
    total_clinicas: 4,
    total_usuarios: 12,
    mrr_estimado: 1299.9,
    arr_estimado: 15598.8,
    clinicas_ativas: 2,
    clinicas_trial: 1,
    clinicas_expiradas: 1,
    clinicas_suspensas: 0,
    clinicas_sem_usuario: null,
    clinicas_arquivadas: undefined,
    acessos_clinicas: [
      {
        clinica_id: 10,
        clinica_nome: 'Brana',
        responsavel_nome: 'Tel',
        responsavel_email: 'tel@brana.com',
        ultimo_acesso: '2026-07-20T12:30:00Z',
        status: 'online',
      },
    ],
  });

  assert.equal(normalized.metrics.length, 10);
  assert.equal(normalized.metrics.find((item) => item.key === 'mrr_estimado').value, 1299.9);
  assert.equal(normalized.metrics.find((item) => item.key === 'clinicas_sem_usuario').value, null);
  assert.equal(normalized.metrics.find((item) => item.key === 'clinicas_arquivadas').value, null);
  assert.equal(normalized.acessosClinicas.length, 1);
  assert.equal(normalized.acessosClinicas[0].responsavelNome, 'Tel');
  assert.equal(normalized.acessosClinicas[0].hasUltimoAcesso, true);
  assert.equal(normalized.acessosClinicas[0].ultimoAcesso, '2026-07-20T12:30:00Z');
  assert.equal(Object.hasOwn(normalized, ['recent', 'Activity'].join('')), false);
});

test('admin overview labels and table headers keep UTF-8 accents', () => {
  const labels = ADMIN_OVERVIEW_METRICS.map((item) => item.label);
  assert.equal(labels.includes('Total de clínicas'), true);
  assert.equal(labels.includes('Total de usuários'), true);
  assert.equal(labels.includes('Sem usuário'), true);
  assert.equal(labels.some((label) => /cl\?nicas|usu\?rios|usu\?rio/.test(label)), false);

  const table = readFileSync(resolve('frontend-react/src/features/admin/overview/components/OverviewClinicAccessTable.jsx'), 'utf8');
  assert.match(table, /title: 'Clínica'/);
  assert.match(table, /title: 'Usuário responsável'/);
  assert.match(table, /title: 'Último acesso'/);
  assert.match(table, /title: 'Status'/);
  assert.equal(table.includes(['Clínicas', ' e ', 'responsável'].join('')), false);
});

test('admin overview spacing and removed sections stay stable', () => {
  const page = readFileSync(resolve('frontend-react/src/features/admin/overview/OverviewPage.jsx'), 'utf8');
  const css = readFileSync(resolve('frontend-react/src/features/admin/admin.css'), 'utf8');
  const removedComponent = ['Overview', 'Recent', 'Activity.jsx'].join('');
  assert.equal(existsSync(resolve('frontend-react/src/features/admin/overview/components', removedComponent)), false);
  assert.equal(page.includes(['Overview', 'Recent', 'Activity'].join('')), false);
  assert.equal(page.includes(['Atividade', ' recente'].join('')), false);
  assert.match(page, /import '\.\.\/admin\.css';/);
  assert.equal(css.includes(['admin-overview', '-activity'].join('')), false);
  assert.match(page, /className="admin-overview-access-table-wrapper"[\s\S]*<OverviewClinicAccessTable/);
  assert.match(css, /\.admin-overview-metrics-grid\s*\{\s*margin-bottom:\s*0;/);
  assert.match(css, /\.admin-overview-access-table-wrapper\s*\{[\s\S]*width:\s*clamp\(560px,\s*50%,\s*920px\);[\s\S]*margin-top:\s*24px;/);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.admin-overview-access-table-wrapper\s*\{[\s\S]*width:\s*100%;/);
});

test('admin overview status labels are visual-only and accessible', () => {
  const table = readFileSync(resolve('frontend-react/src/features/admin/overview/components/OverviewClinicAccessTable.jsx'), 'utf8');
  assert.match(table, /normalized === 'online'[\s\S]*color="green"[\s\S]*Status Ativo[\s\S]*>Ativo</);
  assert.match(table, /normalized === 'offline'[\s\S]*color="red"[\s\S]*Status Inativo[\s\S]*>Inativo</);
  assert.match(table, /Status Indisponível[\s\S]*>Indisponível</);
  assert.equal(table.includes(`>${['On', 'line'].join('')}<`), false);
  assert.equal(table.includes(`>${['Off', 'line'].join('')}<`), false);
});

test('admin overview formatters keep Brazilian display rules', () => {
  assert.equal(formatInteger(12345), '12.345');
  assert.match(formatCurrency(1299.9), /1\.299,90$/);
  assert.equal(formatInteger(null), '?');
});

test('admin overview formats last access safely', () => {
  assert.equal(formatLastAccess('2026-07-20T12:30:00Z'), '20/07/2026 09:30');
  assert.equal(formatLastAccess(null, true), 'Não registrado');
  assert.equal(formatLastAccess(undefined, false), 'Não disponível');
  assert.equal(formatLastAccess('data-invalida', true), 'Não registrado');
});
