(function () {
  "use strict";

  const meta = Object.freeze({
    nome: "Símbolos Gráficos",
    modulo: "simbolos-graficos",
    subetapa: "1",
    descricao: "Namespace passivo para futura modularização conservadora do módulo Símbolos Gráficos.",
    ativo: false,
    controlaFluxo: false,
    usaDOM: false,
    usaFetch: false,
    usaRequestJson: false,
    usaEventos: false,
    usaModal: false,
    usaEditorVisual: false,
    usaIframe: false,
    usaCanvas: false,
    usaPostMessage: false,
    moveuLogicaDoApp: false
  });

  function getInfo() {
    return meta;
  }

  function getStatus() {
    return {
      ok: true,
      ativo: false,
      controlaFluxo: false,
      mensagem: "Módulo Símbolos Gráficos carregado em modo passivo. Nenhum fluxo foi assumido."
    };
  }

  function normalizarTextoSimbolo(valor) {
    return String(valor ?? "").trim().toLowerCase();
  }

  function ehSimboloSistema(item) {
    return !!item && (Number(item.legacy_id || 0) > 0 || Number(item.tipo_simbolo || 0) === 1);
  }

  function ocultarItemDaBiblioteca(item) {
    const codigo = String(item?.codigo || "").trim().toLowerCase();
    return codigo === "int_escova.bmp"
      || codigo === "int_manut.bmp"
      || codigo === "int_remove.bmp"
      || codigo === "int_resto.bmp";
  }

  function compararBibliotecaPorCodigo(a, b) {
    const codigoA = String(a?.codigo ?? a?.descricao ?? "").trim();
    const codigoB = String(b?.codigo ?? b?.descricao ?? "").trim();
    const principal = codigoA.localeCompare(codigoB, undefined, { numeric: true, sensitivity: "base" });
    if (principal !== 0) return principal;
    return String(a?.descricao ?? "").localeCompare(String(b?.descricao ?? ""), undefined, { numeric: true, sensitivity: "base" });
  }

  function urlImagemSimbolo(item) {
    if (!item || typeof item !== "object") return "";
    const imagemCustom = String(item.imagem_custom ?? "").trim();
    if (imagemCustom) return imagemCustom;
    const imagemUrl = String(item.imagem_url ?? "").trim();
    if (imagemUrl) return imagemUrl;
    const codigo = String(item.codigo ?? "").trim().toLowerCase();
    if (codigo === "sim_modelo.bmp") return "/desktop-assets/easy/sim_default.bmp";
    return "";
  }

  function validarTipoMarcaSimbolo(valor) {
    const bruto = String(valor ?? "").trim().toLowerCase();
    if (!bruto) return "";
    if (bruto === "1" || bruto === "sistema") return "sistema";
    if (bruto === "2" || bruto === "usuario") return "usuario";
    return "";
  }

  window.BranaSimbolosGraficosModule = Object.freeze({
    meta,
    getInfo,
    getStatus,
    helpers: Object.freeze({
      normalizarTextoSimbolo,
      ehSimboloSistema,
      ocultarItemDaBiblioteca,
      compararBibliotecaPorCodigo,
      urlImagemSimbolo,
      validarTipoMarcaSimbolo
    })
  });
})();
