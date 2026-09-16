import assert from 'node:assert/strict';
import test from 'node:test';

test('repeat API contract is POST with the exact legacy payload', async () => {
  const source = await (await import('node:fs/promises')).readFile(new URL('../src/features/agendaSemanal/api/agendaSemanalApi.js', import.meta.url), 'utf8');
  assert.match(source, /export async function repeatAgendaEvent\(itemId, repeatConfig/);
  assert.match(source, /buildApiUrl\('\/agenda-legado\/repetir'\)/);
  assert.match(source, /method: 'POST'/);
  assert.match(source, /body: JSON\.stringify\(payload\)/);
});
