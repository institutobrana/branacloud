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

  function prefAmbienteDialogoValor(style) {
    const ref = style || {};
    return {
      family: String(ref.fonte_nome || "Tahoma"),
      size: Number(ref.fonte_tamanho || 12) || 12,
      styleId: typeof window.easyFontNormalizeStyleId === "function"
        ? window.easyFontNormalizeStyleId(ref.fonte_estilo)
        : String(ref.fonte_estilo || "normal"),
      color: String(ref.cor_texto || "#000000"),
      strike: !!ref.riscado,
      underline: !!ref.sublinhado,
      script: String(ref.script || "Ocidental")
    };
  }

  function prefAmbienteEstiloDeDialogo(base, valor) {
    const ref = prefAmbEstiloPadrao();
    return {
      ...ref,
      ...(base || {}),
      fonte_nome: String(valor?.family || ref.fonte_nome || "Tahoma"),
      fonte_tamanho: Number(valor?.size || ref.fonte_tamanho || 12) || 12,
      fonte_estilo: typeof window.easyFontNormalizeStyleId === "function"
        ? window.easyFontNormalizeStyleId(valor?.styleId)
        : String(valor?.styleId || ref.fonte_estilo || "normal"),
      cor_texto: String(valor?.color || ref.cor_texto || "#000000").toLowerCase(),
      riscado: !!valor?.strike,
      sublinhado: !!valor?.underline,
      script: String(valor?.script || ref.script || "Ocidental")
    };
  }

  function prefAmbienteTextoExemplo(secao) {
    const mapa = {
      enunciados: "Enunciado",
      campos_edicao: "Campo",
      botoes_funcao: "BotÃ£o de funÃ§Ã£o",
      outros_botoes: 'BotÃ£o "Radio"',
      itens_lista: "Item 1"
    };
    return mapa[String(secao || "")] || "AaBbYyZz";
  }

  function prefAmbienteSecoesAtuais(baseSecoes, atuais) {
    const origem = baseSecoes || {};
    const estadoAtual = atuais || {};
    const saida = {};
    Object.keys(origem).forEach((chave) => {
      saida[chave] = {
        ...(origem[chave] || {}),
        ...(estadoAtual[chave] || {})
      };
    });
    return saida;
  }

  function prefAmbienteNormalizeStyleId(value) {
    const normalized = String(value || "normal").toLowerCase().trim();
    if (normalized === "bold") return "negrito";
    if (normalized === "italic") return "italico";
    if (normalized === "bold-italic") return "negrito-italico";
    return normalized || "normal";
  }

  function prefAmbienteEnsureOverrides(targetDocument) {
    const doc = targetDocument || document;
    if (!doc || doc.getElementById("pref-amb-override-style")) return false;

    const style = doc.createElement("style");
    style.id = "pref-amb-override-style";
    style.textContent = [
      "#config-preferencias-backdrop .pref-amb-layout{grid-template-columns:124px max-content}",
      "#config-preferencias-backdrop .pref-amb-list{width:122px}",
      "#config-preferencias-backdrop .pref-amb-example{width:262px}",
      "#config-preferencias-backdrop .pref-amb-example-grid{grid-template-columns:120px 128px}",
      "#config-preferencias-backdrop .pref-amb-example-right{padding-top:2px}",
      "#config-preferencias-backdrop .pref-amb-listbox{width:128px}",
      "#config-preferencias-backdrop .pref-amb-btn{width:114px;white-space:nowrap}",
      "#config-preferencias-backdrop .pref-amb-row{gap:0;flex-wrap:nowrap}",
      "#config-preferencias-backdrop .pref-amb-campo-label{display:none}",
      "#config-preferencias-backdrop .pref-amb-field-input{width:74px}",
      "#config-preferencias-backdrop .pref-amb-listbox div{cursor:pointer}",
      "#config-preferencias-backdrop .pref-amb-choice{gap:2px}",
      "#config-preferencias-backdrop .pref-amb-choice input{pointer-events:auto}",
      "#config-preferencias-backdrop .pref-amb-list-item{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
    ].join("");
    doc.head.appendChild(style);
    return true;
  }

  function prefEscHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function prefRenderSelectOptions(select, items, config) {
    if (!select) return false;
    const opts = config || {};
    const list = Array.isArray(items) ? items : [];
    const valueFrom = typeof opts.valueFrom === "function" ? opts.valueFrom : (item) => item?.id ?? "";
    const labelFrom = typeof opts.labelFrom === "function" ? opts.labelFrom : (item) => item?.label ?? item?.nome ?? "";
    const placeholder = opts.placeholder == null ? null : String(opts.placeholder);

    select.innerHTML = [
      placeholder == null ? "" : `<option value="">${prefEscHtml(placeholder)}</option>`,
      ...list.map((item) => {
        const value = prefEscHtml(valueFrom(item));
        const label = prefEscHtml(labelFrom(item));
        return `<option value="${value}">${label}</option>`;
      })
    ].join("");

    return true;
  }

  function prefRenderUfOptions(select, ufs, currentValue) {
    if (!select) return false;
    const list = Array.isArray(ufs) ? ufs : [];
    const actual = String(currentValue ?? "").trim();

    select.innerHTML = `<option value=""></option>` + list.map((item) => `<option value="${prefEscHtml(item)}">${prefEscHtml(item)}</option>`).join("");
    if (actual && list.includes(actual)) select.value = actual;
    return true;
  }

  function prefAmbienteAplicarEstiloElemento(elemento, style) {
    if (!elemento || !style) return false;
    const normalize = typeof window.easyFontNormalizeStyleId === "function"
      ? window.easyFontNormalizeStyleId
      : prefAmbienteNormalizeStyleId;
    const estilo = normalize(style.fonte_estilo);

    elemento.style.fontFamily = String(style.fonte_nome || "Tahoma");
    elemento.style.fontSize = `${Number(style.fonte_tamanho || 12)}px`;
    elemento.style.color = String(style.cor_texto || "#000000");
    elemento.style.fontWeight = estilo === "negrito" || estilo === "negrito-italico" ? "700" : "400";
    elemento.style.fontStyle = estilo === "italico" || estilo === "negrito-italico" ? "italic" : "normal";
    elemento.style.textDecoration = `${style.sublinhado ? "underline " : ""}${style.riscado ? "line-through" : ""}`.trim() || "none";
    return true;
  }

  function prefAmbienteRenderLista({ container, secoes, ativa, esc, onSelect } = {}) {
    if (!container) return false;
    const formatEsc = typeof esc === "function" ? esc : (value) => String(value ?? "");
    const lista = Array.isArray(secoes) ? secoes : [];
    const secaoAtiva = String(ativa || "enunciados").trim();

    container.innerHTML = lista.map((item) => (
      `<button type="button" class="pref-amb-list-item ${item.id === secaoAtiva ? "active" : ""}" data-secao="${formatEsc(item.id)}">${formatEsc(item.label)}</button>`
    )).join("");

    container.querySelectorAll("[data-secao]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (typeof onSelect === "function") onSelect(String(btn.dataset.secao || "enunciados"));
      });
    });

    return true;
  }

  function prefAmbienteAplicarPreview({ refs, secoes } = {}) {
    if (!refs || !secoes) return false;
    prefAmbienteAplicarEstiloElemento(refs.ambEnunciado, secoes.enunciados);
    prefAmbienteAplicarEstiloElemento(refs.ambCampoLabel, secoes.enunciados);
    prefAmbienteAplicarEstiloElemento(refs.ambCampoInput, secoes.campos_edicao);
    prefAmbienteAplicarEstiloElemento(refs.ambBotaoFuncao, secoes.botoes_funcao);
    prefAmbienteAplicarEstiloElemento(refs.ambRadioLabel, secoes.outros_botoes);
    prefAmbienteAplicarEstiloElemento(refs.ambCheckLabel, secoes.outros_botoes);

    [refs.ambLista1, refs.ambLista2, refs.ambLista3, refs.ambLista4].forEach((el) => {
      prefAmbienteAplicarEstiloElemento(el, secoes.itens_lista);
    });

    if (refs.ambLista1) {
      refs.ambLista1.classList.add("active");
      refs.ambLista1.style.background = "#0a67c6";
      refs.ambLista1.style.color = "#ffffff";
    }
    if (refs.ambLista2) refs.ambLista2.classList.remove("active");
    if (refs.ambLista3) refs.ambLista3.classList.remove("active");
    if (refs.ambLista4) refs.ambLista4.classList.remove("active");
    return true;
  }

  function prefAmbienteColetarRefs(root) {
    if (!root) return null;
    const labels = root.querySelectorAll(".pref-amb-choice label");
    return {
      ambEnunciado: root.querySelector("#pref-amb-enunciado"),
      ambCampoLabel: root.querySelector("#pref-amb-campo-label"),
      ambCampoInput: root.querySelector("#pref-amb-campo-input"),
      ambBotaoFuncao: root.querySelector("#pref-amb-botao-funcao"),
      ambLista1: root.querySelector("#pref-amb-lista-1"),
      ambLista2: root.querySelector("#pref-amb-lista-2"),
      ambLista3: root.querySelector("#pref-amb-lista-3"),
      ambLista4: root.querySelector("#pref-amb-lista-4"),
      ambRadioLabel: labels[0]?.querySelector("span") || null,
      ambCheckLabel: labels[1]?.querySelector("span") || null
    };
  }

  function prefAmbienteMontarPreview({ backdrop, onToggleItem } = {}) {
    const root = backdrop?.querySelector?.(".pref-amb-example");
    if (!root) return null;

    if (root.dataset.prefAmbPreviewBuilt === "1") {
      return prefAmbienteColetarRefs(root);
    }

    root.innerHTML = `
    <div class="pref-amb-example-grid">
      <div class="pref-amb-example-left">
        <div id="pref-amb-enunciado">Enunciado:</div>
        <div class="pref-amb-row">
          <div id="pref-amb-campo-label" class="pref-amb-campo-label">Campo</div>
          <input id="pref-amb-campo-input" class="pref-amb-field-input" type="text" value="Campo" readonly>
        </div>
        <button id="pref-amb-botao-funcao" class="pref-amb-btn" type="button">BotÃƒÂ£o de funÃƒÂ§ÃƒÂ£o</button>
        <div class="pref-amb-choice">
          <label><input type="radio" name="pref-amb-radio"><span>BotÃƒÂ£o "Radio"</span></label>
          <label><input type="checkbox"><span>Caixa de checagem</span></label>
        </div>
      </div>
      <div class="pref-amb-example-right">
        <div class="pref-amb-listbox">
          <div id="pref-amb-lista-1" class="active">Item 1</div>
          <div id="pref-amb-lista-2">Item 2</div>
          <div id="pref-amb-lista-3">Item 3</div>
          <div id="pref-amb-lista-4">...</div>
        </div>
      </div>
    </div>
  `;

    const refs = prefAmbienteColetarRefs(root);
    const itens = [refs?.ambLista1, refs?.ambLista2, refs?.ambLista3, refs?.ambLista4].filter(Boolean);

    itens.forEach((item) => {
      item.addEventListener("click", () => {
        itens.forEach((el) => {
          el.classList.remove("active");
          el.style.background = "";
          el.style.color = "";
        });
        item.classList.add("active");
        item.style.background = "#0a67c6";
        item.style.color = "#ffffff";
        if (typeof onToggleItem === "function") onToggleItem(item);
      });
    });

    root.dataset.prefAmbPreviewBuilt = "1";
    return refs;
  }

  function prefOdontoFindByLabel(text) {
    const key = prefOdontoNorm(text);
    for (let i = 0; i < PREF_ODONTO_PALETTE.length; i += 1) {
      if (prefOdontoNorm(PREF_ODONTO_PALETTE[i].label) === key) return PREF_ODONTO_PALETTE[i];
    }
    return null;
  }

  function prefAtualizarTituloModal({ tituloEl, titulo } = {}) {
    if (tituloEl && typeof titulo === "string") tituloEl.textContent = titulo;
  }

  function prefSelecionarAbaModal({ tabs, panes, tabId } = {}) {
    if (!Array.isArray(tabs) || !Array.isArray(panes)) return;
    tabs.forEach(btn => btn.classList.toggle("active", btn?.dataset?.tab === tabId));
    panes.forEach(pane => pane.classList.toggle("hidden", pane?.dataset?.pane !== tabId));
  }

  const moduleApi = Object.freeze({
    getMetadata,
    prefOdontoNorm,
    prefValoresPadraoModelos,
    prefValoresPadraoDados,
    prefValoresPadraoOdontograma,
    prefAmbEstiloPadrao,
    prefAmbienteDialogoValor,
    prefAmbienteEstiloDeDialogo,
    prefAmbienteTextoExemplo,
    prefAmbienteSecoesAtuais,
    prefAmbienteNormalizeStyleId,
    prefAmbienteEnsureOverrides,
    prefEscHtml,
    prefRenderSelectOptions,
    prefRenderUfOptions,
    prefAmbienteAplicarEstiloElemento,
    prefAmbienteRenderLista,
    prefAmbienteAplicarPreview,
    prefAmbienteMontarPreview,
    prefOdontoFindByLabel,
    prefAtualizarTituloModal,
    prefSelecionarAbaModal
  });

  window.BranaPreferenciasOpcoesSistemaModule = moduleApi;
})();
