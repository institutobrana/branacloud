import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAgendaEventPresentation } from '../src/features/agendaSemanal/components/agendaEventPresentation.js';

const config = {
  apresentacao_particular_cor: '#ffff00',
  apresentacao_convenio_cor: '#0000ff',
  apresentacao_compromisso_cor: '#00e5ef',
  apresentacao_fonte: { family: 'MS Sans Serif', size: 8, bold: false, italic: false, underline: false, strike: false, color: '#000000' },
};

test('resolve apresentação por tipo e configuração do prestador', () => {
  assert.equal(resolveAgendaEventPresentation({ type: 1, patientId: 10 }, config).backgroundColor, '#ffff00');
  assert.equal(resolveAgendaEventPresentation({ type: 2 }, config).backgroundColor, '#00e5ef');
  assert.equal(resolveAgendaEventPresentation({ type: 0, patientId: 10 }, config).backgroundColor, '#ffff00');
});

test('preserva override visual explícito do evento e aplica fonte em pt', () => {
  const style = resolveAgendaEventPresentation({ type: 1, backgroundColor: '#123456', textColor: '#fff' }, config);
  assert.equal(style.backgroundColor, '#123456');
  assert.equal(style.color, '#fff');
  assert.equal(style.fontFamily, 'MS Sans Serif');
  assert.equal(style.fontSize, '8pt');
  assert.equal(style.borderColor, '#123456');
});

const statusCatalog = [
  { id: 7, codigo: '07', valor_int: 7, cor_apresentacao: '#008000' },
  { id: 3, codigo: '03', valor_int: 3, cor_apresentacao: '' },
];

test('status com cor sobrescreve a cor por tipo', () => {
  assert.equal(resolveAgendaEventPresentation({ status: 7, type: 1 }, config, statusCatalog).backgroundColor, '#008000');
});

test('status sem cor cai para o tipo', () => {
  assert.equal(resolveAgendaEventPresentation({ status: 3, type: 2 }, config, statusCatalog).backgroundColor, '#00e5ef');
});

test('status desconhecido mantém fallback normal', () => {
  assert.equal(resolveAgendaEventPresentation({ status: 999, type: 1 }, config, statusCatalog).backgroundColor, '#ffff00');
});

test('status catalogado aceita codigo e valor_int como chaves equivalentes', () => {
  assert.equal(resolveAgendaEventPresentation({ status: '07', type: 1 }, config, statusCatalog).backgroundColor, '#008000');
});
