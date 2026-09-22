import { isOasisEnvelope } from '../persistence/oasisDocumentEnvelope.js';
import { decodeOneHtmlEntityLayer } from './LegacyDocumentFormatDetector.js';

export const EDITOR_DOCUMENT_FORMATS = Object.freeze({
  OASIS: 'oasis_json',
  HTML: 'html',
  PLAIN_TEXT: 'text',
  RTF: 'rtf',
  UNKNOWN: 'unknown',
});

const HTML_SIGNATURE = /<(?:!doctype\s+html|html|head|body|p|div|span|br|table|tbody|thead|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|img|script|style|iframe|svg|a|b|strong|em|i|u)\b[^>]*>/i;
const CONTROL_SIGNATURE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

export function detectEditorDocumentFormat(dto = {}) {
  const declared = String(dto.conteudo_formato || '').trim().toLowerCase();
  const extension = String(dto.extensao || '').trim().toLowerCase();
  const payload = String(dto.conteudo ?? '');
  const htmlPayload = String(dto.conteudo_html ?? '');

  if (dto.diagnostico?.read_only === true || declared === 'diagnostic') {
    const diagnostic = dto.diagnostico || {};
    return {
      ...result(EDITOR_DOCUMENT_FORMATS.UNKNOWN, String(diagnostic.preview ?? ''), diagnostic.reason || 'Documento disponível apenas para diagnóstico read-only.', extension, diagnostic.detected_format || extension.slice(1) || 'unknown'),
      size: Number(diagnostic.size_bytes ?? diagnostic.size ?? 0),
      fileExists: diagnostic.file_exists === true,
      readOnly: true,
      diagnosticName: String(dto.nome || dto.nome_exibicao || ''),
      diagnosticMetadata: diagnostic.metadata || {},
      previewTruncated: diagnostic.preview_truncated === true,
    };
  }

  if (declared === EDITOR_DOCUMENT_FORMATS.OASIS) {
    return isOasisEnvelope(payload)
      ? result(EDITOR_DOCUMENT_FORMATS.OASIS, payload, 'declared Oasis metadata and valid envelope', extension)
      : result(EDITOR_DOCUMENT_FORMATS.UNKNOWN, payload, 'metadata declares Oasis but envelope is invalid', extension, 'oasis_json');
  }
  if (isOasisEnvelope(payload)) {
    return result(EDITOR_DOCUMENT_FORMATS.OASIS, payload, 'valid Oasis envelope signature', extension);
  }

  const content = declared === 'html' && htmlPayload.trim() ? htmlPayload : payload;
  if (/^\s*\{\\rtf\d*/i.test(content)) return result(EDITOR_DOCUMENT_FORMATS.RTF, content, 'RTF signature', extension);
  const escapedHtml = /&lt;\/?(?:p|div|span|br|table|tbody|thead|tfoot|tr|td|th|ul|ol|li|h[1-6]|blockquote|body|html)\b[^&]*&gt;/i.test(content);
  if (declared === 'html' || HTML_SIGNATURE.test(content) || escapedHtml || /\[\[IMGDATA:/i.test(content)) {
    const sourceFormat = ['.rtf', '.mod', '.rec'].includes(extension) ? extension.slice(1) : 'html';
    const html = escapedHtml && !HTML_SIGNATURE.test(content) ? decodeOneHtmlEntityLayer(content) : content;
    return result(EDITOR_DOCUMENT_FORMATS.HTML, html, declared === 'html' ? 'backend-declared HTML content' : escapedHtml ? 'escaped HTML signature' : 'recognized HTML signature', extension, sourceFormat);
  }

  if (['.bmp', '.doc', '.docx', '.dot', '.dotm', '.tmp'].includes(extension)) {
    return result(EDITOR_DOCUMENT_FORMATS.UNKNOWN, content, `formato binário/Office ${extension} sem importação segura pelo endpoint de modelos`, extension, extension.slice(1));
  }

  if (declared === 'text' || ['.txt', '.text', '.rec'].includes(extension)) {
    if (CONTROL_SIGNATURE.test(content)) return result(EDITOR_DOCUMENT_FORMATS.UNKNOWN, content, 'text metadata contains binary control characters', extension);
    return result(EDITOR_DOCUMENT_FORMATS.PLAIN_TEXT, content, declared === 'text' ? 'backend-declared plain text' : 'plain-text extension fallback', extension);
  }

  if (!declared && !CONTROL_SIGNATURE.test(content) && content.length > 0 && !content.trimStart().startsWith('{')) {
    return result(EDITOR_DOCUMENT_FORMATS.PLAIN_TEXT, content, 'safe text signature fallback', extension);
  }
  return result(EDITOR_DOCUMENT_FORMATS.UNKNOWN, content, `no safe converter for metadata=${declared || 'absent'}, extension=${extension || 'absent'}`, extension, extension.replace(/^\./, '') || 'unknown');
}

function result(format, content, reason, extension, sourceFormat = format) {
  return { format, content, reason, extension, sourceFormat, size: String(content ?? '').length };
}
