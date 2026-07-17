import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/app/App.jsx');
const routesPath = path.resolve('src/app/routes.jsx');

const appSource = fs.readFileSync(appPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const pageSource = fs.readFileSync(path.resolve('src/features/unidadesAtendimento/UnidadesAtendimentoPage.jsx'), 'utf8');

assert.match(appSource, /\/app\/configuracoes\/unidades-atendimento/);
assert.match(appSource, /unidades-atendimento/);
assert.match(appSource, /Unidades de atendimento/);
assert.match(routesSource, /\/app\/configuracoes\/unidades-atendimento/);
assert.match(appSource, /brana-unidades-atendimento-toolbar-action/);
assert.doesNotMatch(pageSource, /UnidadesAtendimentoToolbar/);
assert.doesNotMatch(pageSource, /auxiliary-shell-frame/);

console.log('unidadesAtendimento.routing.test.mjs ok');
