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

  function obterEstadoModulo() {
    if (typeof globalThis !== "undefined" && globalThis.BranaTelaPrincipalOdontologicaEstado) {
      return globalThis.BranaTelaPrincipalOdontologicaEstado;
    }
    if (typeof window !== "undefined" && window.BranaTelaPrincipalOdontologicaEstado) {
      return window.BranaTelaPrincipalOdontologicaEstado;
    }
    return null;
  }

  function obterLayoutModulo() {
    if (typeof globalThis !== "undefined" && globalThis.BranaTelaPrincipalOdontologicaLayout) {
      return globalThis.BranaTelaPrincipalOdontologicaLayout;
    }
    if (typeof window !== "undefined" && window.BranaTelaPrincipalOdontologicaLayout) {
      return window.BranaTelaPrincipalOdontologicaLayout;
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

    const estadoModulo = obterEstadoModulo();
    const layoutModulo = obterLayoutModulo();

    if (!estadoModulo || typeof estadoModulo.obterEstadoTelaPrincipalOdontologicaMock !== "function" || !layoutModulo || typeof layoutModulo.renderTelaPrincipalOdontologicaLayout !== "function") {
      containerResolvido.appendChild(criarMarcadorTecnico(validacao.contexto));
      return montarResultadoBase(validacao.contexto, {
        ok: false,
        status: "modulo-visual-indisponivel",
        container: containerResolvido,
        marcadorCriado: true,
        mensagem: "Módulos visuais indisponíveis; marcador técnico mantido.",
        problemas: validacao.problemas.concat(["modulo-visual-indisponivel"]),
      });
    }

    const estadoMock = estadoModulo.obterEstadoTelaPrincipalOdontologicaMock({
      ...validacao.contexto,
      comPaciente: !!(
        validacao.contexto.comPaciente ||
        validacao.contexto.pacienteId ||
        validacao.contexto.pacienteCodigo ||
        validacao.contexto.pacienteNome
      ),
    });

    const renderizacao = layoutModulo.renderTelaPrincipalOdontologicaLayout(containerResolvido, estadoMock, {
      contexto: validacao.contexto,
      origem: validacao.contexto.origem,
      modo: validacao.contexto.modo,
    });

    if (!renderizacao || !renderizacao.ok) {
      containerResolvido.appendChild(criarMarcadorTecnico(validacao.contexto));
      return montarResultadoBase(validacao.contexto, {
        ok: false,
        status: "falha-renderizacao",
        container: containerResolvido,
        marcadorCriado: true,
        mensagem: "Falha ao renderizar o esqueleto visual estático.",
        problemas: validacao.problemas.concat(["falha-renderizacao"]),
      });
    }

    return montarResultadoBase(validacao.contexto, {
      ok: true,
      status: "esqueleto-visual-estatico-renderizado",
      container: containerResolvido,
      marcadorCriado: false,
      mensagem: "Esqueleto visual estático renderizado.",
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
