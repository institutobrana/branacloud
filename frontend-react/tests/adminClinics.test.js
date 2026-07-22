import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canAccessPlatformAdmin } from '../src/features/admin/adminAccess.js';
import { getAdminClinics, buildAdminClinicsQuery } from '../src/features/admin/clinics/services/adminClinicsApi.js';
import {
  ADMIN_CLINIC_TRIAL_EXTRA_INITIAL_DAYS,
  ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS,
  ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS,
  ADMIN_CLINIC_DEMO_PLAN,
  ADMIN_CLINIC_MONTHLY_PLAN,
  ADMIN_CLINIC_ANNUAL_PLAN,
  ADMIN_CLINIC_SUPER_ADMIN_PLAN,
  ADMIN_CLINIC_NEW_ACCOUNT_PASSWORD_MIN_LENGTH,
  createAdminClinicAccount,
  extendAdminClinicTrial,
  normalizeNewClinicAccountPayload,
  normalizeTrialExtraDays,
  setAdminClinicDemo,
  setAdminClinicMonthlyPlan,
  setAdminClinicAnnualPlan,
  setAdminClinicSuperAdminPlan,
  updateAdminClinicStatus,
} from '../src/features/admin/clinics/services/adminClinicActionsApi.js';
import { normalizeAdminClinics } from '../src/features/admin/clinics/utils/adminClinicsNormalizer.js';
import { formatClinicDate, formatClinicStatus, formatClinicUsers, normalizePlanLabel } from '../src/features/admin/clinics/utils/adminClinicsFormatters.js';
import {
  ADMIN_CLINICS_EMPTY_FILTERS,
  ADMIN_CLINICS_FILTER_COLUMNS,
  ADMIN_CLINICS_TABLE_SCROLL_Y,
  ADMIN_CLINICS_VISIBLE_COLUMNS,
  filterAdminClinics,
  formatAdminClinicsFooterLabel,
  processAdminClinicsRows,
  sortAdminClinics,
  toggleAdminClinicVisibleColumn,
} from '../src/features/admin/clinics/utils/adminClinicsTable.js';
import { clearToken, setToken } from '../src/features/auth/authStorage.js';

const testDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(testDir, '..');
const clinicsRoot = resolve(frontendRoot, 'src/features/admin/clinics');
const toolbarPath = resolve(clinicsRoot, 'components/ClinicsToolbarContent.jsx');
const pagePath = resolve(clinicsRoot, 'ClinicsPage.jsx');
const hookPath = resolve(clinicsRoot, 'hooks/useAdminClinics.js');
const servicePath = resolve(clinicsRoot, 'services/adminClinicsApi.js');
const cssPath = resolve(frontendRoot, 'src/features/admin/admin.css');

test('admin clinics api calls the real clinics endpoint with GET and Bearer token', async () => {
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
  setToken('token-clinicas');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify([{ id: 1, nome: 'Brana' }]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const data = await getAdminClinics({ q: 'brana', limit: 50 });
    assert.equal(data.length, 1);
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\?/);
    assert.match(String(calls[0].url), /q=brana/);
    assert.match(String(calls[0].url), /limit=50/);
    assert.equal(calls[0].options.method, 'GET');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-clinicas');
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinics supports read-only navigation target from ADM users by clinic id', () => {
  const page = readFileSync(pagePath, 'utf8');
  const tableHook = readFileSync(resolve(clinicsRoot, 'hooks/useClinicsTableState.js'), 'utf8');
  const service = readFileSync(servicePath, 'utf8');
  const app = readFileSync(resolve(frontendRoot, 'src/app/App.jsx'), 'utf8');
  const routes = readFileSync(resolve(frontendRoot, 'src/features/admin/AdminRoutes.jsx'), 'utf8');

  assert.match(app, /adminNavigationState/);
  assert.match(app, /handleAdminNavigate/);
  assert.match(app, /onAdminNavigate=\{handleAdminNavigate\}/);
  assert.match(app, /onConsumeNavigationState=\{handleConsumeAdminNavigationState\}/);
  assert.match(routes, /navigationState = null/);
  assert.match(routes, /onAdminNavigate = null/);
  assert.match(page, /selectedClinicIdFromUsers = Number\(navigationState\?\.selectedClinicId \|\| 0\) \|\| null/);
  assert.match(page, /clinics\.rows\.find\(\(row\) => Number\(row\.id\) === Number\(selectedClinicIdFromUsers\)\)/);
  assert.match(page, /tableState\.rows\.some\(\(row\) => Number\(row\.id\) === Number\(selectedClinicIdFromUsers\)\)/);
  assert.match(page, /tableState\.clearFilters\(\)/);
  assert.match(page, /clinics\.setSelectedId\(Number\(selectedClinicIdFromUsers\)\)/);
  assert.match(page, /A conta vinculada a este usu(?:Ã¡|ário)rio n(?:Ã£|ã)o foi encontrada\./);
  assert.match(page, /clinics\.setSelectedId\(null\)/);
  assert.match(page, /onConsumeNavigationState\?\.\(\)/);
  assert.doesNotMatch(page, /window\.location|window\.open|location\.href/);
  assert.match(tableHook, /clearFilters/);
  assert.match(tableHook, /setFilters\(ADMIN_CLINICS_EMPTY_FILTERS\)/);
  assert.match(service, /ADMIN_CLINICS_DEFAULT_LIMIT = 1000/);
});

test('admin clinics api rejects without token and never writes data', async () => {
  const originalWindow = global.window;
  global.window = {
    localStorage: {
      getItem: () => '',
      setItem: () => {},
      removeItem: () => {},
    },
  };
  clearToken();
  await assert.rejects(getAdminClinics(), (error) => error.status === 401 && /Sess/.test(error.message));
  global.window = originalWindow;

  const service = readFileSync(servicePath, 'utf8');
  assert.doesNotMatch(service, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
});

test('admin clinic trial extension action uses legacy PATCH endpoint with Bearer token', async () => {
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
  setToken('token-trial');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ detail: 'Teste prorrogado por 10 dias.', dias: 10 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const data = await extendAdminClinicTrial(42, 10);
    assert.equal(data.dias, 10);
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/42\/trial-extra$/);
    assert.equal(calls[0].options.method, 'PATCH');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-trial');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { dias: 10 });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic trial extension validates integer days before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    assert.equal(ADMIN_CLINIC_TRIAL_EXTRA_INITIAL_DAYS, 10);
    assert.equal(ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS, 1);
    assert.equal(ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS, 3650);
    assert.equal(normalizeTrialExtraDays(1), 1);
    assert.equal(normalizeTrialExtraDays(3650), 3650);
    assert.throws(() => normalizeTrialExtraDays(''), /inteira/);
    assert.throws(() => normalizeTrialExtraDays(1.5), /inteira/);
    assert.throws(() => normalizeTrialExtraDays(0), /entre 1 e 3650/);
    assert.throws(() => normalizeTrialExtraDays(3651), /entre 1 e 3650/);
    await assert.rejects(extendAdminClinicTrial(0, 10), /clínica válida/);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinic status action uses legacy PATCH endpoint with Bearer token', async () => {
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
  setToken('token-status');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ detail: 'Status da clinica atualizado.', ativo: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const data = await updateAdminClinicStatus({ clinicId: 42, ativo: false, motivo: 'inadimplencia' });
    assert.equal(data.ativo, false);
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/42\/status$/);
    assert.equal(calls[0].options.method, 'PATCH');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-status');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { ativo: false, motivo: 'inadimplencia' });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic status action validates id, status and optional reason before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    await assert.rejects(updateAdminClinicStatus({ clinicId: 0, ativo: false }), /cl.nica v.lida/);
    await assert.rejects(updateAdminClinicStatus({ clinicId: 1, ativo: 'false' }), /status da cl.nica/);
    await assert.rejects(updateAdminClinicStatus({ clinicId: 1, ativo: false, motivo: 'x'.repeat(501) }), /500/);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinic demo action uses legacy plan PATCH endpoint with Bearer token', async () => {
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
  setToken('token-demo');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        detail: 'Plano da clinica atualizado.',
        plano: 'DEMO',
        tipo_conta: 'DEMO 7 dias',
        ativo: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };

  try {
    const data = await setAdminClinicDemo({ clinicId: 42 });
    assert.equal(ADMIN_CLINIC_DEMO_PLAN, 'DEMO');
    assert.equal(data.plano, 'DEMO');
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/42\/plano$/);
    assert.equal(calls[0].options.method, 'PATCH');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-demo');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { plano: 'DEMO', manter_ativo: true });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic demo action validates id before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    await assert.rejects(setAdminClinicDemo({ clinicId: 0 }), /cl.nica v.lida/);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinic monthly action uses legacy plan PATCH endpoint with Bearer token', async () => {
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
  setToken('token-monthly');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        detail: 'Plano da clinica atualizado.',
        plano: 'MENSAL',
        tipo_conta: 'Mensal',
        ativo: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };

  try {
    const data = await setAdminClinicMonthlyPlan({ clinicId: 42 });
    assert.equal(ADMIN_CLINIC_MONTHLY_PLAN, 'MENSAL');
    assert.equal(data.plano, 'MENSAL');
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/42\/plano$/);
    assert.equal(calls[0].options.method, 'PATCH');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-monthly');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { plano: 'MENSAL', manter_ativo: true });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic monthly action validates id before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    await assert.rejects(setAdminClinicMonthlyPlan({ clinicId: 0 }), /cl.nica v.lida/);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinic annual action uses legacy plan PATCH endpoint with Bearer token', async () => {
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
  setToken('token-annual');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        detail: 'Plano da clinica atualizado.',
        plano: 'ANUAL',
        tipo_conta: 'Anual',
        ativo: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };

  try {
    const data = await setAdminClinicAnnualPlan({ clinicId: 42 });
    assert.equal(ADMIN_CLINIC_ANNUAL_PLAN, 'ANUAL');
    assert.equal(data.plano, 'ANUAL');
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/42\/plano$/);
    assert.equal(calls[0].options.method, 'PATCH');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-annual');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { plano: 'ANUAL', manter_ativo: true });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic annual action validates id before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    await assert.rejects(setAdminClinicAnnualPlan({ clinicId: 0 }), /cl.nica v.lida/);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinic super admin action uses legacy plan PATCH endpoint with Bearer token', async () => {
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
  setToken('token-super-admin');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        detail: 'Plano da clinica atualizado.',
        plano: 'SUPERADMIN',
        tipo_conta: 'Super Admin',
        ativo: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };

  try {
    const data = await setAdminClinicSuperAdminPlan({ clinicId: 42 });
    assert.equal(ADMIN_CLINIC_SUPER_ADMIN_PLAN, 'SUPERADMIN');
    assert.equal(data.plano, 'SUPERADMIN');
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/42\/plano$/);
    assert.equal(calls[0].options.method, 'PATCH');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-super-admin');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), { plano: 'SUPERADMIN', manter_ativo: true });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic super admin action validates id before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    await assert.rejects(setAdminClinicSuperAdminPlan({ clinicId: 0 }), /cl.nica v.lida/);
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinic new account action uses owner-only POST endpoint with Bearer token', async () => {
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
  setToken('token-owner');
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        detail: 'Conta criada com sucesso.',
        clinica_id: 178,
        admin_user_id: 390,
        admin_setup_completed: false,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };

  try {
    const data = await createAdminClinicAccount({
      nomeClinica: 'Clínica Nova',
      adminNome: 'Admin Nova',
      adminEmail: 'ADMIN.NOVA@LOCAL.BRANA.TEST',
      adminSenha: 'BranaTeste@2026',
      adminConfirmaSenha: 'BranaTeste@2026',
    });
    assert.equal(data.clinica_id, 178);
    assert.equal(data.admin_setup_completed, false);
    assert.equal(calls.length, 1);
    assert.match(String(calls[0].url), /\/api\/superadmin\/clinicas\/nova-conta$/);
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.headers.get('Authorization'), 'Bearer token-owner');
    assert.equal(calls[0].options.headers.get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(calls[0].options.body), {
      nome_clinica: 'Clínica Nova',
      admin_nome: 'Admin Nova',
      admin_email: 'admin.nova@local.brana.test',
      admin_senha: 'BranaTeste@2026',
      admin_confirma_senha: 'BranaTeste@2026',
    });
  } finally {
    global.fetch = originalFetch;
    global.window = originalWindow;
    clearToken();
  }
});

test('admin clinic new account action validates the exact form payload before requesting', async () => {
  const originalFetch = global.fetch;
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    assert.equal(ADMIN_CLINIC_NEW_ACCOUNT_PASSWORD_MIN_LENGTH, 6);
    assert.deepEqual(
      normalizeNewClinicAccountPayload({
        nome_clinica: ' Clínica ',
        admin_nome: ' Admin ',
        admin_email: 'ADMIN@LOCAL.BRANA.TEST ',
        admin_senha: '123456',
        admin_confirma_senha: '123456',
      }),
      {
        nome_clinica: 'Clínica',
        admin_nome: 'Admin',
        admin_email: 'admin@local.brana.test',
        admin_senha: '123456',
        admin_confirma_senha: '123456',
      },
    );
    assert.throws(() => normalizeNewClinicAccountPayload({}), /nome da clínica/i);
    assert.throws(
      () =>
        normalizeNewClinicAccountPayload({
          nomeClinica: 'Clínica',
          adminNome: '',
          adminEmail: 'admin@local.brana.test',
          adminSenha: '123456',
          adminConfirmaSenha: '123456',
        }),
      /nome do administrador/i,
    );
    assert.throws(
      () =>
        normalizeNewClinicAccountPayload({
          nomeClinica: 'Clínica',
          adminNome: 'Admin',
          adminEmail: 'invalido',
          adminSenha: '123456',
          adminConfirmaSenha: '123456',
        }),
      /e-mail válido/i,
    );
    assert.throws(
      () =>
        normalizeNewClinicAccountPayload({
          nomeClinica: 'Clínica',
          adminNome: 'Admin',
          adminEmail: 'admin@local.brana.test',
          adminSenha: '12345',
          adminConfirmaSenha: '12345',
        }),
      /mínimo 6/i,
    );
    await assert.rejects(
      createAdminClinicAccount({
        nomeClinica: 'Clínica',
        adminNome: 'Admin',
        adminEmail: 'admin@local.brana.test',
        adminSenha: '123456',
        adminConfirmaSenha: '654321',
      }),
      /não confere/i,
    );
    assert.equal(calls, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test('admin clinics query only sends q and limit from the React service', () => {
  const query = buildAdminClinicsQuery({
    q: ' Tel ',
    limit: 30,
    status: 'trial',
    ativo: 'inativo',
    plano: 'ANUAL',
  });

  assert.equal(query.get('q'), 'Tel');
  assert.equal(query.get('limit'), '30');
  assert.equal(query.has('status'), false);
  assert.equal(query.has('ativo'), false);
  assert.equal(query.has('plano'), false);

  const emptyQuery = buildAdminClinicsQuery({ q: '   ' });
  assert.equal(emptyQuery.has('q'), false);
  assert.equal(emptyQuery.get('limit'), '1000');
});

test('admin clinics normalizer keeps table fields without local plan filtering', () => {
  const normalized = normalizeAdminClinics([
    {
      id: 10,
      nome: 'Clínica Centro',
      email: 'centro@brana.com',
      ativo: true,
      tipo_conta: 'Mensal',
      trial_ate: '2026-08-01T00:00:00',
      assinatura_status: 'ativa',
      usuarios_total: 3,
      usuarios_ativos: 2,
      is_owner_clinica: false,
    },
    {
      id: 11,
      nome: 'Owner',
      email: 'owner@brana.com',
      ativo: true,
      tipo_conta: 'MASTER',
      assinatura_status: 'ativa',
      usuarios_total: null,
      usuarios_ativos: undefined,
      is_owner_clinica: true,
    },
  ]);

  assert.equal(normalized.rows.length, 2);
  assert.equal(normalized.totalFromBackend, 2);
  assert.equal(normalized.rows[0].id, 10);
  assert.equal(normalized.rows[0].plano, 'MENSAL');
  assert.equal(normalized.rows[0].ativo, true);
  assert.equal(Object.hasOwn(normalized.rows[0], 'isOwnerClinica'), false);
});

test('admin clinics formatters keep Brazilian display and safe fallbacks', () => {
  assert.equal(formatClinicDate('2026-08-01T00:00:00'), '01/08/2026');
  assert.equal(formatClinicDate(null), '-');
  assert.equal(formatClinicUsers(2, 5), '2/5');
  assert.equal(formatClinicStatus('suspensa'), 'Suspensa');
  assert.equal(formatClinicStatus(null), 'Indisponível');
  assert.equal(normalizePlanLabel('SUPERADMIN'), 'Super Admin');
});

test('admin clinics table utilities filter and sort every final column', () => {
  const rows = [
    {
      id: 2,
      nome: 'Clínica Beta',
      email: 'beta@brana.com',
      assinaturaStatus: 'trial',
      tipoConta: 'Mensal',
      plano: 'MENSAL',
      trialAte: '2026-09-01T00:00:00',
      usuariosAtivos: 1,
      usuariosTotal: 3,
    },
    {
      id: 1,
      nome: 'Ápice Dental',
      email: 'apice@brana.com',
      assinaturaStatus: 'ativa',
      tipoConta: 'Anual',
      plano: 'ANUAL',
      trialAte: '2026-08-01T00:00:00',
      usuariosAtivos: 4,
      usuariosTotal: 4,
    },
  ];

  assert.deepEqual(ADMIN_CLINICS_FILTER_COLUMNS.map((column) => column.key), [
    'id',
    'clinica',
    'usuarios',
    'plano',
    'trialAte',
    'status',
  ]);
  assert.equal(filterAdminClinics(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, id: '1' }).length, 1);
  assert.equal(filterAdminClinics(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, clinica: 'apice' }).length, 1);
  assert.equal(filterAdminClinics(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, status: 'Trial' }).length, 1);
  assert.equal(filterAdminClinics(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, plano: 'Anual' }).length, 1);
  assert.equal(filterAdminClinics(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, trialAte: '01/08/2026' }).length, 1);
  assert.equal(filterAdminClinics(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, usuarios: '1/3' }).length, 1);
  assert.deepEqual(sortAdminClinics(rows, { key: 'id', order: 'asc' }).map((row) => row.id), [1, 2]);
  assert.deepEqual(sortAdminClinics(rows, { key: 'id', order: 'desc' }).map((row) => row.id), [2, 1]);
  assert.deepEqual(processAdminClinicsRows(rows, { ...ADMIN_CLINICS_EMPTY_FILTERS, status: 'ativa' }, { key: 'clinica', order: 'asc' }).map((row) => row.id), [1]);
});

test('admin clinics column visibility protects the radio column and the last data column', () => {
  const onlyIdVisible = {
    id: true,
    clinica: false,
    usuarios: false,
    plano: false,
    trialAte: false,
    status: false,
  };
  const blocked = toggleAdminClinicVisibleColumn(onlyIdVisible, 'id');
  const restored = toggleAdminClinicVisibleColumn(onlyIdVisible, 'clinica');
  const hidden = toggleAdminClinicVisibleColumn(ADMIN_CLINICS_VISIBLE_COLUMNS, 'id');
  const hiddenUsers = toggleAdminClinicVisibleColumn(ADMIN_CLINICS_VISIBLE_COLUMNS, 'usuarios');
  const restoredUsers = toggleAdminClinicVisibleColumn(hiddenUsers, 'usuarios');
  const hiddenStatus = toggleAdminClinicVisibleColumn(ADMIN_CLINICS_VISIBLE_COLUMNS, 'status');
  const restoredStatus = toggleAdminClinicVisibleColumn(hiddenStatus, 'status');

  assert.equal(blocked.id, true);
  assert.equal(restored.clinica, true);
  assert.equal(hidden.id, false);
  assert.deepEqual(Object.keys(restoredUsers), ['id', 'clinica', 'usuarios', 'plano', 'trialAte', 'status']);
  assert.deepEqual(Object.keys(restoredStatus), ['id', 'clinica', 'usuarios', 'plano', 'trialAte', 'status']);
  assert.equal(restoredUsers.usuarios, true);
  assert.equal(restoredStatus.status, true);
  assert.equal(ADMIN_CLINICS_TABLE_SCROLL_Y, 480);
  assert.equal(formatAdminClinicsFooterLabel(1, 1), '1 clínica');
  assert.equal(formatAdminClinicsFooterLabel(2, 2), '2 clínicas');
  assert.equal(formatAdminClinicsFooterLabel(1, 4), '1 de 4 clínicas');
  assert.equal(formatAdminClinicsFooterLabel(3, 4), '3 de 4 clínicas');
});

test('admin clinics toolbar exposes disabled admin actions and right-side textual search', () => {
  const toolbar = readFileSync(toolbarPath, 'utf8');
  const table = readFileSync(resolve(clinicsRoot, 'components/ClinicsTable.jsx'), 'utf8');
  const page = readFileSync(pagePath, 'utf8');
  const hook = readFileSync(hookPath, 'utf8');
  const service = readFileSync(servicePath, 'utf8');
  const css = readFileSync(cssPath, 'utf8');
  const removedClearLabel = ['Limpar', ' filtros'].join('');

  assert.match(toolbar, /import \{ Input, InputNumber \} from 'antd';/);
  assert.doesNotMatch(toolbar, /\bButton\b/);
  assert.match(toolbar, /Input\.Search/);
  assert.match(toolbar, /InputNumber/);
  assert.doesNotMatch(toolbar, /Atualizar/);
  assert.doesNotMatch(toolbar, /onRefresh|refreshing/);
  assert.match(toolbar, /Buscar cl[íÃ]nica/);
  ['+Teste', 'Suspender', 'Demo', 'Mensal', 'Anual', 'Super Admin', 'Nova conta', 'Excluir'].forEach((label) => {
    assert.match(toolbar, new RegExp(label.replace('+', '\\+')));
  });
  assert.doesNotMatch(toolbar, /Novo usuário|Novo usu(á|Ã¡)rio/);
  assert.match(toolbar, /admin-clinics-toolbar-actions/);
  assert.match(toolbar, /materiais-estoque-toolbar-actions admin-clinics-toolbar-actions/);
  assert.match(toolbar, /className="auxiliary-shell-button primary"/);
  assert.match(toolbar, /className="auxiliary-shell-button danger"/);
  assert.match(toolbar, /aria-busy=\{trialLoading\}/);
  assert.match(toolbar, /statusActionLabel/);
  assert.match(toolbar, /onStatusAction/);
  assert.match(toolbar, /aria-busy=\{statusActionLoading\}/);
  assert.match(toolbar, /demoDisabled/);
  assert.match(toolbar, /demoLoading/);
  assert.match(toolbar, /onDemo/);
  assert.match(toolbar, /aria-busy=\{demoLoading\}/);
  assert.match(toolbar, /monthlyDisabled/);
  assert.match(toolbar, /monthlyLoading/);
  assert.match(toolbar, /onMonthly/);
  assert.match(toolbar, /aria-busy=\{monthlyLoading\}/);
  assert.match(toolbar, /canCreateAccount/);
  assert.match(toolbar, /createAccountLoading/);
  assert.match(toolbar, /onCreateAccount/);
  assert.match(toolbar, /aria-busy=\{createAccountLoading\}/);
  assert.match(toolbar, /ADMIN_CLINIC_TRIAL_EXTRA_MIN_DAYS/);
  assert.match(toolbar, /ADMIN_CLINIC_TRIAL_EXTRA_MAX_DAYS/);
  assert.match(toolbar, /precision=\{0\}/);
  assert.ok(toolbar.indexOf('InputNumber') < toolbar.indexOf('+Teste'));
  assert.match(toolbar, /admin-clinics-toolbar-search/);
  assert.match(toolbar, /admin-clinics-toolbar-days/);
  assert.doesNotMatch(toolbar, /\bSelect\b/);
  assert.equal(toolbar.includes(removedClearLabel), false);
  assert.doesNotMatch(toolbar, /onFilterChange|onClearFilters|filters=/);
  assert.doesNotMatch(toolbar, /PATCH|DELETE|POST|PUT|fetch\(|getAdminClinics|trial-extra|\/status/);
  assert.match(table, /TableColumnFilterHeader/);
  assert.match(table, /BranaTable/);
  assert.match(table, /scroll=\{\{ y: ADMIN_CLINICS_TABLE_SCROLL_Y \}\}/);
  assert.match(table, /admin-clinics-table-footer/);
  assert.match(table, /rowSelection=\{\{/);
  assert.match(page, /useClinicsTableState/);
  assert.match(page, /useExtendClinicTrial/);
  assert.match(page, /useUpdateClinicStatus/);
  assert.match(page, /useSetClinicDemo/);
  assert.match(page, /useSetClinicMonthlyPlan/);
  assert.match(page, /useCreateAdminClinicAccount/);
  assert.match(page, /normalizeTrialExtraDays/);
  assert.match(page, /normalizeClinicStatusReason/);
  assert.match(page, /<Modal/);
  assert.match(page, /open=\{Boolean\(trialConfirm\)\}/);
  assert.match(page, /open=\{Boolean\(statusConfirm\)\}/);
  assert.match(page, /open=\{Boolean\(demoConfirm\)\}/);
  assert.match(page, /open=\{Boolean\(monthlyConfirm\)\}/);
  assert.match(page, /CreateClinicAccountModal/);
  assert.match(page, /confirmLoading=\{trialAction\.loading\}/);
  assert.match(page, /confirmLoading=\{statusAction\.loading\}/);
  assert.match(page, /confirmLoading=\{demoAction\.loading\}/);
  assert.match(page, /confirmLoading=\{monthlyAction\.loading\}/);
  assert.match(page, /handleConfirmExtendTrial/);
  assert.match(page, /handleConfirmStatusAction/);
  assert.match(page, /handleConfirmDemo/);
  assert.match(page, /handleConfirmMonthly/);
  assert.match(page, /handleSubmitCreateAccount/);
  assert.match(page, /okText="Confirmar Demo"/);
  assert.match(page, /okText="Confirmar Mensal"/);
  assert.doesNotMatch(page, /Modal\.confirm/);
  assert.match(page, /clinics\.refresh\(\)/);
  assert.match(page, /clinics\.setSelectedId\(Number\(result\.clinica_id\)\)/);
  assert.match(page, /Number\(row\.id\) === Number\(current\)/);
  assert.match(table, /Number\(nextKey\)/);
  assert.doesNotMatch(page, /onRefresh|refreshing=\{clinics\.refreshing\}/);
  assert.doesNotMatch(page, /admin-clinics-total/);

  assert.doesNotMatch(page, /onFilterChange|onClearFilters|clinics\.filters|clinics\.updateFilter|clinics\.clearFilters/);
  assert.doesNotMatch(hook, /updateFilter|clearFilters|setFilters|normalizeClinicsFilters|ADMIN_CLINICS_DEFAULT_FILTERS/);
  assert.doesNotMatch(service, /params\.set\(['"`]status|params\.set\(['"`]ativo|params\.set\(['"`]plano/);
  assert.doesNotMatch(css, /admin-clinics-toolbar-filters|\.admin-clinics-toolbar-search\s+\.ant-select/);
  assert.match(css, /admin-clinics-toolbar-search[\s\S]*margin-left:\s*auto/);
  assert.match(css, /admin-clinics-toolbar-days\.ant-input-number[\s\S]*height:\s*28px/);
  assert.match(css, /admin-clinics-toolbar-days \.ant-input-number-input[\s\S]*font-size:\s*12px/);
  assert.equal(existsSync(resolve(clinicsRoot, 'utils/adminClinicsFilters.js')), false);
});

test('admin clinics status modal keeps UTF-8 text and blocks mojibake regressions', () => {
  const files = [
    readFileSync(pagePath, 'utf8'),
    readFileSync(resolve(clinicsRoot, 'services/adminClinicActionsApi.js'), 'utf8'),
    readFileSync(toolbarPath, 'utf8'),
    readFileSync(resolve(clinicsRoot, 'hooks/useUpdateClinicStatus.js'), 'utf8'),
    readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicDemo.js'), 'utf8'),
    readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicMonthlyPlan.js'), 'utf8'),
    readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicAnnualPlan.js'), 'utf8'),
    readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicSuperAdminPlan.js'), 'utf8'),
    readFileSync(resolve(clinicsRoot, 'utils/adminClinicsNormalizer.js'), 'utf8'),
  ].join('\n');

  [
    'Suspender clínica',
    'Suspender a clínica',
    'Usuários dessa clínica',
    'Confirmar suspensão',
    'Motivo (opcional)',
    'Ativar clínica',
    'Confirmar ativação',
    'Selecione uma clínica.',
    'Status da clínica atualizado.',
    'Falha ao atualizar status da clínica.',
    'Aplicar plano Demo',
    'Confirmar Demo',
    'Plano Demo aplicado.',
    'Falha ao aplicar plano Demo.',
    'Aplicar plano Mensal',
    'Confirmar Mensal',
    'Plano Mensal aplicado.',
    'Falha ao aplicar plano Mensal.',
    'Aplicar plano Anual',
    'Confirmar Anual',
    'Plano Anual aplicado.',
    'Falha ao aplicar plano Anual.',
    'Aplicar plano Super Admin',
    'Confirmar Super Admin',
    'Plano Super Admin aplicado.',
    'Falha ao aplicar plano Super Admin.',
  ].forEach((text) => {
    assert.equal(files.includes(text), true, `Texto ausente: ${text}`);
  });

  ['clÃ', 'clÃƒ', 'UsuÃ', 'suspensÃ', 'ativaÃ', 'confirmaÃ', 'Ã‚', '�'].forEach((text) => {
    assert.equal(files.includes(text), false, `Mojibake encontrado: ${text}`);
  });
});

test('admin clinics table is read-only with legacy columns and disabled toolbar actions', () => {
  const table = readFileSync(resolve(clinicsRoot, 'components/ClinicsTable.jsx'), 'utf8');
  const toolbar = readFileSync(toolbarPath, 'utf8');
  const page = readFileSync(pagePath, 'utf8');
  const actionService = readFileSync(resolve(clinicsRoot, 'services/adminClinicActionsApi.js'), 'utf8');
  const demoHook = readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicDemo.js'), 'utf8');
  const monthlyHook = readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicMonthlyPlan.js'), 'utf8');
  const annualHook = readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicAnnualPlan.js'), 'utf8');
  const superAdminHook = readFileSync(resolve(clinicsRoot, 'hooks/useSetClinicSuperAdminPlan.js'), 'utf8');
  const createAccountHook = readFileSync(resolve(clinicsRoot, 'hooks/useCreateAdminClinicAccount.js'), 'utf8');
  const createAccountModal = readFileSync(resolve(clinicsRoot, 'components/CreateClinicAccountModal.jsx'), 'utf8');
  const app = readFileSync(resolve(frontendRoot, 'src/app/App.jsx'), 'utf8');

  [
    ['id', 'ID'],
    ['clinica', 'Clínica'],
    ['usuarios', 'Usuários'],
    ['plano', 'Plano'],
    ['trialAte', 'Trial até'],
    ['status', 'Status'],
  ].forEach(([key, label]) => {
    assert.match(table, new RegExp(`title: renderHeader\\('${key}', '${label}'\\)`));
  });
  assert.ok(table.indexOf("title: renderHeader('usuarios', 'Usuários')") < table.indexOf("title: renderHeader('plano', 'Plano')"));
  assert.ok(table.indexOf("title: renderHeader('status', 'Status')") > table.indexOf("title: renderHeader('trialAte', 'Trial até')"));
  assert.doesNotMatch(table, /Ações|data-sa-action|Novo usuário|Nova conta|Excluir|Suspender|Ativar/);
  assert.match(toolbar, /statusActionLabel = 'Suspender'/);
  assert.doesNotMatch(toolbar, /PATCH|DELETE|POST|PUT|fetch\(/);
  assert.match(actionService, /method:\s*'PATCH'/);
  assert.match(actionService, /\/superadmin\/clinicas\/\$\{resolvedId\}\/trial-extra/);
  assert.match(actionService, /\/superadmin\/clinicas\/\$\{resolvedId\}\/status/);
  assert.match(actionService, /\/superadmin\/clinicas\/\$\{resolvedId\}\/plano/);
  assert.match(actionService, /JSON\.stringify\(\{ ativo, motivo: resolvedReason \}\)/);
  assert.match(actionService, /setAdminClinicPlan/);
  assert.match(actionService, /payload = \{ plano: resolvedPlan, manter_ativo: Boolean\(manterAtivo\) \}/);
  assert.match(actionService, /ADMIN_CLINIC_DEMO_PLAN/);
  assert.match(actionService, /ADMIN_CLINIC_MONTHLY_PLAN/);
  assert.match(actionService, /ADMIN_CLINIC_ANNUAL_PLAN/);
  assert.match(actionService, /ADMIN_CLINIC_SUPER_ADMIN_PLAN/);
  assert.match(actionService, /createAdminClinicAccount/);
  assert.match(actionService, /\/superadmin\/clinicas\/nova-conta/);
  assert.match(actionService, /method:\s*'POST'/);
  assert.match(actionService, /normalizeNewClinicAccountPayload/);
  assert.match(demoHook, /useSetClinicDemo/);
  assert.match(demoHook, /runningRef/);
  assert.match(demoHook, /setAdminClinicDemo/);
  assert.match(monthlyHook, /useSetClinicMonthlyPlan/);
  assert.match(monthlyHook, /runningRef/);
  assert.match(monthlyHook, /setAdminClinicMonthlyPlan/);
  assert.match(annualHook, /useSetClinicAnnualPlan/);
  assert.match(annualHook, /runningRef/);
  assert.match(annualHook, /setAdminClinicAnnualPlan/);
  assert.match(superAdminHook, /useSetClinicSuperAdminPlan/);
  assert.match(superAdminHook, /runningRef/);
  assert.match(superAdminHook, /setAdminClinicSuperAdminPlan/);
  assert.match(createAccountHook, /useCreateAdminClinicAccount/);
  assert.match(createAccountHook, /runningRef/);
  assert.match(createAccountHook, /createAdminClinicAccount/);
  assert.match(createAccountModal, /title="Nova conta"/);
  assert.match(createAccountModal, /Nome da clínica/);
  assert.match(createAccountModal, /Nome do administrador/);
  assert.match(createAccountModal, /E-mail do administrador/);
  assert.match(createAccountModal, /Senha temporária/);
  assert.match(createAccountModal, /Confirmar senha temporária/);
  assert.doesNotMatch(createAccountModal, /Modal\.confirm|window\.confirm|alert\(|prompt\(/);
  assert.match(page, /demoDisabled=\{demoDisabled\}/);
  assert.match(page, /demoLoading=\{demoAction\.loading\}/);
  assert.match(page, /onDemo=\{handleDemo\}/);
  assert.match(page, /monthlyDisabled=\{monthlyDisabled\}/);
  assert.match(page, /monthlyLoading=\{monthlyAction\.loading\}/);
  assert.match(page, /onMonthly=\{handleMonthly\}/);
  assert.match(page, /annualDisabled=\{annualDisabled\}/);
  assert.match(page, /annualLoading=\{annualAction\.loading\}/);
  assert.match(page, /onAnnual=\{handleAnnual\}/);
  assert.match(page, /okText="Confirmar Anual"/);
  assert.match(page, /validade[\s\S]*365 dias/);
  assert.match(page, /superAdminDisabled=\{superAdminDisabled\}/);
  assert.match(page, /superAdminLoading=\{superAdminAction\.loading\}/);
  assert.match(page, /superAdminLabel="Super Admin"/);
  assert.match(page, /onSuperAdmin=\{handleSuperAdmin\}/);
  assert.match(page, /okText="Confirmar Super Admin"/);
  assert.match(page, /validade[\s\S]*365 dias/);
  assert.match(page, /canCreateAccount = Boolean\(user\?\.is_master\)/);
  assert.match(page, /useCreateAdminClinicAccount/);
  assert.match(page, /CreateClinicAccountModal/);
  assert.match(page, /clinics\.setSelectedId\(Number\(result\.clinica_id\)\)/);
  assert.doesNotMatch(page, /is_master\s*=|is_superadmin\s*=|promoteSuperAdmin|promover/i);
  assert.doesNotMatch(toolbar, /fetch\(|getAdminClinics|extendAdminClinicTrial|window\.location\.reload/);
  assert.doesNotMatch(toolbar, /setAdminClinicDemo|setAdminClinicMonthlyPlan|setAdminClinicAnnualPlan|setAdminClinicSuperAdminPlan|updateAdminClinicStatus|extendAdminClinicTrial|createAdminClinicAccount/);
  assert.doesNotMatch(toolbar, /onMensal|onNewUser|onDelete/);
  assert.match(toolbar, /annualDisabled = true/);
  assert.match(toolbar, /annualLoading = false/);
  assert.match(toolbar, /onAnnual\?\.\(\)/);
  assert.match(toolbar, /superAdminDisabled = true/);
  assert.match(toolbar, /superAdminLoading = false/);
  assert.match(toolbar, /superAdminLabel = 'Super Admin'/);
  assert.match(toolbar, /onSuperAdmin\?\.\(\)/);
  assert.match(toolbar, /canCreateAccount = false/);
  assert.match(toolbar, /createAccountLoading = false/);
  assert.match(toolbar, /onCreateAccount\?\.\(\)/);
  assert.match(toolbar, /Nova conta/);
  assert.doesNotMatch(toolbar, /promoteSuperAdmin|usuarioAlvo|targetUser/i);
  assert.doesNotMatch(toolbar, /Novo usuário|Novo usu(á|Ã¡)rio/);
  assert.match(toolbar, /Excluir/);
  assert.match(toolbar, /Suspender/);
  assert.match(table, /rowSelection=\{\{[\s\S]*type:\s*'radio'/);
  assert.match(page, /ClinicsToolbarContent/);
  assert.match(app, /onToolbarChange=\{setAdminToolbar\}/);
});

test('admin clinics page is not reachable for non master users before fetch', () => {
  assert.equal(canAccessPlatformAdmin({ is_master: true }), true);
  assert.equal(canAccessPlatformAdmin({ is_superadmin: true, is_master: false }), false);
  assert.equal(canAccessPlatformAdmin({ is_admin: true, is_master: false }), false);
  assert.equal(canAccessPlatformAdmin(null), false);
});
