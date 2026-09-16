import test from 'node:test';
import assert from 'node:assert/strict';
import { formatHistoricoDate, handleHistoricoEditorKeyDown, historicoHexToInteger, historicoIntegerToCss, historicoRowColor, resolveCurrentPrestador } from './historicoPacienteUtils.js';

test('formata datas do contrato sem deslocamento de fuso', () => {
  assert.equal(formatHistoricoDate('2016-10-07'), '07/10/2016');
  assert.equal(formatHistoricoDate(''), '');
});

test('preserva região e campos vazios para renderização', () => {
  assert.equal(String(null || ''), '');
  assert.equal(String('37'), '37');
});

test('mapeia apenas o branco comprovado e não inventa paleta', () => {
  assert.equal(historicoRowColor(16777215), '#ffffff');
  assert.equal(historicoRowColor(16711680), '#ff0000');
  assert.equal(historicoIntegerToCss(16777215), '#ffffff');
  assert.equal(historicoHexToInteger('#ffffff'), 16777215);
});

test('consome Escape localmente e cancela somente o editor', () => {
  const calls = [];
  const event = { key: 'Escape', preventDefault: () => calls.push('prevent'), stopPropagation: () => calls.push('stop') };
  assert.equal(handleHistoricoEditorKeyDown(event, { onEscape: () => calls.push('cancel') }), 'escape');
  assert.deepEqual(calls, ['prevent', 'stop', 'cancel']);
});

test('mantém Enter separado de Escape', () => {
  const calls = [];
  const event = { key: 'Enter', preventDefault: () => calls.push('prevent'), stopPropagation: () => calls.push('stop') };
  assert.equal(handleHistoricoEditorKeyDown(event, { onEnter: () => calls.push('confirm'), onEscape: () => calls.push('cancel') }), 'enter');
  assert.deepEqual(calls, ['prevent', 'stop', 'confirm']);
});

test('resolve o apelido pelo prestador_id do usuário, não pelo nome do usuário', () => {
  const prestador = resolveCurrentPrestador({ id: 99, nome: 'Usuário do sistema', prestador_id: 2 }, [
    { id: 1, apelido: 'Outro' },
    { id: 2, apelido: 'Tel', nome: 'Gleisson Tel' },
  ]);
  assert.equal(prestador.apelido, 'Tel');
});

test('não cria fallback quando usuário não possui prestador', () => {
  assert.equal(resolveCurrentPrestador({ id: 99, nome: 'Usuário do sistema' }, [{ id: 1, apelido: 'Tel' }]), null);
  assert.equal(resolveCurrentPrestador({ prestador_id: 7 }, [{ id: 1, apelido: 'Tel' }]), null);
});
