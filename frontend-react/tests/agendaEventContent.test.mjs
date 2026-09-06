import test from 'node:test';
import assert from 'node:assert/strict';
import { agendaEventContentLines } from '../src/features/agendaSemanal/utils/agendaEventContent.js';

const event = {
  start: new Date('2026-08-27T08:00:00'),
  patientName: 'Ana Carolina Gomes Ferreira',
  patientId: 42,
  metadata: { nro_pac: 42, cod_prontuario: 'P-7', matricula: 'M-8', fone1: '111', fone2: '222', convenio_nome: 'Plano A', tabela_nome: 'Tabela B', sala: '2', motivo: 'Consulta' },
};

test('visualizacao reproduz as quatro linhas configuradas do legado', () => {
  const lines = agendaEventContentLines(event, { visualizacao_campos: ['Número do paciente', 'Nome do paciente', 'Fone 1', 'Fone 2', 'Sala'] });
  assert.deepEqual(lines.map((line) => line.text), ['08:00 - 42', 'Ana Carolina Gomes Ferreira', '111 | 222', 'Sala: 2']);
});

test('visualizacao do Dia mantém as três colunas do legado', () => {
  const lines = agendaEventContentLines(event, { visualizacao_campos: ['Número do paciente', 'Nome do paciente'] }, 'day');
  assert.deepEqual(lines.map((line) => line.text), ['08:00 - 42 - Ana Carolina Gomes Ferreira', 'Consulta', '111 | 222']);
});
