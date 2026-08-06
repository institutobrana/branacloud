function resolveBibliotecaSelecionada(state, catalogs = {}) {
  const selectedState = state?.bibliotecaSelecionada ?? null;
  if (selectedState) {
    return selectedState;
  }
  const selectedId = state?.bibliotecaSelecionadaId ?? null;
  const selected = Array.isArray(catalogs.biblioteca)
    ? catalogs.biblioteca.find((item) => String(item?.id || item?.code || item?.codigo || '') === String(selectedId || ''))
    : null;

  return selected;
}

function slugifyCodigoBase(text) {
  const normalized = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return (normalized || 'simbolo_grafico').slice(0, 26);
}

export function createSimboloGraficoCreateDraft(state, catalogs = {}) {
  const selected = resolveBibliotecaSelecionada(state, catalogs);
  const descricao = String(state?.descricao ?? state?.nome ?? '').trim();
  const especialidade = String(state?.especialidade ?? '').trim();
  const tipoSimbolo = Number.isFinite(Number(state?.tipoSimbolo)) ? Number(state?.tipoSimbolo) : 2;
  const tipoMarca = Number(state?.formaMarcacao);

  return {
    descricao,
    especialidade,
    tipo_simbolo: tipoSimbolo,
    tipo_marca: tipoMarca,
    legacy_id: null,
    codigo: null,
    desenho: null,
    imagem_custom: null,
    sobreposicao: null,
    icone: null,
    bitmap1: null,
    bitmap2: null,
    bitmap3: null,
    _contract: {
      bibliotecaSelecionadaId: selected ? selected.id ?? null : null,
      bibliotecaSelecionada: selected ? selected.code ?? selected.codigo ?? '' : '',
      imageUrl: selected ? selected.imageUrl ?? '' : '',
      imageSelected: Boolean(selected?.imageUrl),
      blockedFields: ['legacy_id', 'codigo', 'sobreposicao', 'icone', 'bitmap1', 'bitmap2', 'bitmap3'],
    },
  };
}

export function mapSimboloGraficoCreatePayload(state, catalogs = {}) {
  const selected = resolveBibliotecaSelecionada(state, catalogs);
  const descricao = String(state?.descricao ?? state?.nome ?? '').trim();
  const especialidade = String(state?.especialidade ?? '').trim();
  const tipoSimbolo = Number.isFinite(Number(state?.tipoSimbolo)) ? Number(state?.tipoSimbolo) : 2;
  const tipoMarca = Number(state?.formaMarcacao);

  const especialidades = Array.isArray(catalogs.especialidades) ? catalogs.especialidades : [];
  const especialidadeValida = especialidades.some((item) => String(item?.value ?? '') === especialidade);
  if (!descricao || descricao.length > 120 || !especialidadeValida || !Number.isFinite(tipoMarca) || tipoMarca < 1 || tipoMarca > 6) {
    return null;
  }

  return {
    descricao,
    especialidade: Number(especialidade),
    tipo_simbolo: tipoSimbolo,
    tipo_marca: tipoMarca,
    legacy_id: null,
    codigo: selected ? String(selected.fileName || selected.code || selected.codigo || '').trim() || null : `${slugifyCodigoBase(descricao)}.bmp`,
    imagem_custom: selected ? String(selected.imageUrl || '').trim() || null : null,
    desenho: null,
    bibliotecaSelecionadaId: selected ? selected.id ?? null : null,
    bibliotecaSelecionada: selected ? selected.code ?? selected.codigo ?? '' : '',
  };
}
