import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve('src/features/planoContas/PlanoContasPage.jsx');
const appPath = path.resolve('src/app/App.jsx');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const appSource = fs.readFileSync(appPath, 'utf8');

test('PlanoContasPage integra modal de categoria e eventos de toolbar', () => {
  assert.match(pageSource, /PlanoContasCategoryModal/);
  assert.match(pageSource, /nova-categoria/);
  assert.match(pageSource, /alterar-categoria/);
});

test('App.jsx encaminha ações de categoria pelo shell', () => {
  assert.match(appSource, /onNewCategory/);
  assert.match(appSource, /onEditCategory/);
  assert.match(appSource, /nova-categoria/);
  assert.match(appSource, /alterar-categoria/);
});
