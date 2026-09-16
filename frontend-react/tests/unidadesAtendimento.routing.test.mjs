import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/app/App.jsx');
const routesPath = path.resolve('src/app/routes.jsx');

const appSource = fs.readFileSync(appPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const pageSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/UnidadesAtendimentoPage.jsx'), 'utf8');
const hookSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/hooks/useUnidadesAtendimento.js'), 'utf8');

assert.match(appSource, /appPath\('configuracoes\/unidades-atendimento'\)/);
assert.match(appSource, /unidades-atendimento/);
assert.match(appSource, /Unidades de atendimento/);
assert.match(routesSource, /\/app\/configuracoes\/unidades-atendimento/);
assert.match(appSource, /brana-unidades-atendimento-toolbar-action/);
assert.match(appSource, /brana-unidades-atendimento-state/);
assert.match(appSource, /deleteDisabledReason/);
assert.doesNotMatch(pageSource, /UnidadesAtendimentoToolbar/);
assert.doesNotMatch(pageSource, /auxiliary-shell-frame/);
assert.match(pageSource, /action === 'eliminar'/);
assert.match(pageSource, /UnidadeAtendimentoDeleteDialog/);
assert.match(hookSource, /excluirUnidadeAtendimento/);
assert.match(hookSource, /deleteDialogOpen/);
assert.match(hookSource, /deleteDisabledReason/);
assert.ok(
  hookSource.indexOf('const selectedItem = useMemo(') < hookSource.indexOf('const deleteDisabledReason = useMemo('),
  'selectedItem must be declared before deleteDisabledReason to avoid a runtime ReferenceError',
);

console.log('unidadesAtendimento.routing.test.mjs ok');
