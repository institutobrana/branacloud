(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaEntrada";
  const CHAVE_TEXTO = "tela-principal-odontologica-entrada";
  const MARCADOR_TECNICO = "Tela odontológica isolada — entrada técnica inicial";

  function obterContratos() {
    if (typeof globalThis !== "undefined" && globalThis.BranaTelaPrincipalOdontologicaContratos) {
      return globalThis.BranaTelaPrincipalOdontologicaContratos;
    }
    if (typeof window !== "undefined" && window.BranaTelaPrincipalOdontologicaContratos) {
      return window.BranaTelaPrincipalOdontologicaContratos;
    }
    return null;
  }

  function resolverContainer(container) {
    if (container == null) return null;
    if (typeof HTMLElement !== "undefined" && container instanceof HTMLElement) return container;
    if (typeof container === "string") {
      const seletor = container.trim();
      if (!seletor) return null;
      if (typeof document === "undefined") return null;
      try {
        return document.querySelector(seletor) || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  function limparMarcadorTecnico(container) {
    if (!(container instanceof HTMLElement)) return false;
    const marcadores = container.querySelectorAll(`[data-${CHAVE_TEXTO}]`);
    marcadores.forEach((node) => node.remove());
    return true;
  }

  function criarMarcadorTecnico(contexto) {
    const marcador = document.createElement("div");
    marcador.setAttribute(`data-${CHAVE_TEXTO}`, "1");
    marcador.className = "tela-principal-odontologica-entrada-tecnica";
    marcador.textContent = MARCADOR_TECNICO;
    marcador.title = [
      contexto?.origem ? `origem: ${contexto.origem}` : "",
      contexto?.modo ? `modo: ${contexto.modo}` : "",
    ].filter(Boolean).join(" | ");
    return marcador;
  }

  function montarResultadoBase(contexto, extras = {}) {
    return Object.freeze({
      ok: !!extras.ok,
      status: String(extras.status || "ok").trim() || "ok",
      contexto,
      container: extras.container || null,
      marcadorCriado: !!extras.marcadorCriado,
      mensagem: String(extras.mensagem || "").trim(),
      problemas: Array.isArray(extras.problemas) ? extras.problemas.slice() : [],
    });
  }

  function abrirTelaPrincipalOdontologicaPorPaciente(contexto) {
    const contratos = obterContratos();
    if (!contratos || typeof contratos.normalizarContextoTelaPrincipalOdontologica !== "function" || typeof contratos.validarContextoTelaPrincipalOdontologica !== "function") {
      return montarResultadoBase(
        contexto,
        {
          ok: false,
          status: "erro-sem-contrato",
          mensagem: "Contrato de contexto indisponível.",
          problemas: ["contrato-indisponivel"],
        }
      );
    }

    const normalizado = contratos.normalizarContextoTelaPrincipalOdontologica(contexto);
    const validacao = contratos.validarContextoTelaPrincipalOdontologica(normalizado);
    const resultadoBase = {
      ok: validacao.ok,
      status: validacao.ok ? "ok" : "contexto-invalido",
      contexto: validacao.contexto,
      problemas: validacao.problemas,
      mensagem: "",
      container: null,
      marcadorCriado: false,
    };

    const containerResolvido = resolverContainer(normalizado.container);
    if (!containerResolvido) {
      return montarResultadoBase(normalizado, {
        ok: false,
        status: "container-nao-encontrado",
        mensagem: "Container não encontrado.",
        problemas: validacao.problemas.concat(["container-nao-encontrado"]),
      });
    }

    limparMarcadorTecnico(containerResolvido);

    if (!validacao.ok) {
      containerResolvido.appendChild(criarMarcadorTecnico(validacao.contexto));
      return montarResultadoBase(validacao.contexto, {
        ok: false,
        status: "contexto-invalido",
        container: containerResolvido,
        marcadorCriado: true,
        mensagem: "Contexto normalizado com restrições.",
        problemas: validacao.problemas,
      });
    }

    containerResolvido.appendChild(criarMarcadorTecnico(validacao.contexto));

    return montarResultadoBase(validacao.contexto, {
      ok: true,
      status: "entrada-isolada-minima",
      container: containerResolvido,
      marcadorCriado: true,
      mensagem: "Entrada técnica inicial criada.",
      problemas: [],
    });
  }

  const api = Object.freeze({
    MODULE_NAME,
    abrirTelaPrincipalOdontologicaPorPaciente,
    resolverContainer,
    limparMarcadorTecnico,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaEntrada = api;
    window.abrirTelaPrincipalOdontologicaPorPaciente = abrirTelaPrincipalOdontologicaPorPaciente;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaEntrada = api;
    globalThis.abrirTelaPrincipalOdontologicaPorPaciente = abrirTelaPrincipalOdontologicaPorPaciente;
  }
})();
