(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaEntrada";
  const CHAVE_TEXTO = "tela-principal-odontologica-entrada";
  const MARCADOR_TECNICO = "Tela odontologica isolada - entrada tecnica inicial";
  const WORKSPACE_HOST_ID = "tela-principal-odontologica-workspace-host";

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

  function obterElementoWorkspacePrincipal() {
    if (typeof document === "undefined") return null;
    const workspaceEmpty = document.getElementById("workspace-empty");
    if (workspaceEmpty instanceof HTMLElement) return workspaceEmpty;
    const workspace = document.querySelector("main.workspace");
    if (workspace instanceof HTMLElement) return workspace;
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

  function obterOuCriarHostWorkspacePrincipal() {
    const workspace = obterElementoWorkspacePrincipal();
    if (!(workspace instanceof HTMLElement)) return null;

    let host = document.getElementById(WORKSPACE_HOST_ID);
    if (host && host.isConnected) return host;

    host = document.createElement("section");
    host.id = WORKSPACE_HOST_ID;
    host.setAttribute("data-tela-principal-odontologica-workspace", "1");
    host.style.minHeight = "0";
    host.style.width = "100%";
    host.style.boxSizing = "border-box";

    if (workspace.id === "workspace-empty") {
      workspace.replaceChildren(host);
    } else {
      workspace.appendChild(host);
    }

    return host;
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

  function renderizarContextoOdontologico(contextoValidado, containerResolvido, opcoes = {}) {
    limparMarcadorTecnico(containerResolvido);

    const estadoModulo = obterEstadoModulo();
    const layoutModulo = obterLayoutModulo();

    if (!estadoModulo || typeof estadoModulo.obterEstadoTelaPrincipalOdontologicaMock !== "function" || !layoutModulo || typeof layoutModulo.renderTelaPrincipalOdontologicaLayout !== "function") {
      containerResolvido.appendChild(criarMarcadorTecnico(contextoValidado));
      return montarResultadoBase(contextoValidado, {
        ok: false,
        status: "modulo-visual-indisponivel",
        container: containerResolvido,
        marcadorCriado: true,
        mensagem: "Modulos visuais indisponiveis; marcador tecnico mantido.",
        problemas: ["modulo-visual-indisponivel"],
      });
    }

    const estadoMock = estadoModulo.obterEstadoTelaPrincipalOdontologicaMock({
      ...contextoValidado,
      origem: opcoes.origem || contextoValidado.origem,
      comPaciente: !!(
        contextoValidado.comPaciente ||
        contextoValidado.pacienteId ||
        contextoValidado.pacienteCodigo ||
        contextoValidado.pacienteNome
      ),
    });

    const renderizacao = layoutModulo.renderTelaPrincipalOdontologicaLayout(containerResolvido, estadoMock, {
      contexto: contextoValidado,
      origem: opcoes.origem || contextoValidado.origem,
      modo: contextoValidado.modo,
    });

    if (!renderizacao || !renderizacao.ok) {
      containerResolvido.appendChild(criarMarcadorTecnico(contextoValidado));
      return montarResultadoBase(contextoValidado, {
        ok: false,
        status: "falha-renderizacao",
        container: containerResolvido,
        marcadorCriado: true,
        mensagem: "Falha ao renderizar o esqueleto visual.",
        problemas: ["falha-renderizacao"],
      });
    }

    return montarResultadoBase(contextoValidado, {
      ok: true,
      status: opcoes.statusOk || "esqueleto-visual-estatico-renderizado",
      container: containerResolvido,
      marcadorCriado: false,
      mensagem: opcoes.mensagemOk || "Esqueleto visual renderizado.",
      problemas: [],
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
          mensagem: "Contrato de contexto indisponivel.",
          problemas: ["contrato-indisponivel"],
        }
      );
    }

    const normalizado = contratos.normalizarContextoTelaPrincipalOdontologica(contexto);
    const validacao = contratos.validarContextoTelaPrincipalOdontologica(normalizado);

    return abrirTelaPrincipalOdontologicaNoWorkspace({
      ...validacao.contexto,
      origemSecundaria: validacao.contexto.origem,
      origem: "workspace-principal",
      container: null,
    });
  }

  function abrirTelaPrincipalOdontologicaNoWorkspace(contexto) {
    const contratos = obterContratos();
    if (!contratos || typeof contratos.normalizarContextoTelaPrincipalOdontologica !== "function" || typeof contratos.validarContextoTelaPrincipalOdontologica !== "function") {
      return montarResultadoBase(
        contexto,
        {
          ok: false,
          status: "erro-sem-contrato",
          mensagem: "Contrato de contexto indisponivel.",
          problemas: ["contrato-indisponivel"],
        }
      );
    }

    const origemSecundaria = contexto && typeof contexto === "object"
      ? String(
          contexto.origemSecundaria ||
          (String(contexto.origem || "").trim() === "workspace-principal" ? "" : contexto.origem || "")
        ).trim()
      : "";
    const normalizado = contratos.normalizarContextoTelaPrincipalOdontologica({
      ...(contexto && typeof contexto === "object" ? contexto : {}),
      origem: "workspace-principal",
      origemSecundaria,
      container: null,
    });
    const validacao = contratos.validarContextoTelaPrincipalOdontologica(normalizado);

    const workspaceHost = obterOuCriarHostWorkspacePrincipal();
    if (!workspaceHost) {
      return montarResultadoBase(validacao.contexto, {
        ok: false,
        status: "workspace-nao-encontrado",
        mensagem: "Workspace principal nao encontrado.",
        problemas: validacao.problemas.concat(["workspace-nao-encontrado"]),
      });
    }

    if (typeof hideAllPanels === "function") {
      try {
        hideAllPanels();
      } catch {}
    }

    const workspaceEmpty = obterElementoWorkspacePrincipal();
    if (workspaceEmpty?.classList) workspaceEmpty.classList.remove("hidden");

    return renderizarContextoOdontologico(validacao.contexto, workspaceHost, {
      origem: "workspace-principal",
      statusOk: "workspace-principal-renderizado",
      mensagemOk: "Tela odontologica montada no workspace principal.",
    });
  }

  const api = Object.freeze({
    MODULE_NAME,
    abrirTelaPrincipalOdontologicaPorPaciente,
    abrirTelaPrincipalOdontologicaNoWorkspace,
    obterElementoWorkspacePrincipal,
    obterOuCriarHostWorkspacePrincipal,
    resolverContainer,
    limparMarcadorTecnico,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaEntrada = api;
    window.abrirTelaPrincipalOdontologicaPorPaciente = abrirTelaPrincipalOdontologicaPorPaciente;
    window.abrirTelaPrincipalOdontologicaNoWorkspace = abrirTelaPrincipalOdontologicaNoWorkspace;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaEntrada = api;
    globalThis.abrirTelaPrincipalOdontologicaPorPaciente = abrirTelaPrincipalOdontologicaPorPaciente;
    globalThis.abrirTelaPrincipalOdontologicaNoWorkspace = abrirTelaPrincipalOdontologicaNoWorkspace;
  }
})();
