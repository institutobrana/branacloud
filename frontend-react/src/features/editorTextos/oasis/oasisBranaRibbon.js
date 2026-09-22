export const OASIS_BRANA_RIBBON_EVENT = 'brana-editor-textos-oasis-ribbon-command';
export const OASIS_UNIFIED_IMPORT_ITEM_ID = 'editor-toolbar-import-document';
export const OASIS_NEW_DOCUMENT_ITEM_ID = 'editor-toolbar-new-document';

const RIBBON_ACTIONS = [
  { id: 'brana-editor-textos-save', target: 'editor-toolbar-new-document', position: 'before', tab: 'file', label: 'Salvar', icon: 'save', action: 'save' },
  { id: 'brana-editor-textos-save-as', target: 'editor-toolbar-new-document', position: 'before', tab: 'file', label: 'Salvar como', icon: 'file-plus-2', action: 'save-as' },
  { id: 'brana-editor-textos-open', target: 'editor-toolbar-new-document', tab: 'file', label: 'Abrir', icon: 'folder-open', action: 'open' },
  { id: 'brana-editor-textos-sign-pdf', target: 'editor-toolbar-print', tab: 'file', label: 'Assinar PDF', icon: 'file-signature', action: 'sign-pdf' },
  { id: 'brana-editor-textos-merge-field', target: 'editor-toolbar-insert-table', tab: 'insert', label: 'Campo de mesclagem', icon: 'variable', action: 'merge-field' },
];

function createRibbonActionItem({ id, tab, label, icon, action }) {
  return {
    type: 'custom',
    id,
    tab,
    label,
    iconName: icon,
    group: tab === 'file' ? 'document' : 'Campos',
    row: 1,
    ribbonSize: 'large',
    testId: id,
    render: () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'oasis-editor-tool-button';
      button.dataset.testid = id;
      button.setAttribute('aria-label', label);
      button.title = label;

      const iconElement = document.createElement('i');
      iconElement.setAttribute('data-lucide', icon);
      iconElement.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.className = 'oasis-editor-tool-button-label';
      text.textContent = label;
      button.append(iconElement, text);
      button.addEventListener('click', () => window.dispatchEvent(new CustomEvent(OASIS_BRANA_RIBBON_EVENT, { detail: { action } })));
      return button;
    },
  };
}

function createUnifiedImportItem() {
  return {
    type: 'custom',
    id: OASIS_UNIFIED_IMPORT_ITEM_ID,
    tab: 'file',
    label: 'Importar documento',
    iconName: 'file-up',
    group: 'document',
    row: 1,
    ribbonSize: 'large',
    testId: OASIS_UNIFIED_IMPORT_ITEM_ID,
    render: () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'oasis-editor-tool-button';
      button.dataset.testid = OASIS_UNIFIED_IMPORT_ITEM_ID;
      button.setAttribute('aria-label', 'Importar documento');
      button.title = 'Importar documento';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'file-up');
      icon.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.className = 'oasis-editor-tool-button-label';
      text.textContent = 'Importar documento';
      button.append(icon, text);
      button.addEventListener('click', () => window.dispatchEvent(new CustomEvent(OASIS_BRANA_RIBBON_EVENT, { detail: { action: 'import-document' } })));
      return button;
    },
  };
}

function createNewDocumentItem() {
  return createRibbonActionItem({
    id: OASIS_NEW_DOCUMENT_ITEM_ID,
    tab: 'file',
    label: 'Novo Documento',
    icon: 'file-plus-2',
    action: 'new-document',
  });
}

export function registerOasisBranaRibbonItems(client) {
  const registry = client?.ui?.toolbar?.items;
  if (!registry?.insertAfter || !registry?.insertBefore || !registry?.remove || !registry?.replace || !registry?.get) return () => {};

  const originalImportItem = registry.get(OASIS_UNIFIED_IMPORT_ITEM_ID);
  const originalNewDocumentItem = registry.get(OASIS_NEW_DOCUMENT_ITEM_ID);
  if (!originalImportItem || !originalNewDocumentItem) return () => {};
  registry.replace(OASIS_UNIFIED_IMPORT_ITEM_ID, createUnifiedImportItem());
  registry.replace(OASIS_NEW_DOCUMENT_ITEM_ID, createNewDocumentItem());
  for (const definition of RIBBON_ACTIONS) {
    const item = createRibbonActionItem(definition);
    if (definition.position === 'before') registry.insertBefore(definition.target, item);
    else registry.insertAfter(definition.target, item);
  }
  return () => {
    RIBBON_ACTIONS.forEach(({ id }) => registry.remove(id));
    registry.replace(OASIS_UNIFIED_IMPORT_ITEM_ID, originalImportItem);
    registry.replace(OASIS_NEW_DOCUMENT_ITEM_ID, originalNewDocumentItem);
  };
}
