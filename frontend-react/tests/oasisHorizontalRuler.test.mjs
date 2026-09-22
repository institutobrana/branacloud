import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { applyRulerIndent, buildRulerGeometry, buildRulerTicks, calculateIndentValue, getIndentBounds, getRulerDocumentModel, OASIS_RULER_PX_PER_CM, OASIS_RULER_SNAP_CM, resolveCurrentParagraph } from '../src/features/editorTextos/oasis/oasisRulerAdapter.js';
import { decodeOasisEnvelope, encodeOasisEnvelope } from '../src/features/editorTextos/persistence/oasisDocumentEnvelope.js';

const sourceRoot = path.resolve(import.meta.dirname, '../src/features/editorTextos/oasis');

test('ruler maps page pixels, margins and indents into zoomed screen geometry', () => {
  const page = { width: 816, margins: { left: 96, right: 96 } };
  const geometry = buildRulerGeometry(page, { indentLeft: 10, indentRight: 12, indentFirstLine: 8, indentHanging: 0 }, 1.5);
  assert.equal(geometry.pageWidth, 1224);
  assert.equal(geometry.leftMargin, 144);
  assert.equal(geometry.contentRight, 1080);
  assert.equal(geometry.leftMarker, 159);
  assert.equal(geometry.firstLineMarker, 171);
  assert.equal(geometry.rightMarker, 1062);
});

test('ruler creates half-centimeter ticks and centimeter labels at 96dpi', () => {
  const ticks = buildRulerTicks(OASIS_RULER_PX_PER_CM * 2, 1);
  assert.deepEqual(ticks.filter((tick) => tick.label).map((tick) => tick.label), ['0', '1', '2']);
  assert.equal(ticks.length, 5);
});

test('active paragraph comes from selection focus, including nested table blocks', () => {
  const para = { id: 'p-active', type: 'paragraph', runs: [], style: { indentLeft: 18 } };
  const doc = { sections: [{ blocks: [{ type: 'table', rows: [{ cells: [{ blocks: [para] }] }] }] }] };
  assert.equal(resolveCurrentParagraph(doc, { anchor: {}, focus: { paragraphId: 'p-active' } }) , para);
});

test('ruler model reads page and inherited paragraph indent data without mutating document', () => {
  const document = {
    sections: [{ pageSettings: { width: 816, height: 1056, margins: { left: 96, right: 96 } }, blocks: [{ id: 'p1', type: 'paragraph', runs: [], style: { styleId: 'body', indentLeft: 24 } }] }],
    styles: { body: { id: 'body', name: 'Corpo', type: 'paragraph', paragraphStyle: { indentFirstLine: 12, indentRight: 6 } } },
  };
  const before = JSON.stringify(document);
  const client = {
    getState: () => ({ document, selection: { anchor: {}, focus: { paragraphId: 'p1' } }, activeSectionIndex: 0 }),
    ui: { zoom: { get: () => 125 } },
  };
  const model = getRulerDocumentModel(client);
  assert.deepEqual(model.indents, { indentLeft: 24, indentRight: 6, indentFirstLine: 12, indentHanging: 0 });
  assert.equal(model.markersDataSource, 'REAL');
  assert.equal(model.zoomPercent, 125);
  assert.equal(JSON.stringify(document), before);
});

test('paragraph indents remain in the Oasis document envelope roundtrip', () => {
  const document = { id: 'doc-1', sections: [{ blocks: [{ id: 'p1', type: 'paragraph', runs: [], style: { indentLeft: 21, indentRight: 9, indentFirstLine: 6 } }] }] };
  const restored = decodeOasisEnvelope(JSON.stringify(encodeOasisEnvelope(document))).document;
  assert.deepEqual(restored.sections[0].blocks[0].style, { indentLeft: 21, indentRight: 9, indentFirstLine: 6 });
});

test('ruler markers subscribe to selection, document, UI and scrolling and expose accessible controls', () => {
  const component = fs.readFileSync(path.join(sourceRoot, 'OasisHorizontalRuler.jsx'), 'utf8');
  const css = fs.readFileSync(path.join(sourceRoot, 'oasisEditorPilot.css'), 'utf8');
  assert.match(component, /selectionChange/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /addEventListener\('scroll', onScroll, true\)/);
  assert.match(component, /viewportRect/);
  assert.match(component, /clipPath/);
  assert.match(component, /aria-hidden="true"/);
  assert.match(component, /role="slider"/);
  assert.match(component, /aria-valuetext/);
  assert.match(component, /applyRulerIndent/);
  assert.doesNotMatch(component, /setPageMargins|setIndentHanging/);
  assert.match(css, /editor-textos-oasis-ruler\{[^}]*pointer-events:none/);
  assert.match(css, /--oasis-editor-gutter-top:26px/);
});

test('ruler indent mapping is snapped, bounded, and dispatches only the selected paragraph indent commands', () => {
  const pageSettings = { width: 816, margins: { left: 96, right: 96, top: 72, bottom: 72 } };
  const model = { pageSettings, paragraphId: 'p1', indents: { indentLeft: 20, indentRight: 30, indentFirstLine: 10, indentHanging: 0 } };
  const before = structuredClone(pageSettings);
  const maxLeft = getIndentBounds('left', model).max;
  assert.ok(calculateIndentValue('left', 700, model) <= maxLeft);
  assert.equal(calculateIndentValue('left', 0, model), 0);
  assert.equal(calculateIndentValue('firstLine', 96 + 20 + OASIS_RULER_PX_PER_CM * 0.26, model), OASIS_RULER_PX_PER_CM * OASIS_RULER_SNAP_CM * 3);
  assert.equal(calculateIndentValue('right', 800, model), 0);
  const calls = [];
  const client = {
    getState: () => ({ document: { sections: [{ pageSettings, blocks: [{ id: 'p1', type: 'paragraph', style: model.indents }] }] }, selection: { focus: { paragraphId: 'p1' } } }),
    commands: { execute: (...args) => calls.push(args) },
  };
  assert.equal(applyRulerIndent(client, 'p1', 'left', 42), true);
  assert.deepEqual(calls, [['setIndentLeft', 42]]);
  assert.equal(applyRulerIndent(client, 'p1', 'firstLine', 18), true);
  assert.equal(applyRulerIndent(client, 'p1', 'right', 27), true);
  assert.deepEqual(calls, [['setIndentLeft', 42], ['setIndentFirstLine', 18], ['setIndentRight', 27]]);
  assert.deepEqual(pageSettings, before);
  assert.equal(applyRulerIndent(client, 'other', 'left', 42), false);
});
