import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildAttestadoBody, normalizeAttestadoDate, normalizeAttestadoTime } from '../src/features/editorTextos/models/atestadoAssistant.js';
import { normalizeContaCorrenteDateInput } from '../src/features/contaCorrenteCirurgiao/dateParsing.js';

const modalPath = new URL('../src/features/editorTextos/components/EditorTextosAtestadoAssistantModal.jsx', import.meta.url);
const modalSource = fs.readFileSync(modalPath, 'utf8');

test('Atestado uses the shared DateField contract for both dates', () => {
  assert.match(modalSource, /import \{ DateField \} from .*DadosPessoaisTab/);
  assert.equal((modalSource.match(/<DateField label="Data (?:inicial|final)"/g) || []).length, 2);
  assert.equal(normalizeContaCorrenteDateInput('22/09', '2026-09-22').format('DD/MM/YYYY'), '22/09/2026');
  assert.equal(normalizeContaCorrenteDateInput('22/09/2026', '2026-09-22').format('DD/MM/YYYY'), '22/09/2026');
  assert.equal(normalizeAttestadoDate('invalid'), '');
});

test('Atestado normalizes both time fields with the same finish-edit contract', () => {
  const cases = [
    ['7', '07:00'], ['07', '07:00'], ['7:00', '07:00'], ['07:00', '07:00'],
    ['730', '07:30'], ['0730', '07:30'], ['7:30', '07:30'], ['123', '01:23'],
    ['1230', '12:30'], ['0', '00:00'], ['00', '00:00'], ['2359', '23:59'],
  ];
  for (const [input, expected] of cases) assert.equal(normalizeAttestadoTime(input), expected, input);
  for (const input of ['24', '25', '2400', '2360', '99:99', '18:75', '25:00', '23:60']) {
    assert.equal(normalizeAttestadoTime(input), '', input);
  }
  assert.equal(normalizeAttestadoTime(''), '');
  assert.equal((modalSource.match(/<AttestadoTimeField label=/g) || []).length, 2);
  assert.equal((modalSource.match(/onBlur=\{commit\}/g) || []).length, 1);
  assert.equal((modalSource.match(/event\.key === 'Tab'/g) || []).length, 1);
});

test('Atestado body keeps the legacy composed contract and supplied values', () => {
  const body = buildAttestadoBody({ patientName: 'Paciente Teste', reason: 'Cirurgia', cid: 'K00.0 - Anodontia', observations: 'Observação segura', startDate: '22/09/2026', endDate: '23/09/2026', startTime: '730', endTime: '1230' });
  assert.match(body, /Paciente Teste/);
  assert.match(body, /22\/09\/2026 a 23\/09\/2026/);
  assert.match(body, /07:30 as 12:30/);
  assert.match(body, /por motivo de Cirurgia/);
  assert.match(body, /CID: K00\.0 - Anodontia/);
  assert.match(body, /Observação segura/);
});

test('Atestado body does not invent fields outside the legacy body inputs', () => {
  const body = buildAttestadoBody({ patientName: 'Paciente Teste', startDate: '22/09/2026', endDate: '23/09/2026' });
  assert.doesNotMatch(body, /Dias|Duração|<<.*>>/i);
});

test('Atestado merge boundary keeps a structured CID out of body interpolation', () => {
  const selectedCid = { codigo: 'K00.0', descricao: 'Anodontia' };
  const body = buildAttestadoBody({ patientName: 'Paciente Teste', cid: selectedCid.codigo, startDate: '22/09/2026' });
  assert.doesNotMatch(body, /\[object Object\]/);
  assert.match(body, /CID: K00\.0/);
});
