(function () {
  "use strict";

  const MODULE_NAME = "BranaOrcamentoApiV1";

  function getRequestJson() {
    if (typeof requestJson === "function") return requestJson;
    if (typeof globalThis !== "undefined" && typeof globalThis.requestJson === "function") return globalThis.requestJson;
    if (typeof window !== "undefined" && typeof window.requestJson === "function") return window.requestJson;
    return null;
  }

  async function request(method, path, payload, options = {}) {
    const req = getRequestJson();
    if (typeof req !== "function") {
      throw new Error("requestJson indisponivel.");
    }
    return req(method, path, payload, true, options);
  }

  async function listarTratamentosPaciente(pacienteId) {
    const id = Number(pacienteId || 0) || 0;
    if (id <= 0) {
      return { ok: false, items: [], data: null, message: "Paciente invalido." };
    }
    const { res, data } = await request("GET", `/orcamento/pacientes/${encodeURIComponent(String(id))}/tratamentos`, undefined);
    return {
      ok: !!res?.ok,
      res,
      data,
      items: Array.isArray(data?.itens) ? data.itens : [],
      message: res?.ok ? "" : String(data?.detail || "Falha ao carregar tratamentos.").trim(),
    };
  }

  async function carregarTratamento(tratamentoId) {
    const id = Number(tratamentoId || 0) || 0;
    if (id <= 0) {
      return { ok: false, data: null, message: "Tratamento invalido." };
    }
    const { res, data } = await request("GET", `/orcamento/tratamentos/${encodeURIComponent(String(id))}`, undefined);
    return {
      ok: !!res?.ok,
      res,
      data,
      message: res?.ok ? "" : String(data?.detail || "Falha ao carregar orçamento.").trim(),
    };
  }

  async function alterarIntervencao(tratamentoId, intervencaoId, payload) {
    const idTratamento = Number(tratamentoId || 0) || 0;
    const idIntervencao = Number(intervencaoId || 0) || 0;
    const { res, data } = await request(
      "PATCH",
      `/orcamento/tratamentos/${encodeURIComponent(String(idTratamento))}/intervencoes/${encodeURIComponent(String(idIntervencao))}`,
      payload || {}
    );
    return { ok: !!res?.ok, res, data, message: String(data?.detail || "").trim() };
  }

  async function alterarParcela(tratamentoId, numeroParcela, payload) {
    const idTratamento = Number(tratamentoId || 0) || 0;
    const parcela = Number(numeroParcela || 0) || 0;
    const { res, data } = await request(
      "PATCH",
      `/orcamento/tratamentos/${encodeURIComponent(String(idTratamento))}/parcelas/${encodeURIComponent(String(parcela))}`,
      payload || {}
    );
    return { ok: !!res?.ok, res, data, message: String(data?.detail || "").trim() };
  }

  async function aprovarTratamento(tratamentoId, payload = {}) {
    const idTratamento = Number(tratamentoId || 0) || 0;
    const { res, data } = await request(
      "POST",
      `/orcamento/tratamentos/${encodeURIComponent(String(idTratamento))}/aprovar`,
      payload || {}
    );
    return { ok: !!res?.ok, res, data, message: String(data?.detail || "").trim() };
  }

  async function prepararImpressao(tratamentoId, payload = {}) {
    const idTratamento = Number(tratamentoId || 0) || 0;
    const { res, data } = await request(
      "POST",
      `/orcamento/tratamentos/${encodeURIComponent(String(idTratamento))}/impressao`,
      payload || {}
    );
    return { ok: !!res?.ok, res, data, message: String(data?.detail || "").trim(), payload: data || null };
  }

  window.BranaOrcamentoApiV1 = Object.freeze({
    moduleName: MODULE_NAME,
    request,
    listarTratamentosPaciente,
    carregarTratamento,
    alterarIntervencao,
    alterarParcela,
    aprovarTratamento,
    prepararImpressao,
  });
})();
