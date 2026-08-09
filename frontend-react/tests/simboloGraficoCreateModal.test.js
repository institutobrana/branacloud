import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createSimboloGrafico, listSimbolosGraficosEspecialidades, listSimbolosGraficosLibrary } from '../src/features/simbolosGraficos/simbolosGraficosApi.js';
import { mapSimboloGraficoEspecialidadesCatalog } from '../src/features/simbolosGraficos/model/simboloGraficoEspecialidadesMapper.js';
import { mapSimboloGraficoLibraryCatalog } from '../src/features/simbolosGraficos/model/simboloGraficoLibraryMapper.js';
import { normalizeAssetUrl } from '../src/features/simbolosGraficos/model/simboloGraficoLibraryMapper.js';
import { validateSimboloGraficoCreateForm } from '../src/features/simbolosGraficos/model/simboloGraficoCreateValidation.js';
import { createSimboloGraficoCreateDraft, mapSimboloGraficoCreatePayload } from '../src/features/simbolosGraficos/model/simboloGraficoCreateMapper.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');

const modalSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx'), 'utf8');
const deleteModalSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/components/SimboloGraficoDeleteModal.jsx'), 'utf8');
const fieldSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/components/SimboloGraficoEspecialidadeField.jsx'), 'utf8');
const pageSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/SimbolosGraficosPage.jsx'), 'utf8');
const initialStateSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/model/simboloGraficoCreateInitialState.js'), 'utf8');
const editorBaseLibrarySource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/model/simboloGraficoEditorBaseLibrary.js'), 'utf8');
const optionsSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/model/simboloGraficoMarcacaoOptions.js'), 'utf8');
const mapperSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/model/simboloGraficoEspecialidadesMapper.js'), 'utf8');
const hookSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/hooks/useSimboloGraficoCatalogs.js'), 'utf8');
const apiSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/simbolosGraficosApi.js'), 'utf8');
const librarySource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/model/simboloGraficoLibraryMapper.js'), 'utf8');
const libraryComponentSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/components/SimboloGraficoLibrary.jsx'), 'utf8');
const createHookSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/hooks/useCreateSimboloGrafico.js'), 'utf8');
const pixelEditorSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/components/SimboloGraficoPixelEditor.jsx'), 'utf8');
const pixelEditorUtilsSource = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/model/simboloGraficoPixelEditorUtils.js'), 'utf8');

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;

function setupFetch(responseFactory, token = 'token-123') {
  const calls = [];
  globalThis.window = { localStorage: { getItem: () => token } };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return responseFactory(url, options);
  };
  return calls;
}

function teardown() {
  globalThis.fetch = originalFetch;
  globalThis.window = originalWindow;
}

test.afterEach(teardown);

test('Modal visual e estrutural permanece', () => {
  assert.match(modalSource, /createSimboloGraficoCreateInitialState/);
  assert.match(modalSource, /Nome do símbolo/);
  assert.match(modalSource, /Forma de marcação no odontograma/);
  assert.match(modalSource, /Tipo do símbolo/);
  assert.match(modalSource, /Desenho/);
  assert.match(modalSource, /Ok/);
  assert.match(modalSource, /Cancela/);
  assert.match(modalSource, /simbolos-graficos-create-footer/);
  assert.match(modalSource, /simbolos-graficos-create-footer \{ display: flex; justify-content: flex-end; align-items: center; gap: 8px; width: 100%; box-sizing: border-box; margin-top: 0; padding-top: 12px; border-top: 1px solid var\(--brana-divider\); \}/);
  assert.match(modalSource, /simbolos-graficos-create-ok/);
  assert.match(modalSource, /simbolos-graficos-create-cancel/);
  assert.match(modalSource, /simbolos-graficos-create-footer \.simbolos-graficos-create-ok,/);
  assert.match(modalSource, /simbolos-graficos-create-footer \.simbolos-graficos-create-cancel/);
  assert.match(modalSource, /width: auto/);
  assert.match(modalSource, /min-width: 88px/);
  assert.match(modalSource, /padding: 0 16px/);
  assert.match(modalSource, /height: 38px/);
  assert.match(modalSource, /padding: 0 10px/);
  assert.match(modalSource, /text-align: center/);
  assert.match(modalSource, /var\(--brana-surface-modal\)/);
  assert.match(modalSource, /var\(--brana-surface-panel\)/);
  assert.match(modalSource, /var\(--brana-control-background\)/);
  assert.match(modalSource, /var\(--brana-control-border\)/);
  assert.match(modalSource, /max-height: calc\(100vh - 32px\)/);
  assert.match(modalSource, /overflow: auto/);
  assert.match(modalSource, /title="Símbolos da biblioteca do sistema não podem ser excluídos"/);
  assert.match(modalSource, /aria-label="Excluir símbolo da biblioteca — indisponível para símbolos do sistema"/);
  assert.match(modalSource, /\bdisabled\b/);
  assert.match(modalSource, /useSimboloGraficoCatalogs/);
  assert.match(modalSource, /SimboloGraficoEspecialidadeField/);
  assert.match(modalSource, /SimboloGraficoLibrary/);
  assert.match(modalSource, /SimboloGraficoPixelEditor/);
  assert.match(modalSource, /mapSimboloGraficoCreatePayload/);
  assert.match(modalSource, /useUpdateSimboloGrafico/);
  assert.match(modalSource, /mode === 'edit'/);
  assert.match(modalSource, /const isCreateMode = !isEditMode;/);
  assert.match(modalSource, /const canChooseUserDefined = isCreateMode;/);
  assert.match(modalSource, /const canEditDrawing = isCreateMode;/);
  assert.match(modalSource, /const canRemoveDrawing = isCreateMode;/);
  assert.match(modalSource, /record\?\.imagemCustom/);
  assert.match(modalSource, /normalizeAssetUrl/);
  assert.match(modalSource, /function resolveRecordPreviewImageUrl\(record\)/);
  assert.match(modalSource, /const directImage = normalizeAssetUrl\(record\?\.imagemCustom \|\| record\?\.imagem_custom \|\| record\?\.imagemUrl \|\| record\?\.imagem_url \|\| ''\);/);
  assert.match(modalSource, /const bitmapName = String\(record\?\.icone \|\| record\?\.bitmap1 \|\| record\?\.bitmap2 \|\| record\?\.bitmap3 \|\| record\?\.codigo \|\| ''\)\.trim\(\);/);
  assert.match(modalSource, /return normalizeAssetUrl\(`\/desktop-assets\/Icones\/\$\{bitmapName\}`\);/);
  assert.match(modalSource, /const resolvedPreviewImageUrl = normalizeAssetUrl\(values\.imagemCustom \|\| selectedLibraryItem\?\.imageUrl \|\| resolveRecordPreviewImageUrl\(record\)\)/);
  assert.match(modalSource, /const currentPreviewItem = resolvedPreviewImageUrl/);
  assert.match(modalSource, /const editorInitialImage = resolvedPreviewImageUrl/);
  assert.match(modalSource, /<DrawingPreview item=\{currentPreviewItem\} \/>/);
  assert.match(modalSource, /disabled=\{isEditMode\}/);
  assert.match(modalSource, /onClick=\{\(\) => \{ if \(isCreateMode\) setEditorOpen\(true\); \}\}/);
  assert.match(modalSource, /disabled:\s*!isEditMode/);
  assert.match(modalSource, /disabled:\s*!canChooseUserDefined/);
  assert.doesNotMatch(modalSource, /window\.__BRANA_SIMBOLO_PREVIEW_DIAGNOSTICO__|data-preview-|PreviewDiagnosticPanel|Diagnóstico do desenho|Testar URL atual|Copiar diagnóstico|capturedAt/);
  assert.match(modalSource, /const customImage = String\(values\.imagemCustom \|\| ''\)\.trim\(\);/);
  assert.match(modalSource, /payload\.imagem_custom = customImage \|\| payload\.imagem_custom \|\| selected\.imageUrl \|\| null/);
  assert.match(modalSource, /payload\.imagem_custom = customImage;/);
  assert.match(modalSource, /nomeTouched/);
  assert.match(modalSource, /nomeNormalizado/);
  assert.match(modalSource, /especialidadeValida/);
  assert.match(modalSource, /formaValida/);
  assert.match(modalSource, /isFormValid/);
  assert.match(modalSource, /Informe o nome do símbolo\./);
  assert.match(modalSource, /maxLength=\{120\}/);
  assert.match(modalSource, /aria-invalid=\{nomeError \? 'true' : 'false'\}/);
  assert.match(modalSource, /aria-describedby=\{nomeError \? 'simbolos-graficos-create-nome-error' : undefined\}/);
  assert.match(fieldSource, /Especialidade/);
  assert.doesNotMatch(fieldSource, /Especialidade \(botão\)/);
  assert.match(modalSource, /useCreateSimboloGrafico/);
  assert.match(modalSource, /submitError/);
  assert.match(modalSource, /onCreated/);
  assert.match(modalSource, /onUpdated/);
  assert.match(modalSource, /\[data-brana-theme='dark'\]/);
  assert.match(modalSource, /flex-wrap: wrap/);
  assert.match(modalSource, /simbolos-graficos-create-footer \{ flex-wrap: wrap; justify-content: stretch; \}/);
  assert.match(modalSource, /simbolos-graficos-create-footer \.simbolos-graficos-create-ok,\s+\.simbolos-graficos-create-footer \.simbolos-graficos-create-cancel \{ width: 100%; \}/);
  assert.doesNotMatch(modalSource, /Limpar seleção da biblioteca|>Limpar</);
  assert.doesNotMatch(modalSource, /useSimboloGraficoCreateForm|editorFlow|SimboloGraficoEditorDialog|onValidatedPayload|Símbolos de sistema não podem ser criados por este fluxo/);
});

test('Modo alteracao hidrata nome, especialidade, forma e desenho a partir do registro selecionado', () => {
  assert.match(modalSource, /function resolveRecordName\(record\)/);
  assert.match(modalSource, /const descricao = resolveRecordName\(record\);/);
  assert.match(modalSource, /record\?\.especialidadeCodigo/);
  assert.match(modalSource, /record\?\.especialidade_codigo/);
  assert.match(modalSource, /record\?\.especialidade[^?]/);
  assert.match(modalSource, /record\?\.especial[^?]/);
  assert.match(modalSource, /const formaMarcacao = Number\.isFinite\(Number\(record\?\.formaMarcacao \?\? record\?\.tipoMarca \?\? record\?\.tipo_marca\)\)/);
  assert.match(modalSource, /tipoSimbolo:\s*1,/);
  assert.match(modalSource, /record\?\.imagemUrl/);
  assert.match(modalSource, /record\?\.imagem_url/);
  assert.match(modalSource, /imagemCustom \?\? ''/);
  assert.match(modalSource, /bibliotecaSelecionada = record\?\.bibliotecaSelecionada/);
  assert.match(modalSource, /record\?\.biblioteca_selecionada/);
  assert.match(modalSource, /record\?\.codigo/);
  assert.match(modalSource, /record\?\.icone/);
  assert.match(modalSource, /record\?\.bitmap1/);
  assert.match(modalSource, /bibliotecaSelecionadaId = record\?\.bibliotecaSelecionadaId/);
  assert.match(modalSource, /record\?\.biblioteca_selecionada_id/);
  assert.match(modalSource, /record\?\.id/);
  assert.match(modalSource, /imageAlt: values\.descricao \|\| 'Desenho'/);
});
test('Modo alteracao prioriza nome util quando descricao vem vazia', () => {
  assert.match(modalSource, /function resolveRecordName\(record\)/);
  assert.match(modalSource, /const descricao = String\(record\?\.descricao \?\? ''\)\.trim\(\);/);
  assert.match(modalSource, /const nome = String\(record\?\.nome \?\? ''\)\.trim\(\);/);
  assert.match(modalSource, /return descricao;/);
  assert.match(modalSource, /return nome;/);
  assert.match(modalSource, /const descricao = resolveRecordName\(record\);/);
});

test('Modal de exclusao identifica alvo e nao fecha durante loading', () => {
  assert.match(deleteModalSource, /Exclui símbolo gráfico/);
  assert.match(deleteModalSource, /Confirma a exclusão do símbolo gráfico/);
  assert.match(deleteModalSource, /Esta ação remove o registro/);
  assert.match(deleteModalSource, /Origem:/);
  assert.match(deleteModalSource, /Elimina/);
  assert.match(deleteModalSource, /Cancela/);
  assert.match(deleteModalSource, /maskClosable=\{!loading\}/);
  assert.match(deleteModalSource, /keyboard=\{!loading\}/);
  assert.match(deleteModalSource, /onCancel=\{loading \? undefined : onCancel\}/);
  assert.match(deleteModalSource, /className="simbolos-graficos-delete-modal"/);
});

test('Nao expoe mutacoes nem recursos visuais proibidos no payload base', () => {
  for (const source of [optionsSource, initialStateSource, editorBaseLibrarySource, mapperSource, hookSource, librarySource, libraryComponentSource, createHookSource]) {
    assert.doesNotMatch(source, /postMessage|iframe|canvas|upload|\bPUT\b|\bPATCH\b|\bDELETE\b/i);
  }
  assert.match(apiSource, /createSimboloGrafico/);
  assert.match(apiSource, /\bPOST\b/);
});

test('Forma de marcacao usa os 6 codigos tecnicos na ordem certa', () => {
  assert.match(optionsSource, /value:\s*1[\s\S]*Face \(ex: Restauração\)/);
  assert.match(optionsSource, /value:\s*2[\s\S]*Dente \(ex: Coroa\)/);
  assert.match(optionsSource, /value:\s*3[\s\S]*Grupo \(ex: Prótese-fixa\)/);
  assert.match(optionsSource, /value:\s*4[\s\S]*Arcada \(ex: Prótese-total\)/);
  assert.match(optionsSource, /value:\s*5[\s\S]*Geral \(ex: Profilaxia\)/);
  assert.match(optionsSource, /value:\s*6[\s\S]*Segmento \[ex: Bracket\]/);
  assert.match(initialStateSource, /formaMarcacao:\s*2\b/);
  assert.match(initialStateSource, /tipoSimbolo:\s*2\b/);
});

test('Mapper de especialidades preserva chave tecnica e filtra entradas invalidas', () => {
  const result = mapSimboloGraficoEspecialidadesCatalog([
    { codigo: '01', nome: 'Dentística' },
    { codigo: 2, nome: 'Prótese' },
    { codigo: '02', nome: 'Prótese duplicada' },
    { codigo: '', nome: 'Sem código' },
    { codigo: '03', nome: '' },
    { codigo: null, nome: 'Sem chave' },
  ]);

  assert.deepEqual(result, [
    { value: '01', label: 'Dentística', disabled: false },
    { value: '2', label: 'Prótese', disabled: false },
    { value: '02', label: 'Prótese duplicada', disabled: false },
  ]);
  assert.deepEqual(mapSimboloGraficoEspecialidadesCatalog([]), []);
  assert.deepEqual(mapSimboloGraficoEspecialidadesCatalog(null), []);
});

test('Mapper da biblioteca normaliza rota de assets e preserva identidade', () => {
  const result = mapSimboloGraficoLibraryCatalog([
    { id: 1, codigo: 'A1', descricao: 'Dente', imagem_url: '/desktop-assets/easy/int_ajuste.bmp', tipo_simbolo: 1, tipo_marca: 2 },
    { id: 2, codigo: 'A1', descricao: 'Duplicado', imagem_custom: '/img/dup.png', tipo_simbolo: 2, tipo_marca: 3 },
    { id: 3, codigo: 'B2', descricao: 'Outro', icone: 'ico.png', tipo_simbolo: 2, tipo_marca: 4 },
    { id: 4, codigo: 'C3', descricao: 'Sem imagem', imagem_url: '', imagem_custom: null, icone: null },
  ]);

  assert.deepEqual(result.map((item) => ({
    id: item.id,
    codigo: item.codigo,
    nome: item.nome,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    source: item.source,
  })), [
    { id: 1, codigo: 'A1', nome: 'Dente', imageUrl: '/app/assets/easy/int_ajuste.bmp', imageAlt: 'Dente', source: 'sistema' },
    { id: 3, codigo: 'B2', nome: 'Outro', imageUrl: '/api/desktop-assets/Icones/ico.png', imageAlt: 'Outro', source: 'usuario' },
    { id: 4, codigo: 'C3', nome: 'Sem imagem', imageUrl: '', imageAlt: 'Sem imagem', source: 'usuario' },
  ]);
  assert.equal(result[0].descricao, 'Dente');
  assert.equal(result[0].tipo_marca, 2);
  assert.equal(result[1].imagemUrl, '/api/desktop-assets/Icones/ico.png');
  assert.equal(result[2].imagemCustom, null);
  assert.equal(normalizeAssetUrl('/desktop-assets/easy/int_fluor.bmp'), '/app/assets/easy/int_fluor.bmp');
});

test('Biblioteca-base embute apenas assets publicados e identidade estavel', () => {
  return import('../src/features/simbolosGraficos/model/simboloGraficoEditorBaseLibrary.js').then(({ getSimboloGraficoEditorBaseLibrary }) => {
    const manifest = getSimboloGraficoEditorBaseLibrary();
    assert.equal(manifest.length, 56);
    assert.equal(manifest[0].fileName, 'sim_30.bmp');
    assert.equal(manifest[manifest.length - 1].fileName, 'sim_ulec.bmp');
    assert.equal(manifest[0].order, 1);
    assert.equal(manifest[manifest.length - 1].order, 56);
    assert.equal(new Set(manifest.map((item) => item.fileName.toLowerCase())).size, 56);
    assert.deepEqual(manifest.filter((item) => !/^sim_[^.]+\.bmp$/i.test(item.fileName)), []);
    assert.deepEqual(manifest.filter((item) => !item.imageUrl.startsWith('/app/assets/Icones/')), []);
    assert.deepEqual(manifest.filter((item) => /^(arc|avi|cmd|dia|esp|ico|int)_/i.test(item.code)), []);
    assert.deepEqual(manifest.filter((item) => /Y:\\|file:\/\//i.test(item.imageUrl)), []);
    assert.deepEqual(manifest.filter((item) => !item.id || !item.code || !item.fileName || !item.imageUrl || !item.order || !item.imageAlt), []);
  });
});

test('Validacao local normaliza valores, respeita catálogo e aceita desenho vazio', () => {
  const catalogs = {
    especialidades: [{ value: '01', label: 'Dentística' }, { value: '02', label: 'Prótese' }],
    biblioteca: [{ id: 10, code: 'sim_default', imageUrl: '/app/assets/Icones/sim_default.bmp', imageAlt: 'sim_default' }],
  };

  const invalid = validateSimboloGraficoCreateForm(
    { descricao: '   ', tipoSimbolo: 7, especialidade: '99', formaMarcacao: 9, bibliotecaSelecionadaId: null, bibliotecaSelecionada: '', desenho: null },
    catalogs,
  );
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.descricao, 'Informe o nome do símbolo.');
  assert.equal(invalid.errors.tipoSimbolo, 'Símbolos de sistema não podem ser criados por este fluxo.');
  assert.equal(invalid.errors.especialidade, 'Selecione uma especialidade válida.');
  assert.equal(invalid.errors.formaMarcacao, 'Selecione uma forma de marcação válida.');
  assert.equal(invalid.errors.desenho, undefined);
  assert.equal(validateSimboloGraficoCreateForm(
    { descricao: 'X', tipoSimbolo: 1, especialidade: '01', formaMarcacao: 2, bibliotecaSelecionadaId: 10, bibliotecaSelecionada: 'sim_default', desenho: '/app/assets/Icones/sim_default.bmp' },
    catalogs,
  ).errors.tipoSimbolo, 'Símbolos de sistema não podem ser criados por este fluxo.');

  const valid = validateSimboloGraficoCreateForm(
    { descricao: '  Símbolo novo  ', tipoSimbolo: 2, especialidade: '01', formaMarcacao: 2, bibliotecaSelecionadaId: null, bibliotecaSelecionada: '', desenho: null },
    catalogs,
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.normalized.descricao, 'Símbolo novo');
  assert.equal(valid.normalized.especialidade, '01');
});

test('Mapper de criação gera draft local sem persistencia e sem tenant', () => {
  const draft = createSimboloGraficoCreateDraft(
    { nome: '  Símbolo novo  ', especialidade: '01', tipoSimbolo: 2, formaMarcacao: 2, bibliotecaSelecionadaId: null },
    { biblioteca: [] },
  );

  assert.deepEqual(draft, {
    descricao: 'Símbolo novo',
    especialidade: '01',
    tipo_simbolo: 2,
    tipo_marca: 2,
    legacy_id: null,
    codigo: null,
    desenho: null,
    imagem_custom: null,
    sobreposicao: null,
    icone: null,
    bitmap1: null,
    bitmap2: null,
    bitmap3: null,
    _contract: {
      bibliotecaSelecionadaId: null,
      bibliotecaSelecionada: '',
      imageUrl: '',
      imageSelected: false,
      blockedFields: ['legacy_id', 'codigo', 'sobreposicao', 'icone', 'bitmap1', 'bitmap2', 'bitmap3'],
    },
  });
});

test('Mapper de criação produz payload local minimo sem exigir biblioteca', () => {
  const payload = mapSimboloGraficoCreatePayload(
    { nome: '  Símbolo novo  ', especialidade: '01', tipoSimbolo: 2, formaMarcacao: 2, bibliotecaSelecionadaId: null },
    {
      especialidades: [{ value: '01', label: 'Dentística' }],
      biblioteca: [],
    },
  );
  assert.deepEqual(payload, {
    descricao: 'Símbolo novo',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
    legacy_id: null,
    codigo: 'simbolo_novo.bmp',
    imagem_custom: null,
    desenho: null,
    bibliotecaSelecionadaId: null,
    bibliotecaSelecionada: '',
  });
});

test('Fluxo de criação preserva desenho customizado quando nao ha biblioteca selecionada', () => {
  const customImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
  const state = {
    nome: '  Símbolo novo  ',
    especialidade: '01',
    tipoSimbolo: 2,
    formaMarcacao: 2,
    bibliotecaSelecionadaId: null,
    bibliotecaSelecionada: null,
    imagemCustom: customImage,
  };

  const payload = mapSimboloGraficoCreatePayload(state, {
    especialidades: [{ value: '01', label: 'Dentística' }],
    biblioteca: [],
  });

  assert.equal(payload.imagem_custom, null);

  const modalSourceLocal = fs.readFileSync(path.join(repoRoot, 'src/features/simbolosGraficos/components/SimboloGraficoCreateModal.jsx'), 'utf8');
  assert.match(modalSourceLocal, /const customImage = String\(values\.imagemCustom \|\| ''\)\.trim\(\);/);
  assert.match(modalSourceLocal, /payload\.imagem_custom = customImage;/);
});

test('API de criação usa POST no endpoint correto sem tenant', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => ({ id: 99, codigo: 'sim_default.bmp', descricao: 'Símbolo novo' }),
  }));

  const result = await createSimboloGrafico({
    descricao: 'Símbolo novo',
    codigo: 'sim_default.bmp',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'POST');
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos$/);
  assert.equal(calls[0].options.body, JSON.stringify({
    descricao: 'Símbolo novo',
    codigo: 'sim_default.bmp',
    especialidade: 1,
    tipo_simbolo: 2,
    tipo_marca: 2,
  }));
  assert.doesNotMatch(JSON.stringify(calls[0].options), /clinica_id|tenantId|userId/i);
  assert.deepEqual(result, { id: 99, codigo: 'sim_default.bmp', descricao: 'Símbolo novo' });
});

test('API de especialidades usa GET e endpoint correto sem enviar tenant', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => [
      { id: 1, codigo: '01', nome: 'Dentística', ordem: 1, imagem_indice: 1 },
      { id: 2, codigo: '02', nome: 'Prótese', ordem: 2, imagem_indice: 2 },
    ],
  }));

  const result = await listSimbolosGraficosEspecialidades();

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'GET');
  assert.match(calls[0].url, /\/api\/cadastros\/auxiliares\/especialidades-ativas$/);
  assert.doesNotMatch(JSON.stringify(calls[0].options), /clinica_id|tenantId|userId/i);
  assert.deepEqual(result, [
    { id: 1, codigo: '01', nome: 'Dentística', ordem: 1, imagem_indice: 1 },
    { id: 2, codigo: '02', nome: 'Prótese', ordem: 2, imagem_indice: 2 },
  ]);
});

test('API de biblioteca usa GET no catalogo oficial', async () => {
  const calls = setupFetch(async () => ({
    ok: true,
    json: async () => [
      { id: 11, codigo: 'SYM-11', descricao: 'Icone 11', imagem_url: '/desktop-assets/easy/int_ajuste.bmp', tipo_simbolo: 1, tipo_marca: 2 },
    ],
  }));

  const result = await listSimbolosGraficosLibrary();

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'GET');
  assert.match(calls[0].url, /\/api\/cadastros\/simbolos-graficos\?scope=catalogo$/);
  assert.deepEqual(result, [
    { id: 11, codigo: 'SYM-11', descricao: 'Icone 11', imagem_url: '/desktop-assets/easy/int_ajuste.bmp', tipo_simbolo: 1, tipo_marca: 2 },
  ]);
});

test('Hook da tela de simbolos graficos usa biblioteca-base estaticamente', () => {
  assert.match(hookSource, /getSimboloGraficoEditorBaseLibrary/);
  assert.doesNotMatch(hookSource, /listSimbolosGraficosLibrary/);
  assert.doesNotMatch(hookSource, /scope=catalogo/);
});

test('API de especialidades propaga erro controlado do cliente compartilhado', async () => {
  setupFetch(async () => ({
    ok: false,
    status: 403,
    json: async () => ({ detail: 'Sem permissao.' }),
  }));

  await assert.rejects(
    () => listSimbolosGraficosEspecialidades(),
    (error) => error.status === 403 && error.message === 'Sem permissao.',
  );
});

test('API de biblioteca propaga erro controlado do cliente compartilhado', async () => {
  setupFetch(async () => ({
    ok: false,
    status: 403,
    json: async () => ({ detail: 'Sem permissao.' }),
  }));

  await assert.rejects(
    () => listSimbolosGraficosLibrary(),
    (error) => error.status === 403 && error.message === 'Sem permissao.',
  );
});

test('Pagina de simbolos graficos abre modal ao acionar Novo e preserva a tabela', () => {
  assert.match(pageSource, /SimboloGraficoCreateModal/);
  assert.match(pageSource, /SimboloGraficoDeleteModal/);
  assert.match(pageSource, /createOpen/);
  assert.match(pageSource, /mode="edit"/);
  assert.match(pageSource, /deleteFlow/);
  assert.match(pageSource, /deleteOpen/);
  assert.match(pageSource, /handleDeleteOpen/);
  assert.match(pageSource, /handleDeleteConfirm/);
  assert.match(pageSource, /Selecione um símbolo gráfico para excluir\./);
  assert.match(pageSource, /Símbolo gráfico excluído com sucesso\./);
  assert.match(pageSource, /result\?\.status === 409/);
  assert.match(pageSource, /reload\(\)/);
  assert.match(pageSource, /selectRow\(createdSymbol\.id\)/);
  assert.match(pageSource, /selectRow\(updatedSymbol\.id\)/);
  assert.match(pageSource, /selectRow\(null\)/);
  assert.match(pageSource, /onCreated=\{handleCreateSuccess\}/);
  assert.match(pageSource, /onUpdated=\{handleEditSuccess\}/);
  assert.match(pageSource, /onConfirm=\{\(\) => void handleDeleteConfirm\(\)\}/);
  assert.match(pageSource, /onCancel=\{handleDeleteCancel\}/);
  assert.match(pageSource, /brana-simbolos-graficos-toolbar-action/);
  assert.match(pageSource, /brana-simbolos-graficos-selection/);
  assert.match(pageSource, /message\.info\('Selecione um símbolo gráfico para alterar\.'\)/);
  assert.match(pageSource, /message\.info\('Selecione um símbolo gráfico para excluir\.'\)/);
  assert.match(pageSource, /action === 'elimina'/);
  assert.doesNotMatch(modalSource, /SimboloGraficoEditorDialog|useSimboloGraficoEditor|initialCustomImage|sourceImageUrl|Diagnóstico do desenho|Testar URL atual|Copiar diagnóstico|window\.__BRANA_SIMBOLO_PREVIEW_DIAGNOSTICO__/);
});

test('Botao Cancela permanece funcional e o botao Ok continua desabilitado', () => {
  assert.match(modalSource, /auxiliary-shell-button simbolos-graficos-create-ok/);
  assert.match(modalSource, /isFormValid \? 'is-enabled' : ''/);
  assert.match(modalSource, /disabled=\{!isFormValid \|\| flow\.submitting\}/);
  assert.match(modalSource, /onClick=\{handleOkClick\}/);
  assert.match(modalSource, /submitError/);
  assert.match(modalSource, /submitting \? 'Salvando\.\.\.' : 'Ok'/);
  assert.match(modalSource, /onCreated/);
  assert.match(modalSource, /onUpdated/);
  assert.match(modalSource, /useUpdateSimboloGrafico/);
  assert.match(modalSource, /record\?\.id/);
  assert.doesNotMatch(modalSource, /onValidatedPayload|handleSubmit|onSubmit/);
  assert.match(modalSource, /onClick=\{handleCancel\}/);
  assert.match(modalSource, /simbolos-graficos-create-cancel/);
  assert.match(modalSource, /onCancel\?\.\(\)/);
  assert.match(modalSource, /simbolos-graficos-create-footer \{ display: flex; justify-content: flex-end; align-items: center; gap: 8px; width: 100%; box-sizing: border-box; margin-top: 0; padding-top: 12px; border-top: 1px solid var\(--brana-divider\); \}/);
  assert.match(modalSource, /simbolos-graficos-create-footer \.simbolos-graficos-create-ok,\s+\.simbolos-graficos-create-footer \.simbolos-graficos-create-cancel \{ width: auto; min-width: 88px; padding: 0 16px; \}/);
});

test('Botao X confirma exclusao local do desenho e preserva o lápis', () => {
  assert.match(modalSource, /simbolos-graficos-create-icon-wrap/);
  assert.match(modalSource, /title="Símbolos da biblioteca do sistema não podem ser excluídos"/);
  assert.match(modalSource, /aria-label="Excluir símbolo da biblioteca — indisponível para símbolos do sistema"/);
  assert.match(modalSource, /aria-label="Excluir desenho"/);
  assert.match(modalSource, /onClick=\{handleRequestRemoveDrawing\}/);
  assert.match(modalSource, /disabled=\{isEditMode\}/);
  assert.match(modalSource, /aria-label="Editar desenho"/);
  assert.match(modalSource, /onClick=\{\(\) => \{ if \(isCreateMode\) setEditorOpen\(true\); \}\}/);
  assert.match(modalSource, /disabled=\{isEditMode\}/);
  assert.match(modalSource, /Edita símbolo gráfico/);
  assert.match(modalSource, /Deseja eliminar o arquivo \$\{drawingFileName\} do disco \?/);
  assert.match(modalSource, /arquivo associado a este símbolo do disco/);
  assert.doesNotMatch(modalSource, /imagem_custom\.png/);
  assert.match(modalSource, /\bSim\b/);
  assert.match(modalSource, /\bNão\b/);
});

test('Modo edit trava controles de desenho e tipo do símbolo', () => {
  assert.match(modalSource, /disabled:\s*!isEditMode/);
  assert.match(modalSource, /disabled:\s*!canChooseUserDefined/);
  assert.match(modalSource, /if \(isEditMode && event\?\.target\?\.value !== 1\) return;/);
  assert.match(modalSource, /if \(isCreateMode && event\?\.target\?\.value === 1\) return;/);
  assert.match(modalSource, /if \(!canUseLibrary\) return;/);
  assert.match(modalSource, /if \(!isCreateMode \|\| !hasCurrentDrawing\) return;/);
  assert.match(modalSource, /if \(!isCreateMode\) return;/);
});

test('Campo Nome possui validacao local simples e nao libera submit', () => {
  assert.match(modalSource, /onChange=\{\(event\) => setValues\(\(current\) => \(\{ \.\.\.current, nome: event\.target\.value \}\)\)\}/);
  assert.match(modalSource, /onBlur=\{\(\) => setNomeTouched\(true\)\}/);
  assert.match(modalSource, /nomeError = nomeTouched && !nomeNormalizado \? 'Informe o nome do símbolo\.' : ''/);
  assert.match(modalSource, /nomeValido = nomeNormalizado\.length > 0 && nomeNormalizado\.length <= 120/);
  assert.match(modalSource, /setNomeTouched\(false\)/);
  assert.match(modalSource, /setNomeTouched\(true\)/);
  assert.match(modalSource, /handleOkClick/);
  assert.match(modalSource, /mapSimboloGraficoCreatePayload\(values, \{ especialidades, biblioteca \}\)/);
  assert.match(modalSource, /event\?\.preventDefault\?\.?\(\)/);
  assert.match(modalSource, /flow\.submit\(record\?\.id, payload\)/);
  assert.match(modalSource, /handleCancel\(\)/);
  assert.doesNotMatch(modalSource, /console\.groupCollapsed\('\[SIMBOLOS_GRAFICOS_PREVIEW_DIAGNOSTICO\] preview ready'\)|console\.table\(\[diagnostic\]\)|handleOpenDiagnostic|handleCopyDiagnostic|handleTestCurrentUrl|window\.__BRANA_SIMBOLO_PREVIEW_DIAGNOSTICO__|Testar URL atual|Copiar diagnóstico/);
  assert.doesNotMatch(modalSource, /handleSubmit|onSubmit|axios/);
});

test('Especialidade no Altera normaliza o valor antes de renderizar o combo', () => {
  assert.match(fieldSource, /const normalizedValue = String\(value \?\? ''\)\.trim\(\);/);
  assert.match(fieldSource, /const normalizedOptions = Array\.isArray\(options\)/);
  assert.match(fieldSource, /const optionValues = new Set\(normalizedOptions\.map\(.*\)\);/);
  assert.match(fieldSource, /const normalizedPaddedValue = normalizedValue && normalizedValue\.length === 1 \? normalizedValue\.padStart\(2, '0'\) : normalizedValue;/);
  assert.match(fieldSource, /const resolvedValue = optionValues\.has\(normalizedValue\)/);
  assert.match(fieldSource, /value=\{resolvedValue \|\| undefined\}/);
  assert.match(fieldSource, /options=\{normalizedOptions\}/);
  assert.match(fieldSource, /onChange=\{\(nextValue\) => onChange\?\.\(String\(nextValue \?\? ''\)\.trim\(\)\)\}/);
  assert.match(fieldSource, /disabled=\{loading \|\| empty\}/);
  assert.match(modalSource, /createEditState\(record\)/);
  assert.match(modalSource, /createSimboloGraficoCreateInitialState\(\)/);
  assert.match(modalSource, /SimboloGraficoEspecialidadeField/);
  assert.match(modalSource, /record\?\.codigo \|\|/);
  assert.match(modalSource, /record\?\.icone \|\|/);
  assert.match(modalSource, /base\.bibliotecaSelecionada/);
});

test('Editor 24x24 expõe matriz, preview e exportacao PNG deterministicas', () => {
  const countExact = (needle) => (pixelEditorSource.match(new RegExp(`>${needle}<`, 'g')) || []).length;
  assert.match(pixelEditorSource, /SIMBOLO_GRAFICO_EDITOR_SIZE/);
  assert.match(pixelEditorSource, /repeat\(\$\{SIMBOLO_GRAFICO_EDITOR_SIZE\}, 1fr\)/);
  assert.match(pixelEditorSource, /Editor de símbolos gráficos/);
  assert.doesNotMatch(pixelEditorSource, /Carregar X/);
  assert.doesNotMatch(pixelEditorSource, /Carregar Bracket/);
  assert.doesNotMatch(pixelEditorSource, /Tela vazia/);
  assert.match(pixelEditorSource, /Lápis/);
  assert.match(pixelEditorSource, /Borracha/);
  assert.match(pixelEditorSource, /Desfazer/);
  assert.match(pixelEditorSource, /Limpar/);
  assert.match(pixelEditorSource, /activeColor/);
  assert.match(pixelEditorSource, /normalizePixelValue/);
  assert.match(pixelEditorSource, /isPixelActive/);
  assert.match(pixelEditorSource, /Prévia 1x/);
  assert.match(pixelEditorSource, /Prévia ampliada/);
  assert.match(pixelEditorSource, /Salvar/);
  assert.match(pixelEditorSource, /Salvar como/);
  assert.match(pixelEditorSource, /Cancela/);
  assert.match(pixelEditorSource, /history/);
  assert.match(pixelEditorSource, /handleUndo/);
  assert.match(pixelEditorSource, /handleClear/);
  assert.match(pixelEditorSource, /image-rendering: pixelated/);
  assert.match(pixelEditorSource, /simbolos-graficos-pixel-editor-stage-tools/);
  assert.equal(countExact('Lápis'), 1);
  assert.equal(countExact('Borracha'), 1);
  assert.equal(countExact('Desfazer'), 1);
  assert.equal(countExact('Limpar'), 1);
  assert.doesNotMatch(pixelEditorSource, /<h3>Ações<\/h3>|<label>Ações<\/label>/);
  assert.doesNotMatch(pixelEditorSource, /Especialidade/);
  assert.doesNotMatch(pixelEditorSource, /Forma de marcação no odontograma/);
  assert.doesNotMatch(pixelEditorSource, /Ferramentas disponíveis/);
  assert.match(pixelEditorSource, /var\(--brana-border-subtle\)/);
  assert.match(pixelEditorSource, /height: 28px/);
  assert.match(pixelEditorSource, /matrixToPngDataUrl/);
  assert.match(pixelEditorSource, /loadImageSourceToPixelMatrix/);
  assert.match(pixelEditorSource, /onPointerDown/);
  assert.match(pixelEditorSource, /onPointerEnter/);
  assert.match(pixelEditorSource, /onPointerUp/);
  assert.match(pixelEditorSource, /onPointerCancel/);
  assert.match(pixelEditorUtilsSource, /createEmptyPixelMatrix/);
  assert.match(pixelEditorUtilsSource, /togglePixel/);
  assert.match(pixelEditorUtilsSource, /clearPixelMatrix/);
  assert.match(pixelEditorUtilsSource, /countActivePixels/);
});

test('Biblioteca do editor respeita superfícies e contraste do tema', () => {
  assert.match(libraryComponentSource, /var\(--brana-surface-card\)/);
  assert.match(libraryComponentSource, /var\(--brana-border-subtle\)/);
  assert.match(libraryComponentSource, /var\(--brana-brand-primary\)/);
  assert.match(libraryComponentSource, /\[data-brana-theme='dark'\]/);
  assert.match(libraryComponentSource, /simbolos-graficos-library-item.is-selected/);
  assert.match(libraryComponentSource, /simbolos-graficos-library-scroll/);
});
