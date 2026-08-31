export const ODONTOGRAM_DEFAULTS = {
  especialidade_mais_utilizada: 'clinica',
  filtro_mais_utilizado: 'todas_tratamento',
  exibir_alerta_anamnese: true,
  exibir_icones_alerta: true,
  exibir_imagens_easycapture: true,
  exibir_coluna_cirurgiao_historico: false,
  exibir_historico_ordem_decrescente: true,
  exibir_dados_paciente: true,
  exibir_dados_tratamento: true,
  exibir_observacoes: true,
  exibir_documentos: true,
  exibir_agenda_dia: true,
  cor_anomalia: '#000000',
  cor_condicao_observada: '#008000',
  cor_realizado: '#0000ff',
  cor_a_realizar: '#ff0000',
};

export const ODONTOGRAM_FILTERS = [
  ['todas_tratamento', 'Todas as intervenções no tratamento'],
  ['condicao_observada', 'Condição observada'],
  ['ja_realizado', 'Já realizado'],
  ['a_realizar', 'A realizar'],
  ['todas_intervencoes', 'Todas as intervenções'],
  ['condicao_tratamento', 'Condição observada no tratamento'],
  ['ja_realizado_tratamento', 'Já realizado no tratamento'],
  ['a_realizar_tratamento', 'A realizar no tratamento'],
  ['caracteristicas_arcada', 'Características da arcada'],
].map(([value, label]) => ({ value, label }));

export const ODONTOGRAM_CHECKBOXES = [
  ['exibir_alerta_anamnese', 'Exibir alerta de anamnese'],
  ['exibir_icones_alerta', 'Exibir ícones de alerta'],
  ['exibir_imagens_easycapture', 'Exibir imagens do EasyCapture'],
  ['exibir_coluna_cirurgiao_historico', 'Exibir coluna cirurgião no histórico'],
  ['exibir_historico_ordem_decrescente', 'Exibir histórico em ordem decrescente'],
  ['exibir_dados_paciente', 'Exibir dados do paciente'],
  ['exibir_dados_tratamento', 'Exibir dados do tratamento'],
  ['exibir_observacoes', 'Exibir observações'],
  ['exibir_documentos', 'Exibir documentos emitidos'],
  ['exibir_agenda_dia', 'Exibir agenda do dia'],
].map(([key, label]) => ({ key, label }));

export const ODONTOGRAM_COLORS = [
  ['#000000', 'Preto'], ['#800000', 'Bordo'], ['#008000', 'Verde'], ['#808000', 'Verde-oliva'],
  ['#000080', 'Azul-marinho'], ['#800080', 'Roxo'], ['#008080', 'Azul-petroleo'], ['#808080', 'Cinza'],
  ['#c0c0c0', 'Prateado'], ['#ff0000', 'Vermelho'], ['#00ff00', 'Verde-limao'], ['#ffff00', 'Amarelo'],
  ['#0000ff', 'Azul'], ['#ff00ff', 'Fucsia'], ['#00ffff', 'Azul-piscina'], ['#ffffff', 'Branco'],
].map(([value, label]) => ({ value, label }));
