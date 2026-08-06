import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appPath = path.resolve('frontend-react/src/app/App.jsx');
const routesPath = path.resolve('frontend-react/src/app/routes.jsx');
const pagePath = path.resolve('frontend-react/src/features/medicamentos/MedicamentosPageNew.jsx');
const toolbarPath = path.resolve('frontend-react/src/features/medicamentos/MedicamentosToolbar.jsx');
const cssPath = path.resolve('frontend-react/src/features/medicamentos/medicamentos.css');
const appSource = fs.readFileSync(appPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const pageSource = fs.readFileSync(pagePath, 'utf8');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');
const cssSource = fs.readFileSync(cssPath, 'utf8');

test('Medicamentos aparece no menu de Tabelas', () => {
  assert.match(appSource, /key:\s*'medicamentos',\s*label:\s*'Medicamentos'/);
});

test('Medicamentos possui rota real em /app/tabelas/medicamentos', () => {
  assert.match(appSource, /tabelas\/medicamentos/);
  assert.match(routesSource, /path:\s*'\/app\/tabelas\/medicamentos'/);
});

test('Medicamentos nao redireciona para o dashboard no resolvedor de tela', () => {
  assert.match(appSource, /if \(path === `\$\{base\}\/tabelas\/medicamentos`\) return 'medicamentos';/);
  assert.match(appSource, /screen === 'medicamentos'/);
});

test('Toolbar de Medicamentos fica na banda global do shell', () => {
  assert.match(appSource, /medicamentosTopBar/);
  assert.match(appSource, /brana-shell-band auxiliary-shell-band medicamentos-shell-band/);
  assert.match(toolbarSource, /role="toolbar"/);
});

test('A pagina de Medicamentos nao duplica a toolbar interna', () => {
  assert.doesNotMatch(pageSource, /role="toolbar"/);
  assert.match(pageSource, /medicamentos-table-shell/);
});

test('Botoes estruturais estao desabilitados nesta etapa', () => {
  assert.match(toolbarSource, /<button type="button" className="auxiliary-shell-button primary" disabled>/);
  assert.match(toolbarSource, /<button type="button" className="auxiliary-shell-button" disabled>/);
  assert.match(toolbarSource, /<button type="button" className="auxiliary-shell-button danger" disabled>/);
});

test('Medicamentos nao faz chamadas HTTP nesta etapa', () => {
  assert.doesNotMatch(pageSource, /fetch\(|axios|listarMedicamentos|medicamentosApi/);
  assert.doesNotMatch(toolbarSource, /fetch\(|axios|listarMedicamentos|medicamentosApi/);
});

test('Medicamentos preserva cobertura basica para tema claro e escuro', () => {
  assert.match(cssSource, /\.medicamentos-table \.ant-table-thead > tr > th/);
  assert.match(cssSource, /:root\[data-brana-theme='dark'\]\s+\.medicamentos-table \.ant-table-tbody > tr\.is-selected > td/);
});
