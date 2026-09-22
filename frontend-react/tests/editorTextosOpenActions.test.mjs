import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const dialog = read('src/features/editorTextos/components/EditorTextosDocumentDialogs.jsx');
const lifecycle = read('src/features/editorTextos/hooks/useEditorDocumentLifecycle.js');
const oasis = read('src/features/editorTextos/oasis/OasisEditorPilot.jsx');
const css = read('src/features/editorTextos/components/EditorTextosDocumentDialogs.css');
const actions = read('src/features/editorTextos/api/editorTextosModelActions.js');
const { deleteEditorTextModel, renameEditorTextModel } = await import('../src/features/editorTextos/api/editorTextosModelActions.js');

test('open-model footer has the exact right-aligned action order and selection states', () => {
  assert.match(dialog, /editor-textos-open-actions__right/);
  assert.match(dialog, />Renomear<\/button>/);
  assert.match(dialog, />Eliminar<\/button>/);
  assert.match(dialog, /onClick=\{openSelected\}>Abrir<\/button>/);
  assert.match(dialog, /onClick=\{onClose\}>Cancelar<\/button>/);
  assert.doesNotMatch(dialog, />OK<\/button>/);
  assert.doesNotMatch(dialog, />Excluir<\/button>/);
  assert.match(dialog, /disabled=\{!canAlter/);
  assert.match(dialog, /disabled=\{!selected \|\| loading \|\| actionLoading\} onClick=\{openSelected\}>Abrir/);
  assert.match(dialog, /const selected = filteredItems\.find/);
  assert.match(dialog, /setSelectedId\(null\)/);
  assert.match(css, /editor-textos-open-actions\{justify-content:flex-end/);
  assert.match(css, /editor-textos-open-actions__right\{display:flex;align-items:center;justify-content:flex-end/);
  const footer = dialog.match(/<div className="editor-textos-open-actions__right">([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.deepEqual([...footer.matchAll(/>(Abrir|Renomear|Eliminar|Cancelar)<\/button>/g)].map((match) => match[1]), ['Abrir', 'Renomear', 'Eliminar', 'Cancelar']);
});

test('rename uses the official endpoint and keeps selection by stable model ID', () => {
  assert.match(dialog, /onRename\(selected, name\)/);
  assert.match(dialog, /Renomear modelo/);
  assert.match(lifecycle, /renameEditorTextModel\(item, name\)/);
  assert.match(actions, /api\.renameDocument\(id, nextName\)/);
  assert.match(actions, /api\.listDocuments\(\)/);
  assert.match(oasis, /renameOasisModel/);
});

test('delete requires an in-app confirmation identifying the model and permanence', () => {
  assert.match(dialog, /role="alertdialog"/);
  assert.match(dialog, /“\{modelLabel\(selected\)\}”/);
  assert.match(dialog, /Esta operação é permanente/);
  assert.match(dialog, /onClick=\{\(\) => void confirmDelete\(\)\}/);
  assert.doesNotMatch(dialog, /window\.confirm/);
  assert.doesNotMatch(lifecycle, /window\.confirm/);
});

test('delete validates the selected numeric ID and server response before removing list entry', () => {
  assert.match(lifecycle, /deleteEditorTextModel\(item\)/);
  assert.match(actions, /api\.deleteDocument\(id\)/);
  assert.match(actions, /result\?\.ok !== true \|\| Number\(result\?\.id\) !== id/);
  assert.match(oasis, /deleteOasisModel/);
});

test('cancel leaves selection/list intact and delete errors stay visible', () => {
  assert.match(dialog, /setDeleteVisible\(false\); setActionError\(''\)/);
  assert.match(dialog, /catch \(deleteError\)/);
  assert.match(dialog, /deleteVisible && selected[\s\S]*?role="alert" className="editor-textos-dialog-error"/);
  assert.match(dialog, /role="alert" className="editor-textos-dialog-error"/);
  assert.match(dialog, /setSelectedId\(null\)/);
});

test('OK and double-click continue opening selected entries', () => {
  assert.match(dialog, /onDoubleClick=\{openSelected\}/);
  assert.match(dialog, /disabled=\{!selected \|\| loading \|\| actionLoading\} onClick=\{openSelected\}/);
  assert.match(dialog, /onOpen\(selectedId\)/);
});

test('rename uses the selected ID, trims name, and refreshes list through API', async () => {
  const calls = [];
  const api = {
    renameDocument: async (...args) => { calls.push(['rename', ...args]); return { id: 42 }; },
    listDocuments: async () => ({ itens: [{ id: 42, nome_exibicao: 'Novo nome' }] }),
  };
  const result = await renameEditorTextModel({ id: 42, nome_exibicao: 'Antigo' }, '  Novo nome  ', api);
  assert.deepEqual(calls, [['rename', 42, 'Novo nome']]);
  assert.equal(result.id, 42);
  assert.equal(result.items[0].nome_exibicao, 'Novo nome');
});

test('rename rejects invalid/system selection and mismatched response without refreshing', async () => {
  let calls = 0;
  const api = {
    renameDocument: async () => { calls += 1; return { id: 99 }; },
    listDocuments: async () => { calls += 1; return { itens: [] }; },
  };
  await assert.rejects(renameEditorTextModel({ id: 0 }, 'Nome', api));
  await assert.rejects(renameEditorTextModel({ id: 42, sistema: true }, 'Nome', api));
  await assert.rejects(renameEditorTextModel({ id: 42 }, '   ', api));
  await assert.rejects(renameEditorTextModel({ id: 42 }, 'Nome', api), /não corresponde/);
  assert.equal(calls, 1);
});

test('delete sends only the validated selected ID and requires matching success', async () => {
  const calls = [];
  const api = { deleteDocument: async (id) => { calls.push(id); return { ok: true, id }; } };
  assert.equal(await deleteEditorTextModel({ id: 199, nome_exibicao: 'Modelo teste' }, api), 199);
  assert.deepEqual(calls, [199]);
  await assert.rejects(deleteEditorTextModel({ id: 88, nome_exibicao: 'Outro' }, {
    deleteDocument: async () => ({ ok: true, id: 89 }),
  }), /não corresponde/);
  await assert.rejects(deleteEditorTextModel({ id: 1, nome_exibicao: 'Base', sistema: true }, api));
});

test('delete API failures propagate so UI can retain the item and show the error', async () => {
  const expected = new Error('Falha simulada no DELETE');
  await assert.rejects(deleteEditorTextModel({ id: 77, nome_exibicao: 'Fixture' }, {
    deleteDocument: async () => { throw expected; },
  }), expected);
});
