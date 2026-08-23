import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('frontend-react/src/app/App.jsx');
const routesPath = path.resolve('frontend-react/src/app/routes.jsx');
const pagePath = path.resolve('frontend-react/src/features/prestadores/PrestadoresPage.jsx');
const toolbarPath = path.resolve('frontend-react/src/features/prestadores/PrestadoresToolbar.jsx');
const modalPath = path.resolve('frontend-react/src/features/prestadores/components/PrestadorModal.jsx');
const deleteDialogPath = path.resolve('frontend-react/src/features/prestadores/components/PrestadorDeleteDialog.jsx');
const tablePath = path.resolve('frontend-react/src/features/prestadores/PrestadoresTable.jsx');
const observationsPath = path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/PrestadorObservacoesTab.jsx');
const constantsPath = path.resolve('frontend-react/src/features/prestadores/prestadoresConstants.js');
const appSource = fs.readFileSync(appPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');
const modalSource = fs.readFileSync(modalPath, 'utf8');
const deleteDialogSource = fs.readFileSync(deleteDialogPath, 'utf8');
const tableSource = fs.readFileSync(tablePath, 'utf8');
const observationsSource = fs.readFileSync(observationsPath, 'utf8');
const constantsSource = fs.readFileSync(constantsPath, 'utf8');
const refToolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/servicosProtetico/components/ServicosProteticoToolbar.jsx'), 'utf8');
const refTableSource = fs.readFileSync(path.resolve('frontend-react/src/features/servicosProtetico/components/ServicosProteticoTable.jsx'), 'utf8');

test('Corpo clinico aparece no menu de Cadastro', () => {
  assert.match(appSource, /key:\s*'corpo-clinico',\s*label:\s*'Corpo clínico'/);
});

test('Corpo clinico possui rota real em /app/cadastro/corpo-clinico', () => {
  assert.match(appSource, /cadastro\/corpo-clinico/);
  assert.match(routesSource, /path:\s*'\/app\/cadastro\/corpo-clinico'/);
});

test('App reconhece a tela prestadores na navegacao autenticada', () => {
  assert.match(appSource, /if \(path === `\$\{base\}\/cadastro\/corpo-clinico`\) return 'prestadores';/);
  assert.match(appSource, /if \(screen === 'prestadores'\) \{/);
  assert.match(appSource, /if \(groupKey === 'cadastro' && item\?\.key === 'corpo-clinico'/);
  assert.match(appSource, /const prestadoresState = usePrestadores\(\);/);
  assert.match(appSource, /const prestadoresTopBar = useMemo/);
});

test('Pagina de prestadores usa shell em L e delega a listagem', () => {
  assert.match(pageSource, /servicos-protetico-page/);
  assert.match(pageSource, /PrestadoresTable/);
  assert.doesNotMatch(pageSource, /fetch\(|axios|api\//);
  assert.match(pageSource, /items, loading, error, selectedId, onSelect, onDoubleClick, footerLabel/);
});

test('Toolbar de prestadores expõe os controles pedidos e bloqueia ações dependentes', () => {
  assert.match(toolbarSource, /Novo prestador/);
  assert.match(toolbarSource, /onNovoPrestador/);
  assert.match(toolbarSource, /Altera/);
  assert.match(toolbarSource, /Elimina/);
  assert.match(toolbarSource, /onElimina/);
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
  assert.match(toolbarSource, /Todas as especialidades/);
  assert.match(toolbarSource, /showSearch/);
  assert.match(refToolbarSource, /servicos-protetico-toolbar-row/);
});

test('Modal de prestadores existe com quatro abas e botoes sem persistencia', () => {
  assert.match(modalSource, /Novo prestador/);
  assert.match(modalSource, /Altera prestador/);
  assert.match(modalSource, /Principal/);
  assert.match(modalSource, /Contato/);
  assert.match(modalSource, /Detalhes/);
  assert.match(modalSource, /Observações/);
  assert.doesNotMatch(modalSource, /Complementar/);
  assert.doesNotMatch(modalSource, /Agenda/);
  assert.doesNotMatch(modalSource, /Convênios/);
  assert.match(modalSource, /Cancela/);
  assert.match(modalSource, /Ok/);
  assert.match(modalSource, /PrestadorModal/);
  assert.match(modalSource, /useEffect\(\(\) => \{/);
  assert.match(modalSource, /if \(!open\) return;/);
  assert.match(modalSource, /setDraft\(buildPrestadorModalDraft\(\[\], record\)\);/);
  assert.match(modalSource, /const handleCancel = \(\) => \{/);
  assert.match(modalSource, /onCancel\?\.\(\);/);
  assert.match(modalSource, /createPrestador/);
  assert.match(modalSource, /updatePrestador/);
  assert.match(modalSource, /submitting/);
  assert.match(modalSource, /data-prestadores-submitting/);
  assert.match(modalSource, /disabled/);
  assert.match(modalSource, /PrestadorObservacoesTab/);
  assert.match(deleteDialogSource, /Elimina prestador/);
  assert.match(deleteDialogSource, /Deseja realmente eliminar o prestador/);
  assert.match(deleteDialogSource, /PrestadorDeleteDialog/);
});

test('As quatro abas compartilham o mesmo draft em vez de estado isolado', () => {
  assert.match(modalSource, /<PrestadorPrincipalTab draft=\{draft\} updateDraft=\{updateDraft\} \/>/);
  assert.match(modalSource, /<PrestadorContatoTab draft=\{draft\} updateDraft=\{updateDraft\} \/>/);
  assert.match(modalSource, /<PrestadorDetalhesTab draft=\{draft\} updateDraft=\{updateDraft\} \/>/);
  assert.match(modalSource, /<PrestadorObservacoesTab draft=\{draft\} updateDraft=\{updateDraft\} \/>/);
});

test('Observacoes usa textarea simples e nao inventa persistencia', () => {
  assert.match(observationsSource, /export function PrestadorObservacoesTab/);
  assert.match(observationsSource, /Input\.TextArea/);
  assert.match(observationsSource, /rows=\{13\}/);
  assert.match(observationsSource, /Observações/);
  assert.doesNotMatch(observationsSource, /requestJson\(/);
  assert.doesNotMatch(observationsSource, /Editor|Quill|ProseMirror/);
});

test('Principal do modal segue a estrutura de linhas do legado', () => {
  const principalSource = fs.readFileSync(path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/PrestadorPrincipalTab.jsx'), 'utf8');
  assert.match(principalSource, /buildPrestadorPrincipalDefaults/);
  assert.match(principalSource, /PRESTADOR_TIPO_OPTIONS/);
  assert.match(principalSource, /PRESTADOR_CBO_OPTIONS/);
  assert.match(principalSource, /PRESTADOR_SEXO_OPTIONS/);
  assert.match(principalSource, /PRESTADOR_ESTADO_CIVIL_OPTIONS/);
  assert.match(principalSource, /PRESTADOR_PREFIXO_OPTIONS/);
  assert.match(principalSource, /PRESTADOR_UF_CRO_OPTIONS/);
  assert.match(principalSource, /normalizeContaCorrenteDateInput/);
  assert.match(principalSource, /DatePickerEntry/);
  assert.match(principalSource, /onBlur={commitDraft}/);
  assert.match(principalSource, /onKeyDown=\{\(event\) => \{/);
  assert.match(principalSource, /Código/);
  assert.match(principalSource, /Nome do prestador/);
  assert.match(principalSource, /Apelido/);
  assert.match(principalSource, /Tipo do prestador/);
  assert.match(principalSource, /Início/);
  assert.match(principalSource, /Término/);
  assert.match(principalSource, /Inativar prestador/);
  assert.match(principalSource, /Prestador executa procedimento/);
  assert.match(principalSource, /CRO/);
  assert.match(principalSource, /UF CRO/);
  assert.match(principalSource, /CPF/);
  assert.match(principalSource, /RG/);
  assert.match(principalSource, /Nº INSS/);
  assert.match(principalSource, /Nº CCM/);
  assert.match(principalSource, /Nº contrato/);
  assert.match(principalSource, /Nº CNES/);
  assert.match(principalSource, /CBO-S/);
  assert.match(principalSource, /Nascimento/);
  assert.match(principalSource, /Sexo/);
  assert.match(principalSource, /Estado civil/);
  assert.match(principalSource, /Prefixo/);
  assert.match(principalSource, /Inclusão/);
  assert.match(principalSource, /Alteração/);
  assert.match(principalSource, /ID interno/);
  assert.doesNotMatch(principalSource, /Status/);
  assert.doesNotMatch(principalSource, /Especialidade/);
  assert.doesNotMatch(principalSource, /Telefone/);
  assert.doesNotMatch(principalSource, /E-mail/);
});

test('Contratos da Principal usam defaults e catálogos reais', () => {
  const contractsSource = fs.readFileSync(path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/prestadorPrincipalContracts.js'), 'utf8');
  assert.match(contractsSource, /PRESTADOR_TIPO_DEFAULT = 'Cirurgião dentista'/);
  assert.match(contractsSource, /PRESTADOR_CBO_DEFAULT = 'Cir.Dentista em Geral'/);
  assert.doesNotMatch(contractsSource, /buildPrestadorNextCodigo/);
  assert.match(contractsSource, /codigo:\s*''/);
  assert.match(contractsSource, /Casado\(a\)/);
  assert.match(contractsSource, /União Estável/);
  assert.match(contractsSource, /Dr/);
  assert.match(contractsSource, /UNIDADE_ATENDIMENTO_UFS/);
});

test('App abre o mesmo modal em modo de edicao usando o registro selecionado', () => {
  assert.match(appSource, /const openEditPrestador = \(item\) => \{/);
  assert.match(appSource, /const openDeletePrestador = \(\) => \{/);
  assert.match(appSource, /onAltera=\{\(\) => \{/);
  assert.match(appSource, /onElimina=\{openDeletePrestador\}/);
  assert.doesNotMatch(appSource, /obterPrestador/);
  assert.match(appSource, /mode:\s*'edit'/);
  assert.match(appSource, /mode:\s*'create'/);
  assert.match(appSource, /rowId:/);
  assert.match(appSource, /onDoubleClick=\{openEditPrestador\}/);
  assert.match(appSource, /PrestadorDeleteDialog/);
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
  assert.match(tableSource, /dataSource=\{items\}/);
  assert.match(tableSource, /renderStatus/);
  assert.match(tableSource, /Nenhum prestador cadastrado\./);
  assert.match(tableSource, /TABLE_SCROLL_Y = 480/);
  assert.match(refTableSource, /servicos-protetico-table-shell/);
});

test('Hook de prestadores carrega backend real e monta filtros locais', () => {
  const hookSource = fs.readFileSync(path.resolve('frontend-react/src/features/prestadores/hooks/usePrestadores.js'), 'utf8');
  const apiSource = fs.readFileSync(path.resolve('frontend-react/src/features/prestadores/prestadoresApi.js'), 'utf8');
  assert.match(hookSource, /listarPrestadores/);
  assert.match(hookSource, /filters/);
  assert.match(hookSource, /footerLabel/);
  assert.match(apiSource, /\/cadastros\/prestadores/);
  assert.match(apiSource, /normalizePrestador/);
});
