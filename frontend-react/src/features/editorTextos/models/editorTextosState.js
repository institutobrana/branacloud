import { DEFAULT_PAGE_CONFIG } from './pageConfig.js';

export const EMPTY_EDITOR_DOCUMENT = Object.freeze({
  id: null,
  name: 'Novo documento',
  type: 'texto',
  content: '<p></p>',
  dirty: false,
  loading: false,
  saving: false,
  pageConfig: DEFAULT_PAGE_CONFIG,
  originalContent: '<p></p>',
  importSafety: { format: 'HTML', confidence: 1, reasons: [], editable: true, resaveAllowed: true, reason: '' },
});

export function createEmptyEditorDocument() {
  return { ...EMPTY_EDITOR_DOCUMENT };
}
