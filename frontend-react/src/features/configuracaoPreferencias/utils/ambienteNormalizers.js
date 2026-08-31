import { AMBIENTE_DEFAULT_STYLE, AMBIENTE_FALLBACK_SECTIONS } from '../constants/ambienteConstants.js';

export function normalizeEnvironment(values) {
  const source = values || {};
  const received = source.secoes || {};
  const secoes = Object.keys(AMBIENTE_FALLBACK_SECTIONS).reduce((out, key) => ({
    ...out,
    [key]: { ...AMBIENTE_DEFAULT_STYLE, ...(received[key] || {}) },
  }), {});
  return { ...source, secao_ativa: source.secao_ativa || 'enunciados', secoes };
}

export function normalizeStyle(style, options = {}) {
  const base = { ...AMBIENTE_DEFAULT_STYLE, ...(style || {}) };
  const fonts = (options.fontes || []).map((item) => item.id);
  const styles = (options.estilos || []).map((item) => item.id);
  const scripts = (options.scripts || []).map((item) => item.id);
  return {
    ...base,
    fonte_nome: fonts.includes(base.fonte_nome) ? base.fonte_nome : AMBIENTE_DEFAULT_STYLE.fonte_nome,
    fonte_tamanho: Math.max(8, Math.min(36, Number(base.fonte_tamanho) || 12)),
    fonte_estilo: styles.includes(base.fonte_estilo) ? base.fonte_estilo : 'normal',
    cor_texto: /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(base.cor_texto)) ? String(base.cor_texto).toLowerCase() : '#000000',
    script: scripts.includes(base.script) ? base.script : 'Ocidental',
    riscado: Boolean(base.riscado),
    sublinhado: Boolean(base.sublinhado),
  };
}
