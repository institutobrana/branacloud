(function () {
  "use strict";

  const MODULE_NAME = "conta-corrente";
  const MODULE_VERSION = "1.0.0";

  function contaCorrenteFormatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function contaCorrenteFormatarDataISO(valor) {
    if (!valor || String(valor).length < 10) return "";
    const [y, m, d] = String(valor).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
  }

  function contaCorrenteMontarLinhasLancamentos(lista, opts) {
    const itens = Array.isArray(lista) ? lista : [];
    const formatData =
      typeof opts?.formatData === "function"
        ? opts.formatData
        : contaCorrenteFormatarDataISO;
    const formatMoeda =
      typeof opts?.formatMoeda === "function"
        ? opts.formatMoeda
        : contaCorrenteFormatarMoeda;
    const escHtml =
      typeof opts?.escHtml === "function"
        ? opts.escHtml
        : (valor) =>
            String(valor ?? "")
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");

    const html = itens
      .map(
        (item) =>
          `<tr data-id="${escHtml(item?.id ?? "")}" class="${item?.tipo === "debito" ? "debito" : ""}"><td>${escHtml(formatData(item?.data_lancamento || ""))}</td><td>${escHtml(item?.categoria_nome || "")}</td><td>${escHtml(item?.historico || "")}</td><td>${item?.tipo === "debito" ? formatMoeda(item?.valor) : ""}</td><td>${item?.tipo === "credito" ? formatMoeda(item?.valor) : ""}</td></tr>`
      )
      .join("");

    return {
      html,
      totalItens: itens.length,
    };
  }

  function contaCorrenteAtualizarTotais(data, refs, opts) {
    if (!refs) return null;
    const formatMoeda =
      typeof opts?.formatMoeda === "function"
        ? opts.formatMoeda
        : contaCorrenteFormatarMoeda;
    const totalEntrada = Number(data?.total_entrada || 0);
    const totalSaida = Number(data?.total_saida || 0);
    const saldo = Number(data?.saldo || 0);

    if (refs.totEnt) refs.totEnt.textContent = formatMoeda(totalEntrada);
    if (refs.totSai) refs.totSai.textContent = formatMoeda(totalSaida);
    if (refs.totSaldo) {
      refs.totSaldo.textContent = formatMoeda(saldo);
      refs.totSaldo.style.color = saldo < 0 ? "red" : "black";
    }

    return { totalEntrada, totalSaida, saldo };
  }

  function contaCorrenteRenderTabela(refs, data, opts) {
    if (!refs || !refs.tbody) return null;
    const linhas = contaCorrenteMontarLinhasLancamentos(data?.itens || [], opts);
    refs.tbody.innerHTML = linhas.html;
    contaCorrenteAtualizarTotais(data, refs, opts);
    return linhas;
  }

  const meta = Object.freeze({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    description: "Namespace passivo do modulo Conta corrente. Nao controla fluxo funcional nesta etapa.",
    status: "passivo",
    ativo: false,
    controlaFluxo: false,
    subetapa: "1_namespace_passivo",
  });

  function getInfo() {
    return {
      meta,
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
      helpers: [
        "contaCorrenteFormatarMoeda",
        "contaCorrenteFormatarDataISO",
        "contaCorrenteMontarLinhasLancamentos",
        "contaCorrenteAtualizarTotais",
        "contaCorrenteRenderTabela",
      ],
    };
  }

  function getStatus() {
    return {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
    };
  }

  const module = Object.freeze({
    meta,
    getInfo,
    getStatus,
    contaCorrenteFormatarMoeda,
    contaCorrenteFormatarDataISO,
    contaCorrenteMontarLinhasLancamentos,
    contaCorrenteAtualizarTotais,
    contaCorrenteRenderTabela,
  });

  window.BranaContaCorrenteModule = module;
})();
