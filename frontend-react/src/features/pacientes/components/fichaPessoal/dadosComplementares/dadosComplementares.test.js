import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COMPLEMENTARY_SELECT_FIELDS, COMPLEMENTARY_TEXT_FIELDS, EMPTY_COMPLEMENTARY, normalizeComplementary, optionsWithCurrent } from './dadosComplementaresOptions.js';
import { listarAuxiliarFicha } from '../fichaPessoalApi.js';
import { buildPacientePayload } from '../useFichaPessoalForm.js';

test('normaliza itens auxiliares pelo texto descricao, sem [object Object]', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify([
    { id: 1, descricao: 'Estado civil' },
    { id: 2, descricao: 'Bairro central' },
    { id: 3, descricao: '' },
  ]), { status: 200, headers: { 'Content-Type': 'application/json' } });

  try {
    const values = await listarAuxiliarFicha('Estado civil');
    assert.deepEqual(values, ['Estado civil', 'Bairro central']);
    assert.ok(values.every((value) => typeof value === 'string'));
    assert.ok(!values.includes('[object Object]'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Dados complementares define os campos e flags do contrato', () => {
  assert.equal(COMPLEMENTARY_TEXT_FIELDS.length + COMPLEMENTARY_SELECT_FIELDS.length, 26);
  assert.equal(Object.keys(EMPTY_COMPLEMENTARY).length, 28);
  assert.equal(EMPTY_COMPLEMENTARY.publico, false);
  assert.equal(EMPTY_COMPLEMENTARY.titular, false);
});

test('hidrata strings ausentes como vazias e flags ausentes como false', () => {
  const value = normalizeComplementary({ profissao: ' Dentista ', publico: 0 });
  assert.equal(value.profissao, ' Dentista ');
  assert.equal(value.nome_pai, '');
  assert.equal(value.publico, false);
  assert.equal(value.titular, false);
});

test('usa a chave contratada horario_trab para horário de trabalho', () => {
  const value = normalizeComplementary({ horario_trab: '08:00-18:00', horario_trabalho: 'incorreto' });
  assert.equal(value.horario_trab, '08:00-18:00');
  assert.equal(value.horario_trabalho, undefined);
});

test('preserva valor histórico fora do catálogo sem duplicar valor existente', () => {
  assert.deepEqual(optionsWithCurrent(['SP', 'RJ'], 'MG'), ['MG', 'SP', 'RJ']);
  assert.deepEqual(optionsWithCurrent(['SP', 'RJ'], 'RJ'), ['SP', 'RJ']);
});

test('não usa a coluna principal de apelido para hidratar o campo complementar', () => {
  const value = normalizeComplementary({ apelido: 'Extra' });
  assert.equal(value.apelido, 'Extra');
  assert.equal(value.apelido, 'Extra');
});

test('Grava mantém matricula fora de extra e envia complementares como valores simples', () => {
  const payload = buildPacientePayload({
    nome: 'Paciente Teste', matricula: 'PR-42', apelido: 'Apelido extra', horario_trab: '08:00',
    complementares: { responsavel: 'Responsavel', cpf_responsavel: '123', nome_pai: 'Pai', nome_mae: 'Mae', nome_conjuge: 'Conjuge', apelido: 'Apelido extra', horario_trab: '08:00', publico: true, titular: false, unidade_atendimento: 'Unidade', cirurgiao_responsavel: 'Cirurgiao', palavra_chave_1: 'Chave' },
  });
  assert.equal(payload.matricula, 'PR-42');
  assert.equal(payload.extra.apelido, 'Apelido extra');
  assert.equal(payload.extra.horario_trab, '08:00');
  assert.equal(payload.extra.publico, true);
  assert.equal(payload.extra.titular, false);
  assert.equal(payload.extra.paciente_id, undefined);
  assert.equal(payload.extra.horario_trabalho, undefined);
  assert.equal(payload.extra.unidade_atendimento, 'Unidade');
  assert.equal(payload.extra.palavra_chave_1, 'Chave');
  assert.equal(Object.prototype.hasOwnProperty.call(payload, 'apelido'), false);
});
