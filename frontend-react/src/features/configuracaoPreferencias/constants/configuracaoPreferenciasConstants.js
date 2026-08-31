export const CONFIGURACAO_PREFERENCIAS_TABS = [
  { key: 'geral', label: 'Geral' },
  { key: 'modelos', label: 'Modelos' },
  { key: 'ambiente', label: 'Ambiente' },
  { key: 'dados', label: 'Dados do usuário' },
  { key: 'odontograma', label: 'Odontograma' },
];

export const GENERAL_DEFAULTS = {
  pesquisa_padrao_odontograma: 'geral',
  tabela_padrao_id: null,
  convenio_padrao_id: 0,
  mensagem_padrao_orcamentos: '',
  historico_padrao_conta_corrente: 'Honorarios odontologicos',
  exibir_quadro_avisos: true,
  busca_automatica_pacientes_agendados: true,
  alarme_habilitado: false,
  alarme_minutos_antecedencia: 1,
};

export const GENERAL_SEARCH_OPTIONS = [
  { value: 'geral', label: 'Geral' },
  { value: 'codigo', label: 'Codigo' },
  { value: 'nome', label: 'Nome' },
];
