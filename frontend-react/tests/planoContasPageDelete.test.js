import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.resolve('src/features/planoContas/PlanoContasPage.jsx');
const pageSource = fs.readFileSync(pagePath, 'utf8');

test('PlanoContasPage publica estado de eliminacao e contexto no shell', () => {
  assert.match(pageSource, /canDelete/);
  assert.match(pageSource, /deleting/);
  assert.match(pageSource, /context: selectionState\.context/);
  assert.match(pageSource, /brana-plano-contas-toolbar-state/);
});

test('PlanoContasPage registra listener de toolbar uma unica vez', () => {
  assert.match(pageSource, /window\.addEventListener\('brana-plano-contas-toolbar-action'/);
  assert.match(pageSource, /return \(\) => window\.removeEventListener\('brana-plano-contas-toolbar-action'/);
  assert.match(pageSource, /useEffect\(\(\) => \{/);
  assert.match(pageSource, /\}, \[\]\);/);
});

test('PlanoContasPage aciona confirmacao simples de exclusao da categoria', () => {
  assert.match(pageSource, /Eliminar categoria/);
  assert.match(pageSource, /Confirma a exclusão da categoria/);
  assert.match(pageSource, /eliminar-categoria/);
  assert.match(pageSource, /handleDeleteCategory/);
  assert.match(pageSource, /setDeleteConfirmOpen\(true\)/);
});
