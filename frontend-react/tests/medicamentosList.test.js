import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const apiPath = path.resolve('frontend-react/src/features/medicamentos/medicamentosApi.js');
const hookPath = path.resolve('frontend-react/src/features/medicamentos/useMedicamentosNew.js');
const tablePath = path.resolve('frontend-react/src/features/medicamentos/MedicamentosTableNew.jsx');
const pagePath = path.resolve('frontend-react/src/features/medicamentos/MedicamentosPageNew.jsx');
const toolbarPath = path.resolve('frontend-react/src/features/medicamentos/MedicamentosToolbar.jsx');
const cssPath = path.resolve('frontend-react/src/features/medicamentos/medicamentos.css');
const filterHeaderPath = path.resolve('frontend-react/src/components/TableColumnFilterHeader.jsx');

const apiSource = fs.readFileSync(apiPath, 'utf8');
const hookSource = fs.readFileSync(hookPath, 'utf8');
const tableSource = fs.readFileSync(tablePath, 'utf8');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');
const cssSource = fs.readFileSync(cssPath, 'utf8');
const filterHeaderSource = fs.readFileSync(filterHeaderPath, 'utf8');

test('Medicamentos usa o cliente HTTP global e os endpoints reais', () => {
  assert.match(apiSource, /buildApiUrl/);
  assert.match(apiSource, /\/medicamentos\?\$\{search\.toString\(\)\}/);
  assert.match(apiSource, /headers:\s*getAuthHeaders\(\)/);
  assert.match(apiSource, /\/medicamentos\/opcoes\/grupos/);
});

test('Medicamentos envia os parametros reais de grupo, nome, limit e skip', () => {
  assert.match(apiSource, /search\.set\('grupo'/);
  assert.match(apiSource, /search\.set\('nome'/);
  assert.match(apiSource, /search\.set\('limit', String\(limit\)\)/);
  assert.match(apiSource, /search\.set\('skip', String\(skip\)\)/);
});

test('Hook de Medicamentos possui debounce e protecao contra resposta obsoleta', () => {
  assert.match(hookSource, /setTimeout\(\(\) =>/);
  assert.match(hookSource, /requestSeqRef/);
  assert.match(hookSource, /currentRequestId !== requestSeqRef\.current/);
});

test('Hook de Medicamentos preserva selecao por id e limpa quando sumir', () => {
  assert.match(hookSource, /setSelectedId\(\(current\) =>/);
  assert.match(hookSource, /sortedItems\.some\(\(item\) => Number\(item\.id\) === Number\(current\)\)/);
});

test('Tabela de Medicamentos usa TableColumnFilterHeader com contrato completo', () => {
  assert.match(tableSource, /TableColumnFilterHeader/);
  assert.match(tableSource, /activeSort=\{sortState\?\.key === columnKey \? sortState\?\.order : null\}/);
  assert.match(tableSource, /onSortAsc=\{\(\) => onSort\?\.\(columnKey, 'asc'\)\}/);
  assert.match(tableSource, /onSortDesc=\{\(\) => onSort\?\.\(columnKey, 'desc'\)\}/);
  assert.match(tableSource, /const columns = BASE_COLUMNS\.map/);
  assert.match(tableSource, /const resolvedColumns = columns\.filter/);
  assert.match(tableSource, /onToggleColumn=\{onToggleVisibleColumn\}/);
  assert.match(tableSource, /filterValue=\{draftFilters\?\.\[columnKey\] \?\? ''\}/);
  assert.match(tableSource, /onFilterValueChange=\{\(value\) => setDraftFilters/);
  assert.match(tableSource, /onFilterApply=\{\(\) => onFilterApply\?\.\(columnKey, draftFilters\?\.\[columnKey\] \?\? ''\)\}/);
  assert.match(tableSource, /onFilterClear=\{\(\) => \{/);
  assert.match(tableSource, /activeFilter=\{Boolean\(String\(filters\?\.\[columnKey\] \?\? ''\)\.trim\(\)\)\}/);
});

test('Tabela de Medicamentos nao usa popup customizado antigo', () => {
  assert.doesNotMatch(tableSource, /medicamentos-filter-menu/);
  assert.doesNotMatch(tableSource, /medicamentos-filter-dropdown/);
});

test('TableColumnFilterHeader fornece o popup global completo', () => {
  assert.match(filterHeaderSource, /auxiliary-filter-menu-filter/);
  assert.match(filterHeaderSource, /auxiliary-filter-menu-actions/);
  assert.match(filterHeaderSource, /onFilterApply/);
  assert.match(filterHeaderSource, /onFilterClear/);
  assert.match(filterHeaderSource, /onSortAsc/);
  assert.match(filterHeaderSource, /onSortDesc/);
  assert.match(filterHeaderSource, /auxiliary-filter-menu-columns/);
});

test('Toolbar de Medicamentos permanece compacta e na banda global', () => {
  assert.doesNotMatch(pageSource, /role="toolbar"/);
  assert.match(toolbarSource, /role="toolbar"/);
  assert.match(toolbarSource, /placeholder="Pesquisar por nome"/);
  assert.match(toolbarSource, /disabled/);
});

test('CSS da Medicamentos cobre quadro, rodape integrado e tema escuro', () => {
  assert.match(cssSource, /\.medicamentos-table-frame/);
  assert.match(cssSource, /\.medicamentos-table-footer/);
  assert.match(cssSource, /grid-template-rows:\s*auto auto/);
  assert.doesNotMatch(cssSource, /\.medicamentos-filter-menu/);
  assert.doesNotMatch(cssSource, /\.medicamentos-card/);
  assert.match(cssSource, /:root\[data-brana-theme='dark'\]\s+\.medicamentos-table-footer/);
});

test('Pagina de Medicamentos preserva contador e estado de erro sem modal', () => {
  assert.match(pageSource, /medicamentos-table-shell/);
  assert.match(pageSource, /Falha ao carregar medicamentos/);
  assert.doesNotMatch(pageSource, /Modal|modal/);
  assert.doesNotMatch(pageSource, /POST|PUT|DELETE/);
});
