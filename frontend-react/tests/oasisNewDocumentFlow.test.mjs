import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { findNewTextTemplate, getNewTextType, NEW_TEXT_TYPES } from '../src/features/editorTextos/models/editorTextosModalModels.js';

const root = path.resolve(import.meta.dirname, '../src/features/editorTextos');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('new-document options match the five audited legacy functional types and categories', () => {
  assert.deepEqual(NEW_TEXT_TYPES.map(({ value }) => value), ['receita', 'atestado', 'carta_paciente', 'carta_simples', 'texto_branco']);
  assert.deepEqual(NEW_TEXT_TYPES.map(({ type }) => type), ['receitas', 'atestados', 'outros', 'outros', 'outros']);
  assert.equal(getNewTextType('unknown'), null);
});

test('new-document dialog places compact actions directly under the five-item type list in the same narrow column', () => {
  const dialog = read('components/EditorTextosNewDocumentDialog.jsx');
  const styles = read('components/EditorTextosNewDocumentDialog.css');
  assert.match(dialog, /rootClassName="editor-textos-new-document-modal"/);
  assert.match(dialog, /width=\{312\}/);
  assert.match(dialog, /size=\{5\}/);
  assert.match(dialog, /className="editor-textos-new-document-type-list"/);
  assert.match(styles, /width: min\(312px, calc\(100vw - 24px\)\)/);
  assert.match(styles, /height: auto/);
  assert.match(styles, /width: 200px/);
  assert.match(styles, /height: 106px/);
  assert.match(styles, /overflow-y: hidden/);
  assert.match(styles, /editor-textos-new-document-type-column \{\s*width: 200px/);
  assert.match(styles, /editor-textos-new-document-actions \{\s*display: flex;\s*justify-content: flex-end;\s*gap: 8px;\s*width: 200px;\s*margin-top: 8px/s);
  assert.match(dialog, /editor-textos-new-document-type-column[\s\S]*editor-textos-new-document-type-list[\s\S]*editor-textos-new-document-actions/);
  assert.match(dialog, /footer=\{null\}/);
  assert.match(styles, /@media \(max-width: 420px\)/);
  assert.match(styles, /width: min\(312px, calc\(100vw - 24px\)\) !important/);
  assert.match(styles, /width: min\(200px, calc\(100% - 16px\)\)/);
});

test('legacy default template matching is restricted to exact type/name rules and prefers system defaults', () => {
  const entries = [
    { id: 30, nome: 'Receita', tipo_modelo: 'receitas', sistema: false },
    { id: 21, nome: 'Receita.mod', tipo_modelo: 'receitas', sistema: true },
    { id: 1, nome: 'Receita', tipo_modelo: 'outros', sistema: true },
  ];
  assert.equal(findNewTextTemplate(entries, getNewTextType('receita')).id, 21);
  assert.equal(findNewTextTemplate(entries, getNewTextType('texto_branco')), null);
});

test('Oasis New Document waits for type confirmation and protects dirty work before replacement', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  const dialog = read('components/EditorTextosNewDocumentDialog.jsx');
  assert.match(pilot, /action === 'new-document'\) requestNewOasisDocument\(\)/);
  assert.match(pilot, /if \(dirtyRef\.current\) \{\s*pendingNewDocumentRef\.current = true;\s*setUnsavedVisible\(true\)/);
  assert.match(pilot, /client\.document\.set\(document\)/);
  assert.match(pilot, /documentTypeRef\.current = type\.type/);
  assert.match(pilot, /savedSnapshotRef\.current = null;\s*dirtyRef\.current = true;\s*setDirty\(true\)/);
  assert.match(dialog, /mode, setMode\] = useState\('create_new'\)/);
  assert.match(dialog, /selectedType, setSelectedType\] = useState\('receita'\)/);
  assert.match(dialog, /Abrir um texto já existente\.\.\./);
  assert.match(dialog, /Criar um novo texto do tipo:/);
  assert.match(dialog, /disabled=\{!createMode\}/);
  assert.match(dialog, /onClick=\{\(\) => createMode \? onCreate\(selectedType\) : onOpenExisting\(\)\}/);
  assert.match(pilot, /onOpenExisting=\{\(\) => \{ setNewDocumentVisible\(false\); void showOpenOasis\(\); \}\}/);
  assert.doesNotMatch(dialog, /createOasisNewDocument|client\.document\.(?:set|load)/);
  assert.match(dialog, /onCancel=\{onCancel\}/);
});

test('opening existing from the New dialog reuses the same Open-model listing flow without creating a document', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  const openFlow = pilot.slice(pilot.indexOf('const showOpenOasis'), pilot.indexOf('const renameOasisModel'));
  assert.match(openFlow, /editorTextosApi\.listDocuments\(\)/);
  assert.match(pilot, /if \(action === 'open'\) void showOpenOasis\(\)/);
  assert.match(pilot, /onOpenExisting=\{\(\) => \{ setNewDocumentVisible\(false\); void showOpenOasis\(\); \}\}/);
  assert.match(pilot, /onCreate=\{\(typeKey\) => \{ void createNewOasisByType\(typeKey\); \}\}/);
});

test('selected functional category is persisted as Oasis metadata instead of a legacy file extension', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  assert.match(pilot, /tipo_modelo: documentTypeRef\.current \|\| 'outros'/);
  assert.match(pilot, /extensao: '\.txt'/);
  assert.match(pilot, /documentTypeRef\.current = String\(dto\?\.tipo_modelo \|\| 'outros'\)/);
});
