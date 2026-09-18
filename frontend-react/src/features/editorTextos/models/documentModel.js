import { DEFAULT_PAGE_CONFIG, normalizePageConfig } from './pageConfig.js';
import { detectLegacyDocumentFormat, decodeLegacyDocumentForEditor, getImportSafety, LEGACY_DOCUMENT_FORMATS } from './LegacyDocumentFormatDetector.js';

export function documentDtoToModel(dto = {}, { manualLegacyTestMode = false } = {}) {
  const rawContent = String(dto.conteudo_html || dto.conteudo || '<p></p>') || '<p></p>';
  const detection = detectLegacyDocumentFormat({ content: rawContent, fileExtension: dto.extensao, metadata: dto });
  const importSafety = getImportSafety(detection);
  const legacyExtension = ['.rtf', '.mod', '.rec'].includes(String(dto.extensao || '').toLowerCase()) || (String(dto.extensao || '').toLowerCase() === '.txt' && detection.format === LEGACY_DOCUMENT_FORMATS.RTF);
  const manualOverride = manualLegacyTestMode && legacyExtension;
  const content = importSafety.editable || manualOverride ? decodeLegacyDocumentForEditor(rawContent, detection) : '<p></p>';
  return {
    id: dto.id ?? null,
    name: String(dto.nome_exibicao || dto.nome || 'Novo documento'),
    type: String(dto.tipo_modelo || 'outros'),
    extension: String(dto.extensao || '.txt'),
    content,
    originalContent: rawContent,
    importSafety: manualOverride ? { ...importSafety, editable: false, resaveAllowed: false, manualLegacyTestAllowed: true, reason: 'modo de homologação: alterações não serão salvas' } : importSafety,
    pageConfig: normalizePageConfig(dto.pagina_config || DEFAULT_PAGE_CONFIG),
    dirty: false,
    loading: false,
    saving: false,
  };
}

export function documentModelToPayload(model, content) {
  return {
    nome: String(model.name || 'Novo documento').trim(),
    conteudo: String(content || '<p></p>'),
    conteudo_formato: 'html',
    tipo_modelo: String(model.type || 'outros'),
    extensao: String(model.extension || '.txt'),
    pagina_config: model.pageConfig || null,
  };
}
