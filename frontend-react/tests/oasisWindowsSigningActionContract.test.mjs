import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const pilot = fs.readFileSync(new URL('../src/features/editorTextos/oasis/OasisEditorPilot.jsx', import.meta.url), 'utf8');
const dialog = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosSignPdfDialog.jsx', import.meta.url), 'utf8');

test('Windows certificate action is explicit and gated by the local-signature flag', () => {
  assert.match(dialog, /data-testid="sign-with-windows-certificate"/);
  assert.match(dialog, /Assinar PDF/);
  assert.match(pilot, /LOCAL_SIGNATURE_EXPERIMENT_ENABLED/);
  assert.match(pilot, /prepareLocalPdf\(\{ pdf: exported\.value\.blob/);
  assert.match(pilot, /waitForLocalPairingApproval/);
  assert.match(pilot, /waitForLocalOperationApproval/);
  assert.match(pilot, /signLocalOperation/);
  assert.match(pilot, /getLocalSignatureResult/);
  assert.match(pilot, /isRecoveredPdfValid/);
});

test('legacy PFX action remains separate from the Windows certificate action', () => {
  assert.match(dialog, /legacyMode = false/);
  assert.match(dialog, /accept="\.pfx,\.p12,application\/x-pkcs12"/);
  assert.match(dialog, /onSign\?\.\(\{ certificate, password \}\)/);
  assert.match(dialog, /onPrepareLocal/);
});

test('normal Windows modal hides legacy credentials and development diagnostics', () => {
  assert.match(dialog, /!legacyMode && localEnabled/);
  assert.match(dialog, /showDevDiagnostics && devWpfApprovalEnabled/);
  assert.match(dialog, /showDevDiagnostics && devFakeEnabled/);
  assert.match(dialog, /legacyMode && <Button htmlType="submit"/);
  assert.match(pilot, /showDevDiagnostics=\{import\.meta\.env\.DEV/);
});
