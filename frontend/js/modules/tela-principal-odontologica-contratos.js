(function () {
  "use strict";

  const ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA = Object.freeze({
    "workspace-principal": "workspace-principal",
    "ficha-pessoal-historico": "ficha-pessoal-historico",
  });

  const MODOS_TELA_PRINCIPAL_ODONTOLOGICA = Object.freeze({
    "visual-estatico": "visual-estatico",
    leitura: "leitura",
  });

  function normalizarTexto(valor, fallback = "") {
    const texto = String(valor ?? "").trim();
    return texto || String(fallback ?? "").trim();
  }

  function resolverOrigemTelaPrincipalOdontologica(valor) {
    const origem = normalizarTexto(valor, ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA["ficha-pessoal-historico"]);
    if (Object.prototype.hasOwnProperty.call(ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA, origem)) {
      return origem;
    }
    return ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA["ficha-pessoal-historico"];
  }

  function resolverModoTelaPrincipalOdontologica(valor) {
    const modo = normalizarTexto(valor, MODOS_TELA_PRINCIPAL_ODONTOLOGICA["visual-estatico"]);
    if (Object.prototype.hasOwnProperty.call(MODOS_TELA_PRINCIPAL_ODONTOLOGICA, modo)) {
      return modo;
    }
    return MODOS_TELA_PRINCIPAL_ODONTOLOGICA["visual-estatico"];
  }

  function normalizarContextoTelaPrincipalOdontologica(contexto) {
    const fonte = contexto && typeof contexto === "object" ? contexto : {};
    return {
      pacienteId: fonte.pacienteId == null ? null : fonte.pacienteId,
      pacienteCodigo: fonte.pacienteCodigo == null ? "" : String(fonte.pacienteCodigo).trim(),
      pacienteNome: fonte.pacienteNome == null ? "" : String(fonte.pacienteNome).trim(),
      origemSecundaria: fonte.origemSecundaria == null ? "" : String(fonte.origemSecundaria).trim(),
      origem: resolverOrigemTelaPrincipalOdontologica(fonte.origem),
      modo: resolverModoTelaPrincipalOdontologica(fonte.modo),
      container: fonte.container == null ? null : fonte.container,
    };
  }

  function validarContextoTelaPrincipalOdontologica(contexto) {
    const normalizado = normalizarContextoTelaPrincipalOdontologica(contexto);
    const problemas = [];

    if (!Object.prototype.hasOwnProperty.call(ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA, normalizado.origem)) {
      problemas.push("origem-invalida");
    }

    if (!Object.prototype.hasOwnProperty.call(MODOS_TELA_PRINCIPAL_ODONTOLOGICA, normalizado.modo)) {
      problemas.push("modo-invalido");
    }

    if (normalizado.pacienteId != null && Number(normalizado.pacienteId) <= 0) {
      problemas.push("paciente-id-invalido");
    }

    if (normalizado.container != null) {
      const tipo = typeof normalizado.container;
      const ehSeletor = tipo === "string" && !!String(normalizado.container).trim();
      const ehElemento = typeof HTMLElement !== "undefined" && normalizado.container instanceof HTMLElement;
      if (!ehSeletor && !ehElemento) {
        problemas.push("container-invalido");
      }
    }

    return {
      ok: problemas.length === 0,
      problemas,
      contexto: normalizado,
    };
  }

  const api = Object.freeze({
    ORIGENS_TELA_PRINCIPAL_ODONTOLOGICA,
    MODOS_TELA_PRINCIPAL_ODONTOLOGICA,
    normalizarContextoTelaPrincipalOdontologica,
    validarContextoTelaPrincipalOdontologica,
    resolverOrigemTelaPrincipalOdontologica,
    resolverModoTelaPrincipalOdontologica,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaContratos = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaContratos = api;
  }
})();
