import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LEGACY_FONT_FAMILIES,
  loadLocalFontFamilies,
  normalizeLocalFontFamilies,
  resetLocalFontFamiliesCache,
} from '../src/features/relatoriosConfiguracao/constants/localFontCandidates.js';

const originalWindow = globalThis.window;

test.afterEach(() => {
  resetLocalFontFamiliesCache();
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
});

test('normaliza família, remove duplicatas e ordena sem destruir grafia', () => {
  assert.deepEqual(normalizeLocalFontFamilies([
    { family: 'Tahoma' }, { family: 'arial' }, { family: 'Arial' }, { family: 'Soul Mama' },
  ]), ['arial', 'Arial', 'Soul Mama', 'Tahoma']);
});

test('carrega famílias locais e usa family como unidade', async () => {
  let calls = 0;
  globalThis.window = { queryLocalFonts: async () => { calls += 1; return [{ family: 'Tahoma', fullName: 'Tahoma Bold' }, { family: 'Arial' }, { family: 'Arial' }]; } };
  const result = await loadLocalFontFamilies();
  assert.equal(result.source, 'local');
  assert.equal(result.permissionState, 'granted');
  assert.deepEqual(result.families, ['Arial', 'Tahoma']);
  await loadLocalFontFamilies();
  assert.equal(calls, 1);
});

test('usa fallback quando API está indisponível, vazia ou falha', async () => {
  delete globalThis.window;
  assert.deepEqual((await loadLocalFontFamilies()).families, normalizeLocalFontFamilies(LEGACY_FONT_FAMILIES));
  resetLocalFontFamiliesCache();
  globalThis.window = { queryLocalFonts: async () => [] };
  assert.equal((await loadLocalFontFamilies()).source, 'fallback');
  resetLocalFontFamiliesCache();
  const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' });
  globalThis.window = { queryLocalFonts: async () => { throw error; } };
  const denied = await loadLocalFontFamilies();
  assert.equal(denied.permissionState, 'denied');
  assert.deepEqual(denied.families, normalizeLocalFontFamilies(LEGACY_FONT_FAMILIES));
});

test('trata SecurityError e outros erros como fallback sem lançar', async () => {
  const error = Object.assign(new Error('blocked'), { name: 'SecurityError' });
  globalThis.window = { queryLocalFonts: async () => { throw error; } };
  const result = await loadLocalFontFamilies();
  assert.equal(result.source, 'fallback');
  assert.equal(result.permissionState, 'unknown');
});
