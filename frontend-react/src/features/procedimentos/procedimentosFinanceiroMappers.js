const FINANCEIRO_FIELD_KEYS = Object.freeze([
  'custo_fph',
  'custo_material',
  'custo_proc',
  'ir',
  'cd',
  'cartao',
  'valor_minimo',
  'lucro_bruto',
  'lucro_liquido',
  'rendimento_proc',
  'rendimento_3040',
  'rendimento_1020',
  'rendimento',
  'lucro_hora',
]);

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function toStringValue(value) {
  return String(value ?? '').trim();
}

export function normalizeProcedimentoFinanceiroItem(item) {
  const hasValue = (value) => value !== null && value !== undefined && value !== '';
  return {
    id: hasValue(item?.id) ? toNumber(item?.id, 0) : null,
    codigo: hasValue(item?.codigo) ? toNumber(item?.codigo, 0) : null,
    nome: toStringValue(item?.nome),
    preco: hasValue(item?.preco) ? toNumber(item?.preco, 0) : null,
    tempo: hasValue(item?.tempo) ? toNumber(item?.tempo, 0) : null,
    tempo_grafico: hasValue(item?.tempo_grafico) ? toNumber(item?.tempo_grafico, 0) : null,
    lab: hasValue(item?.lab) ? toNumber(item?.lab, 0) : null,
    custo_material: hasValue(item?.custo_material) ? toNumber(item?.custo_material, 0) : null,
    custo_fph: hasValue(item?.custo_fph) ? toNumber(item?.custo_fph, 0) : null,
    custo_proc: hasValue(item?.custo_proc) ? toNumber(item?.custo_proc, 0) : null,
    ir: hasValue(item?.ir) ? toNumber(item?.ir, 0) : null,
    cd: hasValue(item?.cd) ? toNumber(item?.cd, 0) : null,
    cartao: hasValue(item?.cartao) ? toNumber(item?.cartao, 0) : null,
    lucro_bruto: hasValue(item?.lucro_bruto) ? toNumber(item?.lucro_bruto, 0) : null,
    lucro_liquido: hasValue(item?.lucro_liquido) ? toNumber(item?.lucro_liquido, 0) : null,
    valor_minimo: hasValue(item?.valor_minimo) ? toNumber(item?.valor_minimo, 0) : null,
    rendimento_proc: hasValue(item?.rendimento_proc) ? toNumber(item?.rendimento_proc, 0) : null,
    rendimento_3040: hasValue(item?.rendimento_3040) ? toNumber(item?.rendimento_3040, 0) : null,
    rendimento_1020: hasValue(item?.rendimento_1020) ? toNumber(item?.rendimento_1020, 0) : null,
    rendimento: hasValue(item?.rendimento) ? toNumber(item?.rendimento, 0) : null,
    lucro_hora: hasValue(item?.lucro_hora) ? toNumber(item?.lucro_hora, 0) : null,
  };
}

export function normalizeProcedimentosFinanceiroResponse(data) {
  const items = Array.isArray(data?.itens) ? data.itens.map(normalizeProcedimentoFinanceiroItem) : [];
  return {
    items,
    grafico: Array.isArray(data?.grafico) ? data.grafico.map(normalizeProcedimentoFinanceiroItem) : [],
  };
}

export function resolveProcedimentoFinanceiroItem(items, procedimentoId) {
  const id = Number(procedimentoId || 0) || 0;
  if (!id) return null;
  return (Array.isArray(items) ? items : []).find((item) => Number(item?.id || 0) === id) || null;
}

export function formatFinanceiroMoney(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return '—';
  return `R$ ${next.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatFinanceiroPercent(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return '—';
  return `${next.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatFinanceiroTempo(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return '—';
  return next.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function getFinanceiroFieldEntries(item) {
  return FINANCEIRO_FIELD_KEYS.map((key) => [key, item?.[key]]);
}
