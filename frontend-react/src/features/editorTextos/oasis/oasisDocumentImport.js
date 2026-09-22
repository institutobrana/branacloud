import { convertPlainTextToOasis } from '../adapters/editorLegacyToOasisAdapter.js';
import { convertRtfHtmlToOasis } from '../adapters/editorLegacyToOasisAdapter.js';
import { decodeImportedTextBytes } from './importedTextDecoder.js';
import { detectImportedDocumentFormat } from './importedDocumentFormatDetector.js';

export const UNIFIED_IMPORT_ACCEPT = '.docx,.txt,.rtf,.mod';
export const UNIFIED_IMPORT_EXTENSIONS = Object.freeze(['.docx', '.txt', '.rtf', '.mod']);

export function getSupportedImportFormat(filename) {
  const name = String(filename || '').trim().split(/[\\/]/).at(-1) || '';
  const dot = name.lastIndexOf('.');
  const extension = dot > 0 ? name.slice(dot).toLowerCase() : '';
  return UNIFIED_IMPORT_EXTENSIONS.includes(extension) ? extension.slice(1) : null;
}

export function getImportedDocumentName(filename) {
  const basename = String(filename || '').split(/[\\/]/).at(-1) || '';
  const withoutExtension = basename.replace(/\.(docx|txt|rtf|mod)$/i, '').trim();
  return withoutExtension || 'Documento importado';
}

export async function importDocumentIntoOasis({ file, client, createDocumentFactory, createParagraphFactory, createTableFactory, convertRtf }) {
  const format = getSupportedImportFormat(file?.name);
  if (!format) {
    throw new Error('Formato não suportado. Nesta versão podem ser importados arquivos DOCX, TXT, RTF e MOD.');
  }
  if (!client) throw new Error('O editor Oasis ainda não está pronto para importar documentos.');

  const beforeDocument = client.getDocument();
  let detection;
  let decodedText = null;
  {
    const sourceBytes = new Uint8Array(await file.arrayBuffer());
    detection = await detectImportedDocumentFormat(file, sourceBytes);
    if (detection.safeToImport && detection.detectedFormat === 'plain_text' && detection.confidence === 'HIGH') {
      decodedText = decodeImportedTextBytes(sourceBytes);
    } else if (detection.safeToImport && detection.detectedFormat === 'rtf' && detection.confidence === 'HIGH') {
      decodedText = decodeImportedTextBytes(sourceBytes);
    }
  }
  if (!detection.safeToImport) {
    throw new Error(detection.reason || 'Formato do arquivo não reconhecido com segurança.');
  }

  let convertedDocument = null;
  let textEncoding = null;
  let textEncodingWarning = null;
  let importWarnings = [];
  let importedFormat = format;
  let importedPageConfig = null;
  if (detection.detectedFormat === 'rtf') {
    if (!['.rtf', '.txt', '.mod'].includes(detection.extension)) {
      throw new Error('RTF detectado em uma extensão fora da allowlist; o arquivo não foi importado.');
    }
    if (decodedText?.warning) throw new Error('O arquivo RTF possui bytes sem mapeamento de texto seguro e não foi importado.');
    if (typeof convertRtf !== 'function') throw new Error('O conversor RTF seguro do Brana não está disponível.');
    const convertedRtf = await convertRtf(decodedText?.text ?? '');
    if (!convertedRtf || typeof convertedRtf.html !== 'string' || convertedRtf.persisted !== false) {
      throw new Error('O serviço RTF não confirmou uma conversão temporária segura.');
    }
    const converted = convertRtfHtmlToOasis(convertedRtf.html, {
      createDocument: createDocumentFactory,
      createParagraph: createParagraphFactory,
      createTable: createTableFactory,
      pageSettings: convertedRtf.page_settings,
      title: getImportedDocumentName(file.name),
    });
    convertedDocument = converted.document;
    importedPageConfig = convertedRtf.page_config || null;
    importWarnings = [...new Set([...(convertedRtf.warnings || []), ...converted.warnings])];
    importedFormat = 'rtf';
  } else if (format === 'docx') {
    if (detection.detectedFormat !== 'docx' || detection.confidence !== 'HIGH') {
      throw new Error('O conteúdo não foi validado como DOCX OOXML; o importador Oasis não foi acionado.');
    }
    await client.import.docx(file);
  } else {
    if (detection.detectedFormat !== 'plain_text' || detection.confidence !== 'HIGH') {
      throw new Error('O conteúdo não foi validado como texto puro; nenhum importador foi acionado.');
    }
    if (typeof createDocumentFactory !== 'function' || typeof createParagraphFactory !== 'function') {
      throw new Error('As fábricas Oasis são necessárias para importar texto simples.');
    }
    textEncoding = decodedText.encoding;
    textEncodingWarning = decodedText.warning;
    const converted = convertPlainTextToOasis(decodedText.text, { createDocument: createDocumentFactory, createParagraph: createParagraphFactory, title: getImportedDocumentName(file.name) });
    convertedDocument = converted.document;
  }

  const importedDocument = convertedDocument || client.getDocument();
  if (!importedDocument || importedDocument.id === beforeDocument?.id) {
    throw new Error('O Oasis não carregou o documento. O documento atual foi preservado.');
  }

  // Treat this as a fresh, editable session: keep Oasis's own dirty state and
  // discard undo entries that could restore the document that was open before.
  client.document.set(importedDocument);
  client.history.clear();
  client.focus.focus();

  return {
    document: client.getDocument(),
    format: importedFormat,
    suggestedName: getImportedDocumentName(file.name),
    sourceExtension: detection.extension,
    detectedContentFormat: detection.detectedFormat,
    detectionConfidence: detection.confidence,
    ...(importedPageConfig ? { pageConfig: importedPageConfig } : {}),
    ...(format === 'txt' || format === 'rtf' || format === 'mod' ? { textEncoding: decodedText?.encoding || null, textEncodingWarning: decodedText?.warning || null } : {}),
    warnings: importWarnings,
  };
}
