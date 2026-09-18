import { useCallback, useEffect, useRef, useState } from 'react';
import { editorTextosApi } from '../api/editorTextosApi.js';
import { documentDtoToModel, documentModelToPayload } from '../models/documentModel.js';
import { LegacyHtmlAdapter } from '../adapters/LegacyHtmlAdapter.js';
import { createEmptyEditorDocument } from '../models/editorTextosState.js';
import { NEW_TEXT_TYPES, normalizeModelName } from '../models/editorTextosModalModels.js';
import { normalizePageConfig } from '../models/pageConfig.js';
import { safeRoundtripCheck } from '../models/LegacyDocumentFormatDetector.js';

export function useEditorDocumentLifecycle({ engineAdapter, onError, manualLegacyTestMode = false }) {
  const [documentState, setDocumentState] = useState(createEmptyEditorDocument);
  const [openItems, setOpenItems] = useState([]);
  const [openVisible, setOpenVisible] = useState(false);
  const [saveAsVisible, setSaveAsVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [unsavedVisible, setUnsavedVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const leaveContinuationRef = useRef(null);
  const [openLoading, setOpenLoading] = useState(false);
  const [openError, setOpenError] = useState('');

  const applyDocument = useCallback((document, { focus = false } = {}) => {
    const content = LegacyHtmlAdapter.deserializeLegacyHtml(document.content);
    engineAdapter?.loadContent(content, { emitUpdate: false });
    const exported = engineAdapter?.getContent() || content;
    const roundtrip = document.importSafety?.editable ? safeRoundtripCheck({ sourceHtml: content, exportedHtml: exported, serializedLegacyHtml: LegacyHtmlAdapter.serializeToLegacyHtml(exported) }) : { safe: false, lostFeatures: [], warnings: [] };
    const legacyTestOverride = manualLegacyTestMode && document.importSafety?.manualLegacyTestAllowed === true;
    const importSafety = legacyTestOverride
      ? { ...document.importSafety, editable: false, resaveAllowed: false, manualLegacyTestAllowed: true, safeRoundTrip: roundtrip.safe, lostFeatures: roundtrip.lostFeatures, warnings: roundtrip.warnings, reason: 'modo de homologação: alterações não serão salvas' }
      : document.importSafety?.editable && roundtrip.safe
      ? { ...document.importSafety, safeRoundTrip: true, lostFeatures: [], warnings: [] }
      : { ...(document.importSafety || {}), editable: false, resaveAllowed: false, safeRoundTrip: false, lostFeatures: roundtrip.lostFeatures, warnings: roundtrip.warnings, reason: document.importSafety?.reason || 'conteúdo material não sobreviveu ao roundtrip do editor' };
    setDocumentState({ ...document, importSafety, pageConfig: normalizePageConfig(document.pageConfig), content, dirty: false, loading: false, saving: false });
    if (focus) engineAdapter?.focus();
  }, [engineAdapter, manualLegacyTestMode]);

  const newDocument = useCallback(() => {
    if (documentState.dirty) return false;
    applyDocument(createEmptyEditorDocument(), { focus: true });
    return true;
  }, [applyDocument, documentState.dirty]);

  const openDocument = useCallback(async (id) => {
    setDocumentState((current) => ({ ...current, loading: true }));
    try {
      const dto = await editorTextosApi.getDocument(id);
      applyDocument(documentDtoToModel(dto, { manualLegacyTestMode }), { focus: true });
      setOpenVisible(false);
      return true;
    } catch (error) {
      setDocumentState((current) => ({ ...current, loading: false }));
      onError?.(error);
      return false;
    }
  }, [applyDocument, onError]);

  const showOpen = useCallback(async ({ bypassDirty = false } = {}) => {
    if (documentState.dirty && !bypassDirty) return false;
    setOpenError('');
    setOpenLoading(true);
    try {
      const response = await editorTextosApi.listDocuments();
      setOpenItems(Array.isArray(response?.itens) ? response.itens : []);
      setOpenVisible(true);
      return true;
    } catch (error) { setOpenError(error.message); onError?.(error); return false; } finally { setOpenLoading(false); }
  }, [documentState.dirty, onError]);

  const refreshOpenItems = useCallback(async () => {
    setOpenError('');
    setOpenLoading(true);
    try {
      const response = await editorTextosApi.listDocuments();
      setOpenItems(Array.isArray(response?.itens) ? response.itens : []);
      return true;
    } catch (error) { setOpenError(error.message); onError?.(error); return false; } finally { setOpenLoading(false); }
  }, [onError]);

  const saveDocument = useCallback(async () => {
    if (documentState.saving) return false;
    if (documentState.importSafety && !documentState.importSafety.resaveAllowed) {
      onError?.(new Error('Este documento usa um formato legado que ainda não pode ser editado com segurança no novo Editor de Textos.'));
      return false;
    }
    if (!documentState.id) {
      setSaveAsVisible(true);
      return false;
    }
    const content = LegacyHtmlAdapter.serializeToLegacyHtml(engineAdapter?.getContent());
    setDocumentState((current) => ({ ...current, saving: true }));
    try {
      const dto = await editorTextosApi.updateDocument(documentState.id, documentModelToPayload(documentState, content));
      setDocumentState({ ...documentDtoToModel(dto), dirty: false, saving: false });
      return true;
    } catch (error) {
      setDocumentState((current) => ({ ...current, saving: false }));
      onError?.(error);
      return false;
    }
  }, [documentState, engineAdapter, onError]);

  const executePendingAction = useCallback(async (action) => {
    if (!action) return false;
    if (action.type === 'NEW') {
      setNewVisible(true);
      return true;
    }
    if (action.type === 'OPEN') return showOpen({ bypassDirty: true });
    if (action.type === 'LEAVE_EDITOR') {
      const continueNavigation = leaveContinuationRef.current;
      leaveContinuationRef.current = null;
      continueNavigation?.();
      return true;
    }
    return false;
  }, [showOpen]);

  const finishPendingAction = useCallback(async () => {
    const action = pendingAction;
    setPendingAction(null);
    setUnsavedVisible(false);
    return executePendingAction(action);
  }, [executePendingAction, pendingAction]);

  const saveDocumentAs = useCallback(async (name) => {
    if (documentState.importSafety && !documentState.importSafety.resaveAllowed) {
      onError?.(new Error('Este documento usa um formato legado que ainda não pode ser editado com segurança no novo Editor de Textos.'));
      return false;
    }
    const content = LegacyHtmlAdapter.serializeToLegacyHtml(engineAdapter?.getContent());
    try {
      const dto = await editorTextosApi.createDocument(documentModelToPayload({ ...documentState, id: null, name }, content));
      setDocumentState({ ...documentDtoToModel(dto), dirty: false, saving: false });
      setSaveAsVisible(false);
      if (pendingAction) await finishPendingAction();
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    }
  }, [documentState, engineAdapter, finishPendingAction, onError, pendingAction]);

  const createNewByType = useCallback(async (typeKey) => {
    const rule = NEW_TEXT_TYPES.find((item) => item.value === typeKey) || NEW_TEXT_TYPES[4];
    let items = openItems;
    if (!items.length) {
      const response = await editorTextosApi.listDocuments();
      items = Array.isArray(response?.itens) ? response.itens : [];
    }
    const candidates = items.filter((item) => String(item.tipo_modelo || '').toLowerCase() === rule.type && rule.candidates.some((candidate) => normalizeModelName(candidate) === normalizeModelName(item.nome || item.nome_arquivo))).sort((a, b) => Number(a.sistema) - Number(b.sistema) || Number(a.id) - Number(b.id));
    setNewVisible(false);
    if (candidates[0]) return openDocument(candidates[0].id);
    applyDocument(createEmptyEditorDocument(), { focus: true });
    setDocumentState((current) => ({ ...current, type: rule.type, extension: rule.extension, dirty: false }));
    return true;
  }, [applyDocument, openDocument, openItems]);

  const renameDocument = useCallback(async (item) => {
    const name = window.prompt('Renomear modelo:', item?.nome || item?.nome_exibicao || '');
    if (name == null || !name.trim()) return false;
    await editorTextosApi.renameDocument(item.id, name.trim());
    await refreshOpenItems();
    return true;
  }, [refreshOpenItems]);

  const deleteDocument = useCallback(async (item) => {
    if (!window.confirm(`Tem certeza de que deseja excluir "${item?.nome || item?.nome_exibicao || ''}"?`)) return false;
    await editorTextosApi.deleteDocument(item.id);
    setOpenItems((current) => current.filter((entry) => entry.id !== item.id));
    return true;
  }, []);

  const showProperties = useCallback((item) => {
    window.alert(`Propriedades do modelo\n\nNome: ${item?.nome || item?.nome_exibicao || '-'}\nArquivo: ${item?.nome_arquivo || '-'}\nExtensão: ${item?.extensao || '-'}\nTipo: ${item?.tipo_modelo || '-'}\nOrigem: ${item?.sistema ? 'Sistema' : 'Clínica'}`);
  }, []);

  const updatePageConfig = useCallback((pageConfig) => {
    setDocumentState((current) => ({ ...current, pageConfig: normalizePageConfig(pageConfig), dirty: true }));
  }, []);

  const requestPendingAction = useCallback((action) => {
    if (!documentState.dirty) return executePendingAction(action);
    setPendingAction(action);
    setUnsavedVisible(true);
    return true;
  }, [documentState.dirty, executePendingAction]);

  const saveAndContinue = useCallback(async () => {
    const saved = await saveDocument();
    if (saved) await finishPendingAction();
    return saved;
  }, [finishPendingAction, saveDocument]);

  const cancelPendingAction = useCallback(() => {
    setPendingAction(null);
    leaveContinuationRef.current = null;
    setUnsavedVisible(false);
  }, []);

  const discardAndContinue = useCallback(async () => {
    const action = pendingAction;
    setPendingAction(null);
    setUnsavedVisible(false);
    if (documentState.id) {
      const restored = await openDocument(documentState.id);
      if (!restored) return false;
    } else {
      applyDocument(createEmptyEditorDocument(), { focus: true });
    }
    return executePendingAction(action);
  }, [applyDocument, documentState.id, executePendingAction, openDocument, pendingAction]);

  useEffect(() => {
    const onBeforeLeave = (event) => {
      if (!documentState.dirty) return;
      event.detail.prevented = true;
      leaveContinuationRef.current = event.detail.continueNavigation;
      setPendingAction({ type: 'LEAVE_EDITOR' });
      setUnsavedVisible(true);
    };
    window.addEventListener('brana-editor-textos-before-leave', onBeforeLeave);
    return () => window.removeEventListener('brana-editor-textos-before-leave', onBeforeLeave);
  }, [documentState.dirty]);

  useEffect(() => {
    if (!engineAdapter) return undefined;
    return engineAdapter.subscribeToChanges(() => {
      setDocumentState((current) => ({ ...current, content: LegacyHtmlAdapter.serializeToLegacyHtml(engineAdapter.getContent()), dirty: true }));
    });
  }, [engineAdapter]);

  useEffect(() => {
    const onAction = (event) => {
      const action = event.detail?.action;
      if (action === 'novo') requestPendingAction({ type: 'NEW' });
      if (action === 'abrir') requestPendingAction({ type: 'OPEN' });
      if (action === 'salvar') saveDocument();
      if (action === 'salvar-como') setSaveAsVisible(true);
    };
    window.addEventListener('brana-editor-textos-action', onAction);
    return () => window.removeEventListener('brana-editor-textos-action', onAction);
  }, [requestPendingAction, saveDocument]);

  return { documentState, setDocumentState, openItems, openVisible, setOpenVisible, openLoading, openError, refreshOpenItems, saveAsVisible, setSaveAsVisible, newVisible, setNewVisible, unsavedVisible, pendingAction, saveAndContinue, discardAndContinue, cancelPendingAction, openDocument, showOpen, saveDocument, saveDocumentAs, createNewByType, renameDocument, deleteDocument, showProperties, updatePageConfig, newDocument };
}
