(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistoricoPropriedadesDaLinha";
  const STYLE_ID = "ficha-historico-props-visual-style";
  const MODAL_ID = "ficha-historico-props-modal-backdrop";
  const DATALIST_ID = "ficha-historico-props-cirurgiao-lista";
  const COR_FUNDO_PADRAO = "Branco";
  const COR_FUNDO_OPCOES = [
    { value: "Branco", swatch: "#ffffff" },
    { value: "Amarelo", swatch: "#fff3a6" },
    { value: "Azul", swatch: "#dbeeff" },
    { value: "Verde", swatch: "#d8f5d4" },
    { value: "Vermelho", swatch: "#ffd8d8" },
    { value: "Cinza", swatch: "#eef1f5" },
  ];

  function createModule(deps = {}) {
    const host = {
      getSelectedRow: typeof deps.getSelectedRow === "function" ? deps.getSelectedRow : () => null,
      getActiveCellIndex: typeof deps.getActiveCellIndex === "function" ? deps.getActiveCellIndex : () => 0,
      getPrestadoresCatalogo: typeof deps.getPrestadoresCatalogo === "function" ? deps.getPrestadoresCatalogo : () => [],
      ensurePrestadoresCatalogo: typeof deps.ensurePrestadoresCatalogo === "function" ? deps.ensurePrestadoresCatalogo : async () => [],
      historicoCelulas: typeof deps.historicoCelulas === "function" ? deps.historicoCelulas : () => [],
      historicoTextoCelula: typeof deps.historicoTextoCelula === "function" ? deps.historicoTextoCelula : () => "",
      historicoCampoTexto: typeof deps.historicoCampoTexto === "function" ? deps.historicoCampoTexto : () => "",
      historicoCampoDefinirTexto: typeof deps.historicoCampoDefinirTexto === "function" ? deps.historicoCampoDefinirTexto : () => false,
      historicoDefinirTextoCelula: typeof deps.historicoDefinirTextoCelula === "function" ? deps.historicoDefinirTextoCelula : () => false,
      historicoCampoDefinirCirurgiao: typeof deps.historicoCampoDefinirCirurgiao === "function" ? deps.historicoCampoDefinirCirurgiao : () => "",
      historicoEncontrarPrestadorPorTexto: typeof deps.historicoEncontrarPrestadorPorTexto === "function" ? deps.historicoEncontrarPrestadorPorTexto : () => null,
      historicoSincronizarCirurgiaoLinha: typeof deps.historicoSincronizarCirurgiaoLinha === "function" ? deps.historicoSincronizarCirurgiaoLinha : () => ({ prestadorId: null, prestadorNome: "" }),
      definirLinhaHistoricoEditavel: typeof deps.definirLinhaHistoricoEditavel === "function" ? deps.definirLinhaHistoricoEditavel : () => [],
      selecionarLinhaHistorico: typeof deps.selecionarLinhaHistorico === "function" ? deps.selecionarLinhaHistorico : () => null,
      definirCelulaAtiva: typeof deps.definirCelulaAtiva === "function" ? deps.definirCelulaAtiva : () => null,
      guardarSnapshotLinhaHistorico: typeof deps.guardarSnapshotLinhaHistorico === "function" ? deps.guardarSnapshotLinhaHistorico : () => {},
      linhaHistoricoEstado: typeof deps.linhaHistoricoEstado === "function" ? deps.linhaHistoricoEstado : () => "confirmada",
      marcarLinhaHistoricoEstado: typeof deps.marcarLinhaHistoricoEstado === "function" ? deps.marcarLinhaHistoricoEstado : () => {},
      setPropertiesRow: typeof deps.setPropertiesRow === "function" ? deps.setPropertiesRow : () => {},
      setEditingRow: typeof deps.setEditingRow === "function" ? deps.setEditingRow : () => {},
      setStatusMessage: typeof deps.setStatusMessage === "function" ? deps.setStatusMessage : () => {},
    };

    const state = {
      open: false,
      row: null,
    };

    function pad2(value) {
      return String(value).padStart(2, "0");
    }

    function dataHoraAuditoriaPadrao() {
      const agora = new Date();
      const usuario = String(sessaoAtual?.apelido || sessaoAtual?.nome || "").trim();
      const data = `${pad2(agora.getDate())}/${pad2(agora.getMonth() + 1)}/${agora.getFullYear()}`;
      const hora = `${pad2(agora.getHours())}:${pad2(agora.getMinutes())}`;
      return usuario ? `${data} ${hora} - ${usuario}` : `${data} ${hora}`;
    }

    function corFundoSwatch(valor) {
      const achada = COR_FUNDO_OPCOES.find((item) => item.value === valor);
      return achada?.swatch || "#ffffff";
    }

    function atualizarSwatchCor(modal, valor) {
      const wrapper = modal?.querySelector?.("[data-historico-cor-wrap]");
      const swatch = modal?.querySelector?.("[data-historico-cor-swatch]");
      const select = modal?.querySelector?.("#ficha-historico-props-cor");
      const texto = String(valor || COR_FUNDO_PADRAO).trim() || COR_FUNDO_PADRAO;
      if (wrapper instanceof HTMLElement) wrapper.dataset.valor = texto;
      if (swatch instanceof HTMLElement) swatch.style.background = corFundoSwatch(texto);
      if (select instanceof HTMLSelectElement) select.value = texto;
    }

    function textoAuditoriaInsercao(tr) {
      const valor = String(tr?.dataset?.historicoDataInsercao || "").trim();
      if (valor) return valor;
      if (host.linhaHistoricoEstado(tr) === "rascunho") return dataHoraAuditoriaPadrao();
      return "";
    }

    function ensureStyles() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        .ficha-hist-props-backdrop{position:fixed;inset:0;z-index:5000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.18);padding:12px}
        .ficha-hist-props-backdrop.is-open{display:flex}
        .ficha-hist-props-modal{width:min(760px,96vw);background:#efefef;border:1px solid #c1c1c1;border-radius:0;box-shadow:0 10px 28px rgba(0,0,0,.22);font:12px Tahoma,sans-serif;color:#1f2937}
        .ficha-hist-props-head{position:relative;display:flex;align-items:center;justify-content:center;height:40px;padding:0 48px;background:#fff;border-bottom:1px solid #c9c9c9}
        .ficha-hist-props-title{font:400 19px Tahoma,sans-serif;color:#373737;line-height:1}
        .ficha-hist-props-close{position:absolute;top:0;right:0;border:none;background:#d85a5a;color:#fff;width:48px;height:40px;font:700 24px/1 Tahoma,sans-serif;border-radius:0}
        .ficha-hist-props-close:hover{background:#c74848}
        .ficha-hist-props-body{padding:12px 12px 10px}
        .ficha-hist-props-panel{border:1px solid #c5c5c5;background:#efefef;padding:10px 10px 12px}
        .ficha-hist-props-grid{display:grid;grid-template-columns:1.02fr 1.52fr 0.95fr 1.62fr;gap:10px 12px;align-items:end}
        .ficha-hist-props-field{display:grid;gap:4px}
        .ficha-hist-props-field label{font:400 12px Tahoma,sans-serif;color:#353535;text-transform:none}
        .ficha-hist-props-field input,.ficha-hist-props-field textarea,.ficha-hist-props-field select,.ficha-hist-props-field .readonly{width:100%;border:1px solid #b8b8b8;border-radius:0;padding:4px 6px;background:#fff;font:12px Tahoma,sans-serif;color:#1f1f1f;box-shadow:inset 0 0 0 1px #f8f8f8}
        .ficha-hist-props-field input,.ficha-hist-props-field select{height:30px}
        .ficha-hist-props-field textarea{min-height:108px;resize:none;line-height:1.28;padding:6px 6px}
        .ficha-hist-props-field.full{grid-column:1 / -1}
        .ficha-hist-props-combo{position:relative}
        .ficha-hist-props-combo::after{content:"▼";position:absolute;right:8px;top:50%;transform:translateY(-54%);font:400 9px Tahoma,sans-serif;color:#4d4d4d;pointer-events:none}
        .ficha-hist-props-combo input,.ficha-hist-props-combo select{padding-right:22px}
        .ficha-hist-props-color{display:block}
        .ficha-hist-props-color .ficha-hist-props-swatch{position:absolute;left:6px;top:50%;width:24px;height:16px;transform:translateY(-50%);border:1px solid #8a8a8a;background:#fff;box-shadow:inset 0 0 0 1px #f8f8f8;pointer-events:none}
        .ficha-hist-props-color select{padding-left:34px;padding-right:24px}
        .ficha-hist-props-body .ficha-hist-props-desc-wrap{margin-top:10px}
        .ficha-hist-props-audit{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
        .ficha-hist-props-audit .ficha-hist-props-field input{background:#18ebf2;border-color:#86b9c2;color:#121212;font-weight:400}
        .ficha-hist-props-buttons{display:flex;justify-content:flex-end;gap:20px;padding:12px 6px 0}
        .ficha-hist-props-buttons .btn{min-width:102px;height:32px;border:1px solid #a9a9a9;border-radius:0;background:linear-gradient(180deg,#fff 0%,#ededed 100%);font:400 12px Tahoma,sans-serif;color:#222;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
        .ficha-hist-props-buttons .btn:hover{background:linear-gradient(180deg,#fff 0%,#e4e4e4 100%)}
      `;
      document.head.appendChild(style);
    }

    function modalEl() {
      let el = document.getElementById(MODAL_ID);
      if (el) return el;

      el = document.createElement("div");
      el.id = MODAL_ID;
      el.className = "ficha-hist-props-backdrop";
      el.innerHTML = `
        <div class="ficha-hist-props-modal" role="dialog" aria-modal="true" aria-labelledby="ficha-historico-props-title">
          <div class="ficha-hist-props-head">
            <div class="ficha-hist-props-title" id="ficha-historico-props-title">Propriedades do histórico</div>
            <button type="button" class="ficha-hist-props-close" data-historico-props-close aria-label="Fechar">X</button>
          </div>
          <div class="ficha-hist-props-body">
            <div class="ficha-hist-props-panel">
              <div class="ficha-hist-props-grid">
                <div class="ficha-hist-props-field">
                  <label for="ficha-historico-props-data">Data:</label>
                  <input id="ficha-historico-props-data" type="text" autocomplete="off" data-historico-campo="data">
                </div>
                <div class="ficha-hist-props-field">
                  <label for="ficha-historico-props-cirurgiao">Cirurgião responsável:</label>
                  <div class="ficha-hist-props-combo">
                    <input id="ficha-historico-props-cirurgiao" type="text" autocomplete="off" list="${DATALIST_ID}" data-historico-campo="cirurgiao">
                  </div>
                  <datalist id="${DATALIST_ID}" data-historico-cirurgiao-lista></datalist>
                </div>
                <div class="ficha-hist-props-field">
                  <label for="ficha-historico-props-regiao">Região:</label>
                  <div class="ficha-hist-props-combo">
                    <input id="ficha-historico-props-regiao" type="text" autocomplete="off" data-historico-campo="regiao">
                  </div>
                </div>
                <div class="ficha-hist-props-field">
                  <label for="ficha-historico-props-cor">Cor de fundo:</label>
                  <div class="ficha-hist-props-combo ficha-hist-props-color" data-historico-cor-wrap>
                    <span class="ficha-hist-props-swatch" data-historico-cor-swatch aria-hidden="true"></span>
                    <select id="ficha-historico-props-cor" data-historico-campo="cor">
                      ${COR_FUNDO_OPCOES.map((opcao) => `<option value="${opcao.value}">${opcao.value}</option>`).join("")}
                    </select>
                  </div>
                </div>
                <div class="ficha-hist-props-field full ficha-hist-props-desc-wrap">
                  <label for="ficha-historico-props-historico">Histórico:</label>
                  <textarea id="ficha-historico-props-historico" data-historico-campo="descricao"></textarea>
                </div>
                <div class="ficha-hist-props-audit">
                  <div class="ficha-hist-props-field">
                    <label for="ficha-historico-props-data-insercao">Data de inserção:</label>
                    <input id="ficha-historico-props-data-insercao" type="text" class="readonly" readonly data-historico-campo="data-insercao">
                  </div>
                  <div class="ficha-hist-props-field">
                    <label for="ficha-historico-props-data-atualizacao">Data de atualização:</label>
                    <input id="ficha-historico-props-data-atualizacao" type="text" class="readonly" readonly data-historico-campo="data-atualizacao">
                  </div>
                </div>
              </div>
            </div>
            <div class="ficha-hist-props-buttons">
              <button type="button" class="btn" data-historico-props-aplicar>Ok</button>
              <button type="button" class="btn" data-historico-props-cancelar>Cancela</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(el);
      return el;
    }

    function atualizarDatalistPrestadores(modal, catalogo) {
      const list = modal?.querySelector?.(`#${DATALIST_ID}`);
      if (!(list instanceof HTMLDataListElement)) return;
      list.innerHTML = "";
      const itens = Array.isArray(catalogo) ? catalogo : [];
      itens.forEach((item) => {
        const valor = String(item?.nome || item?.apelido || item?.codigo || "").trim();
        if (!valor) return;
        const option = document.createElement("option");
        option.value = valor;
        option.label = String(item?.codigo || "").trim() && String(item?.nome || item?.apelido || "").trim()
          ? `${String(item?.codigo || "").trim()} - ${String(item?.nome || item?.apelido || "").trim()}`
          : valor;
        list.appendChild(option);
      });
    }

    function obterCampoTexto(modal, selector, padrao = "") {
      const el = modal?.querySelector?.(selector);
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        return String(el.value || "").trim() || padrao;
      }
      return padrao;
    }

    function aplicar() {
      const modal = modalEl();
      const tr = state.row;
      if (!(tr instanceof HTMLElement) || !tr.isConnected) return false;
      const data = modal.querySelector("#ficha-historico-props-data");
      const cirurgiao = modal.querySelector("#ficha-historico-props-cirurgiao");
      const regiao = modal.querySelector("#ficha-historico-props-regiao");
      const historico = modal.querySelector("#ficha-historico-props-historico");
      const dataInsercao = modal.querySelector("#ficha-historico-props-data-insercao");
      const dataAtualizacao = modal.querySelector("#ficha-historico-props-data-atualizacao");

      host.historicoDefinirTextoCelula(tr, 0, data instanceof HTMLInputElement ? data.value : "");
      const catalogo = host.getPrestadoresCatalogo();
      const cirurgiaoValor = cirurgiao instanceof HTMLInputElement ? cirurgiao.value : "";
      const cirurgiaoResolvido = host.historicoEncontrarPrestadorPorTexto(cirurgiaoValor, catalogo);
      if (cirurgiaoResolvido) {
        host.historicoCampoDefinirCirurgiao(tr, cirurgiaoResolvido, cirurgiaoResolvido.id);
      } else {
        host.historicoCampoDefinirCirurgiao(tr, cirurgiaoValor, String(tr.dataset.historicoCirurgiaoId || "").trim() || null);
        host.historicoSincronizarCirurgiaoLinha(tr, catalogo);
      }
      host.historicoCampoDefinirTexto(tr, "regiao", regiao instanceof HTMLInputElement ? regiao.value : "");
      host.historicoDefinirTextoCelula(tr, 3, historico instanceof HTMLTextAreaElement ? historico.value : "");
      tr.dataset.historicoCorFundo = obterCampoTexto(modal, "#ficha-historico-props-cor", COR_FUNDO_PADRAO);
      tr.dataset.historicoDataInsercao = obterCampoTexto(modal, "#ficha-historico-props-data-insercao", "");
      tr.dataset.historicoDataAtualizacao = obterCampoTexto(modal, "#ficha-historico-props-data-atualizacao", "");
      host.guardarSnapshotLinhaHistorico(tr);
      const estado = host.linhaHistoricoEstado(tr);
      host.marcarLinhaHistoricoEstado(tr, estado);
      if (estado !== "rascunho") delete tr.dataset.historicoNovo;
      return true;
    }

    function fechar(restaurarFoco = true) {
      const modal = modalEl();
      const aplicarBtn = modal.querySelector("[data-historico-props-aplicar]");
      const cancelarBtn = modal.querySelector("[data-historico-props-cancelar]");
      const fecharBtn = modal.querySelector("[data-historico-props-close]");
      const cor = modal.querySelector("#ficha-historico-props-cor");
      modal.classList.remove("is-open");
      modal.dataset.open = "0";
      if (state.row && state.row.isConnected) {
        host.definirLinhaHistoricoEditavel(state.row, false);
      }
      const row = state.row && state.row.isConnected ? state.row : null;
      const focusIndex = Math.max(0, Math.min(host.getActiveCellIndex() || 0, row ? host.historicoCelulas(row).length - 1 : 0));
      state.row = null;
      state.open = false;
      host.setPropertiesRow(null);
      host.setEditingRow(null);
      if (aplicarBtn) aplicarBtn.onclick = null;
      if (cancelarBtn) cancelarBtn.onclick = null;
      if (fecharBtn) fecharBtn.onclick = null;
      if (cor instanceof HTMLSelectElement) {
        cor.onchange = null;
        cor.oninput = null;
      }
      modal.onkeydown = null;
      if (restaurarFoco && row) {
        host.selecionarLinhaHistorico(row);
        const cell = host.definirCelulaAtiva(row, focusIndex);
        if (cell instanceof HTMLElement) {
          try {
            cell.focus({ preventScroll: true });
          } catch {
            cell.focus();
          }
        }
      }
    }

    async function abrir() {
      const tr = host.getSelectedRow();
      if (!(tr instanceof HTMLElement)) {
        host.setStatusMessage("Selecione uma linha para abrir as propriedades.");
        return false;
      }
      const catalogo = await host.ensurePrestadoresCatalogo().catch(() => host.getPrestadoresCatalogo());
      const modal = modalEl();
      const data = modal.querySelector("#ficha-historico-props-data");
      const cirurgiao = modal.querySelector("#ficha-historico-props-cirurgiao");
      const regiao = modal.querySelector("#ficha-historico-props-regiao");
      const cor = modal.querySelector("#ficha-historico-props-cor");
      const historico = modal.querySelector("#ficha-historico-props-historico");
      const dataInsercao = modal.querySelector("#ficha-historico-props-data-insercao");
      const dataAtualizacao = modal.querySelector("#ficha-historico-props-data-atualizacao");
      const fecharBtn = modal.querySelector("[data-historico-props-close]");
      const cancelarBtn = modal.querySelector("[data-historico-props-cancelar]");
      const aplicarBtn = modal.querySelector("[data-historico-props-aplicar]");

      state.row = tr;
      state.open = true;
      host.setPropertiesRow(tr);
      host.setEditingRow(null);
      host.definirLinhaHistoricoEditavel(tr, false);
      atualizarDatalistPrestadores(modal, catalogo);
      host.historicoSincronizarCirurgiaoLinha(tr, catalogo);

      if (data instanceof HTMLInputElement) data.value = host.historicoTextoCelula(tr, 0);
      if (cirurgiao instanceof HTMLInputElement) cirurgiao.value = host.historicoCampoTexto(tr, "cirurgiao");
      if (regiao instanceof HTMLInputElement) regiao.value = host.historicoCampoTexto(tr, "regiao") || "Todos";
      atualizarSwatchCor(modal, String(tr.dataset.historicoCorFundo || "").trim() || COR_FUNDO_PADRAO);
      if (cor instanceof HTMLSelectElement) cor.value = String(tr.dataset.historicoCorFundo || "").trim() || COR_FUNDO_PADRAO;
      if (historico instanceof HTMLTextAreaElement) historico.value = host.historicoTextoCelula(tr, 3);
      if (dataInsercao instanceof HTMLInputElement) dataInsercao.value = textoAuditoriaInsercao(tr);
      if (dataAtualizacao instanceof HTMLInputElement) dataAtualizacao.value = String(tr.dataset.historicoDataAtualizacao || "").trim();

      const corChangeHandler = () => atualizarSwatchCor(modal, cor instanceof HTMLSelectElement ? cor.value : COR_FUNDO_PADRAO);
      if (cor instanceof HTMLSelectElement) {
        cor.onchange = corChangeHandler;
        cor.oninput = corChangeHandler;
      }

      const aplicarHandler = () => {
        aplicar();
        fechar(true);
        host.setStatusMessage("Propriedades da linha aplicadas.");
      };
      const cancelarHandler = () => {
        fechar(true);
        host.setStatusMessage("Propriedades da linha canceladas.");
      };
      const closeHandler = () => cancelarHandler();
      const keyHandler = (ev) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          cancelarHandler();
        }
        if (ev.key === "Enter" && !(ev.target instanceof HTMLTextAreaElement)) {
          ev.preventDefault();
          aplicarHandler();
        }
      };

      aplicarBtn.onclick = aplicarHandler;
      cancelarBtn.onclick = cancelarHandler;
      fecharBtn.onclick = closeHandler;
      modal.onkeydown = keyHandler;
      modal.dataset.open = "1";
      modal.classList.add("is-open");
      host.setStatusMessage("Propriedades da linha abertas.");

      const firstField = data instanceof HTMLElement ? data : null;
      if (firstField) {
        try {
          firstField.focus({ preventScroll: true });
        } catch {
          firstField.focus();
        }
      }
      return true;
    }

    return {
      abrir,
      ensureStyles,
      modalEl,
      fechar,
      aplicar,
    };
  }

  window.BranaFichaPessoalAbaHistoricoPropriedadesDaLinhaFactory = createModule;
})();
