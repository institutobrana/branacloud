import test from 'node:test';
import assert from 'node:assert/strict';
import dayjs from 'dayjs';
import { normalizeContaCorrenteDateInput, formatContaCorrenteDate } from '../src/features/contaCorrenteCirurgiao/dateParsing.js';

const referenceDate = dayjs('2026-08-15');

test('normalizeContaCorrenteDateInput resolves short values against an explicit reference date', () => {
  assert.equal(normalizeContaCorrenteDateInput('01', referenceDate)?.format('DD/MM/YYYY'), '01/08/2026');
  assert.equal(normalizeContaCorrenteDateInput('0107', referenceDate)?.format('DD/MM/YYYY'), '01/07/2026');
  assert.equal(normalizeContaCorrenteDateInput('010126', referenceDate)?.format('DD/MM/YYYY'), '01/01/2026');
});

test('normalizeContaCorrenteDateInput preserves full valid dates and rejects invalid calendar values', () => {
  assert.equal(normalizeContaCorrenteDateInput('01/01/2026', referenceDate)?.format('DD/MM/YYYY'), '01/01/2026');
  assert.equal(normalizeContaCorrenteDateInput('29/02/2024', referenceDate)?.format('DD/MM/YYYY'), '29/02/2024');
  assert.equal(normalizeContaCorrenteDateInput('320126', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('011326', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('310226', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('290225', referenceDate), null);
});

test('normalizeContaCorrenteDateInput ignores empty and unsupported lengths without applying period defaults', () => {
  assert.equal(normalizeContaCorrenteDateInput('', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('1', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('123', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('12345', referenceDate), null);
  assert.equal(normalizeContaCorrenteDateInput('12345678', referenceDate), null);
});

test('formatContaCorrenteDate returns the normalized display format', () => {
  assert.equal(formatContaCorrenteDate('010126'), '01/01/2026');
  assert.equal(formatContaCorrenteDate('320126'), null);
});
