import { useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { UndoRedo } from '@tiptap/extensions';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createEditorEngineAdapter } from './adapters/EditorEngineAdapter.js';
import { createEditorSelectionAdapter } from './adapters/EditorSelectionAdapter.js';
import { createEditorClipboardAdapter } from './adapters/EditorClipboardAdapter.js';
import { LegacyHtmlAdapter } from './adapters/LegacyHtmlAdapter.js';
import { EditorTextosPrimaryToolbar } from './components/EditorTextosPrimaryToolbar.jsx';
import { EditorTextosWorkspace } from './components/EditorTextosWorkspace.jsx';
import { EditorTextosFormatToolbar } from './components/EditorTextosFormatToolbar.jsx';
import { getEditorTextosFixture } from './fixtures/editorTextosFixtures.js';
import { useEditorDocumentLifecycle } from './hooks/useEditorDocumentLifecycle.js';
import { EditorTextosOpenDialog, EditorTextosNewTextDialog, EditorTextosSaveAsDialog } from './components/EditorTextosDocumentDialogs.jsx';
import { EditorTextosUnsavedChangesDialog } from './components/EditorTextosUnsavedChangesDialog.jsx';
import { EditorTextosPageSetupDialog } from './components/EditorTextosPageSetupDialog.jsx';
import { ResizableImageExtension } from './extensions/ResizableImageExtension.js';
import { ParagraphIndentExtension } from './extensions/ParagraphIndentExtension.js';
import { InlineTabExtension } from './extensions/InlineTabExtension.js';
import { EditorTableBorderExtension } from './table/EditorTableBorderExtension.js';
import { EditorTableSelectionExtension } from './table/tableSelection.js';
import { EditorTextosTableInsertDialog } from './table/EditorTextosTableInsertDialog.jsx';
import { insertTable, isInTable } from './table/tableCommands.js';
import { calculateInitialSize, readFileAsDataUrl, readImageDimensions } from './adapters/EditorImageAdapter.js';
import { createEmptyEditorDocument } from './models/editorTextosState.js';
import './styles/editorTextos.css';

const extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Underline,
  TextStyle.extend({
    name: 'textStyle',
    addGlobalAttributes() {
      return [{ types: ['textStyle'], attributes: {
        fontFamily: { default: null, parseHTML: (element) => element.style.fontFamily || null, renderHTML: (attributes) => attributes.fontFamily ? { style: `font-family: ${attributes.fontFamily}` } : {} },
        fontSize: { default: null, parseHTML: (element) => element.style.fontSize || null, renderHTML: (attributes) => attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {} },
      }}];
    },
  }),
  Color.configure({ types: ['textStyle'] }),
  TextAlign.configure({ types: ['paragraph'] }),
  BulletList,
  ListItem,
  Table.configure({ resizable: false, allowTableNodeSelection: true }),
  TableRow,
  TableHeader,
  TableCell,
  EditorTableBorderExtension,
  EditorTableSelectionExtension,
  UndoRedo,
  InlineTabExtension,
  ParagraphIndentExtension,
  ResizableImageExtension,
];

export function EditorTextosPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const editor = useEditor({ extensions, content: '<p></p>', immediatelyRender: false });
  const engineAdapter = useMemo(() => createEditorEngineAdapter(editor), [editor]);
  const selectionAdapter = useMemo(() => createEditorSelectionAdapter(editor), [editor]);
  const clipboardAdapter = useMemo(() => createEditorClipboardAdapter(editor), [editor]);
  const lifecycle = useEditorDocumentLifecycle({ engineAdapter, onError: (error) => setErrorMessage(error.message) });
  const { documentState, setDocumentState } = lifecycle;
  const [pageSetupVisible, setPageSetupVisible] = useState(false);
  const [tableDialogVisible, setTableDialogVisible] = useState(false);
  const imageSelection = useRef(null);
  const imageInput = useRef(null);

  useEffect(() => {
    editor?.setEditable(documentState.importSafety?.editable !== false);
  }, [editor, documentState.importSafety?.editable]);

  const insertImage = ({ src, width, height, fitPage }) => {
    if (!editor) return;
    if (imageSelection.current) editor.commands.setTextSelection(imageSelection.current);
    editor.chain().focus().insertContent({
      type: 'image',
      attrs: { src, width, height, fitPage },
    }).run();
  };

  const handleNativeImagePick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !editor) return;
    try {
      const src = await readFileAsDataUrl(file);
      const natural = await readImageDimensions(src);
      const size = calculateInitialSize({ ...natural, contentWidth: editor.view.dom.clientWidth || 700, fitPage: true });
      insertImage({ src, ...size, fitPage: true });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const onAction = (event) => {
      if (event.detail?.action === 'pagina') setPageSetupVisible(true);
      if (event.detail?.action === 'table' && !isInTable(editor)) setTableDialogVisible(true);
      if (event.detail?.action === 'imagem') { imageSelection.current = editor?.state.selection ? { from: editor.state.selection.from, to: editor.state.selection.to } : null; imageInput.current?.click(); }
    };
    window.addEventListener('brana-editor-textos-action', onAction);
    return () => window.removeEventListener('brana-editor-textos-action', onAction);
  }, [editor]);

  const handleTableInsert = (options) => {
    if (insertTable(editor, options)) setTableDialogVisible(false);
  };

  const loadLocalContent = (content, { focus = false } = {}) => {
    const normalized = LegacyHtmlAdapter.deserializeLegacyHtml(content);
    engineAdapter?.loadContent(normalized, { emitUpdate: false });
    setDocumentState((current) => ({ ...current, content: normalized, dirty: false, loading: false }));
    if (focus) engineAdapter?.focus();
  };

  const handleNew = () => {
    loadLocalContent('<p></p>', { focus: true });
    engineAdapter?.focus();
    setDocumentState(createEmptyEditorDocument());
  };

  useEffect(() => {
    const onLoadFixture = (event) => {
      const fixture = getEditorTextosFixture(event.detail?.fixtureId);
      if (fixture) loadLocalContent(fixture.html);
    };
    window.addEventListener('brana-editor-textos-load-fixture', onLoadFixture);
    return () => window.removeEventListener('brana-editor-textos-load-fixture', onLoadFixture);
  }, [engineAdapter]);

  useEffect(() => {
    const onClipboardCommand = async (event) => {
      const command = event.detail?.command;
      if (!clipboardAdapter || !['recortar', 'copiar', 'colar'].includes(command)) return;
      try {
        await clipboardAdapter[{ recortar: 'cut', copiar: 'copy', colar: 'paste' }[command]]();
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    window.addEventListener('brana-editor-textos-clipboard-command', onClipboardCommand);
    return () => window.removeEventListener('brana-editor-textos-clipboard-command', onClipboardCommand);
  }, [clipboardAdapter]);

  useEffect(() => {
    if (!engineAdapter || !selectionAdapter) return undefined;
    const publishState = () => window.dispatchEvent(new CustomEvent('brana-editor-textos-format-state', {
      detail: { ...selectionAdapter.getActiveFormats(), inTable: isInTable(editor) },
    }));
    const unsubscribeUpdate = engineAdapter.subscribeToChanges(publishState);
    const unsubscribeSelection = engineAdapter.subscribeToSelectionChanges(publishState);
    publishState();
    return () => { unsubscribeUpdate(); unsubscribeSelection(); };
  }, [engineAdapter, selectionAdapter]);

  useEffect(() => {
    const onFormatCommand = (event) => {
      const { command, attrs } = event.detail || {};
      if (!command || !engineAdapter) return;
      engineAdapter.executeCommand(command, attrs);
    };
    window.addEventListener('brana-editor-textos-format-command', onFormatCommand);
    return () => window.removeEventListener('brana-editor-textos-format-command', onFormatCommand);
  }, [engineAdapter]);

  return (
    <section className="editor-textos-page-root" aria-label="Editor de Textos">
      <EditorTextosFormatToolbar />
      {!documentState.importSafety?.editable && <div role="alert" className="editor-textos-protected-warning">Este documento usa um formato legado que ainda não pode ser editado com segurança no novo Editor de Textos.</div>}
      <EditorTextosWorkspace editor={editor} pageConfig={documentState.pageConfig} />
      <EditorTextosTableInsertDialog open={tableDialogVisible} onCancel={() => setTableDialogVisible(false)} onInsert={handleTableInsert} />
      <input ref={imageInput} type="file" accept="image/bmp,image/jpeg,image/png,image/gif,image/webp" hidden onChange={handleNativeImagePick} />
      {errorMessage && <div role="alert" className="editor-textos-error">{errorMessage}</div>}
      <button type="button" className="editor-textos-hidden-smoke" onClick={handleNew}>Resetar documento local</button>
      {lifecycle.openVisible && <EditorTextosOpenDialog items={lifecycle.openItems} loading={lifecycle.openLoading} error={lifecycle.openError} onClose={() => lifecycle.setOpenVisible(false)} onRefresh={lifecycle.refreshOpenItems} onOpen={lifecycle.openDocument} onRename={lifecycle.renameDocument} onDelete={lifecycle.deleteDocument} onProperties={lifecycle.showProperties} />}
      {lifecycle.newVisible && <EditorTextosNewTextDialog onClose={() => lifecycle.setNewVisible(false)} onOpenExisting={() => { lifecycle.setNewVisible(false); lifecycle.showOpen(); }} onCreate={lifecycle.createNewByType} />}
      {lifecycle.saveAsVisible && <EditorTextosSaveAsDialog initialName={documentState.name} onClose={() => lifecycle.setSaveAsVisible(false)} onSave={lifecycle.saveDocumentAs} />}
      <EditorTextosUnsavedChangesDialog open={lifecycle.unsavedVisible} saving={documentState.saving} onCancel={lifecycle.cancelPendingAction} onDiscard={lifecycle.discardAndContinue} onSave={lifecycle.saveAndContinue} />
      {pageSetupVisible && <EditorTextosPageSetupDialog pageConfig={documentState.pageConfig} onClose={() => setPageSetupVisible(false)} onApply={(config) => { lifecycle.updatePageConfig(config); setPageSetupVisible(false); }} />}
    </section>
  );
}
