export const OPCOES_SISTEMA_TABS = [
  { key: 'clinica', label: 'Clínica' },
  { key: 'financeiro', label: 'Financeiro' },
  { key: 'seguranca', label: 'Segurança' },
  { key: 'data', label: 'Data' },
  { key: 'avancado', label: 'Avançado' },
];

export const REPORT_INDEX_OPTIONS = [
  { value: 255, label: 'Moeda corrente' },
  { value: 0, label: 'Índice padrão' },
];

export const EMPTY_SYSTEM_OPTIONS = {
  clinica: { nome: '', endereco: '', complemento: '', cep: '', uf: '', telefones: '', cnpj: '', inscricao_estadual: '' },
  financeiro: { indice_padrao_id: 255, moeda_corrente: 'Reais', sigla_moeda: 'R$', periodo_parcelamento: 30, tipo_cobranca_padrao: '', categoria_mensalidade_ortodontia_id: null, indice_relatorios_id: 255, pedir_indices_diariamente: true, lancar_creditos_baixa_clinica: true, lancar_debitos_convenio_paciente: true, considerar_creditos_futuros_devedores: false },
  seguranca: { ativar_controle_usuarios: true, ativar_auditoria: true },
  data: { formato_data: 'DD/MM/AAAA', data_atual: '', hora_atual: '', considerar_ano_2000_menor_que: 15, semanas_horarios_livres: 5 },
  avancado: { sistema_captura_imagens: 'EasyCapture', versao_word: 'Word 2000', formato_envio_email: 'formatado_com_imagens', qtd_imagens_odontograma: 40, habilitar_validacao_cpf: true, bloquear_duplicidade_cpf: true, atualizar_agenda_automaticamente: true, exigir_orcamento_aprovado: false, habilitar_cep_online: true, enviar_somente_num_paciente_servico_protese: false },
};

export const UF_OPTIONS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((value) => ({ value, label: value }));
