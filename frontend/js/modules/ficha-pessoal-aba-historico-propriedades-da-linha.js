(function () {
  "use strict";

  const MODULE_NAME = "BranaFichaPessoalAbaHistoricoPropriedadesDaLinha";
  const STYLE_ID = "ficha-historico-props-visual-style";
  const MODAL_ID = "ficha-historico-props-modal-backdrop";
  const DATALIST_ID = "ficha-historico-props-cirurgiao-lista";

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

    function ensureStyles() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        .ficha-hist-props-backdrop{position:fixed;inset:0;z-index:5000;display:none;align-items:center;justify-content:center;background:rgba(25,34,48,.42);padding:20px}
        .ficha-hist-props-backdrop.is-open{display:flex}
        .ficha-hist-props-modal{width:min(680px,92vw);max-height:min(82vh,720px);overflow:auto;background:#fff;border:1px solid #b8c5d4;border-radius:12px;box-shadow:0 24px 56px rgba(15,32,55,.28);font:12px Tahoma,sans-serif;color:#1f2937}
        .ficha-hist-props-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid #e3ebf3;background:linear-gradient(180deg,#f8fbff 0%,#edf4fb 100%)}
        .ficha-hist-props-title{display:grid;gap:4px}
        .ficha-hist-props-title strong{font:700 15px Tahoma,sans-serif}
        .ficha-hist-props-title span{color:#5b6b7e;line-height:1.35}
        .ficha-hist-props-close{border:1px solid #b8c5d4;background:#fff;border-radius:8px;width:32px;height:32px;font:700 18px/1 Tahoma,sans-serif;color:#44546a}
        .ficha-hist-props-body{display:grid;gap:14px;padding:16px}
        .ficha-hist-props-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .ficha-hist-props-field{display:grid;gap:4px}
        .ficha-hist-props-field label{font:700 11px Tahoma,sans-serif;color:#4f5f72;text-transform:none}
        .ficha-hist-props-field input,.ficha-hist-props-field textarea,.ficha-hist-props-field .readonly{width:100%;border:1px solid #bfc9d6;border-radius:8px;padding:8px 10px;background:#fff;font:12px Tahoma,sans-serif;color:#1f2937}
        .ficha-hist-props-field textarea{min-height:92px;resize:vertical}
        .ficha-hist-props-field .readonly{background:#f7f9fc;color:#56657a}
        .ficha-hist-props-field.full{grid-column:1 / -1}
        .ficha-hist-props-note{grid-column:1 / -1;border:1px dashed #c9d5e2;border-radius:10px;background:#f7fafc;padding:12px 12px;color:#526174;display:grid;gap:4px}
        .ficha-hist-props-note strong{font:700 11px Tahoma,sans-serif;color:#334155}
        .ficha-hist-props-footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px 16px;border-top:1px solid #e3ebf3;background:#f8fbff}
        .ficha-hist-props-footer .btn{min-width:118px;justify-content:center}
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
          <div class="ficha-hist-props-header">
            <div class="ficha-hist-props-title">
              <strong id="ficha-historico-props-title">Propriedades da linha</strong>
              <span>Campos principais da linha selecionada. O Cirurgiao usa o catalogo de prestadores e continua editavel.</span>
            </div>
            <button type="button" class="ficha-hist-props-close" data-historico-props-close aria-label="Fechar">X</button>
          </div>
          <div class="ficha-hist-props-body">
            <div class="ficha-hist-props-grid">
              <div class="ficha-hist-props-field">
                <label for="ficha-historico-props-data">Data</label>
                <input id="ficha-historico-props-data" type="text" autocomplete="off" data-historico-campo="data">
              </div>
              <div class="ficha-hist-props-field">
                <label for="ficha-historico-props-cirurgiao">Cirurgiao</label>
                <input id="ficha-historico-props-cirurgiao" type="text" autocomplete="off" list="${DATALIST_ID}" data-historico-campo="cirurgiao" placeholder="Digite ou selecione no catalogo">
                <datalist id="${DATALIST_ID}" data-historico-cirurgiao-lista></datalist>
              </div>
              <div class="ficha-hist-props-field">
                <label for="ficha-historico-props-regiao">Regiao</label>
                <input id="ficha-historico-props-regiao" type="text" autocomplete="off" data-historico-campo="regiao">
              </div>
              <div class="ficha-hist-props-field full">
                <label for="ficha-historico-props-historico">Historico / Descricao</label>
                <textarea id="ficha-historico-props-historico" data-historico-campo="descricao"></textarea>
              </div>
              <div class="ficha-hist-props-note">
                <strong>Campos fora desta etapa</strong>
                <span>Cor de fundo, data de insercao e data de atualizacao permanecem apenas documentados por enquanto.</span>
              </div>
            </div>
          </div>
          <div class="ficha-hist-props-footer">
            <button type="button" class="btn" data-historico-props-cancelar>Cancelar</button>
            <button type="button" class="btn primary" data-historico-props-aplicar>Aplicar</button>
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

    function aplicar() {
      const modal = modalEl();
      const tr = state.row;
      if (!(tr instanceof HTMLElement) || !tr.isConnected) return false;
      const data = modal.querySelector("#ficha-historico-props-data");
      const cirurgiao = modal.querySelector("#ficha-historico-props-cirurgiao");
      const regiao = modal.querySelector("#ficha-historico-props-regiao");
      const historico = modal.querySelector("#ficha-historico-props-historico");

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
      const historico = modal.querySelector("#ficha-historico-props-historico");
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
      if (regiao instanceof HTMLInputElement) regiao.value = host.historicoCampoTexto(tr, "regiao");
      if (historico instanceof HTMLTextAreaElement) historico.value = host.historicoTextoCelula(tr, 3);

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
