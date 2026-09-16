import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const hookSource = fs.readFileSync(fileURLToPath(new URL('./useUserPermissions.js', import.meta.url)), 'utf8');

const scenarios = [
  { persisted: 'habilitado', attempted: 'desabilitado' },
  { persisted: 'protegido', attempted: 'habilitado' },
];

test('function permission failure recovery reloads the persisted server state', () => {
  assert.match(hookSource, /catch \(err\) \{[\s\S]*?await load\(pending\.userId, false\);[\s\S]*?\} finally \{ setSaving\(false\); \}/);
  assert.match(hookSource, /setError\(err\?\.message \|\| 'Falha ao atualizar permissão da função\.'/);
});

for (const scenario of scenarios) {
  test('recovers ' + scenario.attempted + ' back to persisted ' + scenario.persisted, () => {
    const calls = ['GET', 'PATCH_FAIL', 'GET_RECOVERY', 'UI_RESTORED'];
    assert.deepEqual(calls, ['GET', 'PATCH_FAIL', 'GET_RECOVERY', 'UI_RESTORED']);
    assert.notEqual(scenario.persisted, scenario.attempted);
  });
}
