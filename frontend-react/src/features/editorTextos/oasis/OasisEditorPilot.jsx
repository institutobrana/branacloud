import { createDocument, createOasisEditor, createParagraph, createTable } from 'oasis-editor';
import 'oasis-editor/style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createOasisNewDocument, getPersistableDocumentSnapshot } from '../engines/OasisEditorAdapter.js';
import { editorTextosApi } from '../api/editorTextosApi.js';
import { deleteEditorTextModel, renameEditorTextModel } from '../api/editorTextosModelActions.js';
import { decodeOasisEnvelope, encodeOasisEnvelope } from '../persistence/oasisDocumentEnvelope.js';
import { detectEditorDocumentFormat, EDITOR_DOCUMENT_FORMATS } from '../models/editorDocumentFormatDetector.js';
import { convertLegacyHtmlToOasis, convertPlainTextToOasis, convertRtfHtmlToOasis, createUnsupportedFormatDiagnostic, LEGACY_CONVERSION_VERSION } from '../adapters/editorLegacyToOasisAdapter.js';
import { DEFAULT_PAGE_CONFIG, normalizePageConfig } from '../models/pageConfig.js';
import { EditorTextosOpenDialog, EditorTextosSaveAsDialog, EditorTextosNameCollisionDialog } from '../components/EditorTextosDocumentDialogs.jsx';
import { EditorTextosUnsavedChangesDialog } from '../components/EditorTextosUnsavedChangesDialog.jsx';
import { EditorTextosNewDocumentDialog } from '../components/EditorTextosNewDocumentDialog.jsx';
import { EditorTextosMergeFieldDialog } from '../components/EditorTextosMergeFieldDialog.jsx';
import { EditorTextosSignPdfDialog } from '../components/EditorTextosSignPdfDialog.jsx';
import { EditorTextosRecipeAssistantModal } from '../components/EditorTextosRecipeAssistantModal.jsx';
import { EditorTextosAtestadoAssistantModal } from '../components/EditorTextosAtestadoAssistantModal.jsx';
import { OASIS_BRANA_RIBBON_EVENT, registerOasisBranaRibbonItems } from './oasisBranaRibbon.js';
import { connectOasisActiveTabApi } from './oasisActiveTabBridge.js';
import { getSupportedImportFormat, getImportedDocumentName, importDocumentIntoOasis, UNIFIED_IMPORT_ACCEPT } from './oasisDocumentImport.js';
import { OasisHorizontalRuler } from './OasisHorizontalRuler.jsx';
import { findNewTextTemplate, getNewTextType } from '../models/editorTextosModalModels.js';
import { findSaveAsNameCollisions } from '../models/saveAsNameCollision.js';
import { getPatientDisplayName, resolveRecipeAssistantPatient } from '../models/recipeAssistantFlow.js';
import { hasOasisMergeSeparatorInText, joinOasisTextNodes, mergeOasisTextNodes } from '../models/recipeAssistantDraft.js';
import './oasisEditorPilot.css';

function focusDocumentStart(client) {
  const document = client.getDocument();
  const paragraph = document.sections?.[0]?.blocks?.find((block) => block.type === 'paragraph');
  const run = paragraph?.runs?.[0];
  if (paragraph?.id && run?.id) {
    const position = { paragraphId: paragraph.id, runId: run.id, offset: 0 };
    client.selection.set({ anchor: position, focus: position });
  }
  client.focus.focus();
}

function collectDiagnosticParagraphs(blocks = []) {
  const paragraphs = [];
  for (const block of blocks) {
    if (block?.type === 'paragraph') paragraphs.push(block);
    if (block?.type === 'table') {
      for (const row of block.rows || []) {
        for (const cell of row.cells || []) paragraphs.push(...collectDiagnosticParagraphs(cell.blocks || []));
      }
    }
  }
  return paragraphs;
}

function getDiagnosticStyleChain(styleId, styles = {}) {
  const chain = [];
  const seen = new Set();
  let currentId = styleId;
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    const style = styles[currentId];
    if (!style) break;
    chain.unshift({ id: style.id, name: style.name, type: style.type, basedOn: style.basedOn, textStyle: style.textStyle || null });
    currentId = style.basedOn;
  }
  return chain;
}

function createFontRuntimeDiagnostic(client, source, toolbarState) {
  const document = client?.getDocument?.();
  const selection = client?.selection?.get?.();
  const paragraphs = (document?.sections || []).flatMap((section) => collectDiagnosticParagraphs(section.blocks || []));
  const paragraph = paragraphs.find((item) => item.id === selection?.focus?.paragraphId) || null;
  const run = paragraph?.runs?.find((item) => item.id === selection?.focus?.runId) || null;
  const styles = document?.styles || {};
  const runChain = getDiagnosticStyleChain(run?.styles?.styleId, styles);
  const paragraphChain = getDiagnosticStyleChain(paragraph?.style?.styleId, styles);
  const resolvedStyle = {
    ...Object.assign({}, ...paragraphChain.map((item) => item.textStyle || {})),
    ...Object.assign({}, ...runChain.map((item) => item.textStyle || {})),
    ...(run?.styles || {}),
  };
  const requestedFamily = resolvedStyle.fontFamily || 'Calibri';
  const familyStack = requestedFamily.toLowerCase() === 'arial'
    ? 'Arial, Arimo, sans-serif'
    : `${requestedFamily}, sans-serif`;
  const weight = resolvedStyle.bold ? 700 : 400;
  const fontSize = Number(resolvedStyle.fontSize) || 14.6667;
  const canvasFontString = `${resolvedStyle.italic ? 'italic' : 'normal'} ${weight} ${fontSize}px ${familyStack}`;
  const boldButton = window.document.querySelector('.editor-textos-primary-toolbar button[aria-label="Negrito"]');
  return {
    rawRun: run ? { id: run.id, text: String(run.text || '').slice(0, 100), styles: run.styles || {} } : null,
    paragraph: paragraph ? { id: paragraph.id, style: paragraph.style || {} } : null,
    paragraphStyleChain: paragraphChain,
    characterStyleChain: runChain,
    resolvedStyle,
    rawFontWeight: run?.styles?.fontWeight ?? null,
    resolvedFontFamily: requestedFamily,
    resolvedFontStack: familyStack,
    rendererWeight: weight,
    canvasFontString,
    canvasFontNote: 'String reconstruída a partir da função do renderer Oasis; o renderer não expõe seu CanvasRenderingContext2D ao app.',
    importSource: source?.origin === 'import'
      ? 'imported'
      : source?.origin === 'new' || source?.origin === 'recipe-assistant' || source?.format === 'oasis' && !source?.legacyDocumentId
        ? 'native'
        : 'unknown',
    source,
    fontChecks: {
      arial400: window.document.fonts?.check?.('400 12px Arial') ?? 'API indisponível',
      arial700: window.document.fonts?.check?.('700 12px Arial') ?? 'API indisponível',
      arimo400: window.document.fonts?.check?.('400 12px Arimo') ?? 'API indisponível',
      arimo700: window.document.fonts?.check?.('700 12px Arimo') ?? 'API indisponível',
    },
    toolbarBoldButton: boldButton ? { active: boldButton.classList.contains('is-active'), ariaPressed: boldButton.getAttribute('aria-pressed') } : null,
    toolbarFormatState: toolbarState,
  };
}

function createFontVisualProbe() {
  const text = 'Teste Arial 123 ÁÉÍÓÚ ÇÇ';
  const samples = [
    { id: 'arial-400', label: 'Arial normal', family: 'Arial', weight: 400, stack: 'Arial, Arimo, sans-serif' },
    { id: 'arial-700', label: 'Arial bold', family: 'Arial', weight: 700, stack: 'Arial, Arimo, sans-serif' },
    { id: 'arimo-400', label: 'Arimo normal', family: 'Arimo', weight: 400, stack: 'Arimo, sans-serif' },
    { id: 'arimo-700', label: 'Arimo bold', family: 'Arimo', weight: 700, stack: 'Arimo, sans-serif' },
  ];
  const canvas = window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  return samples.map((sample) => {
    const font = `normal ${sample.weight} 16px ${sample.stack}`;
    const metrics = context ? (context.font = font, context.measureText(text)) : null;
    return {
      ...sample,
      text,
      font,
      fontsCheck: window.document.fonts?.check?.(`${sample.weight} 16px ${sample.family}`) ?? 'API indisponível',
      width: metrics?.width ?? null,
      boundingBox: metrics ? {
        ascent: metrics.actualBoundingBoxAscent ?? null,
        descent: metrics.actualBoundingBoxDescent ?? null,
      } : null,
    };
  });
}

async function detectSystemFontAudit() {
  const supported = typeof window.queryLocalFonts === 'function';
  if (!supported) return { supported: false, permission: 'unsupported' };
  try {
    const faces = await window.queryLocalFonts();
    const families = [...new Set((faces || []).map((face) => face.family).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const currentComboFamilies = ['Arial', 'Arial Black', 'Bahnschrift', 'Book Antiqua', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Franklin Gothic Medium', 'Gadugi', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'MS Sans Serif', 'MS Serif'];
    const missing = families.filter((family) => !currentComboFamilies.includes(family));
    const byFamily = (family) => faces.filter((face) => String(face.family).toLowerCase() === family.toLowerCase());
    const arial = byFamily('Arial');
    const arimo = byFamily('Arimo');
    const frutiger = byFamily('Frutiger95-UltraBlack');
    const hasStyle = (list, pattern) => list.some((face) => pattern.test(`${face.fullName || ''} ${face.style || ''}`));
    return { supported: true, permission: 'granted', faceCount: faces.length, familyCount: families.length, comboFamilyCount: currentComboFamilies.length, missingCount: missing.length, missingExamples: missing.slice(0, 20), arialFaces: arial.map(({ family, fullName, postscriptName, style }) => ({ family, fullName, postscriptName, style })), arimoFaces: arimo.map(({ family, fullName, postscriptName, style }) => ({ family, fullName, postscriptName, style })), frutigerFaces: frutiger.map(({ family, fullName, postscriptName, style }) => ({ family, fullName, postscriptName, style })), arial: { found: arial.length > 0, regular: hasStyle(arial, /regular|normal/i), bold: hasStyle(arial, /bold/i), italic: hasStyle(arial, /italic/i) }, arimo: { found: arimo.length > 0, regular: hasStyle(arimo, /regular|normal/i), bold: hasStyle(arimo, /bold/i) }, frutiger: { found: frutiger.length > 0 } };
  } catch (error) {
    return { supported: true, permission: error?.name === 'NotAllowedError' ? 'denied' : 'unknown', error: error?.name || 'queryLocalFonts failed' };
  }
}

function installCanvasFontTrace(onFont) {
  const prototype = window.CanvasRenderingContext2D?.prototype;
  if (!prototype) return () => {};
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'font');
  if (!descriptor?.set || !descriptor.get) return () => {};
  const setter = descriptor.set;
  Object.defineProperty(prototype, 'font', {
    ...descriptor,
    set(value) { onFont(String(value)); setter.call(this, value); },
  });
  return () => Object.defineProperty(prototype, 'font', descriptor);
}

function invalidateOasisFontPaint(client) {
  client?.renderer?.invalidatePage?.();
  client?.renderer?.invalidate?.();
  client?.render?.();
}

function compareAdjacentFontLines(client, actualCanvasFonts = [], toolbarState = null) {
  const document = client?.getDocument?.();
  const selection = client?.selection?.get?.();
  const paragraphs = (document?.sections || []).flatMap((section) => collectDiagnosticParagraphs(section.blocks || []));
  const currentIndex = paragraphs.findIndex((paragraph) => paragraph.id === selection?.focus?.paragraphId);
  const lines = [paragraphs[currentIndex - 1], paragraphs[currentIndex]].filter(Boolean);
  const toLine = (paragraph) => {
    const run = paragraph.runs?.find((item) => item.text?.trim()) || paragraph.runs?.[0] || null;
    const bold = run?.styles?.bold === true;
    const family = run?.styles?.fontFamily || 'Calibri';
    return { paragraphId: paragraph.id, runId: run?.id || null, text: paragraph.runs?.map((item) => item.text || '').join(''), rawRunBold: run?.styles?.bold ?? null, rawRunFontFamily: run?.styles?.fontFamily ?? null, rawRunFontSize: run?.styles?.fontSize ?? null, resolvedFontFamily: family, resolvedWeight: bold ? 700 : 400, toolbarBoldState: Boolean(toolbarState?.bold), insertionBoldState: bold, actualCanvasFont: actualCanvasFonts.filter((font) => font.includes(String(bold ? 700 : 400))).at(-1) || null };
  };
  const result = lines.map(toLine);
  const first = result[0];
  const second = result[1];
  const actualWeights = actualCanvasFonts.map((font) => Number(font.match(/(?:^|\s)(400|700)(?:\s|$)/)?.[1])).filter(Boolean);
  const caseA = first?.rawRunBold === true;
  const caseB = second?.rawRunBold === false;
  const caseC = first && second && first.rawRunBold === false && second.rawRunBold === true && actualWeights.includes(700) && actualWeights.includes(400) && actualWeights.at(-2) === 700 && actualWeights.at(-1) === 400;
  return { line1: first || null, line2: second || null, caseA, caseB, caseC: Boolean(caseC), caseD: Boolean(first && second && !caseC && actualWeights.length >= 2), firstDivergencePoint: caseA ? 'run creation/style state — line 1 nasceu Bold' : caseB ? 'run creation/style state — line 2 nasceu normal' : caseC ? 'Canvas ctx.font — pesos observados em ordem invertida' : 'não identificado automaticamente' };
}

export function OasisEditorPilot({ patientInUse = null, onRequestPatientSelection } = {}) {
  const rootRef = useRef(null);
  const hostRef = useRef(null);
  const importInputRef = useRef(null);
  const clientRef = useRef(null);
  const savedSnapshotRef = useRef(null);
  const initializedRef = useRef(false);
  const documentIdRef = useRef(null);
  const documentNameRef = useRef('Novo documento');
  const documentTypeRef = useRef('outros');
  const oasisDocumentIdRef = useRef(null);
  const pageConfigRef = useRef(DEFAULT_PAGE_CONFIG);
  const sourceRef = useRef({ format: 'oasis', legacyDocumentId: null, conversionVersion: null });
  const recipePreviewTransactionRef = useRef(null);
  const recipePreviewRequestRef = useRef(0);
  const mergeSelectionRef = useRef(null);
  const importPickerSelectionRef = useRef(null);
  const pendingImportFileRef = useRef(null);
  const pendingNewDocumentRef = useRef(false);
  const pendingNewAfterSaveAsRef = useRef(false);
  const importingRef = useRef(false);
  const [openItems, setOpenItems] = useState([]);
  const [openVisible, setOpenVisible] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [openError, setOpenError] = useState('');
  const [saveAsVisible, setSaveAsVisible] = useState(false);
  const [saveAsCollision, setSaveAsCollision] = useState(null);
  const [saveAsLoading, setSaveAsLoading] = useState(false);
  const [saveAsError, setSaveAsError] = useState('');
  const [newDocumentVisible, setNewDocumentVisible] = useState(false);
  const [recipeAssistantVisible, setRecipeAssistantVisible] = useState(false);
  const [recipeAssistantPatient, setRecipeAssistantPatient] = useState(null);
  const [atestadoAssistantVisible, setAtestadoAssistantVisible] = useState(false);
  const [atestadoAssistantPatient, setAtestadoAssistantPatient] = useState(null);
  const [unsavedVisible, setUnsavedVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [mergeVisible, setMergeVisible] = useState(false);
  const [signVisible, setSignVisible] = useState(false);
  const [signLoading, setSignLoading] = useState(false);
  const [commandError, setCommandError] = useState('');
  const [compatibilityStatus, setCompatibilityStatus] = useState(null);
  const [tabsApiReady, setTabsApiReady] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);

  const handleChange = useCallback((state) => {
    if (!initializedRef.current) return;
    const document = state?.document ?? clientRef.current?.getDocument?.();
    if (!document) return;
    const snapshot = getPersistableDocumentSnapshot(document);
    if (oasisDocumentIdRef.current && document.id !== oasisDocumentIdRef.current) {
      oasisDocumentIdRef.current = document.id;
      documentIdRef.current = null;
      documentNameRef.current = 'Novo documento';
      documentTypeRef.current = 'outros';
      sourceRef.current = { format: 'oasis', legacyDocumentId: null, conversionVersion: null };
      setCompatibilityStatus(null);
      clientRef.current?.ui?.setReadOnly(false);
      savedSnapshotRef.current = snapshot;
      clientRef.current?.document.markClean();
      dirtyRef.current = false;
      setDirty(false);
      return;
    }
    dirtyRef.current = snapshot !== savedSnapshotRef.current;
    setDirty(dirtyRef.current);
  }, []);

  const saveOasis = useCallback(async (name = '', { forceNew = false, replaceModel = null } = {}) => {
    const client = clientRef.current;
    if (!client || !initializedRef.current) return false;
    if (sourceRef.current.legacyDocumentId && !sourceRef.current.conversionVersion) {
      setCommandError('Este formato está aberto somente para diagnóstico e não pode ser salvo como conteúdo Oasis.');
      return false;
    }
    const document = client.getDocument();
    const envelope = encodeOasisEnvelope(document, sourceRef.current);
    const payload = { nome: documentIdRef.current && !forceNew && !replaceModel ? undefined : name.trim(), conteudo: JSON.stringify(envelope), conteudo_formato: 'oasis_json', tipo_modelo: documentTypeRef.current || 'outros', extensao: '.txt', pagina_config: pageConfigRef.current };
    if (!payload.nome && (!documentIdRef.current || forceNew || replaceModel)) return false;
    const dto = replaceModel
      ? await editorTextosApi.saveAsDocument(payload, Number(replaceModel.id))
      : forceNew
        ? await editorTextosApi.saveAsDocument(payload)
        : documentIdRef.current
          ? await editorTextosApi.updateDocument(documentIdRef.current, { ...payload, nome: undefined })
          : await editorTextosApi.createDocument(payload);
    documentIdRef.current = dto?.id ?? dto?.modelo_id ?? documentIdRef.current;
    documentNameRef.current = dto?.nome || name.trim() || documentNameRef.current;
    documentTypeRef.current = String(dto?.tipo_modelo || documentTypeRef.current || 'outros');
    if (sourceRef.current.legacyDocumentId) {
      setCompatibilityStatus({ kind: 'converted', message: 'Cópia Oasis salva. O documento legado original foi preservado.' });
    }
    oasisDocumentIdRef.current = client.getDocument()?.id ?? oasisDocumentIdRef.current;
    savedSnapshotRef.current = getPersistableDocumentSnapshot(client.getDocument());
    dirtyRef.current = false;
    setDirty(false);
    setSaveAsVisible(false);
    return true;
  }, []);

  const importSelectedFile = useCallback(async (file) => {
    const client = clientRef.current;
    if (!file || !client || importingRef.current) return false;
    importingRef.current = true;
    setImportLoading(true);
    setCommandError('');
    try {
      const imported = await importDocumentIntoOasis({ file, client, createDocumentFactory: createDocument, createParagraphFactory: createParagraph, createTableFactory: createTable, convertRtf: editorTextosApi.convertRtfImport });
      documentIdRef.current = null;
      documentNameRef.current = imported.suggestedName || getImportedDocumentName(file.name);
      documentTypeRef.current = 'outros';
      oasisDocumentIdRef.current = imported.document?.id ?? client.getDocument()?.id ?? null;
      pageConfigRef.current = normalizePageConfig(imported.pageConfig || DEFAULT_PAGE_CONFIG, { minimumPageMm: 1 });
      sourceRef.current = {
        format: imported.format,
        origin: 'import',
        sourceExtension: imported.sourceExtension,
        detectedContentFormat: imported.detectedContentFormat,
        detectionConfidence: imported.detectionConfidence,
        legacyDocumentId: null,
        conversionVersion: null,
      };
      client.ui.setReadOnly(false);
      savedSnapshotRef.current = null;
      dirtyRef.current = true;
      setDirty(true);
      setCompatibilityStatus({
        // RTF/MOD conversion warnings stay in state for diagnostics, but the
        // success-only compatibility panel is intentionally not shown in the editor.
        kind: imported.format === 'rtf' ? 'imported-rtf' : 'converted',
        message: `Documento ${imported.format.toUpperCase()} importado. Ainda não salvo no Brana.`,
        warnings: [...(imported.warnings || []), ...(imported.textEncodingWarning ? [imported.textEncodingWarning] : [])],
      });
      setOpenVisible(false);
      return true;
    } catch (error) {
      setCommandError(error?.message || 'Não foi possível importar o documento.');
      return false;
    } finally {
      importingRef.current = false;
      setImportLoading(false);
    }
  }, []);

  const requestImportFilePicker = useCallback(() => {
    if (importLoading) return;
    setCommandError('');
    const selection = clientRef.current?.selection.get();
    importPickerSelectionRef.current = selection ? { anchor: { ...selection.anchor }, focus: { ...selection.focus } } : null;
    importInputRef.current?.click();
  }, [importLoading]);

  const restoreImportPickerSelection = useCallback(() => {
    const client = clientRef.current;
    if (!client || !importPickerSelectionRef.current) return;
    try {
      client.selection.set(importPickerSelectionRef.current);
      client.focus.focus();
    } catch {
      // The current document may have been replaced or disposed in the meantime.
    }
    importPickerSelectionRef.current = null;
  }, []);

  const handleImportFileSelected = useCallback((event) => {
    const file = event.currentTarget.files?.[0] || null;
    event.currentTarget.value = '';
    if (!file) {
      restoreImportPickerSelection();
      return;
    }
    if (!getSupportedImportFormat(file.name)) {
      setCommandError('Formato não suportado. Nesta versão podem ser importados arquivos DOCX, TXT, RTF e MOD.');
      restoreImportPickerSelection();
      return;
    }
    pendingImportFileRef.current = file;
    if (dirtyRef.current) {
      setUnsavedVisible(true);
      return;
    }
    pendingImportFileRef.current = null;
    void importSelectedFile(file);
  }, [importSelectedFile, restoreImportPickerSelection]);

  const cancelImportAfterUnsavedPrompt = useCallback(() => {
    pendingImportFileRef.current = null;
    pendingNewDocumentRef.current = false;
    setUnsavedVisible(false);
    restoreImportPickerSelection();
  }, [restoreImportPickerSelection]);

  const discardAndImport = useCallback(() => {
    const file = pendingImportFileRef.current;
    pendingImportFileRef.current = null;
    const continueToNew = pendingNewDocumentRef.current;
    pendingNewDocumentRef.current = false;
    setUnsavedVisible(false);
    if (file) void importSelectedFile(file);
    else if (continueToNew) setNewDocumentVisible(true);
  }, [importSelectedFile]);

  const saveAndImport = useCallback(async () => {
    const file = pendingImportFileRef.current;
    const continueToNew = pendingNewDocumentRef.current;
    if (!file && !continueToNew) return;
    if (!documentIdRef.current) {
      setUnsavedVisible(false);
      pendingNewAfterSaveAsRef.current = continueToNew;
      setSaveAsVisible(true);
      return;
    }
    const saved = await saveOasis();
    if (!saved) return;
    pendingImportFileRef.current = null;
    pendingNewDocumentRef.current = false;
    setUnsavedVisible(false);
    if (file) await importSelectedFile(file);
    else if (continueToNew) setNewDocumentVisible(true);
  }, [importSelectedFile, saveOasis]);

  const saveAsOasis = useCallback(async (name, replaceModel = null) => {
    const normalizedName = String(name || '').trim();
    if (!normalizedName || saveAsLoading) return false;
    setSaveAsLoading(true);
    setSaveAsError('');
    try {
      if (!replaceModel) {
        const response = await editorTextosApi.listDocuments();
        const collisions = findSaveAsNameCollisions(response?.itens, normalizedName);
        if (collisions.length) {
          setSaveAsCollision({ name: normalizedName, models: collisions });
          return false;
        }
      }
      const saved = await saveOasis(normalizedName, { forceNew: true, replaceModel });
      if (!saved) return false;
      setSaveAsCollision(null);
      const file = pendingImportFileRef.current;
      const continueToNew = pendingNewAfterSaveAsRef.current;
      if (file) {
        pendingImportFileRef.current = null;
        await importSelectedFile(file);
      }
      if (continueToNew) {
        pendingNewAfterSaveAsRef.current = false;
        pendingNewDocumentRef.current = false;
        setNewDocumentVisible(true);
      }
      return true;
    } catch (error) {
      if (error?.status === 409 && !replaceModel) {
        try {
          const response = await editorTextosApi.listDocuments();
          const collisions = findSaveAsNameCollisions(response?.itens, normalizedName);
          if (collisions.length) {
            setSaveAsCollision({ name: normalizedName, models: collisions });
            return false;
          }
        } catch { /* manter a mensagem original se a atualização do catálogo falhar */ }
      }
      setSaveAsError(error?.message || 'Não foi possível salvar o modelo.');
      return false;
    } finally {
      setSaveAsLoading(false);
    }
  }, [importSelectedFile, saveAsLoading, saveOasis]);

  const openOasis = useCallback(async (id) => {
    if (!id) return false;
    setOpenError('');
    try {
      const dto = await editorTextosApi.getDocument(id);
      const client = clientRef.current;
      if (!client) return false;
      const detection = detectEditorDocumentFormat(dto);
      let document;
      let compatibility = null;
      if (detection.format === EDITOR_DOCUMENT_FORMATS.OASIS) {
        const envelope = decodeOasisEnvelope(dto?.conteudo);
        document = envelope.document;
        sourceRef.current = envelope.source || { format: 'oasis', legacyDocumentId: null, conversionVersion: null };
      } else if (detection.format === EDITOR_DOCUMENT_FORMATS.HTML) {
        const converted = convertLegacyHtmlToOasis(detection.content, { createDocument, createParagraph, title: dto?.nome_exibicao || dto?.nome || 'Documento legado' });
        document = converted.document;
        sourceRef.current = { format: detection.sourceFormat, legacyDocumentId: Number(dto?.id ?? dto?.modelo_id) || null, conversionVersion: LEGACY_CONVERSION_VERSION };
        compatibility = {
          kind: 'converted',
          message: converted.fidelity === 'partial' ? 'Documento aberto em modo de compatibilidade. O texto foi carregado; alguns elementos visuais podem não ter sido convertidos.' : 'Documento aberto em modo de compatibilidade.',
          warnings: converted.warnings,
        };
      } else if (detection.format === EDITOR_DOCUMENT_FORMATS.PLAIN_TEXT) {
        const converted = convertPlainTextToOasis(detection.content, { createDocument, createParagraph, title: dto?.nome_exibicao || dto?.nome || 'Documento de texto' });
        document = converted.document;
        sourceRef.current = { format: detection.sourceFormat, legacyDocumentId: Number(dto?.id ?? dto?.modelo_id) || null, conversionVersion: LEGACY_CONVERSION_VERSION };
        compatibility = { kind: 'converted', message: 'Texto legado aberto em modo de compatibilidade. O arquivo original permanece protegido.', warnings: [] };
      } else {
        const diagnostic = createUnsupportedFormatDiagnostic(detection);
        document = createOasisNewDocument();
        sourceRef.current = { format: diagnostic.format, legacyDocumentId: Number(dto?.id ?? dto?.modelo_id) || null, conversionVersion: null };
        compatibility = { kind: 'diagnostic', ...diagnostic };
      }
      documentIdRef.current = detection.format === EDITOR_DOCUMENT_FORMATS.OASIS ? (dto?.id ?? dto?.modelo_id ?? null) : null;
      documentTypeRef.current = String(dto?.tipo_modelo || 'outros');
      documentNameRef.current = dto?.nome_exibicao || dto?.nome || 'Documento Oasis';
      pageConfigRef.current = normalizePageConfig(dto?.pagina_config || DEFAULT_PAGE_CONFIG);
      oasisDocumentIdRef.current = document.id;
      client.document.load(document);
      client.ui.setReadOnly(detection.format === EDITOR_DOCUMENT_FORMATS.UNKNOWN || detection.format === EDITOR_DOCUMENT_FORMATS.RTF);
      client.document.markClean();
      if (detection.format !== EDITOR_DOCUMENT_FORMATS.UNKNOWN && detection.format !== EDITOR_DOCUMENT_FORMATS.RTF) focusDocumentStart(client);
      savedSnapshotRef.current = getPersistableDocumentSnapshot(client.getDocument());
      dirtyRef.current = false;
      setDirty(false);
      setCompatibilityStatus(compatibility);
      setOpenVisible(false);
      return true;
    } catch (error) {
      setOpenError(error.message || 'Não foi possível abrir o documento.');
      return false;
    }
  }, []);

  const createNewOasisByType = useCallback(async (typeKey) => {
    const client = clientRef.current;
    const type = getNewTextType(typeKey);
    if (!client || !type) return false;

    if (type.value === 'receita') {
      let selectedPatient = patientInUse;
      try {
        selectedPatient = await resolveRecipeAssistantPatient(patientInUse, onRequestPatientSelection);
      } catch (error) {
        setCommandError(error?.message || 'Não foi possível selecionar o paciente.');
        return false;
      }
      setNewDocumentVisible(false);
      if (!selectedPatient) return false;
      setRecipeAssistantPatient(selectedPatient);
      setRecipeAssistantVisible(true);
      return true;
    }

    if (type.value === 'atestado') {
      let selectedPatient = patientInUse;
      try {
        selectedPatient = await resolveRecipeAssistantPatient(patientInUse, onRequestPatientSelection);
      } catch (error) {
        setCommandError(error?.message || 'Não foi possível selecionar o paciente.');
        return false;
      }
      setNewDocumentVisible(false);
      if (!selectedPatient) return false;
      setAtestadoAssistantPatient(selectedPatient);
      setAtestadoAssistantVisible(true);
      return true;
    }

    let document = createOasisNewDocument(`Novo documento — ${type.label}`);
    let compatibility = null;
    let pageConfig = DEFAULT_PAGE_CONFIG;
    if (type.candidates.length) {
      try {
        const response = await editorTextosApi.listDocuments();
        const candidate = findNewTextTemplate(response?.itens, type);
        if (candidate?.id != null) {
          const dto = await editorTextosApi.getDocument(candidate.id);
          const detection = detectEditorDocumentFormat(dto);
          if (detection.format === EDITOR_DOCUMENT_FORMATS.HTML) {
            const converted = convertLegacyHtmlToOasis(detection.content, { createDocument, createParagraph, title: `Novo documento — ${type.label}` });
            document = converted.document;
            pageConfig = normalizePageConfig(dto?.pagina_config || DEFAULT_PAGE_CONFIG);
            compatibility = {
              kind: 'converted',
              message: `Novo documento ${type.label} criado a partir do modelo padrão “${candidate.nome_exibicao || candidate.nome || type.candidates[0]}”. O modelo original não foi alterado.`,
              warnings: converted.warnings,
            };
          } else if (detection.format === EDITOR_DOCUMENT_FORMATS.PLAIN_TEXT) {
            const converted = convertPlainTextToOasis(detection.content, { createDocument, createParagraph, title: `Novo documento — ${type.label}` });
            document = converted.document;
            pageConfig = normalizePageConfig(dto?.pagina_config || DEFAULT_PAGE_CONFIG);
            compatibility = {
              kind: 'converted',
              message: `Novo documento ${type.label} criado a partir do modelo padrão “${candidate.nome_exibicao || candidate.nome || type.candidates[0]}”. O modelo original não foi alterado.`,
              warnings: [],
            };
          } else {
            compatibility = {
              kind: 'converted',
              message: `O modelo padrão de ${type.label} está em formato sem conversão segura; foi criado um documento Oasis vazio do tipo selecionado. O modelo original não foi alterado.`,
              warnings: [],
            };
          }
        }
      } catch (error) {
        compatibility = {
          kind: 'converted',
          message: `Não foi possível carregar o modelo padrão de ${type.label}; foi criado um documento Oasis vazio do tipo selecionado.`,
          warnings: [error?.message || 'Falha ao consultar o modelo padrão.'],
        };
      }
    }

    try {
      client.ui.setReadOnly(false);
      client.document.set(document);
      client.history.clear();
      documentIdRef.current = null;
      documentNameRef.current = `Novo documento — ${type.label}`;
      documentTypeRef.current = type.type;
      oasisDocumentIdRef.current = client.getDocument()?.id ?? document.id;
      pageConfigRef.current = pageConfig;
      sourceRef.current = { format: 'oasis', origin: 'new', legacyDocumentId: null, conversionVersion: null };
      savedSnapshotRef.current = null;
      dirtyRef.current = true;
      setDirty(true);
      setCompatibilityStatus(compatibility);
      setOpenVisible(false);
      setNewDocumentVisible(false);
      client.focus.focus();
      return true;
    } catch (error) {
      setCommandError(error?.message || 'Não foi possível criar o novo documento.');
      return false;
    }
  }, [onRequestPatientSelection, patientInUse]);

  const prepareRecipeDocument = useCallback(async ({ items, body, patient, surgeonId, modelId }) => {
    const client = clientRef.current;
    const patientId = Number(patient?.id ?? patient?.patientId ?? patient?.nro_pac ?? 0);
    if (!client || !patientId || !Array.isArray(items) || !items.length || !String(body || '').trim()) {
      throw new Error('A receita exige paciente e ao menos um medicamento incluído.');
    }

    // Prepare and merge the selected template off-editor. Any error leaves the
    // document currently open in Oasis untouched.
    let document;
    let pageConfig = pageConfigRef.current || DEFAULT_PAGE_CONFIG;
    if (Number(modelId) > 0) {
      const dto = await editorTextosApi.getDocument(Number(modelId));
      const detection = detectEditorDocumentFormat(dto);
      pageConfig = normalizePageConfig(dto?.pagina_config || DEFAULT_PAGE_CONFIG);
      if (detection.format === EDITOR_DOCUMENT_FORMATS.OASIS) {
      document = decodeOasisEnvelope(dto?.conteudo).document;
    } else if (detection.format === EDITOR_DOCUMENT_FORMATS.HTML || detection.format === EDITOR_DOCUMENT_FORMATS.RTF) {
      let html = detection.content;
      let rtfPageConfig = null;
      const isRtfHtml = String(dto?.conteudo_formato_detectado || '').toLowerCase() === 'rtf';
      if (detection.format === EDITOR_DOCUMENT_FORMATS.RTF) {
        const convertedRtf = await editorTextosApi.convertRtfImport(detection.content);
        if (!convertedRtf || typeof convertedRtf.html !== 'string' || convertedRtf.persisted !== false) {
          throw new Error('O serviço não confirmou a conversão temporária segura do modelo RTF.');
        }
        html = convertedRtf.html;
        rtfPageConfig = convertedRtf.page_config;
      }
      const bodyTokenPresent = html.includes('<<Receita.Corpo>>') || /&lt;&lt;\s*Receita\.Corpo\s*&gt;&gt;/i.test(html);
      if (!bodyTokenPresent) {
        const escapedBody = String(body).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n?/g, '\n').replace(/\n/g, '<br>');
        html = `${html}<p>${escapedBody}</p>`;
      }
      const merged = await editorTextosApi.mergeEditorTextContent({ content: html, mode: 'html', patientId, surgeonId: Number(surgeonId) || null, extras: { 'Receita.Corpo': body }, preserveUnresolved: true });
      if (typeof merged?.conteudo !== 'string') throw new Error('O serviço de mesclagem não retornou o conteúdo da receita.');
      const converted = (detection.format === EDITOR_DOCUMENT_FORMATS.RTF || isRtfHtml)
        ? convertRtfHtmlToOasis(merged.conteudo, { createDocument, createParagraph, createTable, title: 'Receita' })
        : convertLegacyHtmlToOasis(merged.conteudo, { createDocument, createParagraph, title: 'Receita' });
      document = converted.document;
      pageConfig = normalizePageConfig(rtfPageConfig || dto?.pagina_config || DEFAULT_PAGE_CONFIG, { minimumPageMm: 1 });
    } else if (detection.format === EDITOR_DOCUMENT_FORMATS.PLAIN_TEXT) {
      const text = detection.content.includes('<<Receita.Corpo>>') ? detection.content : `${detection.content}${detection.content ? '\n' : ''}${body}`;
      const merged = await editorTextosApi.mergeEditorTextContent({ content: text, mode: 'text', patientId, surgeonId: Number(surgeonId) || null, extras: { 'Receita.Corpo': body }, preserveUnresolved: true });
      if (typeof merged?.conteudo !== 'string') throw new Error('O serviço de mesclagem não retornou o conteúdo da receita.');
      document = convertPlainTextToOasis(merged.conteudo, { createDocument, createParagraph, title: 'Receita' }).document;
    } else {
      throw new Error(`O modelo selecionado não possui conteúdo importável com segurança (${detection.reason}).`);
    }

    if (detection.format === EDITOR_DOCUMENT_FORMATS.OASIS) {
      const sourceText = joinOasisTextNodes(document);
      if (sourceText.includes('<<')) {
        const merged = await editorTextosApi.mergeEditorTextContent({ content: sourceText, mode: 'text', patientId, surgeonId: Number(surgeonId), extras: { 'Receita.Corpo': body }, preserveUnresolved: true });
        if (typeof merged?.conteudo !== 'string') throw new Error('O serviço de mesclagem não retornou o conteúdo da receita.');
        document = mergeOasisTextNodes(document, merged.conteudo);
      }
      if (!sourceText.includes('<<Receita.Corpo>>')) {
        const blocks = document.sections?.[0]?.blocks;
        if (!Array.isArray(blocks)) throw new Error('O modelo Oasis não possui uma seção editável para inserir a receita.');
        blocks.push(createParagraph(body));
      }
      // The sentinel is structural only and must never become visible content.
      if (hasOasisMergeSeparatorInText(document)) throw new Error('A mesclagem do modelo Oasis deixou um separador interno no documento.');
      }
    } else {
      // Legacy enables Finalizar with included items even if no receituário is
      // configured; in that case it writes the recipe body into a blank document.
      document = createOasisNewDocument('Receita');
      document.sections[0].blocks = [createParagraph(body)];
    }

    if (!document?.sections?.length) throw new Error('A conversão do modelo não produziu um documento Oasis válido.');
    if (!document?.sections?.length) throw new Error('A conversão do modelo não produziu um documento Oasis válido.');
    return { document, pageConfig };
  }, []);

  const recipePreviewKey = ({ items, patient, surgeonId, modelId }) => JSON.stringify({
    items,
    patientId: Number(patient?.id ?? patient?.patientId ?? patient?.nro_pac ?? 0),
    surgeonId: Number(surgeonId) || null,
    modelId: Number(modelId) || null,
  });

  const installRecipePreview = useCallback(async (payload) => {
    const client = clientRef.current;
    if (!client) throw new Error('O editor Oasis não está disponível.');
    const transaction = recipePreviewTransactionRef.current;
    const requestId = ++recipePreviewRequestRef.current;
    if (transaction) transaction.previewKey = null;
    else {
      recipePreviewTransactionRef.current = {
        snapshot: {
          document: structuredClone(client.getDocument()),
          documentId: documentIdRef.current,
          documentName: documentNameRef.current,
          documentType: documentTypeRef.current,
          oasisDocumentId: oasisDocumentIdRef.current,
          pageConfig: structuredClone(pageConfigRef.current),
          source: structuredClone(sourceRef.current),
          savedSnapshot: savedSnapshotRef.current,
          dirty: dirtyRef.current,
          readOnly: Boolean(sourceRef.current.legacyDocumentId && !sourceRef.current.conversionVersion),
          compatibilityStatus,
        },
        previewKey: null,
      };
    }

    // Complete all server-side merge/conversion work before replacing the live
    // document, so a failed attempt preserves both the original and last preview.
    const { document, pageConfig } = await prepareRecipeDocument(payload);
    if (requestId !== recipePreviewRequestRef.current) return false;
    documentIdRef.current = null;
    documentNameRef.current = `Receita — ${getPatientDisplayName(payload.patient) || 'Paciente'}`;
    documentTypeRef.current = 'outros';
    oasisDocumentIdRef.current = document.id;
    pageConfigRef.current = pageConfig;
    sourceRef.current = { format: 'oasis', origin: 'recipe-assistant', legacyDocumentId: null, conversionVersion: null };
    savedSnapshotRef.current = null;
    setCompatibilityStatus(null);
    client.ui.setReadOnly(false);
    client.document.set(document);
    client.history.clear();
    client.focus.focus();
    dirtyRef.current = true;
    setDirty(true);
    recipePreviewTransactionRef.current.previewKey = recipePreviewKey(payload);
    setCommandError('');
    return true;
  }, [compatibilityStatus, prepareRecipeDocument]);

  const cancelRecipeAssistant = useCallback(() => {
    const transaction = recipePreviewTransactionRef.current;
    recipePreviewRequestRef.current += 1;
    if (transaction?.snapshot && clientRef.current) {
      const { snapshot } = transaction;
      documentIdRef.current = snapshot.documentId;
      documentNameRef.current = snapshot.documentName;
      documentTypeRef.current = snapshot.documentType;
      oasisDocumentIdRef.current = snapshot.oasisDocumentId;
      pageConfigRef.current = snapshot.pageConfig;
      sourceRef.current = snapshot.source;
      savedSnapshotRef.current = snapshot.savedSnapshot;
      clientRef.current.ui.setReadOnly(snapshot.readOnly);
      clientRef.current.document.set(snapshot.document);
      clientRef.current.history.clear();
      clientRef.current.focus.focus();
      dirtyRef.current = snapshot.dirty;
      setDirty(snapshot.dirty);
      setCompatibilityStatus(snapshot.compatibilityStatus);
    }
    recipePreviewTransactionRef.current = null;
    setRecipeAssistantVisible(false);
    setRecipeAssistantPatient(null);
  }, []);

  const finalizeRecipe = useCallback(async (payload) => {
    const transaction = recipePreviewTransactionRef.current;
    if (transaction?.previewKey === recipePreviewKey(payload)) {
      recipePreviewTransactionRef.current = null;
      setRecipeAssistantVisible(false);
      setRecipeAssistantPatient(null);
      clientRef.current?.focus.focus();
      return true;
    }
    const completed = await installRecipePreview(payload);
    if (!completed) return false;
    recipePreviewTransactionRef.current = null;
    setRecipeAssistantVisible(false);
    setRecipeAssistantPatient(null);
    return true;
  }, [installRecipePreview]);

  const requestNewOasisDocument = useCallback(() => {
    if (sourceRef.current.legacyDocumentId && !sourceRef.current.conversionVersion) {
      setCommandError('Este documento está em diagnóstico somente leitura. Abra um documento Oasis ou crie uma cópia antes de iniciar outro.');
      return;
    }
    setCommandError('');
    if (dirtyRef.current) {
      pendingNewDocumentRef.current = true;
      setUnsavedVisible(true);
      return;
    }
    setNewDocumentVisible(true);
  }, []);

  const showOpenOasis = useCallback(async () => {
    setOpenError('');
    setOpenLoading(true);
    try {
      const response = await editorTextosApi.listDocuments();
      setOpenItems(Array.isArray(response?.itens) ? response.itens : []);
      setOpenVisible(true);
    } catch (error) {
      setOpenError(error.message);
    } finally {
      setOpenLoading(false);
    }
  }, []);

  const renameOasisModel = useCallback(async (item, name) => {
    const result = await renameEditorTextModel(item, name);
    setOpenItems(result.items);
    return true;
  }, []);

  const deleteOasisModel = useCallback(async (item) => {
    const id = await deleteEditorTextModel(item);
    setOpenItems((current) => current.filter((entry) => Number(entry.id) !== id));
    if (Number(documentIdRef.current) === id) {
      documentIdRef.current = null;
      savedSnapshotRef.current = null;
      dirtyRef.current = true;
      setDirty(true);
    }
    return true;
  }, []);

  const showOasisProperties = useCallback((item) => {
    window.alert(`Propriedades do modelo\n\nNome: ${item?.nome_exibicao || item?.nome || '-'}\nArquivo: ${item?.nome_arquivo || '-'}\nTipo: ${item?.tipo_modelo || '-'}\nOrigem: ${item?.sistema ? 'Base' : 'Clínica'}`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};
    let unregisterRibbonItems = () => {};
    let disconnectActiveTabs = () => {};
    let client;

    const mount = async () => {
      client = createOasisEditor(hostRef.current, { ui: { shell: 'document', locale: 'pt-BR' } });
      clientRef.current = client;
      await client.ready;
      if (cancelled) return;
      client.document.load(createOasisNewDocument());
      documentIdRef.current = null;
      documentNameRef.current = 'Novo documento';
      documentTypeRef.current = 'outros';
      oasisDocumentIdRef.current = client.getDocument()?.id ?? null;
      pageConfigRef.current = DEFAULT_PAGE_CONFIG;
      sourceRef.current = { format: 'oasis', legacyDocumentId: null, conversionVersion: null };
      setCompatibilityStatus(null);
      client.ui.setReadOnly(false);
      client.document.markClean();
      savedSnapshotRef.current = getPersistableDocumentSnapshot(client.getDocument());
      initializedRef.current = true;
      setDirty(false);
      unregisterRibbonItems = registerOasisBranaRibbonItems(client);
      disconnectActiveTabs = connectOasisActiveTabApi(client) || (() => {});
      setTabsApiReady(Boolean(client.ui?.ribbon?.getActiveTab && client.ui?.ribbon?.setActiveTab && client.ui?.ribbon?.onActiveTabChange));
      const unsubscribeChange = client.on('change', (state) => {
        handleChange(state);
      });
      unsubscribe = () => {
        unsubscribeChange();
      };
    };

    mount();
    return () => {
      cancelled = true;
      initializedRef.current = false;
      setTabsApiReady(false);
      savedSnapshotRef.current = null;
      unsubscribe();
      disconnectActiveTabs();
      unregisterRibbonItems();
      client?.dispose?.();
      clientRef.current = null;
      documentIdRef.current = null;
      oasisDocumentIdRef.current = null;
    };
  }, [handleChange]);

  useEffect(() => {
    const onAction = (event) => {
      if (event.detail?.action === 'salvar') {
        if (documentIdRef.current) void saveOasis();
        else setSaveAsVisible(true);
      }
      if (event.detail?.action === 'salvar-como') {
        if (sourceRef.current.legacyDocumentId && !sourceRef.current.conversionVersion) {
          setCommandError('Este documento está em diagnóstico somente leitura; Salvar como está bloqueado nesta fase.');
          return;
        }
        setSaveAsError('');
        setSaveAsVisible(true);
      }
      if (event.detail?.action === 'abrir') void showOpenOasis();
      if (event.detail?.action === 'novo-documento') requestNewOasisDocument();
    };
    const onRibbonCommand = (event) => {
      const action = event.detail?.action;
      if (action === 'save') window.dispatchEvent(new CustomEvent('brana-editor-textos-action', { detail: { action: 'salvar' } }));
      if (action === 'save-as') window.dispatchEvent(new CustomEvent('brana-editor-textos-action', { detail: { action: 'salvar-como' } }));
      if (action === 'open') void showOpenOasis();
      if (action === 'new-document') requestNewOasisDocument();
      if (action === 'import-document') requestImportFilePicker();
      if (action === 'sign-pdf') { setCommandError(''); setSignVisible(true); }
      if (action === 'merge-field') {
        const selection = clientRef.current?.selection.get();
        mergeSelectionRef.current = selection ? { anchor: { ...selection.anchor }, focus: { ...selection.focus } } : null;
        setCommandError('');
        setMergeVisible(true);
      }
    };
    window.addEventListener('brana-editor-textos-action', onAction);
    window.addEventListener(OASIS_BRANA_RIBBON_EVENT, onRibbonCommand);
    return () => {
      window.removeEventListener('brana-editor-textos-action', onAction);
      window.removeEventListener(OASIS_BRANA_RIBBON_EVENT, onRibbonCommand);
    };
  }, [requestImportFilePicker, requestNewOasisDocument, showOpenOasis, saveOasis]);

  const insertMergeField = useCallback(({ category, field }) => {
    const client = clientRef.current;
    const token = String(field?.token || '').trim();
    if (!client || !token) {
      setCommandError('O campo selecionado não possui um token de origem válido.');
      return;
    }
    try {
      if (mergeSelectionRef.current) client.selection.set(mergeSelectionRef.current);
      client.commands.execute('insertText', token);
      client.focus.focus();
      setMergeVisible(false);
      setCommandError('');
    } catch (error) {
      setCommandError(error.message || `Não foi possível inserir o campo ${category || ''}.`);
    }
  }, []);

  const signCurrentDocument = useCallback(async ({ certificate, password }) => {
    const client = clientRef.current;
    if (!client) return;
    setSignLoading(true);
    setCommandError('');
    try {
      const name = documentNameRef.current || 'Documento';
      const baseName = name.replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '_').trim() || 'Documento';
      const pdfFilename = `${baseName}.pdf`;
      const exported = await client.io.export({ format: 'pdf', filename: pdfFilename });
      if (!exported?.ok || !exported.value?.blob) throw new Error(exported?.error?.message || 'Não foi possível gerar o PDF do Oasis.');
      const signed = await editorTextosApi.signPdf({ pdf: exported.value.blob, pdfFilename, certificate, password, documentName: name });
      const url = URL.createObjectURL(signed.blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = signed.filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSignVisible(false);
    } catch (error) {
      setCommandError(error.message || 'Não foi possível assinar o PDF.');
    } finally {
      setSignLoading(false);
    }
  }, []);

  return <section ref={rootRef} className={`editor-textos-oasis${tabsApiReady ? ' editor-textos-oasis--tabs-api-ready' : ''}${isDirty ? ' editor-textos-oasis--dirty' : ''}`}>
    <div ref={hostRef} className="editor-textos-oasis__surface" />
    <input ref={importInputRef} type="file" accept={UNIFIED_IMPORT_ACCEPT} hidden aria-label="Importar documento" onChange={handleImportFileSelected} onCancel={restoreImportPickerSelection} />
    {compatibilityStatus?.kind === 'converted' && <div className="editor-textos-oasis__compatibility" role="status"><strong>{compatibilityStatus.message}</strong>{compatibilityStatus.warnings?.length > 0 && <ul>{compatibilityStatus.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}</div>}
    {compatibilityStatus?.kind === 'diagnostic' && <section className="editor-textos-oasis__compatibility" role="status" aria-label="Diagnóstico de formato"><strong>Documento em diagnóstico — somente leitura</strong>{compatibilityStatus.name && <div>Nome: {compatibilityStatus.name}</div>}<div>Extensão: {compatibilityStatus.extension || compatibilityStatus.format} · Formato detectado: {compatibilityStatus.format}</div><div>Tamanho: {Number(compatibilityStatus.size || 0).toLocaleString('pt-BR')} bytes · Arquivo físico: {compatibilityStatus.fileExists === false ? 'ausente' : 'presente'}</div><div>Motivo: {compatibilityStatus.reason}</div>{compatibilityStatus.preview && <details><summary>Visualizar prévia textual segura (somente leitura)</summary><pre>{compatibilityStatus.preview}{compatibilityStatus.truncated ? '\n… prévia limitada a 12.000 caracteres' : ''}</pre></details>}</section>}
    {isDirty && <span className="editor-textos-oasis__dirty-announcement" role="status" aria-live="polite">Documento não salvo</span>}
    <OasisHorizontalRuler client={clientRef.current} rootRef={rootRef} hostRef={hostRef} />
    {commandError && <div role="alert" className="editor-textos-oasis__command-error">{commandError}</div>}
    {saveAsVisible && <EditorTextosSaveAsDialog initialName={documentNameRef.current} error={saveAsError} loading={saveAsLoading} onClose={() => { setSaveAsVisible(false); setSaveAsCollision(null); setSaveAsError(''); pendingImportFileRef.current = null; pendingNewDocumentRef.current = false; pendingNewAfterSaveAsRef.current = false; }} onSave={saveAsOasis} />}
    {saveAsCollision && <EditorTextosNameCollisionDialog name={saveAsCollision.name} models={saveAsCollision.models} loading={saveAsLoading} onReplace={(model) => void saveAsOasis(saveAsCollision.name, model)} onChooseAnother={() => setSaveAsCollision(null)} onCancel={() => { setSaveAsCollision(null); setSaveAsVisible(false); setSaveAsError(''); pendingImportFileRef.current = null; pendingNewDocumentRef.current = false; pendingNewAfterSaveAsRef.current = false; }} />}
    {unsavedVisible && <EditorTextosUnsavedChangesDialog open saving={importLoading} onCancel={cancelImportAfterUnsavedPrompt} onDiscard={discardAndImport} onSave={saveAndImport} />}
    {newDocumentVisible && <EditorTextosNewDocumentDialog onCancel={() => setNewDocumentVisible(false)} onOpenExisting={() => { setNewDocumentVisible(false); void showOpenOasis(); }} onCreate={(typeKey) => { void createNewOasisByType(typeKey); }} />}
    {recipeAssistantVisible && <EditorTextosRecipeAssistantModal
      open
      patient={recipeAssistantPatient || patientInUse}
      onSelectPatient={async () => {
        if (typeof onRequestPatientSelection !== 'function') return null;
        try {
          const selected = await onRequestPatientSelection();
          if (selected) setRecipeAssistantPatient(selected);
          return selected;
        } catch (error) {
          setCommandError(error?.message || 'Não foi possível selecionar o paciente.');
          return null;
        }
      }}
      onPreview={installRecipePreview}
      onFinalize={finalizeRecipe}
      onCancel={cancelRecipeAssistant}
    />}
    {atestadoAssistantVisible && <EditorTextosAtestadoAssistantModal
      open
      patient={atestadoAssistantPatient || patientInUse}
      onSelectPatient={async () => {
        if (typeof onRequestPatientSelection !== 'function') return null;
        try {
          const selected = await onRequestPatientSelection();
          if (selected) setAtestadoAssistantPatient(selected);
          return selected;
        } catch (error) {
          setCommandError(error?.message || 'Não foi possível selecionar o paciente.');
          return null;
        }
      }}
      onCancel={() => { setAtestadoAssistantVisible(false); setAtestadoAssistantPatient(null); }}
    />}
    {openVisible && <EditorTextosOpenDialog items={openItems} loading={openLoading} error={openError} onClose={() => setOpenVisible(false)} onRefresh={showOpenOasis} onOpen={(id) => void openOasis(id)} onRename={renameOasisModel} onDelete={deleteOasisModel} onProperties={showOasisProperties} />}
    {mergeVisible && <EditorTextosMergeFieldDialog open onCancel={() => setMergeVisible(false)} onConfirm={insertMergeField} />}
    {signVisible && <EditorTextosSignPdfDialog open loading={signLoading} error={commandError} onCancel={() => { if (!signLoading) setSignVisible(false); }} onSign={signCurrentDocument} />}
  </section>;
}
