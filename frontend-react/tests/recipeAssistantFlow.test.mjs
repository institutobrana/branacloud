import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hasUsablePatient, resolveRecipeAssistantPatient } from '../src/features/editorTextos/models/recipeAssistantFlow.js';
import { normalizeAttestadoDate, normalizeAttestadoTime } from '../src/features/editorTextos/models/atestadoAssistant.js';

const root = path.resolve(import.meta.dirname, '../src/features/editorTextos');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('a patient already in use bypasses patient selection and is forwarded to the recipe assistant', async () => {
  const patient = { id: 271, nome: 'Paciente de teste' };
  let pickerCalls = 0;
  assert.equal(hasUsablePatient(patient), true);
  assert.equal(await resolveRecipeAssistantPatient(patient, async () => { pickerCalls += 1; }), patient);
  assert.equal(pickerCalls, 0);
});

test('without a patient, recipe flow waits for shared selection and treats cancellation as no selection', async () => {
  const selected = { id: 812, nome_completo: 'Paciente selecionado' };
  assert.equal(await resolveRecipeAssistantPatient(null, async () => selected), selected);
  assert.equal(await resolveRecipeAssistantPatient(null, async () => null), null);
  assert.equal(await resolveRecipeAssistantPatient(null, null), null);
});

test('recipe flow uses the app PatientInUse provider and shared MenuPacientesModal; it does not create or replace an Oasis document', () => {
  const app = fs.readFileSync(path.resolve(root, '../../app/App.jsx'), 'utf8');
  const pilot = read('oasis/OasisEditorPilot.jsx');
  assert.match(app, /<EditorTextosPage patientInUse=\{patientInUse\} onRequestPatientSelection=\{requestEditorPatientSelection\}/);
  assert.match(app, /screen === 'editor-textos' && editorPatientMenuOpen/);
  assert.match(app, /finishEditorPatientSelection\(patient\)/);
  assert.match(pilot, /type\.value === 'receita'[\s\S]*resolveRecipeAssistantPatient/);
  const recipeBranch = pilot.slice(pilot.indexOf("if (type.value === 'receita')"), pilot.indexOf('let document = createOasisNewDocument', pilot.indexOf("if (type.value === 'receita')")));
  assert.doesNotMatch(recipeBranch, /client\.document\.set|client\.history\.clear|createOasisNewDocument/);
  assert.match(pilot, /<EditorTextosRecipeAssistantModal/);
});

test('assistant renders compact controls, validates empty medication, previews each include, and keeps PDF signing disabled', () => {
  const modal = read('components/EditorTextosRecipeAssistantModal.jsx');
  const api = read('api/editorTextosApi.js');
  assert.match(api, /assistente-receitas\/contexto/);
  assert.match(api, /assistente-receitas\/medicamentos/);
  for (const field of ['Cirurgião', 'Modelo de receituário', 'Paciente', 'Medicamento', 'Adulto', 'Criança', 'Prescrição', 'Quantidade', 'Uso', 'Observações']) {
    assert.ok(modal.includes(field), `missing assistant field: ${field}`);
  }
  assert.match(modal, /onClick=\{\(\) => void includeMedication\(\)\}/);
  assert.match(modal, /onClick=\{\(\) => void finalizeRecipe\(\)\}/);
  assert.match(modal, /modalRender=\{\(modal\) =>/);
  assert.match(modal, /editor-textos-recipe-assistant__drag-handle/);
  assert.match(modal, /onPreview\?\.\(\{/);
  assert.match(modal, /Campo medicamento não pode ser nulo\./);
  assert.doesNotMatch(modal, /Itens incluídos|item\(ns\) no rascunho|Medicamentos incluídos/);
  assert.match(modal, /width=\{520\}/);
  assert.match(modal, /<Button disabled>Assinar PDF/);
  assert.match(modal, /onCancel=\{\(\) => \{ if \(!including && !finalizing\) onCancel\?\.\(\); \}\}/);
});

test('recipe live preview is transactional, regenerated from the chosen template, and cancel restores prior document metadata/dirty state', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  const styles = read('components/EditorTextosRecipeAssistantModal.css');
  assert.match(pilot, /const prepareRecipeDocument = useCallback/);
  assert.match(pilot, /const installRecipePreview = useCallback/);
  assert.match(pilot, /recipePreviewTransactionRef\.current = \{[\s\S]*snapshot:[\s\S]*previewKey/);
  assert.match(pilot, /client\.document\.set\(document\);[\s\S]*dirtyRef\.current = true;[\s\S]*setDirty\(true\)/);
  assert.match(pilot, /const cancelRecipeAssistant = useCallback/);
  assert.match(pilot, /clientRef\.current\.document\.set\(snapshot\.document\);[\s\S]*setDirty\(snapshot\.dirty\)/);
  assert.match(pilot, /transaction\?\.previewKey === recipePreviewKey\(payload\)/);
  assert.match(pilot, /onPreview=\{installRecipePreview\}/);
  assert.match(pilot, /onCancel=\{cancelRecipeAssistant\}/);
  assert.match(styles, /editor-textos-recipe-assistant-root \.ant-modal-mask/);
  assert.match(styles, /max-height: min\(68vh, 560px\)/);
});

test('legacy recipe assistant previews included items behind the modal and restores the original document state on cancel', () => {
  const legacy = fs.readFileSync(path.resolve(import.meta.dirname, '../../frontend/app.js'), 'utf8');
  const include = legacy.slice(legacy.indexOf('async function editorTextosAssistIncluirAtual'), legacy.indexOf('async function editorTextosAssistPrepararDocumentoFinal'));
  const close = legacy.slice(legacy.indexOf('function editorTextosAssistFechar('), legacy.indexOf('async function editorTextosAssistSelecionarPaciente'));
  const restore = legacy.slice(legacy.indexOf('function editorTextosAssistRestaurarConteudoBase'), legacy.indexOf('function editorTextosInserirTextoNoCursor'));
  assert.match(include, /editorTextosAssistAplicarPreviewItens\(\)/);
  assert.match(legacy, /assistFinalizar\.disabled=!hasItens/);
  assert.doesNotMatch(legacy.slice(legacy.indexOf('async function editorTextosAssistPrepararDocumentoFinal'), legacy.indexOf('async function editorTextosAssistFinalizar')), /cirurgiaoId<=0|modeloId<=0/);
  assert.match(close, /editorTextosAssistRestaurarConteudoBase\(\)/);
  assert.match(restore, /assistConteudoBaseAlterado/);
  const modal = read('components/EditorTextosRecipeAssistantModal.jsx');
  const pilot = read('oasis/OasisEditorPilot.jsx');
  assert.match(modal, /onPreview\?\.\(\{/);
  assert.match(pilot, /installRecipePreview/);
  assert.match(pilot, /recipePreviewTransactionRef\.current = null;[\s\S]*setRecipeAssistantVisible\(false\)/);
});

test('new Atestado uses the shared patient-in-use and patient-menu flow without replacing the current Oasis document', async () => {
  const app = fs.readFileSync(path.resolve(root, '../../app/App.jsx'), 'utf8');
  const pilot = read('oasis/OasisEditorPilot.jsx');
  assert.match(app, /usePatientInUse\(\)/);
  assert.match(app, /screen === 'editor-textos' && editorPatientMenuOpen/);
  assert.match(pilot, /type\.value === 'atestado'[\s\S]*resolveRecipeAssistantPatient/);
  assert.match(pilot, /<EditorTextosAtestadoAssistantModal/);
  assert.match(pilot, /onRequestPatientSelection\(\)/);
  const atestadoBranch = pilot.slice(pilot.indexOf("if (type.value === 'atestado')"), pilot.indexOf('let document = createOasisNewDocument', pilot.indexOf("if (type.value === 'atestado')")));
  assert.doesNotMatch(atestadoBranch, /client\.document\.set|client\.history\.clear|createOasisNewDocument/);
  assert.equal(await resolveRecipeAssistantPatient({ id: 42 }, async () => { throw new Error('picker must not run'); }).then((patient) => patient.id), 42);
  assert.equal(await resolveRecipeAssistantPatient(null, async () => null), null);
});

test('Atestado assistant reuses authenticated context/CID endpoints and legacy date/time normalization', () => {
  const modal = read('components/EditorTextosAtestadoAssistantModal.jsx');
  const api = read('api/editorTextosApi.js');
  assert.match(api, /assistente-atestado\/contexto/);
  assert.match(api, /assistente-atestado\/cid/);
  for (const field of ['Cirurgião', 'Modelo de atestado', 'Paciente', 'Data inicial', 'Data final', 'Hora inicial', 'Hora final', 'Motivo', 'CID', 'Observações']) {
    assert.ok(modal.includes(field), `missing field: ${field}`);
  }
  assert.match(modal, /onClick=\{onCancel\}/);
  assert.match(modal, /disabled>Ok/);
  assert.equal(normalizeAttestadoDate('29022024'), '29/02/2024');
  assert.equal(normalizeAttestadoDate('31/02/2024'), '');
  assert.equal(normalizeAttestadoTime('930'), '09:30');
  assert.equal(normalizeAttestadoTime('2561'), '');
  assert.doesNotMatch(modal, /aria-label="Dias"|Não definido no legado|não há sincronização de dias implementada/);
});

test('Atestado assistant reuses the global DateField contract for both dates and uses compact modal density', () => {
  const modal = read('components/EditorTextosAtestadoAssistantModal.jsx');
  const css = read('components/EditorTextosAtestadoAssistantModal.css');
  assert.match(modal, /import \{ DateField \} from .*DadosPessoaisTab/);
  assert.equal((modal.match(/<DateField label="Data (?:inicial|final)"/g) || []).length, 2);
  assert.match(modal, /width=\{520\}/);
  assert.match(css, /\.editor-textos-attestado-assistant \.ant-modal-body \{ padding: 9px 14px 8px/);
  assert.match(css, /\.editor-textos-attestado-assistant__grid \.ant-input[\s\S]*min-height: 28px/);
});
