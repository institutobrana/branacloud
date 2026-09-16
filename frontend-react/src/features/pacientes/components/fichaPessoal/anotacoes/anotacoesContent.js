export const ANOTACOES_HTML_V1 = '<!--BRANA_ANOTACOES_HTML_V1-->';

const RTF_SIGNATURE = '{\\rtf';
const SAFE_TAGS = new Set(['P', 'BR', 'STRONG', 'EM', 'U', 'SPAN', 'UL', 'OL', 'LI', 'TABLE', 'TBODY', 'TR', 'TD', 'TH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const SAFE_ATTRIBUTES = new Set(['colspan', 'rowspan']);
const SAFE_STYLES = new Set(['font-family', 'font-size', 'color', 'text-align']);

export function isLegacyRtf(value) {
  return String(value || '').trimStart().toLowerCase().startsWith(RTF_SIGNATURE);
}

export function isVersionedAnotacoesHtml(value) {
  return String(value || '').startsWith(ANOTACOES_HTML_V1);
}

export function sanitizeAnotacoesHtml(value) {
  if (typeof DOMParser === 'undefined') return '';
  const document = new DOMParser().parseFromString(String(value || ''), 'text/html');
  const clean = document.createElement('div');
  const visit = (node, parent) => {
    if (node.nodeType === Node.TEXT_NODE) { parent.appendChild(document.createTextNode(node.nodeValue)); return; }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName.toUpperCase();
    if (['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED'].includes(tag)) return;
    if (!SAFE_TAGS.has(tag)) { [...node.childNodes].forEach((child) => visit(child, parent)); return; }
    const next = document.createElement(tag.toLowerCase());
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (SAFE_ATTRIBUTES.has(name)) next.setAttribute(name, attribute.value);
    });
    if (node.hasAttribute('style')) {
      [...SAFE_STYLES].forEach((property) => {
        const value = node.style.getPropertyValue(property).trim();
        if (value && !value.toLowerCase().includes('url(') && !value.toLowerCase().includes('expression')) next.style.setProperty(property, value);
      });
    }
    [...node.childNodes].forEach((child) => visit(child, next));
    parent.appendChild(next);
  };
  [...document.body.childNodes].forEach((child) => visit(child, clean));
  return clean.innerHTML;
}

export function loadAnotacoesContent(value) {
  const raw = String(value || '');
  if (!raw.trim() || isLegacyRtf(raw)) return '';
  if (!isVersionedAnotacoesHtml(raw)) return { type: 'doc', content: raw.split(/\r?\n/).map((text) => ({ type: 'paragraph', ...(text ? { content: [{ type: 'text', text }] } : {}) })) };
  return sanitizeAnotacoesHtml(raw.slice(ANOTACOES_HTML_V1.length));
}

export function serializeAnotacoesHtml(html) {
  const clean = sanitizeAnotacoesHtml(html);
  if (!clean || clean === '<p></p>') return '';
  return `${ANOTACOES_HTML_V1}${clean}`;
}
