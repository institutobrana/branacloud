export function parsePtBrDecimal(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const normalized = raw.replace(/\./g, '').replace(',', '.');
  const next = Number(normalized);
  return Number.isFinite(next) ? next : null;
}

export function parsePtBrInteger(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const next = Number(raw.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(next) ? Math.trunc(next) : null;
}

export function normalizeServicoProteticoCodigo(value) {
  return String(value ?? '').trim();
}

export function normalizeServicoProteticoDescricao(value) {
  const raw = String(value ?? '').trim();
  return raw ? raw : null;
}

export function formatMoneyInput(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) return '';
  return next.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function buildServicoProteticoCreatePayload(values = {}) {
  const codigo = normalizeServicoProteticoCodigo(values.codigo);
  const nome = String(values.nome ?? '').trim();
  const indice = String(values.indice ?? '').trim() || 'R$';
  const preco = parsePtBrDecimal(values.preco) ?? 0;
  const prazo = parsePtBrInteger(values.prazo) ?? 0;
  const descricao = normalizeServicoProteticoDescricao(values.descricao);

  return {
    codigo,
    nome,
    indice,
    preco,
    prazo,
    descricao,
  };
}
