import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPrestadorModalDraft,
  buildPrestadorModalPayload,
  validatePrestadorModalDraft,
} from '../src/features/prestadores/components/prestadorForm/prestadorModalState.js';

test('draft compartilhado da NP-6 nasce com defaults coerentes nas quatro abas', () => {
  const draft = buildPrestadorModalDraft([{ codigo: '001' }, { codigo: '002' }]);
  assert.equal(draft.codigo, '');
  assert.equal(draft.nome, '');
  assert.equal(draft.tipo_prestador, 'Cirurgião dentista');
  assert.equal(draft.fone1_tipo, 'Residencial');
  assert.equal(draft.fone2_tipo, 'Comercial');
  assert.equal(draft.cidade, 'São José do Rio Preto');
  assert.equal(draft.uf, 'SP');
  assert.deepEqual(draft.especialidades_exec, []);
  assert.equal(draft.observacoes, '');
});

test('payload compartilhado consolida todas as abas sem POST', () => {
  const payload = buildPrestadorModalPayload({
    codigo: '010',
    nome: 'Prestador Teste',
    tipo_prestador: 'Cirurgião dentista',
    inicio: null,
    termino: null,
    inativo: false,
    executa_procedimento: true,
    fone1_tipo: 'Residencial',
    fone1: '1234',
    fone2_tipo: 'Comercial',
    fone2: '5678',
    banco: 'Banco do Brasil',
    modo_pagamento: 'PIX',
    especialidades_exec: ['Cirurgia'],
    observacoes: 'Obs',
  });
  assert.equal(payload.codigo, '');
  assert.equal(payload.nome, 'Prestador Teste');
  assert.equal(payload.ativo, true);
  assert.deepEqual(payload.especialidades_exec, ['Cirurgia']);
  assert.equal(payload.observacoes, 'Obs');
  assert.doesNotMatch(JSON.stringify(payload), /POST|PUT|DELETE/);
});

test('observacoes multiline preserva quebras no draft e no payload', () => {
  const observacoes = 'Linha 1\nLinha 2\n\nLinha 4';
  const draft = buildPrestadorModalDraft([], { observacoes });
  const payload = buildPrestadorModalPayload(draft);

  assert.equal(draft.observacoes, observacoes);
  assert.equal(payload.observacoes, observacoes);
});

test('payload em modo de edicao preserva codigo e alteracao', () => {
  const payload = buildPrestadorModalPayload({
    codigo: '006',
    nome: 'Prestador Teste',
    alteracao: new Date().toLocaleDateString('pt-BR'),
  }, { mode: 'edit' });
  assert.equal(payload.codigo, '006');
  assert.match(payload.alteracao, /\d{2}\/\d{2}\/\d{4}/);
});

test('validação da NP-6 bloqueia campos obrigatórios vazios', () => {
  const invalid = validatePrestadorModalDraft({ nome: '', tipo_prestador: '' });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 1);
  const valid = validatePrestadorModalDraft({ nome: 'A', tipo_prestador: 'Cirurgião dentista' });
  assert.equal(valid.isValid, true);
});

test('draft do modal volta ao default ao recriar a abertura', () => {
  const firstDraft = buildPrestadorModalDraft([{ codigo: '001' }]);
  firstDraft.nome = 'Prestador editado';
  firstDraft.observacoes = 'rascunho temporario';

  const reopenedDraft = buildPrestadorModalDraft([{ codigo: '001' }]);

  assert.equal(reopenedDraft.nome, '');
  assert.equal(reopenedDraft.observacoes, '');
  assert.equal(reopenedDraft.codigo, '');
  assert.notStrictEqual(reopenedDraft, firstDraft);
});

test('draft de edicao hidrate valores persistidos sem regenerar defaults', () => {
  const record = {
    codigo: '006',
    nome: 'TESTE NP9 ALTERA',
    apelido: 'Editado',
    tipo_prestador: 'Cirurgião dentista',
    inicio: '21/08/2026',
    termino: '',
    ativo: true,
    executa_procedimento: false,
    fone1_tipo: 'Residencial',
    fone1: '17 99999-9999',
    fone2_tipo: 'Comercial',
    fone2: '17 98888-8888',
    email: 'teste@brana.com',
    homepage: 'https://brana.com',
    logradouro_tipo: 'Rua',
    endereco: 'Rua A',
    numero: '10',
    complemento: 'Sala 2',
    bairro: 'Centro',
    cidade: 'São José do Rio Preto',
    cep: '15000-000',
    uf: 'SP',
    banco: 'Banco do Brasil',
    agencia: '1234',
    conta: '56789',
    nome_conta: 'Conta teste',
    modo_pagamento: 'PIX',
    faculdade: 'FAMERP',
    formatura: '2012',
    alerta_agendamentos: 'Alertar',
    especialidades_exec: ['Cirurgia'],
    observacoes: 'Obs persistida',
    inclusao: '20/08/2026',
    alteracao: '21/08/2026',
    id_interno: '950601',
  };
  const draft = buildPrestadorModalDraft([], record);
  assert.equal(draft.codigo, '006');
  assert.equal(draft.nome, 'TESTE NP9 ALTERA');
  assert.equal(draft.apelido, 'Editado');
  assert.equal(draft.fone1_tipo, 'Residencial');
  assert.equal(draft.bairro, 'Centro');
  assert.equal(draft.observacoes, 'Obs persistida');
});
