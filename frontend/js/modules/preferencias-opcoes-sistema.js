(function () {
  "use strict";

  const MODULE_NAME = "preferencias-opcoes-sistema";
  const MODULE_VERSION = "1.0.0-passivo";

  function getMetadata() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      passive: true,
      movedBehavior: false
    };
  }

  function prefOdontoNorm(text) {
    return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function prefValoresPadraoModelos() {
    return {
      modelo_impresso_atestados_id: null,
      modelo_impresso_receitas_id: null,
      modelo_impresso_recibos_id: null,
      modelo_padrao_etiquetas_id: null,
      modelo_texto_email_agenda_id: null,
      modelo_padrao_orcamentos_id: null,
      modelo_texto_whatsapp_agenda_id: null
    };
  }

  function prefValoresPadraoDados() {
    return {
      nome: "",
      apelido: "",
      email: "",
      endereco: "",
      bairro: "",
      cidade: "",
      cep: "",
      uf: "",
      pais: "Brasil",
      telefones: "",
      cro: "",
      cpf: ""
    };
  }

  function prefValoresPadraoOdontograma() {
    return {
      especialidade_mais_utilizada: "clinica",
      filtro_mais_utilizado: "todas_tratamento",
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
      cor_a_realizar: "#ff0000",
      cor_realizado: "#0000ff",
      cor_condicao_observada: "#008000",
      cor_anomalia: "#000000"
    };
  }

  function prefAmbEstiloPadrao() {
    return {
      fonte_nome: "Tahoma",
      fonte_tamanho: 12,
      fonte_estilo: "normal",
      cor_texto: "#000000",
      riscado: false,
      sublinhado: false,
      script: "Ocidental"
    };
  }

  function prefOdontoFindByLabel(text) {
    const key = prefOdontoNorm(text);
    for (let i = 0; i < PREF_ODONTO_PALETTE.length; i += 1) {
      if (prefOdontoNorm(PREF_ODONTO_PALETTE[i].label) === key) return PREF_ODONTO_PALETTE[i];
    }
    return null;
  }

  const moduleApi = Object.freeze({
    getMetadata,
    prefOdontoNorm,
    prefValoresPadraoModelos,
    prefValoresPadraoDados,
    prefValoresPadraoOdontograma,
    prefAmbEstiloPadrao,
    prefOdontoFindByLabel
  });

  window.BranaPreferenciasOpcoesSistemaModule = moduleApi;
})();
