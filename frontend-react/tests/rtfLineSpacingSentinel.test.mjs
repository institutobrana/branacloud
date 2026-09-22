import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { convertRtfHtmlToOasis } from '../src/features/editorTextos/adapters/editorLegacyToOasisAdapter.js';

const createParagraph = (text) => ({ type: 'paragraph', text, runs: [{ kind: 'text', text }] });
const createDocument = ({ blocks }) => ({ sections: [{ blocks }] });

test('natural RTF line spacing sentinel remains unspecified in Oasis rather than becoming a fixed 50pt line', () => {
  const html = '<p data-rtf-font-size-pt="10">Texto da etiqueta</p><p data-rtf-font-size-pt="12">Outro campo</p>';
  const converted = convertRtfHtmlToOasis(html, {
    createDocument,
    createParagraph,
    Parser: new JSDOM('').window.DOMParser,
  });
  assert.equal(converted.document.sections[0].blocks.length, 2);
  assert.ok(converted.document.sections[0].blocks.every((block) => !block.style?.lineHeight && !block.style?.lineRule));
});

test('explicit non-sentinel RTF line spacing still transfers to Oasis', () => {
  const html = '<p data-rtf-line-spacing="18" data-rtf-line-rule="exact">Documento comum</p>';
  const converted = convertRtfHtmlToOasis(html, {
    createDocument,
    createParagraph,
    Parser: new JSDOM('').window.DOMParser,
  });
  assert.equal(converted.document.sections[0].blocks[0].style.lineRule, 'exact');
  assert.equal(converted.document.sections[0].blocks[0].style.lineHeight, 24);
});
