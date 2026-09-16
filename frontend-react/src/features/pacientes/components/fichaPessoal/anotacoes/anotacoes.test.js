import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/[A-Z]:/, (value) => value.slice(1)).replaceAll('%20', ' ');
const read = (name) => fs.readFileSync(path.join(dir, name), 'utf8');

test('aba de anotacoes usa componente real e nao placeholder', () => {
  const modal = read('../FichaPessoalModal.jsx');
  assert.match(modal, /AnotacoesTab/);
  assert.match(modal, /activeTab === 'anotacoes' \? <AnotacoesTab content=\{ficha\.form\.anotacoes\}/);
});

test('toolbar contem os grupos visuais contratados', () => {
  const toolbar = read('AnotacoesToolbar.jsx');
  for (const label of ['Negrito', 'Itálico', 'Sublinhado', 'Recortar', 'Copiar', 'Colar', 'Alinhar à esquerda', 'Centralizar', 'Alinhar à direita', 'Justificar', 'Marcadores', 'Tabela', 'Fonte', 'Tamanho da fonte', 'Cor da fonte']) {
    assert.match(toolbar, new RegExp(label));
  }
  for (const icon of ['ScissorOutlined', 'CopyOutlined', 'SnippetsOutlined', 'AlignLeftOutlined', 'AlignCenterOutlined', 'AlignRightOutlined', 'MenuOutlined', 'UnorderedListOutlined', 'TableOutlined', 'FontSizeOutlined', 'BgColorsOutlined']) {
    assert.match(toolbar, new RegExp(icon));
  }
  assert.match(toolbar, /<Tooltip/);
  assert.match(toolbar, /aria-label=\{button\.title\}/);
  assert.match(toolbar, /disabled/);
  assert.match(toolbar, /toggleBold/);
  assert.match(toolbar, /toggleItalic/);
  assert.match(toolbar, /toggleUnderline/);
  assert.match(toolbar, /isActive/);
  assert.match(toolbar, /aria-pressed/);
});

test('editor usa TipTap com StarterKit e callback local', () => {
  const editor = read('AnotacoesEditor.jsx');
  assert.match(editor, /useEditor/);
  assert.match(editor, /StarterKit/);
  assert.match(editor, /getHTML\(\)/);
  assert.match(editor, /EditorContent/);
  assert.match(editor, /Underline/);
});

test('sublinhado possui marca TipTap e regra visual local', () => {
  const toolbar = read('AnotacoesToolbar.jsx');
  const editor = read('AnotacoesEditor.jsx');
  const css = read('../fichaPessoal.css');
  assert.match(toolbar, /toggleUnderline/);
  assert.match(toolbar, /isActive/);
  assert.match(editor, /@tiptap\/extension-underline/);
  assert.match(css, /\.ficha-anotacoes-editor \.tiptap u/);
});

test('alinhamentos e marcadores usam comandos TipTap e os demais permanecem inativos', () => {
  const toolbar = read('AnotacoesToolbar.jsx');
  const editor = read('AnotacoesEditor.jsx');
  assert.match(editor, /@tiptap\/extension-text-align/);
  assert.match(editor, /types: \['paragraph', 'heading'\]/);
  assert.match(toolbar, /setTextAlign/);
  assert.match(toolbar, /toggleBulletList/);
  assert.match(toolbar, /textAlign/);
  assert.match(toolbar, /bulletList/);
  assert.match(toolbar, /disabled=\{!button\.mark && !button\.align && !button\.action\}/);
  assert.match(toolbar, /title: 'Tabela'/);
  assert.match(toolbar, /title: 'Recortar'/);
  assert.match(toolbar, /copySelection/);
  assert.match(toolbar, /cutSelection/);
  assert.match(toolbar, /pasteClipboard/);
  assert.match(toolbar, /onMouseDown/);
  assert.match(toolbar, /Use Ctrl\+V para colar/);
  assert.match(toolbar, /Use Ctrl\+C para copiar/);
  assert.match(toolbar, /Use Ctrl\+X para recortar/);
  assert.match(read('anotacoesClipboard.js'), /setTextSelection/);
  assert.match(read('anotacoesClipboard.js'), /execCommand\('copy'\)/);
  assert.doesNotMatch(read('anotacoesClipboard.js'), /execCommand\('paste'\)/);
  assert.match(toolbar, /insertTable/);
  assert.match(toolbar, /withHeaderRow: false/);
  assert.match(toolbar, /min="1" max="20"/);
  assert.match(toolbar, /min="1" max="10"/);
  assert.match(editor, /@tiptap\/extension-table/);
  assert.match(editor, /TableRow/);
  assert.match(editor, /allowTableNodeSelection: true/);
  assert.match(toolbar, /deleteTable/);
  assert.match(toolbar, /canDeleteTable/);
  assert.match(toolbar, /deleteTable/);
  assert.match(toolbar, /canDeleteTable/);
  assert.match(toolbar, /Excluir tabela/);
});

test('fundacao nao altera payload nem cria save proprio', () => {
  const tab = read('AnotacoesTab.jsx');
  assert.doesNotMatch(tab, /buildPacientePayload|createPaciente|updatePaciente|fetch\(/);
});

test('anotacoes integra estado central e preserva RTF legado', () => {
  const form = read('../useFichaPessoalForm.js');
  const tab = read('AnotacoesTab.jsx');
  const content = read('anotacoesContent.js');
  assert.match(form, /anotacoes: form\.anotacoes \|\| null/);
  assert.match(tab, /serializeAnotacoesHtml/);
  assert.match(content, /BRANA_ANOTACOES_HTML_V1/);
  assert.match(content, /isLegacyRtf/);
  assert.match(content, /startsWith\(RTF_SIGNATURE\)/);
  assert.match(content, /SCRIPT', 'IFRAME', 'OBJECT', 'EMBED/);
});

test('paste usa parser ProseMirror e achata apenas bloco inline unico', () => {
  const clipboard = read('anotacoesClipboard.js');
  assert.match(clipboard, /DOMParser as ProseMirrorDOMParser/);
  assert.match(clipboard, /parseSlice\(container, \{ preserveWhitespace: 'full' \}\)/);
  assert.match(clipboard, /new Slice\(first\.content, 0, 0\)/);
  assert.match(clipboard, /currentParent\?\.type\?\.isTextblock/);
  assert.match(clipboard, /replaceSelection\(slice\)/);
});

test('diagnostico forensic temporario foi removido sem remover o clipboard funcional', () => {
  const toolbar = read('AnotacoesToolbar.jsx');
  const clipboard = read('anotacoesClipboard.js');
  const css = read('../fichaPessoal.css');
  assert.doesNotMatch(toolbar, /clipboard-diagnostic|DIRECT_READ|BROWSER_INFO/);
  assert.doesNotMatch(clipboard, /diagnosticSnapshot|onDiagnostic/);
  assert.doesNotMatch(css, /clipboard-diagnostic/);
  assert.match(clipboard, /export async function copySelection/);
  assert.match(clipboard, /export async function cutSelection/);
  assert.match(clipboard, /export async function pasteClipboard/);
});
