import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const routesSource = fs.readFileSync(path.resolve('frontend-react/src/app/routes.jsx'), 'utf8');
const appSource = fs.readFileSync(path.resolve('frontend-react/src/app/App.jsx'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/indicesFinanceiros/IndicesFinanceirosPage.jsx'), 'utf8');

test('rotas registram Indices financeiros', () => {
  assert.match(routesSource, /\/app\/configuracoes\/indices-financeiros/);
  assert.match(routesSource, /Índices financeiros/);
});

test('App.jsx resolve a screen de Indices financeiros', () => {
  assert.match(appSource, /configuracoes\/indices-financeiros/);
  assert.match(appSource, /indices-financeiros/);
  assert.match(appSource, /<IndicesFinanceirosPage \/>/);
  assert.match(appSource, /IndicesFinanceirosToolbar/);
  assert.match(appSource, /Barra operacional de índices financeiros/);
});

test('menu lateral de Configuracoes aponta para Indices financeiros', () => {
  assert.match(appSource, /\{ key: 'indices-financeiros', label: 'Índices financeiros' \}/);
  assert.match(appSource, /handleNavigate\('indices-financeiros'\)/);
});

test('página não renderiza toolbar local e preserva o modal', () => {
  assert.match(pageSource, /indices-financeiros-panels/);
  assert.match(pageSource, /IndicesFinanceirosTable/);
  assert.match(pageSource, /IndicesCotacoesTable/);
  assert.match(pageSource, /IndiceFinanceiroFormDialog/);
  assert.match(pageSource, /brana-indices-financeiros-toolbar-action/);
  assert.doesNotMatch(pageSource, /IndicesFinanceirosToolbar/);
  assert.doesNotMatch(pageSource, /Estrutura minima carregada no shell do Brana Cloud/);
  assert.doesNotMatch(pageSource, /Fecha/);
  assert.doesNotMatch(pageSource, /Eliminar|CRUD/);
  assert.doesNotMatch(pageSource, /Typography\.Title/);
  assert.doesNotMatch(pageSource, /BranaCard/);
});
