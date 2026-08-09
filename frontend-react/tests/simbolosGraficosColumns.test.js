import test from 'node:test';
import assert from 'node:assert/strict';
import { SIMBOLOS_GRAFICOS_COLUMNS, getSimbolosGraficosTableColumns } from '../src/features/simbolosGraficos/simbolosGraficosColumns.js';

test('colunas de simbolos graficos sao deterministicas e nao expõem id', () => {
  assert.equal(SIMBOLOS_GRAFICOS_COLUMNS.length, 2);
  assert.deepEqual(SIMBOLOS_GRAFICOS_COLUMNS.map((column) => column.key), ['nome', 'especialidade']);
  assert.deepEqual(SIMBOLOS_GRAFICOS_COLUMNS.map((column) => column.label), ['Nome', 'Especialidade']);
  assert.doesNotMatch(JSON.stringify(SIMBOLOS_GRAFICOS_COLUMNS), /"id"/);
  assert.doesNotMatch(JSON.stringify(SIMBOLOS_GRAFICOS_COLUMNS), /"origem"/);
});

test('getSimbolosGraficosTableColumns produz metadados de tabela', () => {
  const columns = getSimbolosGraficosTableColumns();
  assert.equal(columns.length, 2);
  assert.deepEqual(columns.map((column) => column.key), ['nome', 'especialidade']);
  assert.ok(columns.every((column) => typeof column.render === 'function'));
  assert.ok(columns.every((column) => column.width > 0));
});

test('colunas renderizam vazios como travessao neutro', () => {
  assert.equal(SIMBOLOS_GRAFICOS_COLUMNS[0].render({ nome: '' }), '—');
  assert.equal(SIMBOLOS_GRAFICOS_COLUMNS[1].render({ especialidade: null }), '—');
});
