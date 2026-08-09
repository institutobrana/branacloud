import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countSimbolosGraficosRows,
  resolveSimbolosGraficosSelection,
} from '../src/features/simbolosGraficos/simbolosGraficosTableState.js';
import { applySimbolosGraficosEspecialidadeNames, mapSimbolosGraficosResponse } from '../src/features/simbolosGraficos/simbolosGraficosMapper.js';

test('Especialidade textual e resolvida pelo catalogo oficial', () => {
  const rows = applySimbolosGraficosEspecialidadeNames(
    [
      { id: 1, nome: 'Sorriso', especialidade: 1 },
      { id: 2, nome: 'Face', especialidade: null },
      { id: 3, nome: 'Branqueamento', especialidade: 12 },
      { id: 4, nome: 'Outro', especialidade: 'Estética' },
    ],
    [
      { id: 1, codigo: '1', nome: 'Dentística' },
      { id: 2, codigo: '2', nome: 'Prótese' },
      { id: 5, codigo: '5', nome: 'Gerais' },
      { id: 6, codigo: '6', nome: 'Cirurgia' },
      { id: 7, codigo: '7', nome: 'Ortodontia' },
      { id: 8, codigo: '8', nome: 'Prevenção' },
      { id: 12, codigo: '12', nome: 'Estética' },
    ],
  );

  assert.equal(rows[0].especialidade, 'Dentística');
  assert.equal(rows[0].especialidadeCodigo, 1);
  assert.equal(rows[1].especialidade, null);
  assert.equal(rows[2].especialidade, 'Estética');
  assert.equal(rows[2].especialidadeCodigo, 12);
  assert.equal(rows[3].especialidade, 'Estética');
  assert.equal(rows[3].especialidadeCodigo, null);
});

test('mapper normaliza lista sem inventar valores', () => {
  const rows = mapSimbolosGraficosResponse([{ id: '3', descricao: 'Item', especialidade: 6 }]);
  assert.equal(rows[0].nome, 'Item');
  assert.equal(rows[0].especialidade, 'Cirurgia');
  assert.equal(rows[0].especialidadeCodigo, 6);
});

test('seleção e contador continuam simples', () => {
  const rows = [
    { id: 10, nome: 'Alpha' },
    { id: 20, nome: 'Beta' },
  ];
  assert.equal(resolveSimbolosGraficosSelection(20, rows), 20);
  assert.equal(resolveSimbolosGraficosSelection(30, rows), null);
  assert.deepEqual(countSimbolosGraficosRows(rows), { totalCount: 2 });
});

test('hook é isolado de JSX, mutações e tenant', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(here, '..');
  const hookSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/hooks/useSimbolosGraficosTableState.js'), 'utf8');
  assert.doesNotMatch(hookSource, /<[^>]+>/);
  assert.doesNotMatch(hookSource, /post|put|patch|delete|clinica_id|tenantId|userId|window\.location/i);
  assert.match(hookSource, /scope:\s*'catalogo'/);
  assert.doesNotMatch(hookSource, /scope:\s*'biblioteca'/);
});
