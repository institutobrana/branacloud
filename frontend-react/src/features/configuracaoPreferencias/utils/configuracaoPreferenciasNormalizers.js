import { GENERAL_DEFAULTS } from '../constants/configuracaoPreferenciasConstants.js';

export function normalizeGeneralValues(values) {
  const source = values || {};
  return {
    ...GENERAL_DEFAULTS,
    ...source,
    tabela_padrao_id: source.tabela_padrao_id ?? null,
    convenio_padrao_id: source.convenio_padrao_id ?? 0,
    alarme_minutos_antecedencia: Math.max(1, Math.min(120, Number(source.alarme_minutos_antecedencia) || 1)),
  };
}

export function buildGeneralPayload(values) {
  const normalized = normalizeGeneralValues(values);
  return {
    pesquisa_padrao_odontograma: normalized.pesquisa_padrao_odontograma,
    tabela_padrao_id: normalized.tabela_padrao_id || null,
    convenio_padrao_id: Number(normalized.convenio_padrao_id) || 0,
    mensagem_padrao_orcamentos: String(normalized.mensagem_padrao_orcamentos || '').trim(),
    historico_padrao_conta_corrente: String(normalized.historico_padrao_conta_corrente || '').trim(),
    exibir_quadro_avisos: Boolean(normalized.exibir_quadro_avisos),
    busca_automatica_pacientes_agendados: Boolean(normalized.busca_automatica_pacientes_agendados),
    alarme_habilitado: Boolean(normalized.alarme_habilitado),
    alarme_minutos_antecedencia: Math.max(1, Math.min(120, Number(normalized.alarme_minutos_antecedencia) || 1)),
  };
}
