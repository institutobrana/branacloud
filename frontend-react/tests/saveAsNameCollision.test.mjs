import test from 'node:test';
import assert from 'node:assert/strict';
import { findSaveAsNameCollisions, canReplaceSaveAsCollision } from '../src/features/editorTextos/models/saveAsNameCollision.js';

test('Save As finds equal names across model categories, case-insensitively and ignoring outer spaces', () => {
  const items = [
    { id: 2, nome: 'ATESTADO_TEL_BRANA', tipo_modelo: 'atestados' },
    { id: 3, nome: 'Outro', tipo_modelo: 'outros' },
    { id: 4, nome: ' Atestado_Tel_Brana ', tipo_modelo: 'outros', sistema: true },
  ];
  assert.deepEqual(findSaveAsNameCollisions(items, ' atestado_tel_brana '), [items[0], items[2]]);
});

test('Save As may replace only a clinic-owned persisted model, never a base/system model', () => {
  assert.equal(canReplaceSaveAsCollision({ id: 7, sistema: false }), true);
  assert.equal(canReplaceSaveAsCollision({ id: 8, sistema: true }), false);
  assert.equal(canReplaceSaveAsCollision({ sistema: false }), false);
});
