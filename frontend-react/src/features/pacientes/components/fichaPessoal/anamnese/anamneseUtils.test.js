import test from 'node:test';
import assert from 'node:assert/strict';
import { ANAMNESE_QUESTION_STRUCTURE, answerMode, itemsEqual, nextYesNoAnswer, normalizeAnswer, serializeLocalAnswer, shouldShowAlert } from './anamneseUtils.js';

test('normaliza respostas sim e nao', () => {
  assert.deepEqual(normalizeAnswer('Sim', 1), { answer: 'sim', complement: '' });
  assert.deepEqual(normalizeAnswer('não', 1), { answer: 'nao', complement: '' });
});

test('mantem complemento do tipo 2 e texto do tipo 3', () => {
  assert.deepEqual(normalizeAnswer('observacao', 2), { answer: '', complement: 'observacao' });
  assert.deepEqual(normalizeAnswer('resposta livre', 3), { answer: 'resposta livre', complement: '' });
  assert.deepEqual(normalizeAnswer('{"tipo_resposta":2,"resposta":"sim","complemento":"teste"}', 2), { answer: 'sim', complement: 'teste' });
});

test('alerta critico depende do tipo da pergunta e resposta', () => {
  assert.equal(shouldShowAlert({ tipo_pergunta: 2 }, 'sim'), true);
  assert.equal(shouldShowAlert({ tipo_pergunta: 2 }, 'nao'), false);
  assert.equal(shouldShowAlert({ tipo_pergunta: 3 }, 'nao'), true);
  assert.equal(shouldShowAlert({ tipo_pergunta: 3 }, 'sim'), false);
  assert.equal(shouldShowAlert({ tipo_pergunta: 1 }, 'sim'), false);
});

test('todos os tipos usam o mesmo molde estrutural', () => {
  assert.deepEqual(ANAMNESE_QUESTION_STRUCTURE, [
    'ficha-anamnese-card',
    'ficha-anamnese-question-head',
    'ficha-anamnese-answer-row',
    'ficha-anamnese-opcoes',
    'ficha-anamnese-answer-slot',
  ]);
  assert.equal(answerMode(1), 'yes-no');
  assert.equal(answerMode(2), 'complement');
  assert.equal(answerMode(3), 'text');
});

test('draft compara valores normalizados e serializa edicoes locais', () => {
  const base = [{ pergunta_id: 1, tipo_resposta: 1, resposta: null }];
  assert.equal(itemsEqual(base, [{ pergunta_id: 1, tipo_resposta: 1, resposta: '' }]), true);
  assert.equal(itemsEqual(base, [{ pergunta_id: 1, tipo_resposta: 1, resposta: 'sim' }]), false);
  assert.equal(serializeLocalAnswer({ tipo_resposta: 2 }, 'sim', 'observacao'), '{"resposta":"sim","complemento":"observacao"}');
  assert.equal(serializeLocalAnswer({ tipo_resposta: 3 }, 'texto', ''), 'texto');
});

test('reclique no radio preserva a resposta e o complemento do tipo 2', () => {
  assert.equal(nextYesNoAnswer('', 'sim'), 'sim');
  assert.equal(nextYesNoAnswer('sim', 'sim'), 'sim');
  assert.equal(nextYesNoAnswer('nao', 'nao'), 'nao');
  assert.equal(serializeLocalAnswer({ tipo_resposta: 1 }, '', ''), '');
  assert.equal(serializeLocalAnswer({ tipo_resposta: 2 }, '', 'observacao'), '{"resposta":"","complemento":"observacao"}');
  assert.equal(shouldShowAlert({ tipo_pergunta: 2 }, ''), false);
});

test('matriz Sim/Nao e deterministica para tipo 1 e tipo 2', () => {
  const sequence = (initial, clicks) => clicks.reduce((answer, selected) => nextYesNoAnswer(answer, selected), initial);
  for (const type of [1, 2]) {
    assert.equal(sequence('', ['sim']), 'sim', `tipo ${type}: vazio para Sim`);
    assert.equal(sequence('sim', ['sim']), 'sim', `tipo ${type}: reclique Sim`);
    assert.equal(sequence('', ['nao']), 'nao', `tipo ${type}: vazio para Nao`);
    assert.equal(sequence('nao', ['nao']), 'nao', `tipo ${type}: reclique Nao`);
    assert.equal(sequence('sim', ['nao']), 'nao', `tipo ${type}: Sim para Nao`);
    assert.equal(sequence('nao', ['sim']), 'sim', `tipo ${type}: Nao para Sim`);
    assert.equal(sequence('', ['sim', 'sim', 'sim', 'sim']), 'sim', `tipo ${type}: re-cliques repetidos`);
  }
});
