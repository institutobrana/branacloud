import { parseMoneyInput } from './procedimentosEditorMappers.js';

export function validateProcedimentoForm(form) {
  const errors = [];
  const nome = String(form?.nome || '').trim();
  const codigo = String(form?.codigo || '').trim();
  const tabelaId = Number(form?.tabela_id || 0) || 0;
  const tempo = Number(form?.tempo || 0);
  const garantia = Number(form?.garantia_meses || 0);

  if (!nome) errors.push('Informe o nome.');
  if (!codigo || !Number.isInteger(Number(codigo))) errors.push('Informe um codigo valido.');
  if (!tabelaId) errors.push('Selecione uma tabela.');
  if (!Number.isInteger(tempo) || tempo < 0) errors.push('Informe um tempo valido.');
  if (!Number.isInteger(garantia) || garantia < 0) errors.push('Informe uma garantia valida.');
  for (const [key, label] of [['valor_paciente', 'valor do paciente'], ['valor_repasse', 'valor de repasse'], ['custo_lab', 'custo de laboratorio']]) {
    if (!Number.isFinite(parseMoneyInput(form?.[key]))) errors.push(`Informe um ${label} valido.`);
  }

  return errors;
}
