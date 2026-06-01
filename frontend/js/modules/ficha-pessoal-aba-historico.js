(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistorico";
  const MODULE_VERSION = "subetapa-1-passive-bridge";

  function historicoListEl() {
    return ficha?.historicoList || null;
  }

  function historicoTextoEl() {
    return ficha?.historicoTexto || null;
  }

  function criarLinhaPadrao() {
    const data = new Date().toLocaleDateString("pt-BR");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${data}</td><td>Sistema</td><td>-</td><td>Historico criado manualmente</td>`;
    return tr;
  }

  function adicionarLinhaPadrao() {
    const list = historicoListEl();
    if (!list) return false;
    const tr = criarLinhaPadrao();
    if (typeof list.prepend === "function") {
      list.prepend(tr);
    } else {
      list.insertBefore(tr, list.firstChild);
    }
    const texto = historicoTextoEl();
    if (texto) texto.value = "";
    if (typeof fichaSetTab === "function") fichaSetTab("historico");
    return true;
  }

  function removerPrimeiraLinha() {
    const list = historicoListEl();
    if (!list) return false;
    const tr = list.querySelector("tr");
    if (!tr) return false;
    tr.remove();
    return true;
  }

  function limparTela() {
    const list = historicoListEl();
    if (list) list.innerHTML = "";
    const texto = historicoTextoEl();
    if (texto) texto.value = "";
    return true;
  }

  function bind() {
    if (!ficha) return;

    const novo = ficha.historicoNovo;
    const alterar = ficha.historicoAlterar;
    const eliminar = ficha.historicoEliminar;
    const confirmar = ficha.historicoConfirmar;

    if (novo && novo.dataset.historicoBound !== "1") {
      novo.dataset.historicoBound = "1";
      novo.addEventListener("click", () => {
        adicionarLinhaPadrao();
      });
    }
    if (alterar && alterar.dataset.historicoBound !== "1") {
      alterar.dataset.historicoBound = "1";
      alterar.addEventListener("click", () => {
        footerMsg.textContent = "Alteracao de historico em planejamento.";
      });
    }
    if (eliminar && eliminar.dataset.historicoBound !== "1") {
      eliminar.dataset.historicoBound = "1";
      eliminar.addEventListener("click", () => {
        removerPrimeiraLinha();
        footerMsg.textContent = "Historico removido em tela.";
      });
    }
    if (confirmar && confirmar.dataset.historicoBound !== "1") {
      confirmar.dataset.historicoBound = "1";
      confirmar.addEventListener("click", () => {
        footerMsg.textContent = "Confirmacao do historico em planejamento.";
      });
    }
  }

  async function onLimparNovo() {
    limparTela();
  }

  function onPacienteAplicado() {}

  function beforeAbandonar() {
    return true;
  }

  function beforeSetTab() {
    return true;
  }

  const module = {
    meta: {
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: "passive-bridge",
      controlsFlow: false,
    },
    bind,
    criarLinhaPadrao,
    adicionarLinhaPadrao,
    removerPrimeiraLinha,
    limparTela,
    onLimparNovo,
    onPacienteAplicado,
    beforeAbandonar,
    beforeSetTab,
  };

  Object.freeze(module.meta);
  Object.freeze(module);

  window.BranaFichaPessoalAbaHistorico = module;
})();
