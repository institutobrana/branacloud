import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const dialog = await readFile(new URL('../src/features/editorTextos/components/EditorTextosSignPdfDialog.jsx', import.meta.url), 'utf8');
const pilot = await readFile(new URL('../src/features/editorTextos/oasis/OasisEditorPilot.jsx', import.meta.url), 'utf8');
const api = await readFile(new URL('../src/features/editorTextos/api/localSignatureBridgeApi.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/features/editorTextos/oasis/oasisEditorPilot.css', import.meta.url), 'utf8');

test('modal Windows exige endpoint disponível e escolha explícita quando necessário', () => {
  assert.match(dialog, /availableCertificates/);
  assert.match(dialog, /authorizationEndpointsAvailable/);
  assert.match(dialog, /disabled=\{loading \|\| !authorizationEndpointsAvailable \|\| !selectedCertificate\}/);
  assert.match(dialog, /Escolha explicitamente uma identidade/);
  assert.match(dialog, /Consultar identidades deste computador/);
  assert.match(dialog, /Identidade em arquivo PFX\/P12/);
  assert.match(dialog, /pfx|p12/i);
});

test('cliente consulta somente certificados autorizados e o piloto bloqueia antes do pairing', () => {
  assert.match(api, /\/signature-certificates\/available/);
  assert.match(pilot, /getAvailableSignatureCertificates/);
  assert.match(pilot, /Nenhum pareamento foi iniciado/);
  assert.match(pilot, /certificateDerSha256: selectedCertificate\.certificateDerSha256/);
  assert.match(pilot, /crossSignatureIdentities/);
  assert.match(pilot, /createLocalSignatureReservationRequest/);
  assert.match(pilot, /bindLocalSignatureReservation/);
  assert.match(pilot, /reservation\.status !== 'RESERVED'/);
  assert.match(pilot, /setLocalApproval/);
  assert.match(pilot, /confirmLocalSignatureAuthorization/);
});

test('diagnósticos continuam atrás do gate de desenvolvimento', () => {
  assert.match(pilot, /showDevDiagnostics=\{import\.meta\.env\.DEV/);
  assert.match(dialog, /showDevDiagnostics && devWpfApprovalEnabled/);
});

test('modal indisponível mantém conteúdo vertical e ações responsivas', () => {
  assert.match(dialog, /editor-textos-sign-certificate/);
  assert.match(dialog, /Assinatura digital indisponível no momento\. Nenhum pareamento ou operação será iniciado\./);
  assert.doesNotMatch(dialog, /Assinatura Windows indisponível no momento/);
  assert.match(dialog, /disabled=\{loading \|\| !authorizationEndpointsAvailable \|\| !selectedCertificate\}/);
  assert.match(pilot, /if \(!authorizationEndpointsAvailable \|\| !selectedCertificate/);
  assert.match(dialog, /const userError/);
  assert.match(styles, /editor-textos-sign-pdf-form>\.editor-textos-dialog-actions\{display:flex;flex-wrap:wrap/);
  assert.match(styles, /overflow-wrap:anywhere/);
  assert.match(styles, /editor-textos-sign-certificate\{display:grid/);
});
