function normalizeText(value) {
  return String(value || '').trim();
}

const ESPECIALIDADES_POR_CODIGO = Object.freeze({
  1: 'Dentística',
  2: 'Prótese',
  3: 'Endodontia',
  4: 'Periodontia',
  5: 'Gerais',
  6: 'Cirurgia',
  7: 'Ortodontia',
  8: 'Prevenção',
  9: 'Odontopediatria',
  10: 'Diagnóstico',
  11: 'Radiologia',
  12: 'Estética',
  13: 'Implantodontia',
});

function normalizeEspecialidadeCodigo(value) {
  if (value == null || value === '') {
    return null;
  }

  const numeric = Number(String(value).trim());
  if (!Number.isInteger(numeric) || numeric < 1) {
    return null;
  }

  return numeric;
}

function resolveEspecialidadeNome(item) {
  const textualEspecialidade = normalizeText(item?.especialidadeNome || item?.especialidade_nome || item?.especialidade);
  if (textualEspecialidade && Number.isNaN(Number(textualEspecialidade))) {
    return textualEspecialidade;
  }

  const codigo = normalizeEspecialidadeCodigo(
    item?.especialidadeCodigo ?? item?.especialidade_codigo ?? item?.especialidade ?? item?.especial,
  );
  return codigo ? ESPECIALIDADES_POR_CODIGO[codigo] || null : null;
}

export function mapSimboloGrafico(item) {
  const id = Number(item?.id || 0) || null;
  const descricao = normalizeText(item?.descricao);
  const especialidadeCodigo = normalizeEspecialidadeCodigo(
    item?.especialidadeCodigo ?? item?.especialidade_codigo ?? item?.especialidade ?? item?.especial,
  );
  const especialidade = resolveEspecialidadeNome(item);
  const codigo = normalizeText(item?.codigo);
  const tipoSimbolo = item?.tipo_simbolo == null ? null : Number(item?.tipo_simbolo || 0) || null;
  const tipoMarca = item?.tipo_marca == null ? null : Number(item?.tipo_marca || 0) || null;
  const imagemCustom = normalizeText(item?.imagem_custom);
  const imagemUrl = normalizeText(item?.imagem_url);

  return {
    id,
    nome: descricao,
    especialidade,
    especialidadeCodigo,
    codigo: codigo || null,
    tipoSimbolo,
    tipoMarca,
    imagemCustom: imagemCustom || null,
    imagemUrl: imagemUrl || null,
    origem: item?.origem == null || item?.origem === '' ? null : item.origem,
  };
}

export function applySimbolosGraficosEspecialidadeNames(rows = [], especialidades = []) {
  const especialidadePorCodigo = new Map();
  const especialidadePorId = new Map();
  const especialidadePorNome = new Map();
  for (const item of Array.isArray(especialidades) ? especialidades : []) {
    const codigo = String(item?.codigo || '').trim();
    const id = String(item?.id || '').trim();
    const nome = String(item?.nome || '').trim();
    if (codigo && nome) {
      especialidadePorCodigo.set(codigo, nome);
    }
    if (id && nome) {
      especialidadePorId.set(id, nome);
    }
    if (nome) {
      especialidadePorNome.set(nome.toLowerCase(), nome);
    }
  }

  return Array.isArray(rows)
    ? rows.map((row) => {
        const nomeExplicito = normalizeText(row?.especialidade);
        if (nomeExplicito && Number.isNaN(Number(nomeExplicito))) {
          return {
            ...row,
            especialidade: nomeExplicito,
            especialidadeCodigo: normalizeEspecialidadeCodigo(
              row?.especialidadeCodigo ?? row?.especialidade_codigo ?? row?.especialidade ?? row?.especial,
            ),
          };
        }

        const codigo = normalizeEspecialidadeCodigo(
          row?.especialidadeCodigo ?? row?.especialidade_codigo ?? row?.especialidade ?? row?.especial,
        );
        const nomeEspecialidade =
          (codigo != null ? especialidadePorCodigo.get(String(codigo)) : null) ||
          (codigo != null ? especialidadePorId.get(String(codigo)) : null) ||
          (codigo != null ? especialidadePorNome.get(String(codigo).toLowerCase()) : null);

        return {
          ...row,
          especialidade: nomeEspecialidade || null,
          especialidadeCodigo: codigo,
        };
      })
    : [];
}

export function mapSimbolosGraficosResponse(payload) {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(mapSimboloGrafico);
}
