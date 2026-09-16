import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.join(here, '../src/features/agendaDiaria/AgendaDiariaPage.jsx');
const source = fs.readFileSync(pagePath, 'utf8');

test('AgendaDiariaPage mantém o contrato de montagem do scheduler diário', () => {
  assert.match(source, /AgendaScheduler/);
  assert.match(source, /initialMode="dia"/);
  assert.match(source, /events=\{agenda\.events\}/);
  assert.doesNotMatch(source, /return\s+null\s*;/);
});
