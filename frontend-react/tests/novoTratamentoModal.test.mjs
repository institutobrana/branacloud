import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { applyNovoTratamentoDefaults, applyNovoTratamentoResponseMetadata, createNovoTratamentoForm } from '../src/features/fichaClinica/novoTratamentoMappers.js';

const root = new URL('../src/features/fichaClinica/', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');
const modal = read('NovoTratamentoModal.jsx');
const principal = read('NovoTratamentoPrincipalTab.jsx');
const convenio = read('NovoTratamentoConvenioTab.jsx');
const mapper = read('novoTratamentoMappers.js');
const api = read('novoTratamentoApi.js');

test('modal Novo tratamento possui duas abas e largura legada compacta', () => {
  assert.match(modal, /title="Novo tratamento"/);
  assert.match(modal, /width=\{468\}/);
  assert.match(modal, /label: 'Principal'/);
  assert.match(modal, /label: 'Convênio'/);
});

test('datas da aba Principal usam o contrato oficial e Convênio permanece texto livre', () => {
  assert.match(principal, /DatePicker/);
  assert.match(principal, /normalizeFichaDateInput/);
  assert.match(principal, /format="DD\/MM\/YYYY"/);
  assert.match(principal, /data_inicio/);
  assert.match(principal, /data_finalizacao/);
  assert.doesNotMatch(convenio, /dateField/);
  assert.match(convenio, /Data da autorização<Input value=\{form\.data_autorizacao\}/);
  assert.match(convenio, /Validade da senha<Input value=\{form\.validade_senha\}/);
});

test('modal preserva os 24 controles do contrato legado', () => {
  const principalLabels = ['Início', 'Finalização', 'Situação', 'Tabela principal', 'Índice', 'Cirurgião responsável', 'Unidade de atendimento', 'Observações', 'Inclusão', 'Alteração', 'Idade', 'Arcada predominante', 'Copiar intervenções a realizar do tratamento anterior'];
  const convenioLabels = ['Convênio', 'Tipo de atendimento (TISS)', 'Cirurgião contratado', 'Cirurgião solicitante', 'Cirurgião executante', 'Sinais clínicos doença periodontal', 'Alteração dos tecidos moles', 'Nº da guia de tratamento', 'Data da autorização', 'Senha de autorização', 'Validade da senha'];
  for (const label of principalLabels) assert.match(principal, new RegExp(label.replace(/[()]/g, '\\$&')));
  for (const label of convenioLabels) assert.match(convenio, new RegExp(label.replace(/[()]/g, '\\$&')));
  assert.equal(principalLabels.length + convenioLabels.length, 24);
});

test('lookups reais e TISS dinâmico estão conectados', () => {
  assert.match(api, /\/tratamentos\/novo\/combos\?paciente_id=/);
  assert.match(api, /\/preferences\/general/);
  assert.match(mapper, /tipo_atendimento_tiss_id: defaults\.tipo_atendimento_tiss_id \?\? tiss\?\.id/);
  assert.doesNotMatch(mapper, /Tratamento Odontológico/);
});

test('defaults de índice e cirurgião usam as configurações oficiais', () => {
  assert.match(api, /\/preferences\/general/);
  assert.match(api, /\/system-options/);
  assert.match(mapper, /indice_padrao_id/);
  assert.match(mapper, /prestador_id/);
  assert.doesNotMatch(mapper, /tabelas\[0\]|indices\[0\]|cirurgioes\[0\]/);
});

test('defaults selecionam itens sem reduzir as opções dos três combos', () => {
  const payload = {
    tabelas: [{ id: 1, row_id: 1, nome: 'A' }, { id: 2, row_id: 2, nome: 'B' }, { id: 3, row_id: 3, nome: 'C' }],
    indices: [{ id: 1, descricao: 'I1' }, { id: 2, descricao: 'I2' }, { id: 3, descricao: 'I3' }],
    cirurgioes: [
      { id: 1, value: 'p:1', prestador_id: 1, nome: 'P1' },
      { id: 2, value: 'p:2', prestador_id: 2, nome: 'P2' },
      { id: 3, value: 'p:3', prestador_id: 3, nome: 'P3' }
    ]
  };
  const result = applyNovoTratamentoDefaults(createNovoTratamentoForm(), payload, { values: { tabela_padrao_id: 1 } }, { values: { financeiro: { indice_padrao_id: 2 } } }, { prestador_id: 2 });
  assert.equal(payload.tabelas.length, 3);
  assert.equal(payload.indices.length, 3);
  assert.equal(payload.cirurgioes.length, 3);
  assert.equal(result.tabela_codigo, 1);
  assert.equal(result.indice, 2);
  assert.equal(result.cirurgiao_responsavel_id, 'p:2');
});

test('tabela principal usa o código da tabela do paciente e preserva todas as opções', () => {
  const payload = { defaults: { tabela_codigo: 4 }, tabelas: [{ id: 1, row_id: 3, nome: 'Tabela A' }, { id: 4, row_id: 18, nome: 'PARTICULAR' }, { id: 10, row_id: 48, nome: 'EASY - Particular' }], indices: [], cirurgioes: [] };
  const result = applyNovoTratamentoDefaults(createNovoTratamentoForm(), payload, { values: { tabela_padrao_id: 1 } }, {}, {});
  assert.equal(result.tabela_codigo, 4);
  assert.equal(payload.tabelas.length, 3);
});

test('unidade de atendimento usa o vínculo do usuário sem reduzir as opções', () => {
  const payload = {
    unidades: [
      { id: 10, row_id: 10, value: 'u:10', nome: 'Unidade Principal' },
      { id: 20, row_id: 20, value: 'u:20', nome: 'Unidade Secundária' },
      { id: 30, row_id: 30, value: 'u:30', nome: 'Unidade Terciária' },
    ],
  };
  const result = applyNovoTratamentoDefaults(createNovoTratamentoForm(), payload, {}, {}, { unidade_atendimento_id: 20 });
  assert.equal(payload.unidades.length, 3);
  assert.equal(result.unidade_atendimento, 'u:20');
});

test('tabela e convênio do paciente vencem preferências sem reduzir as opções', () => {
  const payload = {
    defaults: { tabela_codigo: 4, convenio: '22' },
    tabelas: [{ id: 1, nome: 'A' }, { id: 4, nome: 'B' }, { id: 10, nome: 'C' }],
    convenios: [{ id: '11', nome: 'Preferência' }, { id: '22', nome: 'Paciente' }, { id: '33', nome: 'Outro' }],
  };
  const result = applyNovoTratamentoDefaults(createNovoTratamentoForm(), payload, { values: { tabela_padrao_id: 1, convenio_padrao_id: 11 } }, {}, {});
  assert.equal(payload.tabelas.length, 3);
  assert.equal(payload.convenios.length, 3);
  assert.equal(result.convenio, '22');
  assert.equal(result.tabela_codigo, 4);
});

test('convênio sem valor do paciente preserva o fallback oficial do lookup', () => {
  const payload = { defaults: {}, convenios: [{ id: 'particular', nome: 'Particular' }, { id: '1', nome: 'Convenio 1' }] };
  const result = applyNovoTratamentoDefaults(createNovoTratamentoForm(), payload, { values: { convenio_padrao_id: 0 } }, {}, {});
  assert.equal(result.convenio, 'particular');
});

test('os três cirurgiões da aba Convênio usam o prestador logado, não o primeiro item', () => {
  const payload = {
    cirurgioes: [
      { id: 1, value: 'p:1', prestador_id: 1, nome: 'Primeiro' },
      { id: 2, value: 'p:2', prestador_id: 2, nome: 'Logado' },
    ],
  };
  const result = applyNovoTratamentoDefaults(createNovoTratamentoForm(), payload, {}, {}, { prestador_id: 2 });
  assert.equal(payload.cirurgioes.length, 2);
  assert.equal(result.cirurgiao_contratado_id, 'p:2');
  assert.equal(result.cirurgiao_solicitante_id, 'p:2');
  assert.equal(result.cirurgiao_executante_id, 'p:2');
});

test('os três Selects de cirurgião usam o value técnico como value e o nome como label', () => {
  assert.match(convenio, /const surgeonValue = \(item\) => item\?\.value \?\? item\?\.id/);
  assert.equal((convenio.match(/surgeonValue\)/g) || []).length, 3);
  assert.match(convenio, /label: x\?\.label \?\? x\?\.nome/);
});

test('datas da aba Convênio permanecem texto livre e preservam o payload', () => {
  assert.match(convenio, /Data da autorização<Input value=\{form\.data_autorizacao\} onChange=\{\(e\) => setField\('data_autorizacao', e\.target\.value\)\}/);
  assert.match(convenio, /Validade da senha<Input value=\{form\.validade_senha\} onChange=\{\(e\) => setField\('validade_senha', e\.target\.value\)\}/);
  assert.doesNotMatch(convenio, /Data da autorização<Input[^>]*placeholder/);
  assert.doesNotMatch(convenio, /Validade da senha<Input[^>]*placeholder/);
  assert.doesNotMatch(convenio, /DatePicker|normalizeFichaDateInput|normalizeContaCorrenteDateInput|type="date"/);
  assert.match(mapper, /data_autorizacao: form\.data_autorizacao/);
  assert.match(mapper, /validade_senha: form\.validade_senha/);
});

test('POST usa o contrato de criação do tratamento', () => {
  assert.match(api, /requestJson\('\/tratamentos\/novo'/);
  for (const field of ['paciente_id', 'data_inicio', 'tabela_codigo', 'tipo_atendimento_tiss_id', 'copiar_intervencoes', 'extra']) {
    assert.match(mapper, new RegExp(`${field}:`));
  }
});

test('metadata inicia vazia e usa inclusao/alteracao da resposta do backend', () => {
  const initial = createNovoTratamentoForm();
  assert.equal(initial.inclusao, '');
  assert.equal(initial.alteracao, '');
  assert.match(principal, /className="novo-tratamento-readonly-cyan" value=\{form\.inclusao\} readOnly/);
  assert.match(principal, /className="novo-tratamento-readonly-cyan" value=\{form\.alteracao\} readOnly/);
  assert.equal(applyNovoTratamentoResponseMetadata(initial, { inclusao: '10/09/2026', alteracao: '' }).inclusao, '10/09/2026');
  assert.equal(applyNovoTratamentoResponseMetadata(initial, { inclusao: '10/09/2026', alteracao: '' }).alteracao, '');
  const existing = applyNovoTratamentoResponseMetadata(initial, { inclusao: '01/09/2026', alteracao: '10/09/2026' });
  assert.equal(existing.inclusao, '01/09/2026');
  assert.equal(existing.alteracao, '10/09/2026');
  assert.match(modal, /const response = await createNovoTratamento/);
  assert.match(modal, /applyNovoTratamentoResponseMetadata\(current, response\)/);
});
