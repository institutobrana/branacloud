import test from 'node:test';
import assert from 'node:assert/strict';

function normalizeCatalogValue(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;
  return /^\d+$/.test(raw) ? String(Number(raw)) : raw;
}

test('tipo de indicacao usa codigo do catalogo e preserva label separado', () => {
  const option = { id: 99, codigo: '01', descricao: 'Paciente' };
  assert.equal(normalizeCatalogValue(option.codigo), '1');
  assert.equal(option.descricao, 'Paciente');
  assert.equal(normalizeCatalogValue(1), '1');
});
