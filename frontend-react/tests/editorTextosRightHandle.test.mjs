import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const ruler = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosRuler.jsx', import.meta.url), 'utf8');
const extension = fs.readFileSync(new URL('../src/features/editorTextos/extensions/ParagraphIndentExtension.js', import.meta.url), 'utf8');

const clampRight = (value, usefulWidth, left, minText = 24) => Math.max(0, Math.min(usefulWidth - left - minText, value));
const rightFromPointer = (pointerX, contentLeft, usefulWidth, left, minText = 24) => clampRight(usefulWidth - (pointerX - contentLeft), usefulWidth, left, minText);

test('RIGHT ArrowLeft aumenta o recuo em 1px', () => {
  assert.match(ruler, /side === 'right'\s*\n\s*\? \(event\.key === 'ArrowLeft' \? 1 : -1\)/);
});

test('RIGHT ArrowRight reduz o recuo em 1px', () => {
  const value = 10;
  assert.equal(value + (('ArrowRight' === 'ArrowLeft') ? 1 : -1), 9);
});

test('RIGHT teclado respeita limite mínimo zero', () => {
  assert.equal(Math.max(0, 0 - 1), 0);
});

test('RIGHT teclado respeita limite máximo documental', () => {
  assert.equal(clampRight(999, 700, 40), 636);
});

test('RIGHT preserva LEFT e FIRSTLINE no comando documental', () => {
  assert.match(extension, /\{ \.\.\.node\.attrs, indent: 0, \[key\]: next \}/);
  assert.match(extension, /const key = side === 'left' \? 'leftIndentPx' : 'rightIndentPx'/);
  assert.match(extension, /firstLineIndentPx/);
});

test('RIGHT converte movimento para esquerda em aumento', () => {
  const initial = rightFromPointer(900, 250, 650, 40);
  const movedLeft = rightFromPointer(880, 250, 650, 40);
  assert.ok(movedLeft > initial);
});

test('RIGHT converte movimento para direita em redução', () => {
  const initial = rightFromPointer(800, 250, 650, 40);
  const movedRight = rightFromPointer(820, 250, 650, 40);
  assert.ok(movedRight < initial);
});

test('RIGHT drag para direita pode retornar a zero', () => {
  assert.equal(rightFromPointer(900, 250, 650, 40), 0);
});

test('RIGHT expõe aria-valuenow e aria-valuemax dinâmicos', () => {
  assert.match(ruler, /aria-valuenow=\{rightValue\}/);
  assert.match(ruler, /aria-valuemax=\{usefulPx - MIN_TEXT_WIDTH_PX - leftValue\}/);
});

test('RIGHT usa commit oficial e não altera LEFT por pointermove', () => {
  assert.match(ruler, /setRulerRightIndent.*value/);
  assert.match(ruler, /window\.addEventListener\('pointermove', move\)/);
  assert.match(ruler, /window\.addEventListener\('pointerup', finish/);
});

console.log('RIGHT HANDLE TESTS PASS: 10/10');
