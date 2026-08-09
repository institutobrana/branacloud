import test from 'node:test';
import assert from 'node:assert/strict';

import { mapSimboloGraficoCreatePayload } from '../src/features/simbolosGraficos/model/simboloGraficoCreateMapper.js';

test('mapSimboloGraficoCreatePayload gera payload basico puro e preserva a entrada', () => {
  const state = {
    nome: '  Símbolo novo  ',
    especialidade: '01',
    formaMarcacao: 2,
  };

  const catalogs = {
    especialidades: [{ value: '01', label: 'Dentística' }],
    biblioteca: [],
  };

  const snapshot = structuredClone(state);
  const payload = mapSimboloGraficoCreatePayload(state, catalogs);

  assert.deepEqual(payload, {
    descricao: 'Símbolo novo',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
    legacy_id: null,
    codigo: 'simbolo_novo.bmp',
    imagem_custom: null,
    desenho: null,
    bibliotecaSelecionadaId: null,
    bibliotecaSelecionada: '',
  });
  assert.deepEqual(state, snapshot);
});

test('mapSimboloGraficoCreatePayload rejeita entrada invalida sem retornar payload parcial', () => {
  const catalogs = {
    especialidades: [{ value: '01', label: 'Dentística' }],
    biblioteca: [],
  };

  assert.equal(mapSimboloGraficoCreatePayload({ nome: '   ', especialidade: '01', tipoSimbolo: 2, formaMarcacao: 2 }, catalogs), null);
  assert.equal(mapSimboloGraficoCreatePayload({ nome: 'Ok', especialidade: '', tipoSimbolo: 2, formaMarcacao: 2 }, catalogs), null);
  assert.equal(mapSimboloGraficoCreatePayload({ nome: 'Ok', especialidade: '99', tipoSimbolo: 2, formaMarcacao: 2 }, catalogs), null);
  assert.equal(mapSimboloGraficoCreatePayload({ nome: 'Ok', especialidade: '01', tipoSimbolo: 2, formaMarcacao: 9 }, catalogs), null);
  assert.deepEqual(mapSimboloGraficoCreatePayload({ nome: 'Ok', especialidade: '01', tipoSimbolo: 2, formaMarcacao: 2 }, { especialidades: catalogs.especialidades, biblioteca: [{ id: 10, code: 'sim_simb1', imageUrl: '' }] }), {
    descricao: 'Ok',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
    legacy_id: null,
    codigo: 'ok.bmp',
    imagem_custom: null,
    desenho: null,
    bibliotecaSelecionadaId: null,
    bibliotecaSelecionada: '',
  });
});
