import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAgendaProviders, normalizeAgendaCatalogs } from '../src/features/agendaSemanal/hooks/useAgendaFilters.js';

test('normaliza catálogos em opções primitivas e preserva valores neutros', () => {
  const catalogs = normalizeAgendaCatalogs({
    especialidades: [{ codigo: 'Endodontia', nome: 'Endodontia' }],
    prestadores: [{ id: 1, nome: 'Gleisson Tel', especialidade: 'Endodontia' }],
    unidades: [{ id: 2, nome: 'Centro' }],
  });
  assert.deepEqual(catalogs.especialidades[0], { value: 'Endodontia', label: 'Endodontia' });
  assert.deepEqual(catalogs.prestadores[0], {
    id: 1,
    nome: 'Gleisson Tel',
    value: '1',
    label: 'Gleisson Tel',
    especialidade: 'Endodontia',
    especialidadesExec: [],
    agenda_config: {},
  });
  assert.equal(catalogs.unidades[0].value, '2');
});

test('especialidade filtra prestadores pelo campo principal ou lista executada', () => {
  const providers = normalizeAgendaCatalogs({ prestadores: [
    { id: 1, nome: 'A', especialidade: 'Endodontia' },
    { id: 2, nome: 'B', especialidades_exec: ['Cirurgia'] },
    { id: 3, nome: 'C', especialidade: 'Ortodontia' },
  ] }).prestadores;
  assert.deepEqual(filterAgendaProviders(providers, 'Endodontia').map((item) => item.value), ['1']);
  assert.deepEqual(filterAgendaProviders(providers, 'Cirurgia').map((item) => item.value), ['2']);
  assert.equal(filterAgendaProviders(providers, '').length, 3);
});
