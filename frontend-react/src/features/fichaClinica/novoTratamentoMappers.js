export function todayIso() { return new Date().toISOString().slice(0, 10); }

export function createNovoTratamentoForm() {
  return {
    data_inicio: todayIso(), data_finalizacao: '', situacao: 'Aberto', tabela_codigo: '', indice: '',
    cirurgiao_responsavel_id: '', unidade_atendimento: '', observacoes: '', inclusao: '', alteracao: '',
    idade: '', arcada_predominante: 'Copiar do tratamento anterior', copiar_intervencoes: false,
    convenio: '', tipo_atendimento_tiss_id: '', cirurgiao_contratado_id: '', cirurgiao_solicitante_id: '',
    cirurgiao_executante_id: '', sinais_doenca_periodontal: '', alteracao_tecidos: '', numero_guia: '',
    data_autorizacao: '', senha_autorizacao: '', validade_senha: '',
  };
}

export function applyNovoTratamentoResponseMetadata(form, response) {
  return {
    ...form,
    inclusao: String(response?.inclusao ?? ''),
    alteracao: String(response?.alteracao ?? ''),
  };
}

export function toDateInput(value) { return String(value || '').slice(0, 10); }

export function applyNovoTratamentoDefaults(form, payload = {}, preferences = {}, systemOptions = {}, user = {}) {
  const defaults = payload.defaults || {};
  const first = (items) => Array.isArray(items) && items.length ? items[0] : null;
  const tabela = first(payload.tabelas);
  const indice = first(payload.indices);
  const cirurgiao = first(payload.cirurgioes);
  const unidade = first(payload.unidades);
  const convenio = first(payload.convenios);
  const tiss = first(payload.tipos_tiss);
  const configuredIndexId = Number(systemOptions?.values?.financeiro?.indice_padrao_id || 0);
  const configuredIndex = configuredIndexId > 0 ? payload.indices?.find((item) => Number(item?.id ?? item?.numero ?? item?.value) === configuredIndexId) : null;
  const loggedProviderId = Number(user?.prestador_id ?? user?.prestadorId ?? user?.prestador?.id ?? 0);
  const loggedSurgeon = loggedProviderId > 0 ? payload.cirurgioes?.find((item) => Number(item?.prestador_id ?? item?.id) === loggedProviderId) : null;
  const loggedUnitId = Number(user?.unidade_atendimento_id ?? user?.unidadeAtendimentoId ?? user?.unidade_atendimento?.id ?? user?.unidade?.id ?? 0);
  const loggedUnit = loggedUnitId > 0
    ? payload.unidades?.find((item) => Number(item?.row_id ?? item?.id) === loggedUnitId)
    : null;
  const sinais = first(payload.sinais);
  return {
    ...form,
    data_inicio: toDateInput(defaults.data_inicio) || todayIso(),
    data_finalizacao: toDateInput(defaults.data_finalizacao),
    situacao: defaults.situacao || payload.situacoes?.[0]?.id || 'Aberto',
    tabela_codigo: defaults.tabela_codigo ?? tabela?.id ?? '',
    indice: configuredIndex?.id ?? configuredIndex?.numero ?? defaults.indice ?? indice?.id ?? '',
    cirurgiao_responsavel_id: loggedSurgeon?.value ?? defaults.cirurgiao_responsavel_id ?? '',
    unidade_atendimento: loggedUnit?.value ?? '',
    idade: defaults.idade_texto ?? defaults.idade ?? '',
    arcada_predominante: defaults.arcada_predominante || 'Copiar do tratamento anterior',
    convenio: defaults.convenio ?? convenio?.id ?? 'particular',
    tipo_atendimento_tiss_id: defaults.tipo_atendimento_tiss_id ?? tiss?.id ?? '',
    cirurgiao_contratado_id: loggedSurgeon?.value ?? defaults.cirurgiao_contratado_id ?? '',
    cirurgiao_solicitante_id: loggedSurgeon?.value ?? defaults.cirurgiao_solicitante_id ?? '',
    cirurgiao_executante_id: loggedSurgeon?.value ?? defaults.cirurgiao_executante_id ?? '',
    sinais_doenca_periodontal: defaults.sinais_doenca_periodontal ?? sinais?.id ?? '',
    alteracao_tecidos: defaults.alteracao_tecidos ?? sinais?.id ?? '',
  };
}

export function buildNovoTratamentoPayload(form, patientId, convenioOptions = []) {
  const selected = convenioOptions.find((item) => String(item?.id ?? item?.value) === String(form.convenio));
  const numeric = (value) => value === '' || value == null ? null : Number.isNaN(Number(value)) ? value : Number(value);
  return {
    paciente_id: Number(patientId), data_inicio: form.data_inicio, data_finalizacao: form.data_finalizacao,
    situacao: form.situacao, tabela_codigo: numeric(form.tabela_codigo), indice: numeric(form.indice),
    cirurgiao_responsavel_id: numeric(form.cirurgiao_responsavel_id), unidade_atendimento: form.unidade_atendimento,
    observacoes: form.observacoes, arcada_predominante: form.arcada_predominante, copiar_de: '',
    copiar_intervencoes: Boolean(form.copiar_intervencoes), convenio_nome: selected?.nome || selected?.label || form.convenio || '',
    id_convenio: /^\d+$/.test(String(form.convenio || '')) ? Number(form.convenio) : null,
    tipo_atendimento_tiss_id: numeric(form.tipo_atendimento_tiss_id),
    cirurgiao_contratado_id: numeric(form.cirurgiao_contratado_id), cirurgiao_solicitante_id: numeric(form.cirurgiao_solicitante_id),
    cirurgiao_executante_id: numeric(form.cirurgiao_executante_id), sinais_doenca_periodontal: numeric(form.sinais_doenca_periodontal),
    alteracao_tecidos: numeric(form.alteracao_tecidos), numero_guia: form.numero_guia, data_autorizacao: form.data_autorizacao,
    senha_autorizacao: form.senha_autorizacao, validade_senha: form.validade_senha, extra: {},
  };
}
