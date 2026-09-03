import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const modal = read('features/opcoesSistema/components/OpcoesSistemaModal.jsx');
const api = read('features/opcoesSistema/api/opcoesSistemaApi.js');
const constants = read('features/opcoesSistema/constants/opcoesSistemaConstants.js');
const app = read('app/App.jsx');
const routes = read('app/routes.jsx');

for (const tab of ['ClinicaTab', 'FinanceiroTab', 'SegurancaTab', 'DataTab', 'AvancadoTab']) {
  assert.match(modal, new RegExp(tab));
}
assert.equal((constants.match(/label: '/g) || []).length >= 5, true);
assert.match(modal, /title="Opções do sistema"/);
assert.match(modal, /width=\{690\}/);
assert.match(modal, /type="card"/);
assert.match(modal, /maskClosable=\{false\}/);
assert.match(api, /fetch\(buildApiUrl\('\/system-options'\)/);
assert.match(api, /patchOpcoesSistema/);
assert.match(api, /method: 'PATCH'/);
assert.match(app, /screen === 'opcoes-sistema'/);
assert.match(routes, /configuracoes\/opcoes-sistema/);
console.log('opcoesSistema structure: PASS');
