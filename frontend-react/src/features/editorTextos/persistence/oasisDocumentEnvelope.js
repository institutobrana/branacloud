export const OASIS_ENVELOPE_VERSION = 1;
export const OASIS_VERSION = '0.0.191';
const IMPORT_SOURCE_EXTENSIONS = new Set(['.docx', '.txt', '.rtf']);
const IMPORT_CONTENT_FORMATS = new Set(['docx', 'plain_text', 'rtf']);
const IMPORT_CONFIDENCE_LEVELS = new Set(['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN']);

export function encodeOasisEnvelope(document, source = {}) {
  const sourceExtension = String(source?.sourceExtension || '').toLowerCase();
  const detectedContentFormat = String(source?.detectedContentFormat || '').toLowerCase();
  const detectionConfidence = String(source?.detectionConfidence || '').toUpperCase();
  return {
    format: 'oasis',
    formatVersion: OASIS_ENVELOPE_VERSION,
    oasisVersion: OASIS_VERSION,
    document,
    source: {
      format: String(source?.format || 'oasis'),
      ...(source?.origin ? { origin: String(source.origin) } : {}),
      ...(IMPORT_SOURCE_EXTENSIONS.has(sourceExtension) ? { sourceExtension } : {}),
      ...(IMPORT_CONTENT_FORMATS.has(detectedContentFormat) ? { detectedContentFormat } : {}),
      ...(IMPORT_CONFIDENCE_LEVELS.has(detectionConfidence) ? { detectionConfidence } : {}),
      legacyDocumentId: source?.legacyDocumentId != null && Number.isInteger(Number(source.legacyDocumentId)) ? Number(source.legacyDocumentId) : null,
      conversionVersion: source?.conversionVersion ? String(source.conversionVersion) : null,
      legacySourceProtected: Boolean(source?.legacyDocumentId),
    },
  };
}

export function decodeOasisEnvelope(value) {
  const envelope = typeof value === 'string' ? JSON.parse(value) : value;
  if (!envelope || envelope.format !== 'oasis' || envelope.formatVersion !== OASIS_ENVELOPE_VERSION || !envelope.document) {
    throw new Error('Envelope Oasis inválido ou incompatível.');
  }
  return envelope;
}

export function isOasisEnvelope(value) {
  try { return decodeOasisEnvelope(value).format === 'oasis'; } catch { return false; }
}
