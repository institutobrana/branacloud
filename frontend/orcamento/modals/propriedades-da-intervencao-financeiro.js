(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoPropriedadesIntervencaoFinanceiroV1";

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function money(value) {
    const n = Number(value || 0);
    return Number.isFinite(n)
      ? n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "0,00";
  }

  function parseMoney(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return 0;
    const normalized = raw.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  function formatDateBr(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      return `${iso[3]}/${iso[2]}/${iso[1]}`;
    }
    return raw;
  }

  function renderFinancePane({ intervention = {}, snapshot = {} } = {}) {
    const treatment = snapshot?.treatmentData?.tratamento || {};
    const paciente = Number(intervention?.paciente_rs ?? intervention?.receber_paciente ?? 0) || 0;
    const convenio = Number(intervention?.convenio_rs ?? intervention?.receber_convenio ?? 0) || 0;
    const previsao = String(intervention?.previsao_recebimento || intervention?.data_prevista_recebimento || "").trim();
    const glosa = String(intervention?.codigo_glosa || "").trim();
    const mensagem = String(intervention?.mensagem_autorizacao || "").trim();
    const incluir = intervention?.incluir === false || intervention?.nao_incluir_no_orcamento ? false : true;

    return `
      <div class="orcamento-prop-financeiro-grid">
        <div class="orcamento-prop-financeiro-line">
          <label for="orcamento-prop-financeiro-paciente">Receber do paciente....... R$</label>
          <input id="orcamento-prop-financeiro-paciente" name="receber_paciente" class="orcamento-prop-input" type="text" inputmode="decimal" value="${esc(money(paciente))}">
        </div>
        <div class="orcamento-prop-financeiro-line">
          <label for="orcamento-prop-financeiro-convenio">Receber do convênio...... R$</label>
          <input id="orcamento-prop-financeiro-convenio" name="receber_convenio" class="orcamento-prop-input" type="text" inputmode="decimal" value="${esc(money(convenio))}">
        </div>
        <div class="orcamento-prop-financeiro-line">
          <label for="orcamento-prop-financeiro-prev">Previsão de recebimento..........</label>
          <input id="orcamento-prop-financeiro-prev" name="previsao_recebimento" class="orcamento-prop-input" type="text" value="${esc(formatDateBr(previsao))}">
        </div>
        <div class="orcamento-prop-financeiro-divider"></div>
        <label class="orcamento-prop-checkline">
          <input id="orcamento-prop-financeiro-incluir" name="nao_incluir_no_orcamento" type="checkbox"${incluir ? "" : " checked"}>
          <span>Não incluir no orçamento</span>
        </label>
        <div class="orcamento-prop-financeiro-grid2">
          <div class="orcamento-prop-financeiro-line">
            <label for="orcamento-prop-financeiro-glosa">Código de glosa:</label>
            <input id="orcamento-prop-financeiro-glosa" name="codigo_glosa" class="orcamento-prop-input" type="text" value="${esc(glosa)}">
          </div>
          <div class="orcamento-prop-financeiro-line">
            <label for="orcamento-prop-financeiro-msg">Mensagem de autorização:</label>
            <input id="orcamento-prop-financeiro-msg" name="mensagem_autorizacao" class="orcamento-prop-input" type="text" value="${esc(mensagem)}">
          </div>
        </div>
        <input type="hidden" name="orcamento_tratamento_id" value="${esc(String(treatment?.id || snapshot?.selectedTreatmentId || 0))}">
      </div>
    `;
  }

  function setCheckboxSync(root) {
    const checkbox = root?.querySelector?.('[name="nao_incluir_no_orcamento"]');
    const paciente = root?.querySelector?.('[name="receber_paciente"]');
    const convenio = root?.querySelector?.('[name="receber_convenio"]');
    const previsao = root?.querySelector?.('[name="previsao_recebimento"]');
    const sync = () => {
      const excluded = !!checkbox?.checked;
      if (paciente) paciente.disabled = excluded;
      if (convenio) convenio.disabled = excluded;
      if (previsao) previsao.disabled = excluded;
    };
    if (root?.dataset?.orcamentoFinanceiroBound !== "1") {
      checkbox?.addEventListener?.("change", sync);
      if (root?.dataset) root.dataset.orcamentoFinanceiroBound = "1";
    }
    sync();
  }

  function readFinancePayload(root) {
    const read = (name) => root?.querySelector?.(`[name="${name}"]`);
    return {
      receber_paciente: parseMoney(read("receber_paciente")?.value),
      receber_convenio: parseMoney(read("receber_convenio")?.value),
      previsao_recebimento: String(read("previsao_recebimento")?.value || "").trim(),
      nao_incluir_no_orcamento: !!read("nao_incluir_no_orcamento")?.checked,
      codigo_glosa: String(read("codigo_glosa")?.value || "").trim(),
      mensagem_autorizacao: String(read("mensagem_autorizacao")?.value || "").trim(),
    };
  }

  window.BranaOrcamentoPropriedadesIntervencaoFinanceiroV1 = Object.freeze({
    moduleName: MODULE_NAME,
    esc,
    money,
    parseMoney,
    renderFinancePane,
    readFinancePayload,
    setCheckboxSync,
  });
})();
