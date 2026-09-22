import { createDocument, createParagraph } from 'oasis-editor';

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = canonicalize(value[key]);
      return result;
    }, {});
  }
  return value;
}

export function getPersistableDocumentSnapshot(document) {
  return JSON.stringify(canonicalize(document));
}

export function createOasisNewDocument(title = 'Novo documento') {
  return createDocument({ title, blocks: [createParagraph('')] });
}

export function createOasisEditorAdapter(client) {
  return {
    mount: () => client,
    destroy: () => client?.dispose?.(),
    newDocument: () => client?.document.load(createOasisNewDocument()),
    getDocument: () => client?.document.get(),
    getSelection: () => client?.selection.get(),
    focus: () => client?.focus.focus(),
    onChange: (handler) => {
      if (!client || typeof handler !== 'function') return () => {};
      const unsubscribeChange = client.on('change', handler);
      return unsubscribeChange;
    },
  };
}
