import { normalizeSpecialtyKey, parseMoneyInput } from './procedimentosEditorMappers.js';

export const PROCEDIMENTO_REQUIRED_FIELDS = Object.freeze([
  ['nome', 'Nome'],
  ['procedimento_generico_id', 'Procedimento genérico'],
  ['especialidade', 'Especialidade'],
  ['simbolo_grafico', 'Símbolo gráfico'],
  ['forma_cobranca', 'Forma de cobrança'],
]);

// Catalog identity is not the combo position. Valid symbols outside the contextual
// combo remain valid; the API validates their full, tenant-scoped reference.
export function getFirstProcedimentoRequiredIssue(form, { genericOptions, specialtyOptions } = {}) {
  for (const [field, label] of PROCEDIMENTO_REQUIRED_FIELDS) {
    const value = String(form?.[field] ?? '').trim();
    let missing = !value;
    let invalid = false;
    if (field === 'procedimento_generico_id') {
      missing = !value || Number(value) === 0;
      invalid = !Number.isInteger(Number(value)) || Number(value) < 0
        || (genericOptions && !genericOptions.some((item) => Number(item.id ?? item.value) === Number(value)));
    } else if (field === 'especialidade') {
      missing = !value || /^0+$/.test(value);
      invalid = specialtyOptions && !specialtyOptions.some((item) => normalizeSpecialtyKey(item.codigo ?? item.value) === normalizeSpecialtyKey(value));
    } else if (field === 'simbolo_grafico') {
      const legacy = Number(form?.simbolo_grafico_legacy_id ?? 0);
      missing = !value && legacy === 0;
      invalid = !Number.isInteger(legacy) || legacy < 0;
    } else if (field === 'forma_cobranca') {
      const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
      invalid = !['INTERVENCAO', 'ELEMENTO_FACE', 'ELEMENTO/FACE', 'ELEMENTO / FACE', 'ELEMENTO FACE', 'ELEMENTOFACE'].includes(normalized);
    }
    if (missing || invalid) return {
      field, label, status: missing ? 'MISSING' : 'INVALID',
      message: missing ? `Campo ${label} não pode ser nulo.` : `Campo ${label} possui referência inválida.`,
    };
  }
  return null;
}

export function validateProcedimentoForm(form) {
  const errors = [];
  const codigo = String(form?.codigo || '').trim();
  const tabelaId = Number(form?.tabela_id || 0) || 0;
  const tempo = Number(form?.tempo || 0);
  const garantia = Number(form?.garantia_meses || 0);

  const required = getFirstProcedimentoRequiredIssue(form);
  if (required) errors.push(required.message);
  if (!codigo || !Number.isInteger(Number(codigo))) errors.push('Informe um codigo valido.');
  if (!tabelaId) errors.push('Selecione uma tabela.');
  if (!Number.isInteger(tempo) || tempo < 0) errors.push('Informe um tempo valido.');
  if (!Number.isInteger(garantia) || garantia < 0) errors.push('Informe uma garantia valida.');
  for (const [key, label] of [['valor_paciente', 'valor do paciente'], ['valor_repasse', 'valor de repasse'], ['custo_lab', 'custo de laboratorio']]) {
    if (!Number.isFinite(parseMoneyInput(form?.[key]))) errors.push(`Informe um ${label} valido.`);
  }

  return errors;
}
