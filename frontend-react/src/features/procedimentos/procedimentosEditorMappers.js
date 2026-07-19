export function normalizeSpecialtyKey(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return String(numeric).padStart(2, '0');
  }
  return raw;
}

export function resolveSpecialtyName(value, map) {
  if (value == null || value === '') return '-';

  if (typeof value === 'object') {
    const directName = String(value?.nome || value?.descricao || '').trim();
    if (directName) return directName;

    const directCode = String(value?.codigo || value?.id || '').trim();
    if (!directCode) return '-';

    return (
      map.get(directCode) ||
      map.get(normalizeSpecialtyKey(directCode)) ||
      map.get(String(Number(directCode))) ||
      '-'
    );
  }

  const raw = String(value).trim();
  if (!raw) return '-';

  return (
    map.get(raw) ||
    map.get(normalizeSpecialtyKey(raw)) ||
    map.get(String(Number(raw))) ||
    '-'
  );
}

export function createSpecialtyNameMap(items) {
  const map = new Map();

  (Array.isArray(items) ? items : []).forEach((item) => {
    const codigo = String(item?.codigo ?? item?.id ?? '').trim();
    const nome = String(item?.nome || item?.descricao || '').trim();
    if (!codigo) return;

    const resolved = nome || codigo;
    map.set(codigo, resolved);
    map.set(normalizeSpecialtyKey(codigo), resolved);

    const numeric = Number(codigo);
    if (Number.isFinite(numeric)) {
      map.set(String(numeric), resolved);
      map.set(String(numeric).padStart(2, '0'), resolved);
    }
  });

  return map;
}

export function normalizeProcedimento(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: Number(item?.codigo || 0) || 0,
    nome: String(item?.nome || '').trim(),
    tabela_id: Number(item?.tabela_id || 0) || 0,
    especialidade: String(item?.especialidade || '').trim(),
    procedimento_generico_id: Number(item?.procedimento_generico_id || 0) || null,
    simbolo_grafico: String(item?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: Number(item?.simbolo_grafico_legacy_id || 0) || null,
    simbolo_catalogo_id: Number(item?.simbolo_catalogo_id || 0) || null,
    mostrar_simbolo: Boolean(item?.mostrar_simbolo),
    garantia_meses: Number(item?.garantia_meses || 0) || 0,
    forma_cobranca: String(item?.forma_cobranca || '').trim(),
    valor_repasse: Number(item?.valor_repasse || 0) || 0,
    preferido: Boolean(item?.preferido),
    inativo: Boolean(item?.inativo),
    observacoes: String(item?.observacoes || '').trim(),
    data_inclusao: String(item?.data_inclusao || '').trim(),
    data_alteracao: String(item?.data_alteracao || '').trim(),
    tempo: Number(item?.tempo || 0) || 0,
    preco: Number(item?.preco || 0) || 0,
    custo: Number(item?.custo || 0) || 0,
    custo_lab: Number(item?.custo_lab || 0) || 0,
    lucro_hora: Number(item?.lucro_hora || 0) || 0,
  };
}

export function createEmptyProcedimentoForm({ tabelaId = null, especialidade = '', codigo = '', nome = '' } = {}) {
  return {
    id: null,
    tabela_id: Number(tabelaId || 0) || null,
    codigo: String(codigo || ''),
    nome: String(nome || ''),
    procedimento_generico_id: null,
    especialidade: String(especialidade || ''),
    simbolo_catalogo_id: null,
    simbolo_grafico: '',
    simbolo_grafico_legacy_id: null,
    mostrar_simbolo: false,
    garantia_meses: 0,
    forma_cobranca: '',
    valor_repasse: '',
    valor_paciente: '',
    custo_lab: '',
    tempo: '',
    inativo: false,
    preferido: false,
    observacoes: '',
    data_inclusao: '',
    data_alteracao: '',
  };
}

export function hydrateProcedimentoForm(item, base = {}) {
  const next = normalizeProcedimento(item);
  return {
    ...createEmptyProcedimentoForm({
      tabelaId: next.tabela_id || base.tabela_id || null,
      especialidade: next.especialidade || base.especialidade || '',
      codigo: next.codigo || base.codigo || '',
      nome: next.nome || base.nome || '',
    }),
    ...base,
    ...next,
    valor_repasse: toMoneyInputValue(next.valor_repasse),
    valor_paciente: toMoneyInputValue(next.preco),
    custo_lab: toMoneyInputValue(next.custo_lab),
    simbolo_catalogo_id: Number(base?.simbolo_catalogo_id || next?.simbolo_catalogo_id || 0) || null,
  };
}

export function toMoneyInputValue(value) {
  const next = Number(value || 0);
  if (!Number.isFinite(next)) return '';
  return next.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function parseMoneyInput(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const normalized = raw
    .replace(/\s+/g, '')
    .replace(/[R$]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');
  const next = Number(normalized);
  return Number.isFinite(next) ? next : 0;
}

export function buildProcedimentoPayload(form) {
  return {
    codigo: Number(form?.codigo || 0) || 0,
    nome: String(form?.nome || '').trim(),
    tempo: Number(form?.tempo || 0) || 0,
    preco: parseMoneyInput(form?.valor_paciente),
    custo: 0,
    custo_lab: parseMoneyInput(form?.custo_lab),
    tabela_id: String(form?.tabela_id || 1).trim() || '1',
    especialidade: String(form?.especialidade || '').trim() || null,
    procedimento_generico_id: Number(form?.procedimento_generico_id || 0) || null,
    simbolo_grafico: String(form?.simbolo_grafico || '').trim() || null,
    simbolo_grafico_legacy_id: Number(form?.simbolo_grafico_legacy_id || 0) || null,
    mostrar_simbolo: !!String(form?.simbolo_grafico || '').trim(),
    garantia_meses: Number(form?.garantia_meses || 0) || 0,
    forma_cobranca: String(form?.forma_cobranca || '').trim() || null,
    valor_repasse: parseMoneyInput(form?.valor_repasse),
    preferido: !!form?.preferido,
    inativo: !!form?.inativo,
    observacoes: String(form?.observacoes || '').trim() || null,
  };
}

export function normalizeProcedimentoSymbol(item) {
  const catalogId = Number(item?.catalogId || item?.id || item?.value || 0) || null;
  const legacyId = Number(item?.legacyId || item?.legacy_id || 0) || null;
  const codigo = String(item?.codigo || '').trim();
  const descricao = String(item?.descricao || item?.nome || item?.label || '').trim();
  return {
    value: catalogId,
    label: descricao || String(item?.nome || '').trim() || codigo,
    catalogId,
    legacyId,
    codigo,
    descricao,
    imagemUrl: String(item?.imagemUrl || item?.imagem_url || '').trim(),
    icone: String(item?.icone || '').trim(),
    imagemCustom: String(item?.imagemCustom || item?.imagem_custom || '').trim(),
    especialidade: String(item?.especialidade || '').trim(),
    tipoMarca: Number(item?.tipoMarca || item?.tipo_marca || 0) || null,
    tipoSimbolo: Number(item?.tipoSimbolo || item?.tipo_simbolo || 0) || null,
    raw: item?.raw || item,
  };
}

export function buildProcedimentoSymbolCatalog(items) {
  return (Array.isArray(items) ? items : []).map(normalizeProcedimentoSymbol);
}

export function buildProcedimentoSymbolLookups(items) {
  const catalog = buildProcedimentoSymbolCatalog(items);
  const byCatalogId = new Map();
  const byLegacyId = new Map();
  const byCodigo = new Map();
  const byPair = new Map();

  catalog.forEach((item) => {
    if (item.catalogId) byCatalogId.set(String(item.catalogId), item);

    if (item.legacyId) {
      const key = String(item.legacyId);
      if (!byLegacyId.has(key)) byLegacyId.set(key, []);
      byLegacyId.get(key).push(item);
    }

    if (item.codigo) {
      const key = item.codigo.toLowerCase();
      if (!byCodigo.has(key)) byCodigo.set(key, []);
      byCodigo.get(key).push(item);
    }

    const pairKey = `${String(item.legacyId || '')}::${item.codigo.toLowerCase()}`;
    byPair.set(pairKey, item);
  });

  return { catalog, byCatalogId, byLegacyId, byCodigo, byPair };
}

export function resolveProcedimentoSymbolSelection(simbolos, state) {
  const lookups = buildProcedimentoSymbolLookups(simbolos);
  const catalogId = Number(state?.simbolo_catalogo_id || 0) || null;
  if (catalogId && lookups.byCatalogId.has(String(catalogId))) {
    return { option: lookups.byCatalogId.get(String(catalogId)), ambiguous: false };
  }

  const rawCodigo = String(state?.simbolo_grafico || '').trim();
  const legacyId = Number(state?.simbolo_grafico_legacy_id || 0) || null;

  if (legacyId && rawCodigo) {
    const pair = lookups.byPair.get(`${String(legacyId)}::${rawCodigo.toLowerCase()}`) || null;
    if (pair) return { option: pair, ambiguous: false };
  }

  if (legacyId) {
    const candidates = lookups.byLegacyId.get(String(legacyId)) || [];
    if (candidates.length === 1) return { option: candidates[0], ambiguous: false };
    return { option: null, ambiguous: candidates.length > 1 };
  }

  if (rawCodigo) {
    const candidates = lookups.byCodigo.get(rawCodigo.toLowerCase()) || [];
    if (candidates.length === 1) return { option: candidates[0], ambiguous: false };
    return { option: null, ambiguous: candidates.length > 1 };
  }

  return { option: null, ambiguous: false };
}

export function resolveProcedimentoSymbolSelectValue(simbolos, state) {
  const { option } = resolveProcedimentoSymbolSelection(simbolos, state);
  return option?.catalogId || undefined;
}

export function resolveProcedimentoSymbolPreviewCandidates(simbolos, state) {
  const { option } = resolveProcedimentoSymbolSelection(simbolos, state);
  if (!option) return [];

  const rawSrc = String(option.imagemUrl || '').trim();
  const nomeArquivo = rawSrc.split('/').filter(Boolean).pop() || '';
  const fallback = String(option.icone || option.raw?.bitmap1 || option.raw?.bitmap2 || option.raw?.bitmap3 || '').trim();
  const codigo = String(option.codigo || '').trim();
  const fileName = resolvePreviewFileName(nomeArquivo || fallback || codigo);

  const next = [];
  if (isPublicPreviewUrl(rawSrc)) next.push(rawSrc);
  if (fileName) {
    next.push(`/desktop-assets/easy/${fileName}`);
    if (/^sim_/i.test(fileName)) {
      next.push(`/app/assets/easy/${fileName}`);
    } else if (/^esp_/i.test(fileName)) {
      next.push(`/app/assets/fichaClinica/odontograma/especialidades/${fileName}`);
    } else {
      next.push(`/app/assets/easy/${fileName}`);
      next.push(`/app/assets/fichaClinica/odontograma/procedimentos/${fileName}`);
    }
  }
  return Array.from(new Set(next.filter(Boolean)));
}

export function isPublicPreviewUrl(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return false;
  return (
    normalized.startsWith('/') ||
    /^https?:\/\//i.test(normalized) ||
    /^data:image\//i.test(normalized) ||
    /^blob:/i.test(normalized)
  );
}

export function hydrateProcedimentoSymbolState(simbolos, item = {}) {
  const { option, ambiguous } = resolveProcedimentoSymbolSelection(simbolos, item);
  return {
    simbolo_catalogo_id: option?.catalogId || null,
    simbolo_grafico: option?.codigo || String(item?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: option?.legacyId || Number(item?.simbolo_grafico_legacy_id || 0) || null,
    simbolo_descricao: option?.descricao || '',
    simbolo_preview_src: resolveProcedimentoSymbolPreviewCandidates(simbolos, {
      simbolo_catalogo_id: option?.catalogId || null,
      simbolo_grafico: option?.codigo || String(item?.simbolo_grafico || '').trim(),
      simbolo_grafico_legacy_id: option?.legacyId || Number(item?.simbolo_grafico_legacy_id || 0) || null,
    })[0] || '',
    simbolo_ambiguous: ambiguous,
  };
}

export function extractProcedimentoSymbolPayload(simbolos, state) {
  const { option } = resolveProcedimentoSymbolSelection(simbolos, state);
  if (!option) {
    return {
      simbolo_catalogo_id: null,
      simbolo_grafico: String(state?.simbolo_grafico || '').trim() || null,
      simbolo_grafico_legacy_id: Number(state?.simbolo_grafico_legacy_id || 0) || null,
      mostrar_simbolo: !!String(state?.simbolo_grafico || '').trim(),
    };
  }

  return {
    simbolo_catalogo_id: option.catalogId,
    simbolo_grafico: option.codigo || null,
    simbolo_grafico_legacy_id: option.legacyId || null,
    mostrar_simbolo: true,
  };
}

export function resolvePreviewFileName(fileName) {
  const normalized = String(fileName || '').trim();
  const aliasMap = {
    'int_restdo.bmp': 'int_RestDO.bmp',
    'int_restmo.bmp': 'int_RestMO.bmp',
    'int_restmod.bmp': 'int_RestMOD.bmp',
  };
  return aliasMap[normalized.toLowerCase()] || normalized;
}
