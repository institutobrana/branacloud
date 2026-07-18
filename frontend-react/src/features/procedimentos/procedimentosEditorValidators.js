export function validateProcedimentoForm(form) {
  const errors = [];
  const nome = String(form?.nome || '').trim();
  const codigo = String(form?.codigo || '').trim();
  const tabelaId = Number(form?.tabela_id || 0) || 0;
  const tempo = Number(form?.tempo || 0);
  const garantia = Number(form?.garantia_meses || 0);

  if (!nome) errors.push('Informe o nome.');
  if (!codigo || Number.isNaN(Number(codigo))) errors.push('Informe um codigo valido.');
  if (!tabelaId) errors.push('Selecione uma tabela.');
  if (!Number.isFinite(tempo) || tempo < 0) errors.push('Informe um tempo valido.');
  if (!Number.isFinite(garantia) || garantia < 0) errors.push('Informe uma garantia valida.');

  return errors;
}
