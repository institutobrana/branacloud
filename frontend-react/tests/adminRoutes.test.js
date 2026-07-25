import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAdminMainGroups } from '../src/features/admin/adminRailGroups.js';
import { adminPath, isAdminRoutePath } from '../src/features/admin/adminRoutes.js';
import { ADMIN_SECTIONS, getAdminSectionByKey } from '../src/features/admin/adminNavigation.js';
import { getAdminHeaderModel, getAdminHomeModel, getAdminNavigationModel } from '../src/features/admin/adminVisualModel.js';

test('admin path uses the current React base path', () => {
  assert.equal(adminPath(), '/app/adm');
});

test('admin route matcher recognizes the administrative route and its children', () => {
  assert.equal(isAdminRoutePath('/app/adm'), true);
  assert.equal(isAdminRoutePath('/app/adm/'), true);
  assert.equal(isAdminRoutePath('/app/adm/clinicas'), true);
  assert.equal(isAdminRoutePath('/app'), false);
});

test('admin shell models keep a single Painel ADM title and no provisional foundation copy', () => {
  const header = getAdminHeaderModel('overview');
  const home = getAdminHomeModel('overview');
  const nav = getAdminNavigationModel('overview');

  assert.equal(header.title, 'Painel ADM');
  assert.equal(header.breadcrumb.includes('Painel ADM'), false);
  assert.equal(header.currentLabel.length > 0, true);
  assert.equal(home.title.length > 0, true);
  assert.equal(home.copy.includes('Funda'), false);
  assert.equal(home.copy.includes('estrutura limpa'), true);
  assert.equal(nav.filter((item) => item.active).length, 1);
  assert.equal(nav.find((item) => item.key === 'overview')?.active, true);
  assert.equal(nav.find((item) => item.key === 'users')?.available, true);
  assert.equal(nav.every((item) => item.available === true || (typeof item.status === 'string' && item.status.length > 0)), true);
  assert.equal(nav.find((item) => item.key === 'audit')?.available, true);
  assert.equal(nav.length, 5);
});

test('admin top bar is mounted in the global app shell and pages only provide content', () => {
  const app = readFileSync(resolve('frontend-react/src/app/App.jsx'), 'utf8');
  const shell = readFileSync(resolve('frontend-react/src/features/admin/shared/AdminModuleShell.jsx'), 'utf8');
  const adminCss = readFileSync(resolve('frontend-react/src/features/admin/admin.css'), 'utf8');
  const globals = readFileSync(resolve('frontend-react/src/styles/globals.css'), 'utf8');

  assert.match(app, /const adminTopBar = useMemo\(/);
  assert.match(app, /const canAccessAdminPlatform = canAccessPlatformAdmin\(user\);/);
  assert.match(app, /const mainGroups = getAdminMainGroups\(user, branaMainGroups\);/);
  assert.match(app, /className="brana-shell-band auxiliary-shell-band admin-shell-band"/);
  assert.match(app, /className="brana-shell-band auxiliary-shell-band materiais-estoque-shell-band"/);
  assert.match(app, /screen === 'adm' \|\| screen === 'adm-clinicas' \|\| screen === 'adm-usuarios' \|\| screen === 'adm-cobrancas' \|\| screen === 'adm-auditoria'/);
  assert.match(app, /materiaisEstoqueToolbarState\.selectedListaId \?\? undefined[\s\S]*size="small"/);
  assert.match(app, /materiaisEstoqueToolbarState\.classificacao[\s\S]*size="small"/);
  assert.match(app, /materiaisEstoqueToolbarState\.q[\s\S]*size="small"/);
  assert.doesNotMatch(shell, /brana-shell-band/);
  assert.match(adminCss, /\.admin-shell-band\s*\{[\s\S]*min-height:\s*44px;[\s\S]*box-sizing:\s*border-box;/);
  assert.doesNotMatch(globals, /brana-shell-band--module-toolbar/);
  assert.match(globals, /\.materiais-estoque-toolbar-filters\s*\{\s*display:\s*flex;/);
  assert.match(globals, /\.materiais-estoque-toolbar-filters \.ant-select-selector,[\s\S]*height:\s*28px;/);
});

test('admin rail groups react to async auth transitions and only expose ADM to owner sessions', () => {
  const groups = [
    { key: 'atendimento' },
    { key: 'cadastro' },
    { key: 'financeiro' },
    { key: 'tabelas' },
    { key: 'relatorios' },
    { key: 'configuracao' },
    { key: 'ferramentas' },
    { key: 'ajuda' },
    { key: 'adm' },
  ];
  const anonymous = getAdminMainGroups(null, groups).map((item) => item.key);
  const master = getAdminMainGroups({ is_master: true }, groups).map((item) => item.key);
  const superAdmin = getAdminMainGroups({ is_superadmin: true }, groups).map((item) => item.key);
  const common = getAdminMainGroups({ is_admin: true }, groups).map((item) => item.key);
  const logout = getAdminMainGroups(undefined, groups).map((item) => item.key);

  assert.equal(anonymous.includes('adm'), false);
  assert.equal(common.includes('adm'), false);
  assert.equal(logout.includes('adm'), false);
  assert.equal(master.includes('adm'), true);
  assert.equal(superAdmin.includes('adm'), true);
  assert.equal(master.filter((key) => key === 'adm').length, 1);
  assert.equal(superAdmin.filter((key) => key === 'adm').length, 1);
});

test('admin navigation contract keeps the planned sections only as informational items', () => {
  assert.equal(ADMIN_SECTIONS.some((section) => section.available), true);
  assert.equal(getAdminSectionByKey('missing').key, 'overview');
  assert.equal(getAdminSectionByKey('users').available, true);
  assert.equal(getAdminSectionByKey('users').status, null);
  assert.equal(ADMIN_SECTIONS.some((section) => section.key === 'plans'), false);
  assert.equal(ADMIN_SECTIONS.some((section) => section.key === 'settings'), false);
});

test('shell emenda uses panel width in the global top band calculation', () => {
  const css = readFileSync(resolve('frontend-react/src/styles/globals.css'), 'utf8');
  assert.match(css, /\.brana-shell-body\.has-panel > \.brana-shell-band/);
  assert.match(css, /calc\(var\(--brana-rail-width, 72px\) \+ var\(--brana-panel-width, 272px\)\)/);
});
