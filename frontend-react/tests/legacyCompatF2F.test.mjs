import test from 'node:test';
import assert from 'node:assert/strict';
import { documentDtoToModel, documentModelToPayload } from '../src/features/editorTextos/models/documentModel.js';
import { LEGACY_DOCUMENT_FORMATS } from '../src/features/editorTextos/models/LegacyDocumentFormatDetector.js';

const model = (id, content, extension = '.txt') => documentDtoToModel({ id, nome_exibicao: `fixture-${id}`, extensao: extension, conteudo_html: content });

test('F2F libera somente plain text estruturalmente detectado', () => {
  const result = model(187, 'Linha 1\nLinha 2\nação <literal> & {{Campo}}');
  assert.equal(result.importSafety.format, LEGACY_DOCUMENT_FORMATS.PLAIN_TEXT);
  assert.equal(result.importSafety.editable, true);
  assert.equal(result.importSafety.resaveAllowed, true);
  assert.equal(result.content, '<p>Linha 1</p><p>Linha 2</p><p>ação &lt;literal&gt; &amp; {{Campo}}</p>');
});

test('F2F não libera TXT que contém assinatura RTF', () => {
  const result = model(12, '{\\rtf1\\ansi Texto\\par}', '.txt');
  assert.equal(result.importSafety.format, LEGACY_DOCUMENT_FORMATS.RTF);
  assert.equal(result.importSafety.editable, false);
  assert.equal(result.importSafety.resaveAllowed, false);
});

test('F2F mantém RTF, MOD/REC e OLE protegidos', () => {
  for (const [id, content, extension] of [
    [11, '{\\rtf1\\ansi A}', '.rtf'],
    [63, '{\\rtf1\\ansi A}', '.mod'],
    [38, '{\\rtf1\\ansi A}', '.rec'],
    [200, String.fromCharCode(0xD0, 0xCF, 0x11, 0xE0), '.doc'],
  ]) {
    const result = model(id, content, extension);
    assert.equal(result.importSafety.editable, false, `${extension} must remain protected`);
  }
});

test('F2F não usa extensão como único critério', () => {
  const plain = model(1, 'conteúdo simples', '.rtf');
  const rtf = model(2, '{\\rtf1\\ansi conteúdo}', '.txt');
  assert.equal(plain.importSafety.editable, true);
  assert.equal(rtf.importSafety.editable, false);
});

test('F2F preserva tokens e markup literal em plain text', () => {
  const result = model(3, '<<Categoria.Campo>> <tag> & {{Historico.Campo}}');
  assert.equal(result.importSafety.editable, true);
  assert.match(result.content, /&lt;&lt;Categoria\.Campo&gt;&gt;/);
  assert.match(result.content, /&lt;tag&gt;/);
  assert.match(result.content, /\{\{Historico\.Campo\}\}/);
});

test('F2F save representation mantém model id e extensão sem salvar documento real', () => {
  const result = model(4, 'texto editável');
  const payload = documentModelToPayload(result, '<p>texto editado</p>');
  assert.equal(result.id, 4);
  assert.equal(payload.extensao, '.txt');
  assert.equal(payload.conteudo_formato, 'html');
  assert.equal(payload.conteudo, '<p>texto editado</p>');
});

test('F2F controles negativos permanecem não editáveis', () => {
  assert.equal(model(11, '{\\rtf1\\ansi A}', '.rtf').importSafety.editable, false);
});

test('F2F modo de homologação abre RTF-family editável somente em memória', () => {
  for (const [id, extension] of [[11, '.rtf'], [63, '.mod'], [38, '.rec']]) {
    const result = documentDtoToModel({ id, nome_exibicao: `fixture-${id}`, extensao: extension, conteudo_html: '<p>conteúdo legado</p>' }, { manualLegacyTestMode: true });
    assert.equal(result.importSafety.manualLegacyTestAllowed, true);
    assert.equal(result.importSafety.editable, false);
    assert.equal(result.importSafety.resaveAllowed, false);
  }
});

test('F2F modo de homologação não transforma plain text em caso legado', () => {
  const result = documentDtoToModel({ id: 60, extensao: '.txt', conteudo_html: 'texto simples' }, { manualLegacyTestMode: true });
  assert.equal(result.importSafety.format, 'PLAIN_TEXT');
  assert.equal(result.importSafety.editable, true);
  assert.equal(result.importSafety.resaveAllowed, true);
});
