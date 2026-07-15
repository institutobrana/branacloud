import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const toolbarPath = path.resolve('src/features/planoContas/components/PlanoContasToolbar.jsx');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');

test('PlanoContasToolbar desabilita Eliminar sem categoria, em loading, saving ou deleting', () => {
  assert.match(toolbarSource, /disabled=\{!canDelete \|\| saving \|\| deleting\}/);
  assert.match(toolbarSource, /onDeleteCategory/);
  assert.match(toolbarSource, /canDelete = false/);
});

test('PlanoContasToolbar preserva o fluxo das demais acoes', () => {
  assert.match(toolbarSource, /Novo grupo/);
  assert.match(toolbarSource, /Nova categoria/);
  assert.match(toolbarSource, /Alterar/);
  assert.match(toolbarSource, /Fechar/);
});
