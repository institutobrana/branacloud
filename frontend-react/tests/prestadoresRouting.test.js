import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('src/app/App.jsx');
const routesPath = path.resolve('src/app/routes.jsx');
const pagePath = path.resolve('src/features/prestadores/PrestadoresPage.jsx');
const toolbarPath = path.resolve('src/features/prestadores/PrestadoresToolbar.jsx');
const tablePath = path.resolve('src/features/prestadores/PrestadoresTable.jsx');
const constantsPath = path.resolve('src/features/prestadores/prestadoresConstants.js');
const appSource = fs.readFileSync(appPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');
const tableSource = fs.readFileSync(tablePath, 'utf8');
const constantsSource = fs.readFileSync(constantsPath, 'utf8');
const refToolbarSource = fs.readFileSync(path.resolve('src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx'), 'utf8');
const refTableSource = fs.readFileSync(path.resolve('src/features/servicosProtetico/components/ServicosProteticoTable.jsx'), 'utf8');

test('Corpo clinico aparece no menu de Cadastro', () => {
  assert.match(appSource, /key:\s*'corpo-clinico',\s*label:\s*'Corpo clínico'/);
});

test('Corpo clinico possui rota real em /app/cadastro/corpo-clinico', () => {
  assert.match(appSource, /\/app\/cadastro\/corpo-clinico/);
  assert.match(routesSource, /path:\s*'\/app\/cadastro\/corpo-clinico'/);
});

test('App reconhece a tela prestadores na navegacao autenticada', () => {
  assert.match(appSource, /if \(path === '\/app\/cadastro\/corpo-clinico'\) return 'prestadores';/);
  assert.match(appSource, /if \(screen === 'prestadores'\) \{/);
  assert.match(appSource, /if \(groupKey === 'cadastro' && item\?\.key === 'corpo-clinico'/);
});

test('Pagina de prestadores usa shell em L e nao chama API', () => {
  assert.match(pageSource, /servicos-protetico-page/);
  assert.match(pageSource, /PrestadoresToolbar/);
  assert.match(pageSource, /PrestadoresTable/);
  assert.doesNotMatch(pageSource, /fetch\(|axios|api\//);
});

test('Toolbar de prestadores expõe os controles pedidos e bloqueia ações dependentes', () => {
  assert.match(toolbarSource, /Novo prestador/);
  assert.match(toolbarSource, /Altera/);
  assert.match(toolbarSource, /Elimina/);
  assert.match(toolbarSource, /Agenda/);
  assert.match(toolbarSource, /Convênios/);
  assert.match(toolbarSource, /Comissões/);
  assert.match(toolbarSource, /placeholder="Especialidade"/);
  assert.match(toolbarSource, /Buscar por nome ou código/);
  assert.match(toolbarSource, /disabled=\{!canRunSelectionActions\}/);
  assert.match(toolbarSource, /servicos-protetico-toolbar-row/);
  assert.match(toolbarSource, /materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions prestadores-toolbar-actions/);
  assert.match(toolbarSource, /materiais-estoque-toolbar-filters servicos-protetico-toolbar-filters prestadores-toolbar-filters/);
  assert.match(toolbarSource, /prestadores-toolbar-field/);
  assert.match(refToolbarSource, /servicos-protetico-toolbar-row/);
});

test('Tabela de prestadores preserva as cinco colunas do contrato', () => {
  assert.match(constantsSource, /Código/);
  assert.match(constantsSource, /Fone 1/);
  assert.match(constantsSource, /Fone 2/);
  assert.match(constantsSource, /Status/);
  assert.match(tableSource, /servicos-protetico-table-shell prestadores-table-shell/);
  assert.match(tableSource, /servicos-protetico-table-frame prestadores-table-frame/);
  assert.match(tableSource, /servicos-protetico-table-grid prestadores-table-grid/);
  assert.match(tableSource, /rowSelection=\{\{/);
  assert.match(tableSource, /type: 'radio'/);
  assert.match(tableSource, /TableColumnFilterHeader/);
  assert.match(tableSource, /columnsConfig/);
  assert.doesNotMatch(tableSource, /Nenhum prestador cadastrado\./);
  assert.match(tableSource, /0 prestadores/);
  assert.match(tableSource, /TABLE_SCROLL_Y = 480/);
  assert.match(refTableSource, /servicos-protetico-table-shell/);
});
