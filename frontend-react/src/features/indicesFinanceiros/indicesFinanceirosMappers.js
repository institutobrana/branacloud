import { formatIndiceFinanceiroValorAtual } from './indicesFinanceirosFormatters.js';

export function normalizeIndiceFinanceiro(item) {
  const numero = Number(item?.numero ?? item?.id);
  const normalizedNumero = Number.isFinite(numero) ? numero : null;

  return {
    id: normalizedNumero ?? String(item?.id ?? ''),
    numero: normalizedNumero,
    sigla: String(item?.sigla ?? '').trim(),
    nome: String(item?.nome ?? '').trim(),
    reservado: Boolean(item?.reservado),
    ativo: Boolean(item?.ativo),
    valorAtual: formatIndiceFinanceiroValorAtual(item?.valor_atual),
    valorAtualNumerico: Number(item?.valor_atual ?? 0) || 0,
  };
}
