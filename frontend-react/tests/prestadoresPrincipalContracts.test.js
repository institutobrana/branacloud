import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  PRESTADOR_CBO_DEFAULT,
  PRESTADOR_CBO_OPTIONS,
  PRESTADOR_ESTADO_CIVIL_OPTIONS,
  PRESTADOR_PREFIXO_OPTIONS,
  PRESTADOR_SEXO_OPTIONS,
  PRESTADOR_TIPO_DEFAULT,
  PRESTADOR_TIPO_OPTIONS,
  PRESTADOR_UF_CRO_OPTIONS,
  buildPrestadorPrincipalDefaults,
} from '../src/features/prestadores/components/prestadorForm/prestadorPrincipalContracts.js';

test('catalogos reais da Principal preservam contrato de labels persistidas', () => {
  assert.equal(PRESTADOR_TIPO_DEFAULT, 'Cirurgião dentista');
  assert.equal(PRESTADOR_CBO_DEFAULT, 'Cir.Dentista em Geral');
  assert.deepEqual(
    PRESTADOR_TIPO_OPTIONS.map((item) => item.label),
    ['Cirurgião dentista', 'Clínica odontológica', 'Clínica ortodôntica', 'Clínica radiológica', 'Perito'],
  );
  assert.deepEqual(
    PRESTADOR_CBO_OPTIONS.map((item) => item.label),
    [
      'Cir.Dentista em Geral',
      'Cir.Dentista (saúde pública)',
      'Cir.Dentista (traumatologia buco maxilo facial)',
      'Cir.Dentista (endodontia)',
      'Cir.Dentista (ortodontia)',
      'Cir.Dentista (patologia bucal)',
      'Cir.Dentista (pediatria)',
      'Cir.Dentista (prótese)',
      'Cir.Dentista (radiologia)',
      'Cir.Dentista (periodontia)',
    ],
  );
  assert.deepEqual(PRESTADOR_SEXO_OPTIONS.map((item) => item.label), ['Masculino', 'Feminino']);
  assert.ok(PRESTADOR_ESTADO_CIVIL_OPTIONS.some((item) => item.label === 'Casado(a)'));
  assert.ok(PRESTADOR_ESTADO_CIVIL_OPTIONS.some((item) => item.label === 'União Estável'));
  assert.deepEqual(PRESTADOR_PREFIXO_OPTIONS.map((item) => item.label), ['Dr', 'Dra', 'Sr', 'Sra']);
  assert.equal(PRESTADOR_UF_CRO_OPTIONS[0].label, 'AC');
});

test('defaults da Principal mantêm contrato do novo prestador', () => {
  const defaults = buildPrestadorPrincipalDefaults([
    { codigo: '001' },
    { codigo: '009' },
    { codigo: '010' },
  ]);
  assert.equal(defaults.codigo, '');
  assert.equal(defaults.tipo_prestador, 'Cirurgião dentista');
  assert.equal(defaults.inicio, new Date().toLocaleDateString('pt-BR'));
  assert.equal(defaults.termino, '');
  assert.equal(defaults.inativo, false);
  assert.equal(defaults.executa_procedimento, true);
  assert.equal(defaults.cbos, 'Cir.Dentista em Geral');
});

test('nascimento compartilha o mesmo contrato visual/estrutural de data', () => {
  const principalSource = fs.readFileSync(
    path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/PrestadorPrincipalTab.jsx'),
    'utf8',
  );
  assert.match(principalSource, /<Field label="Nascimento" className="prestadores-modal-field--date">/);
  assert.match(principalSource, /<DatePickerEntry value=\{form\.nascimento \?\? null\} onChange=\{\(value\) => updateDraft\(\{ nascimento: value \}\)\} \/>/);
  assert.doesNotMatch(principalSource, /<DatePicker format="DD\/MM\/YYYY" placeholder="__\/__\/____" \/>/);
});
