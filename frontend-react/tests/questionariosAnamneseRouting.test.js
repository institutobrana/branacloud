import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appSource = fs.readFileSync(path.resolve('frontend-react/src/app/App.jsx'), 'utf8');
const routesSource = fs.readFileSync(path.resolve('frontend-react/src/app/routes.jsx'), 'utf8');
const pageSource = fs.readFileSync(path.resolve('frontend-react/src/features/questionariosAnamnese/QuestionariosAnamnesePage.jsx'), 'utf8');
const toolbarSource = fs.readFileSync(path.resolve('frontend-react/src/features/questionariosAnamnese/components/QuestionariosAnamneseToolbar.jsx'), 'utf8');

test('App.jsx resolve e renderiza Questionarios de anamnese pela rota do shell', () => {
  assert.match(appSource, /if \(path === `\$\{base\}\/configuracoes\/questionarios-anamnese`\) return 'questionarios-anamnese';/);
  assert.match(appSource, /screen === 'questionarios-anamnese'/);
  assert.match(appSource, /window\.dispatchEvent\(new Event\('brana-app-navigation'\)\)/);
  assert.match(appSource, /window\.addEventListener\('brana-app-navigation'/);
  assert.match(appSource, /return <QuestionariosAnamnesePage onToolbarChange=\{setQuestionariosToolbar\} \/>;/);
  assert.match(routesSource, /path:\s*'\/app\/configuracoes\/questionarios-anamnese'/);
});

test('Questionarios de anamnese mantem estrutura de pagina e toolbar sem fallback para Dashboard', () => {
  assert.match(pageSource, /QuestionarioFormModal/);
  assert.match(pageSource, /PerguntaFormModal/);
  assert.match(pageSource, /QuestionariosAnamneseTable/);
  assert.doesNotMatch(pageSource, /DashboardPage/);
  assert.match(toolbarSource, /Controles de questionarios de anamnese/);
  assert.match(toolbarSource, /Questionario:/);
  assert.match(toolbarSource, /Nova pergunta/);
  assert.match(toolbarSource, /Altera/);
  assert.match(toolbarSource, /Elimina/);
});
