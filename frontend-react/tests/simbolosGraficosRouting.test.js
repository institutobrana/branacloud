import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appSource = fs.readFileSync(path.resolve('frontend-react/src/app/App.jsx'), 'utf8');
const routesSource = fs.readFileSync(path.resolve('frontend-react/src/app/routes.jsx'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/simbolosGraficos/SimbolosGraficosPage.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/simbolosGraficos/components/SimbolosGraficosToolbar.jsx'), 'utf8');

test('Simbolos graficos possui rota e menu em Configuracoes', () => {
  assert.match(appSource, /key:\s*'simbolos-graficos',\s*label:\s*'Símbolos gráficos'/);
  assert.match(appSource, /if \(path === `\$\{base\}\/configuracoes\/simbolos-graficos`\) return 'simbolos-graficos';/);
  assert.match(appSource, /screen === 'simbolos-graficos'/);
  assert.match(routesSource, /path:\s*'\/app\/configuracoes\/simbolos-graficos'/);
});

test('Simbolos graficos monta pagina e toolbar estruturais', () => {
  assert.match(pageSource, /useSimbolosGraficosTableState/);
  assert.match(pageSource, /SimbolosGraficosTable/);
  assert.match(pageSource, /SimboloGraficoCreateModal/);
  assert.doesNotMatch(pageSource, /Buscar por nome ou especialidade/);
  assert.doesNotMatch(pageSource, /Filtrar por nome/);
  assert.doesNotMatch(pageSource, /Filtrar por especialidade/);
  assert.doesNotMatch(pageSource, /Nome crescente/);
  assert.match(appSource, /brana-simbolos-graficos-selection/);
  assert.match(appSource, /brana-simbolos-graficos-toolbar-action/);
  assert.match(appSource, /hasSelection=\{Boolean\(simbolosGraficosSelectionState\.selectedId\)\}/);
  assert.match(toolbarSource, /Novo/);
  assert.match(toolbarSource, /Altera/);
  assert.match(toolbarSource, /Elimina/);
  assert.match(toolbarSource, /hasSelection/);
});

test('Simbolos graficos continua sem CRUD ou integracao externa na camada de pagina', () => {
  assert.doesNotMatch(pageSource, /fetch\(|axios|postMessage|iframe|canvas|bmp|upload/i);
  assert.doesNotMatch(pageSource, /\b(post|put|patch|delete)\s*\(/i);
  assert.doesNotMatch(toolbarSource, /fetch\(|axios|postMessage|iframe|canvas|bmp|upload/i);
  assert.doesNotMatch(toolbarSource, /\b(post|put|patch|delete)\s*\(/i);
});
