import { createDocument, createOasisEditor, createParagraph, createTable } from 'oasis-editor';
import 'oasis-editor/style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createOasisNewDocument, getPersistableDocumentSnapshot } from '../engines/OasisEditorAdapter.js';
import { editorTextosApi } from '../api/editorTextosApi.js';
import { prepareLocalPdf, checkLocalBridgeConnection, getAvailableSignatureCertificates, getWindowsPublicCertificates, crossSignatureIdentities, createLocalSignatureReservationRequest, getLocalSignatureReservationRequest, bindLocalSignatureReservation, confirmLocalSignatureAuthorization, createLocalPairing, waitForLocalPairingApproval, createLocalSignatureOperation, waitForLocalOperationApproval, signLocalOperation, getLocalSignatureResult, isRecoveredPdfValid, revokeLocalSession } from '../api/localSignatureBridgeApi.js';
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
import { buildAttestadoBody } from '../models/atestadoAssistant.js';
import { runDevFakeSignatureFlow } from '../api/devFakeSignatureHarness.js';

const LOCAL_SIGNATURE_EXPERIMENT_ENABLED = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_LOCAL_SIGNATURE === 'true';
const DEV_FAKE_HOMOLOGATION_ENABLED = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
const DEV_WPF_APPROVAL_ENABLED = DEV_FAKE_HOMOLOGATION_ENABLED;

async function sha256HexForBlob(blob) {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function downloadDevArtifact(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function emitSignatureInsertionTrace(event, detail = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('brana-signature-insertion-trace', {
    detail: { event, ...detail, at: Date.now() },
  }));
}
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
  const [localPairing, setLocalPairing] = useState(null);
  const [devTrace, setDevTrace] = useState([]);
  const [signSuccess, setSignSuccess] = useState('');
  const [availableCertificates, setAvailableCertificates] = useState([]);
  const [activeCertificateBindings, setActiveCertificateBindings] = useState([]);
  const [localPairingAttempted, setLocalPairingAttempted] = useState(false);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificateError, setCertificateError] = useState('');
  const [authorizationEndpointsAvailable, setAuthorizationEndpointsAvailable] = useState(false);
  const [localApproval, setLocalApproval] = useState(null);
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

  const generateAttestado = useCallback(async (payload) => {
    const client = clientRef.current;
    if (!client) throw new Error('O editor Oasis não está disponível.');
    const patientId = Number(payload.patientId) || 0;
    if (!patientId || !Number(payload.modelId) || !Number(payload.surgeonId)) throw new Error('Selecione paciente, modelo e cirurgião antes de confirmar.');
    const snapshot = {
      document: structuredClone(client.getDocument()), documentId: documentIdRef.current, documentName: documentNameRef.current,
      documentType: documentTypeRef.current, oasisDocumentId: oasisDocumentIdRef.current, pageConfig: structuredClone(pageConfigRef.current),
      source: structuredClone(sourceRef.current), savedSnapshot: savedSnapshotRef.current, dirty: dirtyRef.current,
      readOnly: Boolean(sourceRef.current.legacyDocumentId && !sourceRef.current.conversionVersion), compatibilityStatus,
    };
    try {
      const dto = await editorTextosApi.getDocument(Number(payload.modelId));
      const detection = detectEditorDocumentFormat(dto);
      const body = buildAttestadoBody({
        ...payload.fields,
        patientName: getPatientDisplayName(payload.patient), reason: payload.reason, cid: payload.cid?.codigo || payload.cid?.descricao || '',
        observations: payload.observations,
      });
      if (!body.trim()) throw new Error('Não foi possível montar o corpo do atestado.');
      let document;
      let pageConfig = normalizePageConfig(dto?.pagina_config || DEFAULT_PAGE_CONFIG);
      if (detection.format === EDITOR_DOCUMENT_FORMATS.OASIS) {
        document = decodeOasisEnvelope(dto?.conteudo).document;
        const merged = await editorTextosApi.mergeEditorTextContent({ content: joinOasisTextNodes(document), mode: 'text', patientId, surgeonId: Number(payload.surgeonId), extras: { 'Atestado.Corpo': body }, preserveUnresolved: true });
        if (typeof merged?.conteudo !== 'string') throw new Error('O serviço de mesclagem não retornou o conteúdo do atestado.');
        document = mergeOasisTextNodes(document, merged.conteudo);
      } else {
        let content = detection.content;
        const isRtf = detection.format === EDITOR_DOCUMENT_FORMATS.RTF;
        let rtfPageConfig = null;
        if (isRtf) {
          const converted = await editorTextosApi.convertRtfImport(content);
          if (!converted || typeof converted.html !== 'string' || converted.persisted !== false) throw new Error('O serviço não confirmou a conversão temporária segura do modelo RTF.');
          content = converted.html;
          rtfPageConfig = converted.page_config;
        }
        const merged = await editorTextosApi.mergeEditorTextContent({ content, mode: isRtf || detection.format === EDITOR_DOCUMENT_FORMATS.HTML ? 'html' : 'text', patientId, surgeonId: Number(payload.surgeonId), extras: { 'Atestado.Corpo': body }, preserveUnresolved: true });
        if (typeof merged?.conteudo !== 'string') throw new Error('O serviço de mesclagem não retornou o conteúdo do atestado.');
        if (isRtf) document = convertRtfHtmlToOasis(merged.conteudo, { createDocument, createParagraph, createTable, title: 'Atestado' }).document;
        else if (detection.format === EDITOR_DOCUMENT_FORMATS.HTML) document = convertLegacyHtmlToOasis(merged.conteudo, { createDocument, createParagraph, title: 'Atestado' }).document;
        else document = convertPlainTextToOasis(merged.conteudo, { createDocument, createParagraph, title: 'Atestado' }).document;
        pageConfig = normalizePageConfig(rtfPageConfig || dto?.pagina_config || DEFAULT_PAGE_CONFIG, { minimumPageMm: 1 });
      }
      if (!document?.sections?.length) throw new Error('O modelo não produziu um documento Oasis válido.');
      documentIdRef.current = null;
      documentNameRef.current = `Atestado — ${getPatientDisplayName(payload.patient) || 'Paciente'}`;
      documentTypeRef.current = 'outros'; oasisDocumentIdRef.current = document.id; pageConfigRef.current = pageConfig;
      sourceRef.current = { format: 'oasis', origin: 'atestado-assistant', legacyDocumentId: null, conversionVersion: null };
      savedSnapshotRef.current = null; setCompatibilityStatus(null); client.ui.setReadOnly(false); client.document.set(document); client.history.clear(); client.focus.focus(); dirtyRef.current = true; setDirty(true);
      setAtestadoAssistantVisible(false); setAtestadoAssistantPatient(null); setCommandError('');
    } catch (error) {
      client.document.set(snapshot.document); client.history.clear(); client.focus.focus();
      throw error;
    }
  }, [compatibilityStatus]);

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
    emitSignatureInsertionTrace('MENU_HANDLER_ENTERED', { fieldType: category || 'unknown' });
    if (!client || !token) {
      setCommandError('O campo selecionado não possui um token de origem válido.');
      return;
    }
    try {
      if (mergeSelectionRef.current) client.selection.set(mergeSelectionRef.current);
      const isDigitalSignature = token === '<<Cirurgião.AssinaturaDigital>>';
      if (isDigitalSignature && mergeSelectionRef.current?.anchor?.paragraphId && client.edit?.apply) {
        const id = `brana-signature-${crypto.randomUUID()}`;
        const position = mergeSelectionRef.current.anchor;
        emitSignatureInsertionTrace('APPLY_REQUESTED', { operation: 'insertInlineTextBox' });
        const result = client.edit.apply({
          operations: [{
            op: 'insertInlineTextBox',
            target: { nodeId: position.paragraphId },
            offset: position.offset,
            id,
            // Oasis layout is in CSS px; the contract sent to the backend is pt.
            // 96 CSS px = 72 pt, so reserve exactly 220 x 72 pt in the PDF.
            width: 293.333333,
            height: 96,
            // The Oasis model requires at least one nested paragraph for a text box;
            // an empty blocks array is rejected by document validation.
            textBox: {
              blocks: [createParagraph('')],
              paragraphStyle: {},
              textStyle: {},
              shape: { preset: 'rect', fill: '#F8FAFC', borderColor: '#94A3B8', borderWidthPt: 0.75 },
            },
          }],
          origin: { type: 'brana-signature-field', actorId: id, label: 'Assinatura digital' },
        });
        const complete = (outcome) => {
          if (outcome?.ok === false) {
            emitSignatureInsertionTrace('APPLY_REJECTED', { operation: 'insertInlineTextBox', code: outcome.error?.code || 'EDIT_REJECTED' });
            throw new Error(outcome.error?.code || 'INSERT_INLINE_TEXTBOX_FAILED');
          }
          emitSignatureInsertionTrace('MODEL_UPDATED', { operation: 'insertInlineTextBox', created: true });
          requestAnimationFrame(() => emitSignatureInsertionTrace('LAYOUT_RENDER_EXPECTED', { operation: 'insertInlineTextBox' }));
          client.focus.focus();
          setMergeVisible(false);
          setCommandError('');
        };
        if (result && typeof result.then === 'function') {
          result.then(complete).catch((error) => {
            const code = error?.message || 'INSERT_INLINE_TEXTBOX_FAILED';
            emitSignatureInsertionTrace('APPLY_ERROR', { operation: 'insertInlineTextBox', code });
            setCommandError(code);
          });
          return;
        }
        complete(result);
      } else {
        // Legacy documents and non-signature merge fields retain textual behavior.
        client.commands.execute('insertText', token);
      }
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

  useEffect(() => {
    if (!signVisible || !LOCAL_SIGNATURE_EXPERIMENT_ENABLED) return undefined;
    let cancelled = false;
    setCertificatesLoading(true); setCertificateError(''); setAuthorizationEndpointsAvailable(false); setAvailableCertificates([]);
    void getAvailableSignatureCertificates().then((payload) => {
      if (cancelled) return;
      setActiveCertificateBindings(payload.certificates);
      setAvailableCertificates([]);
      // A lista pública não habilita o fluxo por si só. O backend precisa
      // anunciar explicitamente que reserva, bind, confirmação e consumo
      // autenticados estão implantados; a rota atual não anuncia isso.
      setAuthorizationEndpointsAvailable(payload.authorization_flow_enabled === true);
      if (payload.authorization_flow_enabled !== true) {
        setCertificateError('Backend de autorização incompleto; assinatura Windows permanece fechada.');
      }
    }).catch((error) => {
      if (cancelled) return;
      setCertificateError('Backend de autorização indisponível; o fluxo Windows permanece fechado.');
      setCommandError(error?.code || 'SIGNATURE_AUTHORIZATION_UNAVAILABLE');
    }).finally(() => { if (!cancelled) setCertificatesLoading(false); });
    return () => { cancelled = true; };
  }, [signVisible]);

  const consultLocalIdentities = useCallback(async () => {
    if (!authorizationEndpointsAvailable || certificatesLoading || signLoading) return;
    setLocalPairingAttempted(true); setCertificatesLoading(true); setCertificateError(''); setCommandError(''); setAvailableCertificates([]);
    try {
      const pairing = await createLocalPairing();
      const approvedPairing = await waitForLocalPairingApproval({ pairing });
      const localCertificates = await getWindowsPublicCertificates({ pairing: approvedPairing });
      const options = crossSignatureIdentities({ activeBindings: activeCertificateBindings, windowsCertificates: localCertificates.certificates, authorizationFlowEnabled: authorizationEndpointsAvailable });
      setLocalPairing({ pairing: approvedPairing });
      setAvailableCertificates(options);
    } catch (error) {
      setCertificateError(error?.code === 'NO_AUTHORIZED_SIGNATURE_IDENTITIES' ? 'Nenhuma identidade autorizada está disponível neste computador.' : 'Não foi possível consultar as identidades deste computador.');
      setCommandError(error?.code || 'WINDOWS_CERTIFICATE_LIST_UNAVAILABLE');
      setLocalPairing(null);
    } finally { setCertificatesLoading(false); }
  }, [activeCertificateBindings, authorizationEndpointsAvailable, certificatesLoading, signLoading]);

  const prepareCurrentDocumentForLocalBridge = useCallback(async (selectedCertificate) => {
    const client = clientRef.current;
    if (!client) return;
    if (!authorizationEndpointsAvailable || !selectedCertificate?.certificateDerSha256 || !selectedCertificate?.source || !selectedCertificate?.bindingId) {
      setCommandError('Assinatura Windows indisponível: backend de autorização não está pronto. Nenhum pareamento foi iniciado.');
      return;
    }
    setSignLoading(true); setCommandError('');
    try {
      const name = documentNameRef.current || 'Documento';
      const baseName = name.replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '_').trim() || 'Documento';
      const pdfFilename = `${baseName}.pdf`;
      const exported = await client.export.withLayout();
      if (!exported?.blob) throw new Error('Não foi possível gerar o PDF do Oasis.');
      const prepared = await prepareLocalPdf({ pdf: exported.blob, pdfFilename, documentName: name, signatureBoxes: exported.signatureBoxes });
      const operationId = crypto.randomUUID();
      const pending = await createLocalSignatureReservationRequest({ operationId, preparedPdfSha256: prepared.sha256, certificateDerSha256: selectedCertificate.certificateDerSha256, certificateSource: selectedCertificate.source });
      const approvedPairing = localPairing?.pairing || await waitForLocalPairingApproval({ pairing: await createLocalPairing() });
      const bound = await bindLocalSignatureReservation({ pairing: approvedPairing, requestId: pending.request_id, challenge: pending.challenge, operationId, preparedPdfSha256: prepared.sha256, certificateDerSha256: selectedCertificate.certificateDerSha256, certificateSource: selectedCertificate.source });
      const reservation = await getLocalSignatureReservationRequest({ requestId: pending.request_id });
      if (reservation.status !== 'RESERVED' || reservation.authorization_id !== bound.authorization_id) throw new Error('RESERVATION_NOT_RESERVED');
      const operation = await createLocalSignatureOperation({ pairing: approvedPairing, prepared, operationId, authorizationId: bound.authorization_id, certificateDerSha256: selectedCertificate.certificateDerSha256, certificateSource: selectedCertificate.source });
      const approvedOperation = await waitForLocalOperationApproval({ pairing: approvedPairing, operationId: operation.operation_id, prepared });
      if (approvedOperation.state !== 'APPROVED') throw new Error('Operação local não foi aprovada.');
      setLocalApproval({ prepared, pairing: approvedPairing, operation: approvedOperation, authorizationId: bound.authorization_id, operationId, certificateDerSha256: selectedCertificate.certificateDerSha256, certificateSource: selectedCertificate.source, bindingId: selectedCertificate.bindingId });
      setSignSuccess('Operação WPF aprovada. Confirme com sua senha individual Brana para continuar.');
      return;
    } catch (error) { setCommandError(error.message || 'Não foi possível preparar para o bridge local.'); }
    finally { setSignLoading(false); }
  }, [authorizationEndpointsAvailable, localPairing]);

  const confirmLocalSignature = useCallback(async ({ password }) => {
    if (!localApproval || typeof password !== 'string' || !password) return;
    setSignLoading(true); setCommandError('');
    try {
      await confirmLocalSignatureAuthorization({ authorizationId: localApproval.authorizationId, password, operationId: localApproval.operationId, preparedPdfSha256: localApproval.prepared.sha256, certificateDerSha256: localApproval.certificateDerSha256, certificateSource: localApproval.certificateSource });
      const signResponse = await signLocalOperation({ pairing: localApproval.pairing, operationId: localApproval.operationId, authorizationId: localApproval.authorizationId, certificateDerSha256: localApproval.certificateDerSha256, certificateSource: localApproval.certificateSource, prepared: localApproval.prepared });
      if (signResponse?.state !== 'COMPLETED') throw new Error('Assinatura local não foi concluída.');
      const result = await getLocalSignatureResult({ pairing: localApproval.pairing, operationId: localApproval.operationId });
      if (!(await isRecoveredPdfValid({ blob: result.blob, prepared: localApproval.prepared }))) throw new Error('Resultado recuperado não é um PDF assinado íntegro.');
      setLocalPairing({ prepared: localApproval.prepared, pairing: localApproval.pairing, operation: localApproval.operation, result });
      setLocalApproval(null); setSignVisible(false);
    } catch (error) { setCommandError(error.message || 'Não foi possível confirmar a assinatura.'); }
    finally { setSignLoading(false); }
  }, [localApproval]);

  const runDevFakeHomologation = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    setSignLoading(true); setCommandError('');
    try {
      const exported = await client.io.export({ format: 'pdf', filename: 'oasis-dev-homologation.pdf' });
      if (!exported?.ok || !exported.value?.blob) throw new Error('Não foi possível exportar o PDF sintético.');
      const trace = [];
      const fake = await runDevFakeSignatureFlow({ pdfBlob: exported.value.blob, onTrace: (event) => trace.push(event) });
      if (fake.marker !== 'brana-dev-fake-bridge-v1' || fake.signCalls !== 1 || !fake.trace.some((event) => event.event === 'RESULT_RECOVERED')) throw new Error('Bridge fake não identificado com segurança.');
      const url = URL.createObjectURL(fake.result);
      const link = window.document.createElement('a'); link.href = url; link.download = 'oasis-dev-homologation-simulation.pdf'; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      if (typeof window !== 'undefined') window.__BRANA_DEV_HOMOLOGATION_TRACE__ = trace;
      setDevTrace(trace);
      setCommandError('Simulação fake concluída; o PDF baixado não possui assinatura digital.');
    } catch (error) { setCommandError(error.message || 'Homologação fake indisponível.'); }
    finally { setSignLoading(false); }
  }, []);

  const runDevWpfApproval = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    setSignLoading(true); setCommandError(''); setSignSuccess('');
    try {
      const name = documentNameRef.current || 'Documento';
      const baseName = name.replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '_').trim() || 'Documento';
      const exported = await client.io.export({ format: 'pdf', filename: `${baseName}.pdf` });
      if (!exported?.ok || !exported.value?.blob) throw new Error('Não foi possível exportar o PDF do Oasis.');
      const prepared = await prepareLocalPdf({ pdf: exported.value.blob, pdfFilename: `${baseName}.pdf`, documentName: name });
      const pairing = await createLocalPairing();
      const approvedPairing = await waitForLocalPairingApproval({ pairing });
      const operation = await createLocalSignatureOperation({ pairing: approvedPairing, prepared });
      const approvedOperation = await waitForLocalOperationApproval({ pairing: approvedPairing, operationId: operation.operation_id });
      if (approvedOperation.state !== 'APPROVED') throw new Error('Operação WPF não aprovada.');
      setLocalPairing({ prepared, pairing: approvedPairing, operation: approvedOperation });
      setSignSuccess('WPF aprovou a operação. Nenhuma chamada /sign foi feita.');
    } catch (error) { setSignSuccess(''); setCommandError(error.message || 'Não foi possível concluir a aprovação WPF.'); }
    finally { setSignLoading(false); }
  }, []);

  const runDevPrepareOnly = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    setSignLoading(true); setCommandError('');
    try {
      const name = documentNameRef.current || 'Documento de teste';
      const baseName = name.replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '_').trim() || 'Documento-teste';
      const exported = await client.export.withLayout();
      if (!exported?.blob || !Array.isArray(exported.signatureBoxes)) throw new Error('EXPORT_GEOMETRY_UNAVAILABLE');
      if (exported.signatureBoxes.length !== 1) throw new Error('SIGNATURE_BOX_COUNT_INVALID');
      const box = exported.signatureBoxes[0];
      if (!box?.id || !Number.isInteger(box.page) || !Array.isArray(box.rect) || box.rect.length !== 4) throw new Error('SIGNATURE_BOX_GEOMETRY_INVALID');
      const prepared = await prepareLocalPdf({ pdf: exported.blob, pdfFilename: `${baseName}.pdf`, documentName: name, signatureBoxes: exported.signatureBoxes });
      const samePage = Number(prepared.page) === Number(box.page);
      const sameRect = JSON.stringify(prepared.rect) === JSON.stringify(box.rect);
      if (!samePage || !sameRect) throw new Error('SIGNATURE_BOX_PDF_RECT_MISMATCH');
      const trace = { event: 'PREPARE_GEOMETRY', box: { id: box.id, page: box.page, rect: box.rect }, prepared: { fieldName: prepared.fieldName, page: prepared.page, rect: prepared.rect, sha256: prepared.sha256, size: prepared.blob.size }, samePage, sameRect, pairingCreated: false, signCalls: 0 };
      if (typeof window !== 'undefined') window.__BRANA_DEV_PREPARE_TRACE__ = trace;
      setCommandError(`Preparação dev concluída: ${box.id}, página ${box.page}, retângulo ${box.rect.join(',')}; ${prepared.fieldName} coincidente. Nenhum pairing foi iniciado.`);
    } catch (error) { setCommandError(error.message || 'Não foi possível preparar o PDF de teste.'); }
    finally { setSignLoading(false); }
  }, []);

  const runDevGeometryExport = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    setSignLoading(true); setCommandError(''); setSignSuccess('');
    try {
      const exported = await client.export.withLayout();
      if (!exported?.blob || !Array.isArray(exported.signatureBoxes)) throw new Error('EXPORT_GEOMETRY_UNAVAILABLE');
      const pdfSha256 = await sha256HexForBlob(exported.blob);
      const boxes = exported.signatureBoxes.map((box) => ({ id: box.id, page: box.page, rect: box.rect, widthPt: box.widthPt, heightPt: box.heightPt }));
      const manifest = new Blob([JSON.stringify({ schema: 'brana-geometry-diagnostic-v1', pdf_sha256: pdfSha256, boxes }, null, 2)], { type: 'application/json' });
      const baseName = (documentNameRef.current || 'documento').replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]/g, '_').trim() || 'documento';
      downloadDevArtifact(exported.blob, `${baseName}-geometry-diagnostic.pdf`);
      downloadDevArtifact(manifest, `${baseName}-geometry-diagnostic.json`);
      const trace = { event: 'GEOMETRY_EXPORT_READY', pdf_sha256: pdfSha256, pdf_size: exported.blob.size, box_count: boxes.length, boxes, prepareCalled: false, pairingCreated: false, signCalls: 0 };
      if (typeof window !== 'undefined') window.__BRANA_DEV_GEOMETRY_EXPORT_TRACE__ = trace;
      setCommandError(`Diagnóstico exportado: ${boxes.length} caixa(s), PDF ${pdfSha256.slice(0, 12)}…; arquivos PDF e mapa vinculados foram baixados. Nenhuma preparação ou operação foi iniciada.`);
    } catch (error) { setCommandError(error.message || 'Não foi possível exportar o diagnóstico de geometria.'); }
    finally { setSignLoading(false); }
  }, []);

  const runDevBridgeCheck = useCallback(async () => {
    setSignLoading(true); setCommandError('');
    try {
      const result = await checkLocalBridgeConnection();
      const detail = result.status ? `HTTP ${result.status}` : `erro de rede (${result.error})`;
      setCommandError(`Bridge: ${detail}. URL ${result.url}. ${result.timestamp}. Nenhuma operação foi criada.`);
    } catch (error) { setCommandError(error.message || 'Não foi possível testar o bridge.'); }
    finally { setSignLoading(false); }
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
      onConfirm={generateAttestado}
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
    {signVisible && <EditorTextosSignPdfDialog open loading={signLoading} error={commandError} success={signSuccess} devTrace={devTrace} localEnabled={LOCAL_SIGNATURE_EXPERIMENT_ENABLED} legacyMode={false} localConfirmation={Boolean(localApproval)} availableCertificates={availableCertificates} certificatesLoading={certificatesLoading} certificateError={certificateError} authorizationEndpointsAvailable={authorizationEndpointsAvailable} localPairingAttempted={localPairingAttempted} showDevDiagnostics={import.meta.env.DEV && typeof window !== 'undefined' && window.__BRANA_SHOW_SIGNATURE_DIAGNOSTICS__ === true} devFakeEnabled={DEV_FAKE_HOMOLOGATION_ENABLED} devWpfApprovalEnabled={DEV_WPF_APPROVAL_ENABLED} onCancel={() => { if (!signLoading) { revokeLocalSession({ pairing: localPairing?.pairing, sessionId: localPairing?.pairing?.session_id }).catch(() => {}); setLocalPairing(null); setLocalApproval(null); setSignVisible(false); } }} onSign={signCurrentDocument} onPrepareLocal={prepareCurrentDocumentForLocalBridge} onConfirmLocal={confirmLocalSignature} onConsultIdentities={consultLocalIdentities} onDevPrepare={runDevPrepareOnly} onDevGeometryExport={runDevGeometryExport} onDevBridgeCheck={runDevBridgeCheck} onDevFake={runDevFakeHomologation} onDevWpfApproval={runDevWpfApproval} />}
  </section>;
}
