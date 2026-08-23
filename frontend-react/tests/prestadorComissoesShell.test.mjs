import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const root = new URL('../src/features/prestadoresComissoes/', import.meta.url);
const read = (file) => fs.readFileSync(new URL(file, root), 'utf8');
const modal = read('PrestadorComissoesModal.jsx');
const api = read('prestadorComissoesApi.js');
const hook = read('hooks/usePrestadorComissoes.js');
const toolbar = read('components/PrestadorComissoesToolbar.jsx');
const table = read('components/PrestadorComissoesTable.jsx');
const form = read('components/PrestadorComissaoFormModal.jsx');
const app = fs.readFileSync(new URL('../src/app/App.jsx', import.meta.url), 'utf8');
const prestadoresToolbar = fs.readFileSync(new URL('../src/features/prestadores/PrestadoresToolbar.jsx', import.meta.url), 'utf8');

test('Comissões abre o shell React a partir de Prestadores', () => {
  assert.match(prestadoresToolbar, /onComissoes/);
  assert.match(prestadoresToolbar, /onClick=\{onComissoes\}/);
  assert.match(app, /<PrestadorComissoesModal/);
  assert.match(app, /prestadorComissoesOpen/);
});

test('shell mantém Altera e Elimina por seleção', () => {
  assert.match(modal, /Configura fatores de comissão/);
  assert.match(toolbar, /onClick=\{onNew\}[\s\S]*Novo fator de comissão\.\.\./);
  assert.match(toolbar, /disabled=\{!selectedId\}/);
  assert.match(toolbar, /disabled=\{!selectedId \|\| deleting\}/);
  assert.match(api, /method:\s*['"]POST/);
  assert.match(api, /method:\s*['"]PUT/);
  assert.match(api, /method:\s*['"]DELETE/);
});

test('Novo fator usa defaults, contrato de data e payload somente permitido', () => {
  assert.match(form, /mode === 'edit' \? 'Altera fator de comissão' : 'Novo fator de comissão'/);
  assert.match(form, /repasse: '0,00'/);
  assert.match(form, /tipo_repasse_codigo: 1/);
  assert.match(form, /DatePickerEntry/);
  assert.match(form, /value: 1, label: '% sobre valor'/);
  assert.match(form, /value: 2, label: 'Valor fixo'/);
  assert.match(form, /prestadores\.filter/);
  assert.match(form, /is_system_prestador \|\|/);
  assert.match(form, /className="prestador-com-readonly-cyan"/);
});

test('Altera e duplo clique convergem para o mesmo FormModal usando id', () => {
  assert.match(modal, /const openEdit = \(id = state\.selectedId\)/);
  assert.match(modal, /mode="edit"/);
  assert.match(modal, /item=\{state\.items\.find\(\(entry\) => entry\.id === editId\)/);
  assert.match(table, /onDoubleClick: \(\) => onEdit\(record\.id\)/);
  assert.match(api, /atualizarComissao\(id, payload\)/);
  assert.match(api, /comissoes\/\$\{Number\(id\)\}/);
  assert.match(form, /atualizarComissao\(item\.id, payload\)/);
});

test('Elimina confirma pelo prestador e usa id com reload, sem soft delete', () => {
  assert.match(modal, /Deseja eliminar o fator de comissão de/);
  assert.match(modal, /excluirComissao\(deleteRecord\.id\)/);
  assert.match(modal, /await state\.reload\(\)/);
  assert.match(modal, /setDeleteRecord\(null\)/);
  assert.match(api, /excluirComissao\(id\)/);
  assert.doesNotMatch(modal, /source_id.*delete/i);
});

test('especialidade vazia e percentual seguem a apresentação EasyDental', () => {
  const mapper = read('utils/prestadorComissaoMappers.js');
  assert.match(form, /options=\{\[\{ value: '', label: '' \}\,/);
  assert.match(mapper, /especialidade_row_id: draft\.especialidade_row_id \? Number\(draft\.especialidade_row_id\) : null/);
  assert.match(mapper, /toFixed\(4\).*%/s);
  assert.match(table, /formatPrestadorComissaoRepasse/);
  assert.match(api, /item\?\.descricao \?\? item\?\.nome/);
});

test('Novo organiza taxa e auditoria em linhas compactas sem alterar o contrato', () => {
  const css = fs.readFileSync(new URL('../src/features/prestadoresComissoes/prestadorComissoes.css', import.meta.url), 'utf8');
  assert.match(form, /prestador-com-form-rate-row/);
  assert.match(form, /prestador-com-readonly-grid/);
  assert.match(css, /\.prestador-com-form-rate-row\s*\{[\s\S]*grid-template-columns/);
  assert.match(css, /\.prestador-com-readonly-grid\s*\{[\s\S]*grid-template-columns/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(form, /DatePickerEntry/);
});

test('filtros usam Todos, apelidos e sentinela Clínica', () => {
  assert.match(toolbar, /value: ALL_FILTER, label: '<<Todos>>'/);
  assert.match(toolbar, /value: item\.is_system_prestador \? 0/);
  assert.match(toolbar, /item\.apelido \|\| item\.nome/);
  assert.match(toolbar, /inactive/);
  assert.match(api, /convenio_row_id/);
  assert.match(api, /prestador_row_id/);
});

test('tabela tem cinco colunas e Repasse puro', () => {
  for (const label of ['Vigência', 'Prestador', 'Convênio', 'Especialidade', 'Repasse']) assert.match(table, new RegExp(label));
  assert.match(table, /dataIndex: 'repasse'/);
  assert.doesNotMatch(table, /tipo_repasse/);
  assert.match(table, /rowKey="id"/);
});

test('GET possui estados de loading, error, empty e rodapé por quantidade', () => {
  assert.match(hook, /setLoading\(true\)/);
  assert.match(hook, /setError\(''\)/);
  assert.match(table, /loading=\{loading\}/);
  assert.match(table, /error \?/);
  assert.match(table, /Nenhum fator encontrado\./);
  assert.match(hook, /items\.length === 1/);
});
