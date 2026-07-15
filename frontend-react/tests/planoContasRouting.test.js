import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/app/App.jsx');
const appSource = fs.readFileSync(appPath, 'utf8');

test('App.jsx reconhece a rota de Plano de contas no resolvedor', () => {
  assert.match(appSource, /\/app\/configuracoes\/plano-de-contas/);
  assert.match(appSource, /screen === 'plano-contas'/);
  assert.match(appSource, /resolveScreenFromPath\(\)/);
});

test('App.jsx nao rebaixa plano-contas para dashboard no fallback de screen', () => {
  const fallbackLine = appSource.split('\n').find((line) => line.includes("screen !== 'cenario-anual'"));
  assert.ok(fallbackLine, 'fallback line not found');
  assert.match(appSource, /screen !== 'plano-contas'/);
});

test('App.jsx renderiza a barra do Plano de contas no shell', () => {
  assert.match(appSource, /planoContasTopBar/);
  assert.match(appSource, /brana-shell-band auxiliary-shell-band plano-contas-shell-band/);
  assert.match(appSource, /canDelete=/);
  assert.match(appSource, /onDeleteCategory=\{\(\) => window\.dispatchEvent/);
});
