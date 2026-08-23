import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AGENDA_FONTE_COLOR_OPTIONS,
  AGENDA_FONTE_DEFAULTS,
  AGENDA_FONTE_FAMILIES,
  AGENDA_FONTE_SCRIPT_OPTIONS,
  AGENDA_FONTE_SIZE_OPTIONS,
  AGENDA_FONTE_STYLE_OPTIONS,
  buildAgendaFontePreviewStyle,
  getAgendaFonteColor,
  getAgendaFonteStyleLabel,
  normalizeAgendaFonteValue,
} from '../src/features/agendaConfiguracao/agendaConfiguracaoFonte.js';

test('Fonte nasce com contrato legado e lista fixa de familias', () => {
  assert.deepEqual(AGENDA_FONTE_DEFAULTS, {
    family: 'MS Sans Serif',
    bold: false,
    italic: false,
    size: 8,
    strike: false,
    underline: false,
    color: '#000000',
    script: 'Ocidental',
  });
  assert.deepEqual(AGENDA_FONTE_FAMILIES, [
    'MS Sans Serif',
    'MS Serif',
    'Arial',
    'Tahoma',
    'Verdana',
    'Times New Roman',
    'Courier New',
    'Segoe UI',
  ]);
});

test('Fonte preserva estilos, tamanhos, script e cores do legado', () => {
  assert.deepEqual(AGENDA_FONTE_STYLE_OPTIONS.map((item) => item.label), [
    'Regular',
    'Oblíquo',
    'Negrito',
    'Oblíquo e negrito',
  ]);
  assert.equal(getAgendaFonteStyleLabel({ bold: true, italic: false }), 'Negrito');
  assert.equal(getAgendaFonteStyleLabel({ bold: false, italic: true }), 'Oblíquo');
  assert.deepEqual(AGENDA_FONTE_SCRIPT_OPTIONS, [
    { value: 'Ocidental', label: 'Ocidental' },
  ]);
  assert.equal(AGENDA_FONTE_SIZE_OPTIONS[0], 8);
  assert.equal(AGENDA_FONTE_SIZE_OPTIONS[1], 9);
  assert.equal(AGENDA_FONTE_SIZE_OPTIONS[4], 12);
  assert.equal(AGENDA_FONTE_SIZE_OPTIONS.at(-1), 74);
  assert.equal(AGENDA_FONTE_SIZE_OPTIONS.length, 36);
  assert.equal(AGENDA_FONTE_COLOR_OPTIONS.length, 16);
  assert.equal(getAgendaFonteColor('#ff0000').label, 'Vermelho');
  assert.equal(getAgendaFonteColor('#000000').label, 'Preto');
});

test('Fonte normaliza contratos parciais e gera preview em tempo real', () => {
  const fonte = normalizeAgendaFonteValue({
    family: 'Tahoma',
    bold: true,
    italic: true,
    size: 15,
    strike: true,
    underline: true,
    color: '#ff0000',
    script: 'Ocidental',
  });

  assert.deepEqual(fonte, {
    family: 'Tahoma',
    bold: true,
    italic: true,
    size: 15,
    strike: true,
    underline: true,
    color: '#ff0000',
    script: 'Ocidental',
  });

  const style = buildAgendaFontePreviewStyle(fonte);
  assert.equal(style.fontFamily, 'Tahoma');
  assert.equal(style.fontSize, '15px');
  assert.equal(style.fontWeight, '700');
  assert.equal(style.fontStyle, 'italic');
  assert.equal(style.color, '#ff0000');
  assert.equal(style.textDecoration, 'underline line-through');
});
