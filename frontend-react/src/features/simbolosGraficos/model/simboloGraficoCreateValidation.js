import { SIMBOLO_GRAFICO_MARCACAO_OPTIONS } from './simboloGraficoMarcacaoOptions.js';

const MAX_DESCRICAO_LENGTH = 120;
const VALID_TIPO_SIMBOLO = new Set([2]);
const VALID_TIPO_MARCA = new Set(SIMBOLO_GRAFICO_MARCACAO_OPTIONS.map((item) => Number(item.value)));

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeEspecialidadeValue(value, catalogByCode) {
  const raw = normalizeText(value);
  if (!raw) return '';
  if (!catalogByCode.has(raw)) return '';
  return raw;
}

export function validateSimboloGraficoCreateForm(state, catalogs = {}) {
  const errors = {};
  const normalized = {
    descricao: normalizeText(state?.descricao),
    tipoSimbolo: Number(state?.tipoSimbolo),
    especialidade: normalizeText(state?.especialidade),
    formaMarcacao: Number(state?.formaMarcacao),
    bibliotecaSelecionadaId: state?.bibliotecaSelecionadaId ?? null,
    bibliotecaSelecionada: normalizeText(state?.bibliotecaSelecionada),
    desenho: normalizeText(state?.desenho),
  };

  if (!normalized.descricao) {
    errors.descricao = 'Informe o nome do símbolo.';
  } else if (normalized.descricao.length > MAX_DESCRICAO_LENGTH) {
    errors.descricao = `O nome do símbolo deve ter no máximo ${MAX_DESCRICAO_LENGTH} caracteres.`;
  }

  if (!VALID_TIPO_SIMBOLO.has(normalized.tipoSimbolo)) {
    errors.tipoSimbolo = 'Símbolos de sistema não podem ser criados por este fluxo.';
  }

  const especialidades = Array.isArray(catalogs.especialidades) ? catalogs.especialidades : [];
  const especialidadeCodes = new Set(especialidades.map((item) => normalizeText(item?.value)));
  const especialidade = normalizeEspecialidadeValue(normalized.especialidade, especialidadeCodes);
  if (!especialidade) {
    errors.especialidade = 'Selecione uma especialidade válida.';
  }
  normalized.especialidade = especialidade;

  if (!VALID_TIPO_MARCA.has(normalized.formaMarcacao)) {
    errors.formaMarcacao = 'Selecione uma forma de marcação válida.';
  }

  const valid = Object.keys(errors).length === 0;

  return {
    valid,
    errors,
    normalized,
  };
}
