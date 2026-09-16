const HTML_TAG_PATTERN = /<(?:p|div|span|br|table|tbody|thead|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|body|html)\b[^>]*>/i;
const RTF_PATTERN = /^\s*\{\\rtf(?:\d+)?\b/i;
const IMGDATA_PATTERN = /\[\[IMGDATA:[\s\S]*?\]\]/i;
const MERGE_FIELD_PATTERN = /\{\{[^{}]+\}\}/;
const ESCAPED_TAG_PATTERN = /&lt;\/?(?:p|div|span|br|table|tbody|thead|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|body|html)\b[^&]*&gt;/i;

export const LEGACY_DOCUMENT_FORMATS = Object.freeze({
  HTML: 'HTML',
  ESCAPED_HTML: 'ESCAPED_HTML',
  RTF: 'RTF',
  PLAIN_TEXT: 'PLAIN_TEXT',
  LEGACY_TOKENIZED_HTML: 'LEGACY_TOKENIZED_HTML',
  UNKNOWN: 'UNKNOWN',
});

export function detectLegacyDocumentFormat({ content = '', fileExtension = '', metadata = {} } = {}) {
  const value = String(content ?? '');
  const trimmed = value.trim();
  const extension = String(fileExtension || metadata.extension || '').toLowerCase();
  const reasons = [];
  if (!trimmed) return result(LEGACY_DOCUMENT_FORMATS.PLAIN_TEXT, 1, ['empty content is safe text']);
  if (RTF_PATTERN.test(trimmed)) return result(LEGACY_DOCUMENT_FORMATS.RTF, 1, ['RTF signature']);
  if (IMGDATA_PATTERN.test(trimmed)) return result(LEGACY_DOCUMENT_FORMATS.LEGACY_TOKENIZED_HTML, 1, ['IMGDATA token']);
  if (HTML_TAG_PATTERN.test(trimmed)) return result(LEGACY_DOCUMENT_FORMATS.HTML, 1, ['recognized structural HTML tag']);
  if (ESCAPED_TAG_PATTERN.test(trimmed)) return result(LEGACY_DOCUMENT_FORMATS.ESCAPED_HTML, 0.98, ['escaped structural HTML tag']);
  if (MERGE_FIELD_PATTERN.test(trimmed) && /\S/.test(trimmed)) reasons.push('merge fields in text');
  if (['.txt', '.text'].includes(extension) || !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(trimmed)) {
    return result(LEGACY_DOCUMENT_FORMATS.PLAIN_TEXT, reasons.length ? 0.85 : 0.8, reasons.concat('no recognized markup'));
  }
  return result(LEGACY_DOCUMENT_FORMATS.UNKNOWN, 0.99, ['unrecognized control characters or markup']);
}

export function decodeOneHtmlEntityLayer(value = '') {
  return String(value).replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    const lower = entity.toLowerCase();
    if (lower === 'amp') return '&';
    if (lower === 'lt') return '<';
    if (lower === 'gt') return '>';
    if (lower === 'quot') return '"';
    if (lower === 'apos') return "'";
    if (lower === 'nbsp') return '\u00a0';
    const code = lower.startsWith('#x') ? parseInt(lower.slice(2), 16) : parseInt(lower.slice(1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : match;
  });
}

export function decodeLegacyDocumentForEditor(content, detection) {
  if (detection?.format === LEGACY_DOCUMENT_FORMATS.ESCAPED_HTML) return decodeOneHtmlEntityLayer(content);
  if (detection?.format === LEGACY_DOCUMENT_FORMATS.PLAIN_TEXT) return plainTextToHtml(content);
  return String(content ?? '');
}

export function getImportSafety(detection, { safeRoundTrip = true } = {}) {
  const editable = [LEGACY_DOCUMENT_FORMATS.HTML, LEGACY_DOCUMENT_FORMATS.ESCAPED_HTML, LEGACY_DOCUMENT_FORMATS.PLAIN_TEXT, LEGACY_DOCUMENT_FORMATS.LEGACY_TOKENIZED_HTML].includes(detection?.format) && safeRoundTrip;
  const reason = editable ? '' : detection?.format === LEGACY_DOCUMENT_FORMATS.RTF ? 'legacy RTF is not converted by the React editor' : 'document format is not safely recognized';
  return { format: detection?.format || LEGACY_DOCUMENT_FORMATS.UNKNOWN, confidence: detection?.confidence ?? 0, reasons: detection?.reasons || [], editable, resaveAllowed: editable, reason };
}

export function safeRoundtripCheck({ sourceHtml = '', exportedHtml = '', serializedLegacyHtml = '' } = {}) {
  const source = String(sourceHtml ?? '');
  const exported = String(exportedHtml ?? '');
  const serialized = String(serializedLegacyHtml || exported);
  const lostFeatures = [];
  const warnings = [];
  for (const tag of ['table', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']) {
    const sourceCount = materialTagCount(source, tag);
    const exportedCount = materialTagCount(exported, tag);
    if (sourceCount > exportedCount) lostFeatures.push(`${tag}: ${sourceCount} → ${exportedCount}`);
  }
  if (countImages(source) > countImages(exported)) lostFeatures.push(`images: ${countImages(source)} → ${countImages(exported)}`);
  if (countToken(source, 'IMGDATA') > countToken(serialized, 'IMGDATA')) lostFeatures.push('IMGDATA token lost');
  if (mergeFields(source).join('\u0000') !== mergeFields(exported).join('\u0000')) lostFeatures.push('merge field token lost or changed');
  const sourceText = semanticText(source);
  const exportedText = semanticText(exported);
  if (sourceText !== exportedText) lostFeatures.push('visible text changed');
  if (materialTagCount(source, 'p') + materialTagCount(source, 'div') > 0 && materialTagCount(exported, 'p') + materialTagCount(exported, 'div') === 0 && sourceText) lostFeatures.push('text blocks lost');
  if (lostFeatures.length) warnings.push('Tiptap schema or serializer changed material document content');
  return { safe: lostFeatures.length === 0, lostFeatures, warnings };
}

function result(format, confidence, reasons) { return { format, confidence, reasons }; }

function plainTextToHtml(value) {
  const escaped = String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `<p>${escaped.replace(/\r\n|\r|\n/g, '</p><p>')}</p>`;
}

function materialTagCount(value, tag) { return (String(value).match(new RegExp(`<\\s*${tag}(?:\\s|>)`, 'gi')) || []).length; }

function countImages(value) { return (String(value).match(/<img\b/gi) || []).length; }
function countToken(value, name) { return (String(value).match(new RegExp(`\\[\\[${name}:`, 'gi')) || []).length; }
function mergeFields(value) { return [...String(value).matchAll(/\{\{[^{}]+\}\}/g)].map((item) => item[0]); }
function semanticText(value) {
  const normalizedEmptyParagraphs = String(value).replace(/<p\b[^>]*>\s*<br\b[^>]*>\s*<\/p>/gi, '<p></p>');
  const withBreaks = normalizedEmptyParagraphs
    .replace(/\[\[IMGDATA:[\s\S]*?\]\]/gi, '')
    .replace(/<br\b[^>]*>/gi, (tag) => /ProseMirror-trailingBreak/i.test(tag) ? '' : '\n')
    .replace(/<\/(?:p|div|li|h[1-6]|blockquote|tr)\s*>/gi, '\n')
    .replace(/<(?:p|div|li|h[1-6]|blockquote|tr)\b[^>]*>/gi, '');
  const withoutTags = withBreaks.replace(/<[^>]*>/g, ' ');
  return withoutTags.replace(/&nbsp;/gi, ' ').replace(/&emsp;/gi, ' ').replace(/&ensp;/gi, ' ').replace(/&ndash;/gi, '–').replace(/&mdash;/gi, '—').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/\r/g, '').split('\n').map((line) => line.replace(/[ \t\u00a0\u2000-\u200a]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
