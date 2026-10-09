import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createEmptyProcedimentoForm, buildProcedimentoPayload, hydrateProcedimentoForm } from '../src/features/procedimentos/procedimentosEditorMappers.js';
import { getFirstProcedimentoRequiredIssue, PROCEDIMENTO_REQUIRED_FIELDS, validateProcedimentoForm } from '../src/features/procedimentos/procedimentosEditorValidators.js';

const complete = { ...createEmptyProcedimentoForm({ tabelaId: 4, codigo: 1, nome: 'Consulta' }),
  procedimento_generico_id: 20, especialidade: '05', simbolo_grafico: 'sim_outras.bmp', simbolo_grafico_legacy_id: 58 };
const options = { genericOptions: [{ value: 20 }], specialtyOptions: [{ value: '05' }] };
const emptyValues = { nome: [null, '', '   '], procedimento_generico_id: [null, '', 0],
  especialidade: [null, '', '00'], simbolo_grafico: [null, '', '   '], forma_cobranca: [null, '', '   '] };

for (const mode of ['CREATE', 'UPDATE']) {
  for (const [field, label] of PROCEDIMENTO_REQUIRED_FIELDS) {
    for (const empty of emptyValues[field]) {
      test(`${mode}: ${label} ${JSON.stringify(empty)} bloqueia, com nome funcional exato`, () => {
        const form = { ...complete, [field]: empty, ...(field === 'simbolo_grafico' ? { simbolo_grafico_legacy_id: null } : {}) };
        const issue = getFirstProcedimentoRequiredIssue(form, options);
        assert.equal(issue.field, field);
        assert.equal(issue.status, 'MISSING');
        assert.equal(issue.message, `Campo ${label} não pode ser nulo.`);
        assert.equal(validateProcedimentoForm(form)[0], issue.message);
      });
    }
  }
}

test('ordem completa: corrigir um campo apresenta somente o próximo ausente', () => {
  const form = { ...complete, nome: '', procedimento_generico_id: null, especialidade: '', simbolo_grafico: '', simbolo_grafico_legacy_id: null, forma_cobranca: '' };
  for (const [field, label] of PROCEDIMENTO_REQUIRED_FIELDS) {
    assert.equal(getFirstProcedimentoRequiredIssue(form, options).message, `Campo ${label} não pode ser nulo.`);
    form[field] = complete[field];
    if (field === 'simbolo_grafico') form.simbolo_grafico_legacy_id = 58;
  }
  assert.equal(getFirstProcedimentoRequiredIssue(form, options), null);
  assert.deepEqual(validateProcedimentoForm(form), []);
});

test('ordem e nomenclatura frontend/backend não divergem; aliases históricos de cobrança continuam válidos', () => {
  const route = fs.readFileSync(new URL('../../backend/routes/procedimentos_routes.py', import.meta.url), 'utf8');
  const validation = route.slice(route.indexOf('def _validar_campos_edicao'), route.indexOf('def _load_proc_or_404'));
  let previous = -1;
  for (const [, label] of PROCEDIMENTO_REQUIRED_FIELDS) {
    const index = validation.indexOf(`"${label}"`);
    assert.ok(index > previous, label);
    previous = index;
  }
  for (const billing of ['Intervenção', 'intervencao', 'Elemento / Face', 'elementoface', 'ELEMENTO_FACE']) {
    assert.equal(getFirstProcedimentoRequiredIssue({ ...complete, forma_cobranca: billing }, options), null);
  }
});

for (const [field, invalid] of [['procedimento_generico_id', -1], ['procedimento_generico_id', 99],
  ['procedimento_generico_id', 'x'], ['especialidade', '99'], ['simbolo_grafico_legacy_id', -1],
  ['forma_cobranca', '0'], ['forma_cobranca', 'INVALID']]) {
  test(`referência inválida ${field}=${invalid} não é aceita nem confundida com zero opcional`, () => {
    assert.equal(getFirstProcedimentoRequiredIssue({ ...complete, [field]: invalid }, options).status, 'INVALID');
  });
}

test('novo inicia cobrança Intervenção e Genérico vazio; CREATE envia default sem dirty flag', () => {
  const form = createEmptyProcedimentoForm();
  assert.equal(form.procedimento_generico_id, null);
  assert.equal(form.forma_cobranca, 'INTERVENCAO');
  assert.equal(buildProcedimentoPayload(complete).forma_cobranca, 'INTERVENCAO');
});

test('edição preserva cobrança existente e não retransmite campos omitidos', () => {
  const form = hydrateProcedimentoForm({ ...complete, forma_cobranca: 'ELEMENTO_FACE' });
  assert.equal(form.forma_cobranca, 'ELEMENTO_FACE');
  const payload = buildProcedimentoPayload(form, { changedFields: new Set(['nome']) });
  assert.equal('forma_cobranca' in payload, false);
  assert.equal('data_inclusao' in payload, false);
  assert.equal('data_alteracao' in payload, false);
});

test('zeros e false opcionais e Nome "0" não são ausentes; par parcial fora do combo não é apagado', () => {
  const form = { ...complete, nome: '0', tempo: 0, custo_lab: 0, preferido: false, inativo: false, simbolo_grafico: 'custom.bmp', simbolo_grafico_legacy_id: null };
  assert.equal(getFirstProcedimentoRequiredIssue(form, options), null);
  assert.deepEqual(validateProcedimentoForm(form), []);
  assert.equal(buildProcedimentoPayload(form).simbolo_grafico, 'custom.bmp');
});

test('padrão readonly ciano reutilizado e carregado pelo App, sem cor local improvisada', () => {
  const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  const panel = read('../src/features/procedimentos/components/ProcedimentoCadastroPanel.jsx');
  assert.equal((panel.match(/ficha-dados-readonly-cyan/g) || []).length, 2);
  assert.match(panel, /value=\{values.data_inclusao \|\| ''\} readOnly/);
  assert.match(panel, /value=\{values.data_alteracao \|\| ''\} readOnly/);
  assert.match(read('../src/features/pacientes/components/fichaPessoal/fichaPessoal.css'), /\.ficha-dados-readonly-cyan \.ant-input/);
  assert.match(read('../src/app/App.jsx'), /import .*FichaPessoalModal/);
  assert.match(read('../src/features/pacientes/components/fichaPessoal/FichaPessoalModal.jsx'), /import '.\/fichaPessoal.css'/);
});
