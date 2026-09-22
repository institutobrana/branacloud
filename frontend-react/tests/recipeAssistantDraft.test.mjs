import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildRecipeAssistantBody, createRecipeAssistantItem, hasOasisMergeSeparatorInText, joinOasisTextNodes, mergeOasisTextNodes } from '../src/features/editorTextos/models/recipeAssistantDraft.js';

const root = path.resolve(import.meta.dirname, '../src/features/editorTextos');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('included recipe items are immutable snapshots including the adult/child mode and real medication fields', () => {
  const medication = { id: 12, nome: 'Amoxicilina', apresentacao: '500 mg — cápsula' };
  const adult = createRecipeAssistantItem({ medication, ageGroup: 'adulto', prescription: '1 cápsula', quantity: '14', usageId: 4, usageLabel: 'Uso interno', observations: 'após refeição' });
  const child = createRecipeAssistantItem({ medication, ageGroup: 'crianca', prescription: '5 ml', quantity: '1 frasco', usageId: 4, usageLabel: 'Uso interno', observations: '' });
  assert.deepEqual([adult.medicationId, adult.medicationName, adult.presentation, adult.adultChildMode], [12, 'Amoxicilina', '500 mg — cápsula', 'adulto']);
  assert.equal(child.adultChildMode, 'crianca');
  assert.equal(adult.prescription, '1 cápsula');
  assert.equal(child.prescription, '5 ml');
  assert.equal(createRecipeAssistantItem({ medication: null }), null);
});

test('recipe body groups by usage in first-seen order, numbers inclusion order, and retains independent item details', () => {
  const items = [
    { medicationName: 'Amoxicilina', adultChildMode: 'adulto', quantity: '14 cápsulas', usageLabel: 'Uso interno', prescription: '1 cápsula a cada 8 horas', observations: 'Após refeição' },
    { medicationName: 'Ibuprofeno', adultChildMode: 'crianca', quantity: '1 frasco', usageLabel: 'Uso interno', prescription: '5 ml a cada 6 horas', observations: '' },
    { medicationName: 'Colírio', adultChildMode: 'adulto', quantity: '1 unidade', usageLabel: 'Uso externo', prescription: 'Aplicar 1 gota', observations: '' },
  ];
  const body = buildRecipeAssistantBody(items);
  assert.ok(body.indexOf('Uso interno :') < body.indexOf('Uso externo :'));
  assert.ok(body.indexOf('01 - Amoxicilina') < body.indexOf('02 - Ibuprofeno (Criança)'));
  assert.ok(body.indexOf('02 - Ibuprofeno') < body.indexOf('03 - Colírio'));
  assert.match(body, /14 cápsulas/);
  assert.match(body, /1 frasco/);
  assert.match(body, /5 ml a cada 6 horas/);
  assert.match(body, /Obs\.: Após refeição/);
});

test('native Oasis merge rewrites text runs in a cloned template and preserves its other structure', () => {
  const template = {
    id: 'template-id', title: 'Modelo',
    sections: [{ blocks: [{ type: 'paragraph', style: { alignment: 'center' }, runs: [
      { kind: 'text', text: 'Paciente: <<Paciente.NomeCompleto>>' },
      { kind: 'text', text: ' <<Receita.Corpo>>' },
    ] }] }],
  };
  const source = joinOasisTextNodes(template);
  assert.match(source, /<<Receita.Corpo>>/);
  const merged = source.replace('<<Paciente.NomeCompleto>>', 'Maria').replace('<<Receita.Corpo>>', 'Uso interno :\n01 - Amoxicilina');
  const result = mergeOasisTextNodes(template, merged);
  assert.equal(result.sections[0].blocks[0].style.alignment, 'center');
  assert.equal(result.sections[0].blocks[0].runs[0].text, 'Paciente: Maria');
  assert.equal(result.sections[0].blocks[0].runs[1].text, ' Uso interno :\n01 - Amoxicilina');
  assert.equal(template.sections[0].blocks[0].runs[0].text, 'Paciente: <<Paciente.NomeCompleto>>');
  assert.equal(result.id, 'template-id');
});

test('native Oasis recipe merge treats inter-run delimiters as structural, not residual document content', () => {
  const separator = '\uE000BRANA_RECIPE_MERGE\uE001';
  const template = {
    sections: [{ blocks: [{ type: 'paragraph', runs: [
      { kind: 'text', text: 'Paciente: <<Paciente.NomeCompleto>>' },
      { kind: 'text', text: '\n<<Receita.Corpo>>' },
    ] }] }],
  };

  for (const body of ['01 - Amoxicilina 500 mg\n1 cápsula a cada 8 horas', '01 - Amoxicilina 500 mg\n1 cápsula\n\n02 - Ibuprofeno 400 mg\n1 comprimido']) {
    const source = joinOasisTextNodes(template);
    const mergedSource = source.replace('<<Paciente.NomeCompleto>>', 'Maria').replace('<<Receita.Corpo>>', body);
    const result = mergeOasisTextNodes(template, mergedSource);
    assert.equal(result.sections[0].blocks[0].runs[0].text, 'Paciente: Maria');
    assert.ok(result.sections[0].blocks[0].runs[1].text.includes(body));
    assert.equal(hasOasisMergeSeparatorInText(result), false);
    // Flattening intentionally reconstructs the structural delimiter between runs.
    assert.ok(joinOasisTextNodes(result).includes(separator));
  }

  const actualResidual = structuredClone(template);
  actualResidual.sections[0].blocks[0].runs[1].text += separator;
  assert.equal(hasOasisMergeSeparatorInText(actualResidual), true);
});

test('recipe preview/finalization uses selected model and merge endpoint, installs dirty preview, and finalizes without another rewrite', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  const modal = read('components/EditorTextosRecipeAssistantModal.jsx');
  assert.match(pilot, /getDocument\(Number\(modelId\)\)/);
  assert.match(pilot, /mergeEditorTextContent\([\s\S]*extras: \{ 'Receita\.Corpo': body \}/);
  assert.match(pilot, /documentIdRef\.current = null;[\s\S]*sourceRef\.current = \{ format: 'oasis', origin: 'recipe-assistant'/);
  assert.match(pilot, /client\.document\.set\(document\);[\s\S]*client\.history\.clear\(\);[\s\S]*setDirty\(true\)/);
  assert.match(pilot, /const installRecipePreview = useCallback/);
  assert.match(pilot, /const prepareRecipeDocument = useCallback/);
  assert.match(pilot, /hasOasisMergeSeparatorInText\(document\)/);
  assert.doesNotMatch(pilot, /joinOasisTextNodes\(document\)\.includes\(separator\)/);
  assert.match(pilot, /transaction\?\.previewKey === recipePreviewKey\(payload\)/);
  assert.match(pilot, /onFinalize=\{finalizeRecipe\}/);
  assert.match(modal, /onPreview\?\.\(\{[\s\S]*items: nextItems\.map/);
  assert.match(modal, /items: recipeItems\.map\(\(item\) => \(\{ \.\.\.item \}\)\)/);
  assert.match(modal, /setPrescription\(''\);[\s\S]*setQuantity\(''\);[\s\S]*setObservations\(''\)/);
  assert.match(modal, /disabled=\{!recipeItems\.length \|\| !patient \|\| loading \|\| including \|\| finalizing/);
  assert.doesNotMatch(modal, /if \(!recipeItems\.length \|\| !patient \|\| !recipeModelId \|\| !surgeonId/);
  assert.match(pilot, /if \(Number\(modelId\) > 0\)[\s\S]*createOasisNewDocument\('Receita'\)/);
});
