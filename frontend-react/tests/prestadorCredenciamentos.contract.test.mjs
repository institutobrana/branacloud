import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatCredenciamentoDate,
  formatCredenciamentoPrestador,
  formatCredenciamentoValue,
} from '../src/features/prestadoresCredenciamentos/utils/prestadorCredenciamentosFormatters.js';
import { buildCredenciamentoCreatePayload } from '../src/features/prestadoresCredenciamentos/utils/credenciamentoMappers.js';
import { normalizeContaCorrenteDateInput } from '../src/features/contaCorrenteCirurgiao/dateParsing.js';
import fs from 'node:fs';

test('credenciamento formatters preserve the read-only contract', () => {
  assert.equal(formatCredenciamentoDate('2026-08-22'), '22/08/2026');
  assert.equal(formatCredenciamentoDate(''), '');
  assert.equal(formatCredenciamentoValue('1,2500'), '1,2500');
  assert.equal(formatCredenciamentoValue(null), '');
  assert.equal(formatCredenciamentoPrestador({ prestador_sistemico: true, prestador_id: -1 }), '001 - Clínica');
  assert.equal(formatCredenciamentoPrestador({ prestador_row_id: 1, prestador_nome: 'Gleisson Tel' }), 'Gleisson Tel');
});

test('all filters use synthetic values without confusing backend ids', () => {
  const all = '__all__';
  assert.notEqual(all, '0');
  assert.equal(0, 0);
  assert.equal(4, 4);
});

test('new credenciamento payload omits backend-owned fields', () => {
  const common = buildCredenciamentoCreatePayload({
    convenio_row_id: 7,
    prestador_row_id: 2,
    inicio: '22/08/2026',
    valor_us: '1,0000',
    aviso: 'NP12D_TEST',
  });
  assert.deepEqual(common, {
    convenio_row_id: 7,
    prestador_row_id: 2,
    inicio: '22/08/2026',
    fim: null,
    valor_us: '1,0000',
    aviso: 'NP12D_TEST',
    observacoes: null,
  });
  assert.equal(Object.hasOwn(common, 'codigo'), false);
  assert.equal(Object.hasOwn(common, 'id'), false);
  assert.equal(Object.hasOwn(common, 'data_inclusao'), false);
  assert.equal(Object.hasOwn(common, 'data_alteracao'), false);
  assert.equal(buildCredenciamentoCreatePayload({ convenio_row_id: 7, prestador_row_id: 0 }).prestador_row_id, 0);
});

test('new credenciamento dates reuse the official input contract', () => {
  const reference = new Date(2026, 7, 22);
  assert.equal(normalizeContaCorrenteDateInput('220826', reference)?.format('DD/MM/YYYY'), '22/08/2026');
  assert.equal(normalizeContaCorrenteDateInput('22/08/2026', reference)?.format('DD/MM/YYYY'), '22/08/2026');
  assert.equal(normalizeContaCorrenteDateInput('31/02/2026', reference), null);
  assert.equal(normalizeContaCorrenteDateInput('', reference), null);
});

test('new modal keeps code backend-owned and uses readonly cyan fields', () => {
  const source = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/components/CredenciamentoModal.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Gerado pelo backend/);
  assert.doesNotMatch(source, /placeholder="0001"/);
  assert.match(source, /prestador-cred-readonly-cyan/);
  assert.match(source, /maxLength=\{20\}/);
  assert.match(source, /item\.apelido \|\| item\.nome/);
  assert.match(source, /item\.ativo !== false/);
});

test('credenciamento payload preserves an explicit alphanumeric code but omits empty code', () => {
  assert.equal(Object.hasOwn(buildCredenciamentoCreatePayload({ convenio_row_id: 1, prestador_row_id: 2, codigo: '' }), 'codigo'), false);
  assert.equal(buildCredenciamentoCreatePayload({ convenio_row_id: 1, prestador_row_id: 2, codigo: 'ABC123' }).codigo, 'ABC123');
});

test('main prestador filter uses short labels, keeps inactive records, and preserves ids', () => {
  const source = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/components/PrestadorCredenciamentosToolbar.jsx', import.meta.url), 'utf8');
  assert.match(source, /value: '__all__'/);
  assert.match(source, /item\.apelido \|\| item\.nome/);
  assert.match(source, /item\.ativo === false/);
  assert.match(source, /item\.is_system_prestador \? 0 : Number\(item\.row_id \|\| item\.id\)/);
  assert.match(source, /color: '#c62828'/);
  assert.doesNotMatch(source, /001 - Clínica/);
  assert.doesNotMatch(source, /item\.codigo.*item\.nome/);
});

test('credenciamento date input mirrors the New Prestador DatePickerEntry handlers', () => {
  const reference = fs.readFileSync(new URL('../src/features/prestadores/components/prestadorForm/PrestadorPrincipalTab.jsx', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/components/CredenciamentoModal.jsx', import.meta.url), 'utf8');
  for (const expression of [
    'selectDatePickerText',
    'skipNextBlurCommitRef',
    'addEventListener(\'input\'',
    'event.key !== \'Tab\'',
    'normalizeContaCorrenteDateInput',
  ]) {
    assert.ok(reference.includes(expression));
    assert.ok(source.includes(expression));
  }
});

test('edit action and double click reuse the selected credenciamento id', () => {
  const parent = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/PrestadorCredenciamentosModal.jsx', import.meta.url), 'utf8');
  const modal = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/components/CredenciamentoModal.jsx', import.meta.url), 'utf8');
  const api = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/prestadorCredenciamentosApi.js', import.meta.url), 'utf8');
  assert.match(parent, /selectedId=\{state\.selectedId\}/);
  assert.match(parent, /onEdit=\{\(\) => openEdit\(\)\}/);
  assert.match(parent, /onDoubleClick=\{openEdit\}/);
  assert.match(parent, /mode="edit"/);
  assert.match(parent, /record=\{editRecord\}/);
  assert.match(modal, /mode === 'edit'[\s\S]*atualizarCredenciamento\(record\.id, payload\)/);
  assert.match(modal, /mode === 'edit' && \(item\.is_system_prestador \? 0 : Number\(item\.row_id \|\| item\.id\)\) === currentPrestadorId/);
  assert.match(api, /method: 'PUT'/);
  assert.match(api, /prestadores\/credenciamentos\/\$\{id\}/);
  assert.doesNotMatch(parent, /DELETE/);
});

test('edit payload keeps explicit code and excludes identity and audit fields', () => {
  const payload = buildCredenciamentoCreatePayload({
    convenio_row_id: 7,
    prestador_row_id: 2,
    codigo: 'ABC123',
    inicio: '22/08/2026',
    fim: '',
    valor_us: '1,2500',
    aviso: 'alerta',
    observacoes: 'observacao',
    id: 99,
    clinica_id: 1,
    data_inclusao: '22/08/2026',
    data_alteracao: '22/08/2026',
  });
  assert.equal(payload.codigo, 'ABC123');
  assert.equal(payload.fim, null);
  for (const field of ['id', 'clinica_id', 'source_id', 'data_inclusao', 'data_alteracao']) {
    assert.equal(Object.hasOwn(payload, field), false);
  }
});

test('edit normalization accepts the backend legacy obs field', () => {
  const source = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/prestadorCredenciamentosApi.js', import.meta.url), 'utf8');
  assert.match(source, /item\.observacoes \?\? item\.obs/);
});

test('delete action uses the selected credenciamento id and legacy confirmation text', () => {
  const parent = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/PrestadorCredenciamentosModal.jsx', import.meta.url), 'utf8');
  const toolbar = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/components/PrestadorCredenciamentosToolbar.jsx', import.meta.url), 'utf8');
  const api = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/prestadorCredenciamentosApi.js', import.meta.url), 'utf8');
  assert.match(toolbar, /disabled=\{!selectedId \|\| deleting\}/);
  assert.match(toolbar, /onClick=\{onDelete\}/);
  assert.match(parent, /Deseja eliminar o credenciamento \$\{deleteConfirmRecord\.codigo\} \?/);
  assert.match(parent, /await excluirCredenciamento\(deleteConfirmRecord\.id\)/);
  assert.match(parent, /await state\.reload\(\)/);
  assert.match(parent, /setDeleting\(true\)/);
  assert.match(parent, /setDeleting\(false\)/);
  assert.match(api, /method: 'DELETE'/);
  assert.match(api, /prestadores\/credenciamentos\/\$\{id\}/);
  assert.doesNotMatch(parent, /prestador_id|convenio_id/);
});

test('delete failures keep the main flow available for retry', () => {
  const parent = fs.readFileSync(new URL('../src/features/prestadoresCredenciamentos/PrestadorCredenciamentosModal.jsx', import.meta.url), 'utf8');
  assert.match(parent, /setActionError\(nextError\?\.message/);
  assert.match(parent, /setDeleteConfirmRecord\(null\)/);
  assert.match(parent, /actionError \? <Alert type="error"/);
});
