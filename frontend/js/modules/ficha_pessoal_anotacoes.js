(function () {
  "use strict";

  const MODULE_NAME = "ficha_pessoal_anotacoes";
  const MODULE_VERSION = "0.1.0";

  function isTextarea(el) {
    return !!el && typeof el.value === "string" && typeof el.setSelectionRange === "function";
  }

  function focusTextarea(textarea) {
    if (!isTextarea(textarea)) return;
    try {
      textarea.focus({ preventScroll: true });
    } catch {
      try {
        textarea.focus();
      } catch {}
    }
  }

  function restoreSelection(textarea, start, end) {
    if (!isTextarea(textarea)) return;
    const s = Math.max(0, Number(start || 0));
    const e = Math.max(0, Number(end || s));
    try {
      textarea.setSelectionRange(s, e);
    } catch {
      try {
        textarea.selectionStart = s;
        textarea.selectionEnd = e;
      } catch {}
    }
  }

  function withCursorKeep(textarea, apply) {
    if (!isTextarea(textarea)) return false;
    const scrollTop = Number(textarea.scrollTop || 0);
    const scrollLeft = Number(textarea.scrollLeft || 0);
    const result = !!apply();
    try {
      textarea.scrollTop = scrollTop;
      textarea.scrollLeft = scrollLeft;
    } catch {}
    return result;
  }

  function getSelectionRange(textarea) {
    if (!isTextarea(textarea)) return { start: 0, end: 0 };
    const start = Math.max(0, Number(textarea.selectionStart || 0));
    const end = Math.max(0, Number(textarea.selectionEnd || start));
    return start <= end ? { start, end } : { start: end, end: start };
  }

  function replaceRange(textarea, start, end, nextText, selectionStart, selectionEnd) {
    if (!isTextarea(textarea)) return false;
    const value = String(textarea.value ?? "");
    const s = Math.max(0, Math.min(start, value.length));
    const e = Math.max(s, Math.min(end, value.length));
    textarea.value = `${value.slice(0, s)}${nextText}${value.slice(e)}`;
    focusTextarea(textarea);
    restoreSelection(textarea, selectionStart, selectionEnd);
    return true;
  }

  function applyInlineMark(textarea, marker, options = {}) {
    if (!isTextarea(textarea)) return false;
    const mark = String(marker || "").trim();
    if (!mark) return false;

    return withCursorKeep(textarea, () => {
      const value = String(textarea.value ?? "");
      const { start, end } = getSelectionRange(textarea);
      const selected = value.slice(start, end);

      if (!selected) {
        const next = `${value.slice(0, start)}${mark}${mark}${value.slice(end)}`;
        textarea.value = next;
        const cursor = start + mark.length;
        focusTextarea(textarea);
        restoreSelection(textarea, cursor, cursor);
        return true;
      }

      if (selected.startsWith(mark) && selected.endsWith(mark) && selected.length >= mark.length * 2) {
        const inner = selected.slice(mark.length, selected.length - mark.length);
        return replaceRange(textarea, start, end, inner, start, start + inner.length);
      }

      const wrapped = `${mark}${selected}${mark}`;
      const nextStart = start + mark.length;
      const nextEnd = nextStart + selected.length;
      return replaceRange(textarea, start, end, wrapped, nextStart, nextEnd);
    });
  }

  function applyLinePrefix(textarea, prefix = "- ") {
    if (!isTextarea(textarea)) return false;
    const mark = String(prefix || "- ");
    return withCursorKeep(textarea, () => {
      const value = String(textarea.value ?? "");
      const { start, end } = getSelectionRange(textarea);

      if (start === end) {
        const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
        const lineEnd = value.indexOf("\n", start);
        const safeLineEnd = lineEnd === -1 ? value.length : lineEnd;
        const line = value.slice(lineStart, safeLineEnd);
        if (line.startsWith(mark)) {
          focusTextarea(textarea);
          restoreSelection(textarea, start, end);
          return true;
        }
        textarea.value = `${value.slice(0, lineStart)}${mark}${value.slice(lineStart)}`;
        const cursor = start + mark.length;
        focusTextarea(textarea);
        restoreSelection(textarea, cursor, cursor);
        return true;
      }

      const selected = value.slice(start, end);
      const lines = selected.split("\n");
      const nextLines = lines.map((line) => {
        const trim = String(line || "");
        return trim.startsWith(mark) ? trim : `${mark}${trim}`;
      });
      const next = nextLines.join("\n");
      return replaceRange(textarea, start, end, next, start, start + next.length);
    });
  }

  function resolveButton(buttons, key) {
    if (!buttons) return null;
    if (buttons[key]) return buttons[key];
    const lower = String(key || "").toLowerCase();
    return buttons[lower] || null;
  }

  function notify(ctx, message) {
    const footerMsg = ctx?.footerMsg || null;
    if (footerMsg && typeof footerMsg.textContent === "string") {
      footerMsg.textContent = String(message || "");
    }
  }

  function setup(ctx = {}) {
    const textarea = ctx.textarea || ctx.anotacoes || null;
    const buttons = ctx.buttons || {};
    if (!isTextarea(textarea)) return null;
    if (textarea.dataset.fichaAnotacoesToolbarBound === "1") {
      return {
        textarea,
        applyNegrito: () => applyInlineMark(textarea, "**", ctx),
        applyItalico: () => applyInlineMark(textarea, "_", ctx),
        applySublinhado: () => applyInlineMark(textarea, "__", ctx),
        applyLista: () => applyLinePrefix(textarea, "- "),
      };
    }

    const bind = (button, action, label) => {
      if (!button || button.dataset.fichaAnotacoesBound === "1") return;
      button.dataset.fichaAnotacoesBound = "1";
      button.addEventListener("click", () => {
        const fn = typeof action === "function" ? action : null;
        if (!fn) {
          notify(ctx, "Ação indisponível em anotações.");
          return;
        }
        const ok = !!fn();
        if (ok) {
          notify(ctx, `Anotações: ${label} aplicada em texto puro.`);
        } else {
          notify(ctx, "Selecione o texto ou posicione o cursor para aplicar a marcação.");
        }
      });
    };

    bind(resolveButton(buttons, "negrito"), () => applyInlineMark(textarea, "**", ctx), "Negrito");
    bind(resolveButton(buttons, "italico"), () => applyInlineMark(textarea, "_", ctx), "Italico");
    bind(resolveButton(buttons, "sublinhado"), () => applyInlineMark(textarea, "__", ctx), "Sublinhado");
    bind(resolveButton(buttons, "lista"), () => applyLinePrefix(textarea, "- "), "Lista");

    textarea.dataset.fichaAnotacoesToolbarBound = "1";
    return {
      textarea,
      applyNegrito: () => applyInlineMark(textarea, "**", ctx),
      applyItalico: () => applyInlineMark(textarea, "_", ctx),
      applySublinhado: () => applyInlineMark(textarea, "__", ctx),
      applyLista: () => applyLinePrefix(textarea, "- "),
    };
  }

  function getInfo() {
    return {
      meta,
      name: MODULE_NAME,
      version: MODULE_VERSION,
      status: meta.status,
      ativo: meta.ativo,
      controlaFluxo: meta.controlaFluxo,
      subetapa: meta.subetapa,
      setup,
      applyInlineMark,
      applyLinePrefix,
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

  const meta = Object.freeze({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    description: "Namespace passivo e defensivo da aba Anotacoes da Ficha Pessoal.",
    status: "passivo",
    ativo: true,
    controlaFluxo: false,
    subetapa: "ficha_anotacoes_toolbar_texto_puro",
  });

  const module = Object.freeze({
    meta,
    getInfo,
    getStatus,
    setup,
    applyInlineMark,
    applyLinePrefix,
  });

  window.BranaFichaPessoalAnotacoesModule = module;
})();
