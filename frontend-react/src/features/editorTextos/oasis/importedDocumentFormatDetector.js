import { decodeImportedTextBytes } from './importedTextDecoder.js';

const OLE_COMPOUND_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const ZIP_LOCAL_SIGNATURE = [0x50, 0x4b, 0x03, 0x04];
const RTF_VERSION_SIGNATURE = /^\{\\rtf\d+(?=[\\\s{}])/;
const RTF_PREFIX_SIGNATURE = /^\{\\rtf(?=[\\\s{}])/;
const REQUIRED_OOXML_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';
const CONTENT_TYPES_NAMESPACE = 'http://schemas.openxmlformats.org/package/2006/content-types';
const RELATIONSHIPS_NAMESPACE = 'http://schemas.openxmlformats.org/package/2006/relationships';
const WORD_NAMESPACES = new Set([
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
  'http://purl.oclc.org/ooxml/wordprocessingml/main',
]);

export const IMPORTED_CONTENT_FORMATS = Object.freeze({
  PLAIN_TEXT: 'plain_text',
  RTF: 'rtf',
  DOCX: 'docx',
  OLE_COMPOUND: 'ole_compound',
  UNKNOWN: 'unknown',
});

function normalizeBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  throw new TypeError('A detecção do formato requer os bytes originais do arquivo.');
}

function extensionOf(name) {
  const base = String(name || '').split(/[\\/]/).at(-1) || '';
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot).toLowerCase() : '';
}

function hasPrefix(bytes, signature, offset = 0) {
  return bytes.length >= offset + signature.length && signature.every((byte, index) => bytes[offset + index] === byte);
}

function textPreamble(bytes) {
  let offset = hasPrefix(bytes, [0xef, 0xbb, 0xbf]) ? 3 : 0;
  while ([0x09, 0x0a, 0x0d, 0x20].includes(bytes[offset])) offset += 1;
  return { offset, hadBom: offset >= 3 && hasPrefix(bytes, [0xef, 0xbb, 0xbf]) };
}

function detectRtf(bytes) {
  const { offset, hadBom } = textPreamble(bytes);
  const head = String.fromCharCode(...bytes.subarray(offset, Math.min(bytes.length, offset + 4096)));
  if (RTF_VERSION_SIGNATURE.test(head)) {
    const codepage = head.match(/\\ansicpg(\d+)/)?.[1] || null;
    return { detectedFormat: IMPORTED_CONTENT_FORMATS.RTF, confidence: 'HIGH', evidence: `Assinatura RTF inicial {\\rtfN${hadBom ? ' após BOM UTF-8' : ''}${offset > (hadBom ? 3 : 0) ? ' e whitespace' : ''}.`, codepage };
  }
  if (RTF_PREFIX_SIGNATURE.test(head)) {
    return { detectedFormat: IMPORTED_CONTENT_FORMATS.RTF, confidence: 'MEDIUM', evidence: 'Prefixo RTF inicial sem versão \\rtfN completa.' };
  }
  if (/^\{\\rtf/i.test(head)) {
    return { detectedFormat: IMPORTED_CONTENT_FORMATS.UNKNOWN, confidence: 'LOW', evidence: 'Prefixo semelhante a RTF, mas a assinatura não corresponde à sintaxe reconhecida.' };
  }
  return null;
}

function hasUnsafeTextControls(text) {
  const characters = [...text];
  if (!characters.length) return true;
  if (text.includes('\u0000') || /[\u0080-\u009f]/u.test(text)) return true;
  const controls = characters.filter((character) => /[\u0000-\u001f\u007f]/u.test(character) && !/[\r\n\t]/u.test(character)).length;
  return controls / characters.length > 0.005;
}

function detectPlainText(bytes) {
  if (!bytes.length) return null;
  const bomPresent = hasPrefix(bytes, [0xef, 0xbb, 0xbf]);
  if (hasPrefix(bytes, [0xff, 0xfe]) || hasPrefix(bytes, [0xfe, 0xff])) return null;
  const decoded = decodeImportedTextBytes(bytes);
  if (bomPresent && decoded.encoding !== 'utf-8-bom') return null;
  if (decoded.warning || hasUnsafeTextControls(decoded.text)) return null;
  const leadingContent = decoded.text.replace(/^\uFEFF/, '').trimStart();
  if (/^(?:<!doctype\s+html\b|<html\b)/i.test(leadingContent)) return null;
  // Legacy Brana image payloads are structured document content, not plain text.
  // Until their format has a dedicated importer, keep them out of the TXT route.
  if (/\[\[IMGDATA:/i.test(decoded.text)) return null;
  return {
    detectedFormat: IMPORTED_CONTENT_FORMATS.PLAIN_TEXT,
    confidence: 'HIGH',
    evidence: `${decoded.encoding} decodificável, sem assinatura binária conhecida e com proporção imprimível segura${bomPresent ? '; BOM UTF-8 removido para inspeção' : ''}.`,
    encoding: decoded.encoding,
    decodedText: decoded.text,
  };
}

function readU16(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(offset, true);
}

function readU32(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

function findEndOfCentralDirectory(bytes) {
  if (bytes.length < 22) return -1;
  const minimum = Math.max(0, bytes.length - 22 - 0xffff);
  for (let offset = bytes.length - 22; offset >= minimum; offset -= 1) {
    if (readU32(bytes, offset) === 0x06054b50 && offset + 22 + readU16(bytes, offset + 20) === bytes.length) return offset;
  }
  return -1;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

async function unpackEntry(bytes, entry, directoryOffset) {
  const { flags, method, compressedSize, uncompressedSize, checksum, localOffset, name } = entry;
  if ((flags & 0x0001) !== 0 || ![0, 8].includes(method)) throw new Error('OOXML entry encrypted or uses an unsupported ZIP compression method');
  if (localOffset + 30 > bytes.length || readU32(bytes, localOffset) !== 0x04034b50) throw new Error('OOXML local ZIP header missing');
  const localNameLength = readU16(bytes, localOffset + 26);
  const localExtraLength = readU16(bytes, localOffset + 28);
  const localNameStart = localOffset + 30;
  const localName = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(localNameStart, localNameStart + localNameLength));
  if (localName !== name || readU16(bytes, localOffset + 6) !== flags || readU16(bytes, localOffset + 8) !== method) throw new Error('OOXML local and central ZIP headers disagree');
  const dataStart = localNameStart + localNameLength + localExtraLength;
  const dataEnd = dataStart + compressedSize;
  if (dataEnd > directoryOffset) throw new Error('OOXML ZIP entry data exceeds its local-file region');
  const compressed = bytes.subarray(dataStart, dataEnd);
  let content;
  if (method === 0) content = compressed;
  else {
    if (typeof DecompressionStream !== 'function') throw new Error('This runtime cannot validate deflated OOXML parts');
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    content = new Uint8Array(await new Response(stream).arrayBuffer());
  }
  if (content.length !== uncompressedSize || crc32(content) !== checksum) throw new Error('OOXML ZIP entry size or checksum is invalid');
  return content;
}

async function validateDocxPackage(bytes) {
  const eocd = findEndOfCentralDirectory(bytes);
  if (eocd < 0) throw new Error('ZIP end-of-central-directory record missing');
  if (readU16(bytes, eocd + 4) !== 0 || readU16(bytes, eocd + 6) !== 0 || readU16(bytes, eocd + 8) !== readU16(bytes, eocd + 10)) throw new Error('Multi-disk or inconsistent ZIP directory is unsupported');
  const entriesCount = readU16(bytes, eocd + 10);
  const directorySize = readU32(bytes, eocd + 12);
  const directoryOffset = readU32(bytes, eocd + 16);
  if (entriesCount === 0xffff || directoryOffset === 0xffffffff || directorySize === 0xffffffff || directoryOffset + directorySize > eocd) throw new Error('ZIP64 or invalid ZIP directory is not validated');

  const required = new Map();
  let cursor = directoryOffset;
  const decoder = new TextDecoder('utf-8', { fatal: true });
  for (let index = 0; index < entriesCount; index += 1) {
    if (cursor + 46 > directoryOffset + directorySize || readU32(bytes, cursor) !== 0x02014b50) throw new Error('Invalid ZIP central directory entry');
    const nameLength = readU16(bytes, cursor + 28);
    const extraLength = readU16(bytes, cursor + 30);
    const commentLength = readU16(bytes, cursor + 32);
    const entryEnd = cursor + 46 + nameLength + extraLength + commentLength;
    if (entryEnd > directoryOffset + directorySize) throw new Error('ZIP central directory entry exceeds its bounds');
    const name = decoder.decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
    if (['[Content_Types].xml', '_rels/.rels', 'word/document.xml'].includes(name)) {
      if (required.has(name)) throw new Error(`Duplicate required OOXML part: ${name}`);
      required.set(name, {
        name,
        flags: readU16(bytes, cursor + 8),
        method: readU16(bytes, cursor + 10),
        checksum: readU32(bytes, cursor + 16),
        compressedSize: readU32(bytes, cursor + 20),
        uncompressedSize: readU32(bytes, cursor + 24),
        localOffset: readU32(bytes, cursor + 42),
      });
    }
    cursor = entryEnd;
  }
  if (cursor !== directoryOffset + directorySize) throw new Error('ZIP central directory size does not match its entries');
  if (!required.has('[Content_Types].xml') || !required.has('_rels/.rels') || !required.has('word/document.xml')) throw new Error('Required OOXML parts are missing');

  const typesText = new TextDecoder('utf-8', { fatal: true }).decode(await unpackEntry(bytes, required.get('[Content_Types].xml'), directoryOffset));
  const relationshipsText = new TextDecoder('utf-8', { fatal: true }).decode(await unpackEntry(bytes, required.get('_rels/.rels'), directoryOffset));
  const documentText = new TextDecoder('utf-8', { fatal: true }).decode(await unpackEntry(bytes, required.get('word/document.xml'), directoryOffset));
  if (/<!DOCTYPE|<!ENTITY/i.test(typesText + relationshipsText + documentText)) throw new Error('OOXML XML contains a DTD or entity declaration');
  if (typeof DOMParser !== 'function') throw new Error('A safe XML parser is unavailable for OOXML validation');
  const parser = new DOMParser();
  const typesXml = parser.parseFromString(typesText, 'application/xml');
  const relationshipsXml = parser.parseFromString(relationshipsText, 'application/xml');
  const documentXml = parser.parseFromString(documentText, 'application/xml');
  if (typesXml.getElementsByTagName('parsererror').length || typesXml.documentElement?.localName !== 'Types' || typesXml.documentElement.namespaceURI !== CONTENT_TYPES_NAMESPACE) throw new Error('[Content_Types].xml is malformed');
  if (relationshipsXml.getElementsByTagName('parsererror').length || relationshipsXml.documentElement?.localName !== 'Relationships' || relationshipsXml.documentElement.namespaceURI !== RELATIONSHIPS_NAMESPACE) throw new Error('_rels/.rels is malformed');
  if (documentXml.getElementsByTagName('parsererror').length || documentXml.documentElement?.localName !== 'document' || !WORD_NAMESPACES.has(documentXml.documentElement.namespaceURI)) throw new Error('word/document.xml is malformed or has an unexpected namespace');
  const documentOverride = [...typesXml.getElementsByTagNameNS(CONTENT_TYPES_NAMESPACE, 'Override')].find((element) => element.getAttribute('PartName') === '/word/document.xml');
  if (!documentOverride || documentOverride.getAttribute('ContentType') !== REQUIRED_OOXML_CONTENT_TYPE) throw new Error('Main Word document content type is not declared as DOCX');
  const officeDocumentRelationship = [...relationshipsXml.getElementsByTagNameNS(RELATIONSHIPS_NAMESPACE, 'Relationship')].find((element) => element.getAttribute('Type').endsWith('/officeDocument'));
  if (!officeDocumentRelationship || (officeDocumentRelationship.getAttribute('TargetMode') || '').toLowerCase() === 'external' || !['word/document.xml', '/word/document.xml'].includes(officeDocumentRelationship.getAttribute('Target'))) throw new Error('Root OOXML relationship does not reference word/document.xml safely');
}

function baseResult(extension, mimeType, detectedFormat, confidence, evidence, safeToImport = false, reason = '') {
  return {
    extension,
    extensionRole: 'HINT_ONLY',
    mimeType: String(mimeType || ''),
    mimeRole: 'SECONDARY_ONLY',
    detectedFormat,
    confidence,
    evidence,
    safeToImport,
    reason,
  };
}

export async function detectImportedDocumentFormat(file, providedBytes) {
  if (!file) throw new Error('Arquivo ausente para detecção de formato.');
  const extension = extensionOf(file.name);
  const bytes = normalizeBytes(providedBytes ?? await file.arrayBuffer());

  const rtf = detectRtf(bytes);
  if (rtf) {
    if (rtf.detectedFormat === IMPORTED_CONTENT_FORMATS.UNKNOWN) {
      const reason = extension === '.mod'
        ? 'Este arquivo MOD não contém um documento RTF reconhecível e não pode ser importado pelo editor.'
        : 'Formato semelhante a RTF, mas não reconhecido com segurança.';
      return baseResult(extension, file.type, rtf.detectedFormat, rtf.confidence, rtf.evidence, false, reason);
    }
    const allowedSource = extension === '.txt' || extension === '.rtf' || extension === '.mod';
    return baseResult(extension, file.type, rtf.detectedFormat, rtf.confidence, `${rtf.evidence}${rtf.codepage ? ` Codepage declarada: ${rtf.codepage}.` : ''}`, allowedSource && rtf.confidence === 'HIGH',
      allowedSource ? '' : 'Conteúdo RTF detectado, mas somente extensões .rtf, .txt e .mod possuem rota de conversão habilitada.');
  }

  if (hasPrefix(bytes, ZIP_LOCAL_SIGNATURE)) {
    try {
      await validateDocxPackage(bytes);
      const allowed = extension === '.docx';
      return baseResult(extension, file.type, IMPORTED_CONTENT_FORMATS.DOCX, 'HIGH', 'Assinatura ZIP, diretório central, CRCs, tipos, relação raiz e partes OOXML essenciais validados.', allowed,
        allowed ? '' : 'O conteúdo é DOCX, mas a extensão de origem não é .docx.');
    } catch (error) {
      return baseResult(extension, file.type, IMPORTED_CONTENT_FORMATS.UNKNOWN, 'UNKNOWN', `Assinatura ZIP encontrada, mas a validação estrutural OOXML falhou: ${error.message}`, false, 'O arquivo não é um pacote DOCX válido e não será enviado ao importador Oasis.');
    }
  }

  if (hasPrefix(bytes, OLE_COMPOUND_SIGNATURE)) {
    return baseResult(extension, file.type, IMPORTED_CONTENT_FORMATS.OLE_COMPOUND, 'HIGH', 'Assinatura OLE Compound File D0 CF 11 E0 A1 B1 1A E1; o tipo interno WordDocument não foi inspecionado.', false,
      'Contêiner OLE identificado. Isso não comprova sozinho que seja um DOC clássico, e não será importado.');
  }

  const bomOffset = hasPrefix(bytes, [0xef, 0xbb, 0xbf]) ? 3 : 0;
  const leadingBytesText = new TextDecoder('ascii').decode(bytes.subarray(bomOffset, Math.min(bytes.length, bomOffset + 512))).trimStart();
  if (/^\{\s*"format"\s*:\s*"oasis"/i.test(leadingBytesText)) {
    return baseResult(extension, file.type, IMPORTED_CONTENT_FORMATS.UNKNOWN, 'HIGH', 'Envelope JSON Oasis reconhecido; não é TXT puro nem DOCX e este picker não importa envelopes Oasis.', false,
      'Arquivo identificado como envelope Oasis, não como texto simples. Abra documentos Brana pelo comando Abrir.');
  }

  const plainText = detectPlainText(bytes);
  if (plainText) {
    const allowed = extension === '.txt';
    if (extension === '.mod') {
      return baseResult(extension, file.type, plainText.detectedFormat, plainText.confidence, plainText.evidence, false,
        'Este arquivo MOD não contém um documento RTF reconhecível e não pode ser importado pelo editor.');
    }
    return baseResult(extension, file.type, plainText.detectedFormat, plainText.confidence, plainText.evidence, allowed,
      allowed ? '' : 'Conteúdo textual detectado, mas somente arquivos com extensão .txt estão habilitados para este importador.');
  }

  const unknownReason = extension === '.mod'
    ? 'Este arquivo MOD não contém um documento RTF reconhecível e não pode ser importado pelo editor.'
    : 'Formato do arquivo não reconhecido com segurança.';
  return baseResult(extension, file.type, IMPORTED_CONTENT_FORMATS.UNKNOWN, 'UNKNOWN', 'Nenhuma assinatura conhecida nem evidência textual imprimível suficiente.', false, unknownReason);
}
