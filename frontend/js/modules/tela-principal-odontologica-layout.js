(function () {
  "use strict";

  const MODULE_NAME = "BranaTelaPrincipalOdontologicaLayout";
  const ROOT_ATTR = "data-tela-principal-odontologica-isolada";

  function toText(value, fallback = "") {
    const texto = String(value ?? "").trim();
    return texto || String(fallback ?? "").trim();
  }

  function isElementoDom(valor) {
    return typeof HTMLElement !== "undefined" && valor instanceof HTMLElement;
  }

  function validarContainer(container) {
    if (isElementoDom(container)) {
      return { ok: true, container };
    }
    return { ok: false, container: null };
  }

  function limparAreaPropria(container) {
    if (!isElementoDom(container)) return false;
    const existentes = container.querySelectorAll(`[${ROOT_ATTR}]`);
    existentes.forEach((node) => node.remove());
    return true;
  }

  function criarBlocoRotulo(titulo, valor) {
    const bloco = document.createElement("div");
    bloco.style.display = "grid";
    bloco.style.gap = "2px";

    const rotulo = document.createElement("strong");
    rotulo.textContent = titulo;
    rotulo.style.font = "700 11px Tahoma, sans-serif";
    rotulo.style.color = "#304053";

    const texto = document.createElement("span");
    texto.textContent = valor;
    texto.style.font = "12px Tahoma, sans-serif";
    texto.style.color = "#1f2937";

    bloco.appendChild(rotulo);
    bloco.appendChild(texto);
    return bloco;
  }

  function criarTagTexto(texto, destaque = false) {
    const tag = document.createElement("span");
    tag.textContent = texto;
    tag.style.display = "inline-flex";
    tag.style.alignItems = "center";
    tag.style.padding = "3px 8px";
    tag.style.border = "1px solid " + (destaque ? "#8ab4e8" : "#d7dfe7");
    tag.style.borderRadius = "999px";
    tag.style.background = destaque ? "#eef6ff" : "#fff";
    tag.style.font = "11px Tahoma, sans-serif";
    tag.style.color = "#314052";
    return tag;
  }

  function criarCabecalho(container, estado, opcoes = {}) {
    const shell = document.createElement("div");
    shell.style.display = "flex";
    shell.style.justifyContent = "space-between";
    shell.style.alignItems = "center";
    shell.style.gap = "12px";
    shell.style.padding = "10px 12px";
    shell.style.borderBottom = "1px solid #d9e2ec";
    shell.style.background = "linear-gradient(180deg, #f8fbff 0%, #edf4fb 100%)";

    const tituloWrap = document.createElement("div");
    tituloWrap.style.display = "grid";
    tituloWrap.style.gap = "3px";

    const titulo = document.createElement("div");
    titulo.textContent = "Tela principal odontológica";
    titulo.style.font = "700 15px Tahoma, sans-serif";
    titulo.style.color = "#203040";

    const subtitulo = document.createElement("div");
    subtitulo.textContent = "Entrada técnica isolada";
    subtitulo.style.font = "12px Tahoma, sans-serif";
    subtitulo.style.color = "#586776";

    tituloWrap.appendChild(titulo);
    tituloWrap.appendChild(subtitulo);

    const badges = document.createElement("div");
    badges.style.display = "flex";
    badges.style.flexWrap = "wrap";
    badges.style.gap = "6px";
    badges.appendChild(criarTagTexto(estado.statusVisual || "neutro", true));
    badges.appendChild(criarTagTexto(toText(opcoes.modo, estado.modo || "visual-estatico")));
    badges.appendChild(criarTagTexto(toText(opcoes.origem, estado.origem || "ficha-pessoal-historico")));

    shell.appendChild(tituloWrap);
    shell.appendChild(badges);
    return shell;
  }

  function criarToolbar() {
    const toolbar = document.createElement("div");
    toolbar.style.display = "flex";
    toolbar.style.flexWrap = "wrap";
    toolbar.style.gap = "8px";
    toolbar.style.padding = "10px 12px";
    toolbar.style.borderBottom = "1px solid #e3eaf1";
    toolbar.style.background = "#fafcff";

    [
      "Abrir",
      "Salvar",
      "Imprimir",
      "Agenda",
      "Documentos",
      "Observações",
    ].forEach((texto) => {
      const item = document.createElement("button");
      item.type = "button";
      item.textContent = texto;
      item.disabled = true;
      item.style.height = "28px";
      item.style.padding = "0 10px";
      item.style.border = "1px solid #c9d4df";
      item.style.background = "linear-gradient(180deg, #fff 0%, #eef4fa 100%)";
      item.style.borderRadius = "3px";
      item.style.color = "#304053";
      item.style.font = "700 11px Tahoma, sans-serif";
      toolbar.appendChild(item);
    });

    return toolbar;
  }

  function criarLinhaPaciente(estado) {
    const faixa = document.createElement("div");
    faixa.style.display = "grid";
    faixa.style.gridTemplateColumns = "1fr auto";
    faixa.style.gap = "10px";
    faixa.style.padding = "10px 12px";
    faixa.style.borderBottom = "1px solid #e3eaf1";
    faixa.style.background = "#fff";

    const info = document.createElement("div");
    info.style.display = "grid";
    info.style.gap = "4px";

    const nome = document.createElement("div");
    nome.textContent = estado.paciente?.nomeCompleto
      ? `${estado.paciente.codigo || ""}${estado.paciente.codigo ? " - " : ""}${estado.paciente.nomeCompleto}`
      : "Sem paciente selecionado";
    nome.style.font = "700 13px Tahoma, sans-serif";
    nome.style.color = "#1f2937";

    const meta = document.createElement("div");
    meta.textContent = estado.paciente?.simulado ? "Paciente simulado para teste visual." : "Estado neutro de entrada.";
    meta.style.font = "11px Tahoma, sans-serif";
    meta.style.color = "#6b7280";

    info.appendChild(nome);
    info.appendChild(meta);

    const resumo = document.createElement("div");
    resumo.style.display = "flex";
    resumo.style.flexWrap = "wrap";
    resumo.style.gap = "6px";
    resumo.appendChild(criarTagTexto(`Procedimentos: ${estado.procedimentos.length}`));
    resumo.appendChild(criarTagTexto(`Agenda: ${estado.agenda.length}`));
    resumo.appendChild(criarTagTexto(`Histórico: ${estado.historico.length}`));

    faixa.appendChild(info);
    faixa.appendChild(resumo);
    return faixa;
  }

  function criarAreaOdontograma(estado) {
    const area = document.createElement("section");
    area.style.padding = "12px";
    area.style.borderBottom = "1px solid #e3eaf1";
    area.style.background = "#fcfdff";

    const titulo = document.createElement("div");
    titulo.textContent = "Odontograma visual simplificado";
    titulo.style.font = "700 12px Tahoma, sans-serif";
    titulo.style.color = "#213042";
    titulo.style.marginBottom = "8px";

    const grade = document.createElement("div");
    grade.style.display = "grid";
    grade.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
    grade.style.gap = "8px";

    estado.odontograma.forEach((slot) => {
      const bloco = document.createElement("div");
      bloco.style.border = "1px solid #d9e2ec";
      bloco.style.background = "#fff";
      bloco.style.minHeight = "74px";
      bloco.style.padding = "8px";
      bloco.style.display = "grid";
      bloco.style.gap = "4px";

      const dente = document.createElement("div");
      dente.textContent = `Dente ${slot.dente}`;
      dente.style.font = "700 12px Tahoma, sans-serif";
      dente.style.color = "#1f3550";

      const status = document.createElement("div");
      status.textContent = `Status: ${slot.status}`;
      status.style.font = "11px Tahoma, sans-serif";
      status.style.color = "#526273";

      const desc = document.createElement("div");
      desc.textContent = slot.descricao;
      desc.style.font = "11px Tahoma, sans-serif";
      desc.style.color = "#374151";

      bloco.appendChild(dente);
      bloco.appendChild(status);
      bloco.appendChild(desc);
      grade.appendChild(bloco);
    });

    area.appendChild(titulo);
    area.appendChild(grade);
    return area;
  }

  function criarListaProcedimentos(estado) {
    const secao = document.createElement("section");
    secao.style.padding = "12px";
    secao.style.borderBottom = "1px solid #e3eaf1";
    secao.style.background = "#fff";

    const titulo = document.createElement("div");
    titulo.textContent = "Procedimentos mockados";
    titulo.style.font = "700 12px Tahoma, sans-serif";
    titulo.style.color = "#213042";
    titulo.style.marginBottom = "8px";

    const lista = document.createElement("div");
    lista.style.display = "grid";
    lista.style.gap = "6px";

    estado.procedimentos.forEach((item) => {
      const linha = document.createElement("div");
      linha.style.display = "grid";
      linha.style.gap = "2px";
      linha.style.padding = "8px";
      linha.style.border = "1px solid #d9e2ec";
      linha.style.background = "#fafcff";

      const nome = document.createElement("div");
      nome.textContent = `${item.codigo} - ${item.nome}`;
      nome.style.font = "700 11px Tahoma, sans-serif";
      nome.style.color = "#1f3550";

      const obs = document.createElement("div");
      obs.textContent = item.observacao;
      obs.style.font = "11px Tahoma, sans-serif";
      obs.style.color = "#5b6876";

      linha.appendChild(nome);
      linha.appendChild(obs);
      lista.appendChild(linha);
    });

    secao.appendChild(titulo);
    secao.appendChild(lista);
    return secao;
  }

  function criarAtalhosLaterais() {
    const secao = document.createElement("section");
    secao.style.padding = "12px";
    secao.style.borderBottom = "1px solid #e3eaf1";
    secao.style.background = "#fafcff";

    const titulo = document.createElement("div");
    titulo.textContent = "Atalhos visuais";
    titulo.style.font = "700 12px Tahoma, sans-serif";
    titulo.style.color = "#213042";
    titulo.style.marginBottom = "8px";

    const faixa = document.createElement("div");
    faixa.style.display = "flex";
    faixa.style.flexWrap = "wrap";
    faixa.style.gap = "6px";

    ["Paciente", "Tratamento", "Imagens", "Documentos", "Agenda"].forEach((texto) => {
      faixa.appendChild(criarTagTexto(texto));
    });

    secao.appendChild(titulo);
    secao.appendChild(faixa);
    return secao;
  }

  function criarAbasResumo(estado) {
    const secao = document.createElement("section");
    secao.style.padding = "12px";
    secao.style.borderBottom = "1px solid #e3eaf1";
    secao.style.background = "#fff";

    const titulo = document.createElement("div");
    titulo.textContent = "Abas e resumos visuais";
    titulo.style.font = "700 12px Tahoma, sans-serif";
    titulo.style.color = "#213042";
    titulo.style.marginBottom = "8px";

    const faixa = document.createElement("div");
    faixa.style.display = "flex";
    faixa.style.flexWrap = "wrap";
    faixa.style.gap = "6px";

    ["Paciente", "Tratamento", "Observações", "Imagens", "Documentos", "Agenda"].forEach((texto) => {
      faixa.appendChild(criarTagTexto(texto, texto === "Paciente"));
    });

    const observacao = document.createElement("div");
    observacao.textContent = estado.observacoesVisuais;
    observacao.style.marginTop = "8px";
    observacao.style.font = "11px Tahoma, sans-serif";
    observacao.style.color = "#526273";

    secao.appendChild(titulo);
    secao.appendChild(faixa);
    secao.appendChild(observacao);
    return secao;
  }

  function criarAgendaResumo(estado) {
    const secao = document.createElement("section");
    secao.style.padding = "12px";
    secao.style.borderBottom = "1px solid #e3eaf1";
    secao.style.background = "#fbfdff";

    const titulo = document.createElement("div");
    titulo.textContent = "Agenda resumida mockada";
    titulo.style.font = "700 12px Tahoma, sans-serif";
    titulo.style.color = "#213042";
    titulo.style.marginBottom = "8px";

    const lista = document.createElement("div");
    lista.style.display = "grid";
    lista.style.gap = "6px";

    estado.agenda.forEach((item) => {
      const linha = document.createElement("div");
      linha.style.display = "grid";
      linha.style.gridTemplateColumns = "80px 1fr";
      linha.style.gap = "8px";
      linha.style.padding = "6px 8px";
      linha.style.border = "1px solid #d9e2ec";
      linha.style.background = "#fff";

      const hora = document.createElement("div");
      hora.textContent = item.hora;
      hora.style.font = "700 11px Consolas, monospace";
      hora.style.color = "#1f3550";

      const desc = document.createElement("div");
      desc.textContent = item.descricao;
      desc.style.font = "11px Tahoma, sans-serif";
      desc.style.color = "#374151";

      linha.appendChild(hora);
      linha.appendChild(desc);
      lista.appendChild(linha);
    });

    secao.appendChild(titulo);
    secao.appendChild(lista);
    return secao;
  }

  function criarHistoricoMockado(estado) {
    const secao = document.createElement("section");
    secao.style.padding = "12px";
    secao.style.background = "#fff";

    const titulo = document.createElement("div");
    titulo.textContent = "Histórico inferior mockado";
    titulo.style.font = "700 12px Tahoma, sans-serif";
    titulo.style.color = "#213042";
    titulo.style.marginBottom = "8px";

    const tabela = document.createElement("table");
    tabela.style.width = "100%";
    tabela.style.borderCollapse = "collapse";
    tabela.style.tableLayout = "fixed";
    tabela.style.font = "11px Tahoma, sans-serif";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    ["Data", "Cirurgião", "Região", "Descrição do procedimento"].forEach((tituloColuna) => {
      const th = document.createElement("th");
      th.textContent = tituloColuna;
      th.style.textAlign = "left";
      th.style.padding = "4px 6px";
      th.style.borderBottom = "1px solid #d9e2ec";
      th.style.background = "#f6f9fc";
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = document.createElement("tbody");
    estado.historico.forEach((item) => {
      const tr = document.createElement("tr");
      [item.data, item.cirurgiao, item.regiao, item.descricao].forEach((valor) => {
        const td = document.createElement("td");
        td.textContent = valor;
        td.style.padding = "4px 6px";
        td.style.borderBottom = "1px solid #eef2f7";
        td.style.verticalAlign = "top";
        td.style.wordBreak = "break-word";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    tabela.appendChild(thead);
    tabela.appendChild(tbody);
    secao.appendChild(titulo);
    secao.appendChild(tabela);
    return secao;
  }

  function criarRodape(estado) {
    const rodape = document.createElement("div");
    rodape.style.padding = "10px 12px";
    rodape.style.borderTop = "1px solid #d9e2ec";
    rodape.style.background = "#f8fbff";
    rodape.style.font = "11px Tahoma, sans-serif";
    rodape.style.color = "#526273";
    rodape.textContent = estado.resumoVisual;
    return rodape;
  }

  function renderTelaPrincipalOdontologicaLayout(container, estado, opcoes = {}) {
    const validacao = validarContainer(container);
    if (!validacao.ok) {
      return {
        ok: false,
        status: "container-invalido",
        container: null,
        root: null,
      };
    }

    const alvo = validacao.container;
    limparAreaPropria(alvo);

    const root = document.createElement("section");
    root.setAttribute(ROOT_ATTR, "1");
    root.style.display = "grid";
    root.style.gap = "0";
    root.style.border = "1px solid #cfd8e3";
    root.style.background = "#fff";
    root.style.boxSizing = "border-box";
    root.style.fontFamily = "Tahoma, sans-serif";
    root.style.color = "#1f2937";
    root.style.maxWidth = "100%";
    root.style.minHeight = "0";

    const dados = estado && typeof estado === "object" ? estado : {};

    root.appendChild(criarCabecalho(alvo, dados, opcoes));
    root.appendChild(criarToolbar());
    root.appendChild(criarLinhaPaciente(dados));
    root.appendChild(criarAreaOdontograma(dados));
    root.appendChild(criarListaProcedimentos(dados));
    root.appendChild(criarAtalhosLaterais(dados));
    root.appendChild(criarAbasResumo(dados));
    root.appendChild(criarAgendaResumo(dados));
    root.appendChild(criarHistoricoMockado(dados));
    root.appendChild(criarRodape(dados));

    alvo.appendChild(root);

    return {
      ok: true,
      status: "esqueleto-visual-estatico-renderizado",
      container: alvo,
      root,
    };
  }

  const api = Object.freeze({
    MODULE_NAME,
    validarContainer,
    limparAreaPropria,
    renderTelaPrincipalOdontologicaLayout,
  });

  if (typeof window !== "undefined") {
    window.BranaTelaPrincipalOdontologicaLayout = api;
  }

  if (typeof globalThis !== "undefined") {
    globalThis.BranaTelaPrincipalOdontologicaLayout = api;
  }
})();
