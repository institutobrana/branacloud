import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ADMIN_USERS_UNAVAILABLE_LABEL,
  buildAdminUserDetailsSections,
} from '../src/features/admin/users/utils/adminUsersDetails.js';
import { normalizeAdminUser } from '../src/features/admin/users/normalizers/adminUsersNormalizer.js';

const sourcePath = (path) => resolve(`frontend-react/${path}`);
const source = (path) => readFileSync(sourcePath(path), 'utf8');

test('admin user details uses selected list row data and unavailable placeholders', () => {
  const user = normalizeAdminUser({
    id: 12,
    nome: 'Ana Local',
    email: 'ana@local.test',
    ativo: true,
    is_admin: true,
    is_system_user: true,
    last_seen_at: null,
    is_online: false,
    clinica_id: 8,
    clinica_nome: 'Clinica Local',
    clinica_email: 'clinica@local.test',
    clinica_ativa: false,
    clinica_plano: 'SUPERADMIN',
    clinica_trial_ate: '2026-08-30',
  });

  const sections = buildAdminUserDetailsSections(user);
  const items = Object.fromEntries(sections.flatMap((section) => section.items.map((item) => [item.label, item.value])));

  assert.deepEqual(sections.map((section) => section.title), ['Identificação', 'Conta', 'Vínculos', 'Sistema']);
  assert.equal(items.ID, '12');
  assert.equal(items.Nome, 'Ana Local');
  assert.equal(items['Tipo/perfil'], 'Administrador');
  assert.equal(items.Status, 'Ativo');
  assert.equal(items.Plano, 'Super Admin');
  assert.equal(items['Status da clínica'], 'Inativo');
  assert.equal(items['Usuário sistêmico'], 'Sim');
  assert.equal(items.Online, 'Não aplicável');
  assert.equal(items['Última atividade'], 'Usuário sistêmico sem sessão interativa');
  assert.equal(items.Unidade, ADMIN_USERS_UNAVAILABLE_LABEL);
  assert.equal(items.Prestador, ADMIN_USERS_UNAVAILABLE_LABEL);
  assert.equal(items['Último acesso'], ADMIN_USERS_UNAVAILABLE_LABEL);
  assert.equal(items.Proteção, 'Sistema');
});

test('admin user details modal is read-only and exposes only close action', () => {
  const modal = source('src/features/admin/users/components/UserDetailsModal.jsx');

  assert.match(modal, /title="Detalhes do usu(?:Ã¡|á)rio"/);
  assert.match(modal, /centered/);
  assert.match(modal, /width=\{800\}/);
  assert.match(modal, /Fechar/);
  assert.match(modal, /<Button key="close" size="small" onClick=\{onClose\}>/);
  assert.match(modal, /Tooltip/);
  assert.match(modal, /Protegido/);
  assert.match(modal, /somente leitura/);
  assert.doesNotMatch(modal, /Salvar|Editar|Confirmar|Excluir|Ativar|Resetar|Redefinir|Novo usu(?:Ã¡|á)rio|Ver conta/);
  assert.doesNotMatch(modal, /fetch|method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
});

test('admin user details modal applies compact scrollable layout without losing sections', () => {
  const modal = source('src/features/admin/users/components/UserDetailsModal.jsx');
  const css = source('src/features/admin/admin.css');

  assert.match(modal, /className="admin-users-details-modal"/);
  assert.doesNotMatch(modal, /Descriptions/);
  assert.match(modal, /className="admin-users-details-grid"/);
  assert.match(modal, /className="admin-users-details-pair"/);
  assert.match(modal, /className="admin-users-details-label"/);
  assert.match(modal, /className="admin-users-details-content"/);
  assert.match(css, /\.admin-users-details-modal \{\s*width: min\(800px, calc\(100vw - 24px\)\);/);
  assert.match(css, /\.admin-users-details-grid \{\s*display: grid/);
  assert.match(css, /grid-template-columns:[\s\S]*minmax\(76px, 12%\)[\s\S]*minmax\(0, 21\.333%\)[\s\S]*minmax\(76px, 12%\)[\s\S]*minmax\(0, 21\.333%\)[\s\S]*minmax\(76px, 12%\)[\s\S]*minmax\(0, 21\.334%\)/);
  assert.match(css, /\.admin-users-details-pair \{\s*display: contents/);
  assert.match(css, /\.admin-users-details-label,[\s\S]*\.admin-users-details-content \{[\s\S]*padding: 2px 4px/);
  assert.match(css, /\.admin-users-details-label \{[\s\S]*font-size: 11px/);
  assert.match(css, /\.admin-users-details-label \{[\s\S]*white-space: nowrap/);
  assert.match(css, /\.admin-users-details-content \{[\s\S]*overflow-wrap: normal/);
  assert.match(css, /\.admin-users-details-content \{[\s\S]*font-size: 12px/);
  assert.match(css, /max-height: calc\(100vh - 24px\)/);
  assert.match(css, /overflow-x: hidden/);
  assert.match(css, /overflow-y: visible/);
  assert.match(css, /\.admin-users-details-modal \.ant-modal-header[\s\S]*padding: 4px 10px 2px/);
  assert.match(css, /\.admin-users-details-modal \.ant-modal-footer[\s\S]*padding: 3px 8px 4px/);
  assert.match(css, /\.admin-users-details-protected[\s\S]*padding: 3px 5px/);
  assert.match(css, /\.admin-users-details-sections \{\s*display: grid;\s*gap: 8px/);
  assert.match(css, /\.admin-users-details-section[\s\S]*gap: 2px/);
  assert.match(css, /\.admin-users-details-section \.ant-typography[\s\S]*font-size: 13px/);
  assert.match(css, /\.admin-users-details-value--long[\s\S]*text-overflow: ellipsis/);
  assert.match(css, /\.admin-users-details-value--long[\s\S]*white-space: nowrap/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.admin-users-details-modal \{\s*width: calc\(100vw - 16px\);/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*grid-template-columns: minmax\(92px, 34%\) minmax\(0, 66%\)/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*overflow-y: auto/);
});

test('admin users toolbar keeps read controls order and contextual details button', () => {
  const toolbar = source('src/features/admin/users/components/UsersToolbarContent.jsx');

  assert.match(toolbar, /Atualizar[\s\S]*Exportar CSV[\s\S]*Ver detalhes[\s\S]*Buscar usu(?:Ã¡|á)rio/);
  assert.match(toolbar, /materiais-estoque-toolbar-actions admin-users-toolbar-actions/);
  assert.match(toolbar, /className="auxiliary-shell-button primary"/);
  assert.match(toolbar, /className="auxiliary-shell-button"/);
  assert.match(toolbar, /aria-busy=\{refreshing\}/);
  assert.match(toolbar, /aria-busy=\{exporting\}/);
  assert.match(toolbar, /disabled=\{detailsDisabled\}/);
  assert.match(toolbar, /if \(!detailsDisabled\) onViewDetails\?\.\(\)/);
  assert.match(toolbar, /Input\.Search/);
  assert.doesNotMatch(toolbar, /Button size=/);
  assert.doesNotMatch(toolbar, /ReloadOutlined|DownloadOutlined|EyeOutlined|SearchOutlined/);
  assert.match(toolbar, /Atualizar[\s\S]*Exportar CSV[\s\S]*Ver detalhes[\s\S]*Ver conta[\s\S]*Buscar usu(?:Ã¡|á)rio/);
  assert.doesNotMatch(toolbar, /Novo usu(?:Ã¡|á)rio|Excluir|Ativar|Resetar|Salvar|Editar/);
});

test('admin users page opens details from selected row and clears stale selection', () => {
  const page = source('src/features/admin/users/UsersPage.jsx');

  assert.match(page, /const \[detailsOpen, setDetailsOpen\] = useState\(false\)/);
  assert.match(page, /users\.rows\.find\(\(row\) => Number\(row\.id\) === Number\(users\.selectedId\)\)/);
  assert.match(page, /detailsDisabled=\{!selectedUser\}/);
  assert.match(page, /if \(selectedUser\) setDetailsOpen\(true\)/);
  assert.match(page, /setDetailsOpen\(false\);\s*return null;/);
  assert.match(page, /<UserDetailsModal open=\{detailsOpen && Boolean\(selectedUser\)\} user=\{selectedUser\}/);
});

test('admin users details adds no detail endpoint or mutating request', () => {
  const files = [
    'src/features/admin/users/UsersPage.jsx',
    'src/features/admin/users/components/UserDetailsModal.jsx',
    'src/features/admin/users/components/UsersToolbarContent.jsx',
    'src/features/admin/users/services/adminUsersApi.js',
    'src/features/admin/users/utils/adminUsersDetails.js',
  ].map(source);
  const combined = files.join('\n');

  assert.doesNotMatch(combined, /usuarios\/\$\{|usuarios\/:id|detalhe-endpoint/i);
  assert.doesNotMatch(combined, /method:\s*['"`](POST|PUT|PATCH|DELETE)['"`]/);
  assert.doesNotMatch(combined, /window\.(alert|confirm|prompt)|console\.log/);
});
