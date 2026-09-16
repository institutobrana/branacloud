import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculatePatientAge } from '../src/shared/patientInUse/patientInUseUtils.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = fs.readFileSync(path.join(here, '../src/app/App.jsx'), 'utf8');
const page = fs.readFileSync(path.join(here, '../src/features/fichaClinica/FichaClinicaPage.jsx'), 'utf8');
const context = fs.readFileSync(path.join(here, '../src/shared/patientInUse/PatientInUseContext.jsx'), 'utf8');

test('calcula idade em anos respeitando aniversario ainda nao ocorrido', () => {
  const today = new Date('2026-09-09T00:00:00');
  assert.equal(calculatePatientAge('1980-02-02', today), '46 anos, 7 meses');
  assert.equal(calculatePatientAge('1980-09-10', today), '45 anos, 11 meses');
  assert.equal(calculatePatientAge('', today), '');
});

test('entrada sem paciente monta a ficha e abre o modal uma vez', () => {
  assert.match(app, /<FichaClinicaPage/);
  assert.match(app, /<MenuPacientesModal/);
  assert.match(app, /patientEntryPromptedRef/);
  assert.match(app, /setPatientMenuOpen\(true\)/);
  assert.match(app, /onCancel=\{\(\) => setPatientMenuOpen\(false\)\}/);
});

test('selecao, limpeza e reidratacao usam a fonte compartilhada', () => {
  assert.match(app, /setPatientInUse\(patient\)/);
  assert.match(page, /usePatientInUse/);
  assert.match(page, /clearPatient\(\)/);
  assert.match(context, /sessionStorage/);
  assert.match(context, /PatientInUseProvider/);
});

test('acoes contextuais abrem edicao do paciente atual e limpam sem navegar', () => {
  assert.match(app, /onOpenPersonalRecord=\{\(patient\) => openExistingPatient\(patient\?\.id\)\}/);
  assert.match(app, /onCloseFichaClinica=\{\(\) => \{ setPatientMenuOpen\(false\); clearPatientInUse\(\); \}\}/);
  assert.match(app, /mode=\{fichaPessoalMode\}/);
  assert.match(app, /patientId=\{fichaPessoalPatientId\}/);
  assert.match(app, /onSaved=\{\(saved\) => \{[\s\S]*setPatientInUse\(saved\)/);
  assert.doesNotMatch(app, /onCloseFichaClinica=\{\(\) => handleNavigate\('dashboard'\)\}/);
  assert.match(page, /key: 'open-personal-record'/);
  assert.match(page, /key: 'close-ficha-clinica'/);
});

test('cabecalho preserva foto, codigo, nome, idade e fone1 sem APIs clinicas', () => {
  assert.match(page, /foto_data_url/);
  assert.match(page, /patient\.codigo/);
  assert.match(page, /patientLabel/);
  assert.match(page, /data_nascimento/);
  assert.match(page, /formatTelefone\(patient\)/);
  assert.doesNotMatch(page, /\/odontograma\//);
  assert.doesNotMatch(page, /\/tratamentos\//);
});

test('seta do cabecalho usa icon_combo dentro do contexto do paciente', () => {
  assert.match(page, /ficha-clinica-patient-context-arrow/);
  assert.match(page, /src="\/app\/assets\/fichaClinica\/icon_combo\.png"/);
  assert.match(page, /ficha-clinica-patient-context-data[\s\S]*ficha-clinica-patient-context-arrow/);
  assert.match(page, /patientLabel[\s\S]*calculatePatientAge[\s\S]*formatTelefone/);
});

test('toolbar operacional foi separada do quadro do odontograma', () => {
  assert.match(app, /ficha-clinica-shell-band/);
  assert.match(page, /FichaClinicaContextBar/);
  assert.doesNotMatch(page, /ficha-clinica-context-header/);
  assert.match(page, /ficha-clinica-action-bar/);
  assert.match(page, /export function FichaClinicaContextBar/);
});

test('E1 conecta os dois primeiros botoes aos fluxos existentes sem alterar os demais', () => {
  assert.match(app, /onRequestNewPatient=\{openNewPatientFromFicha\}/);
  assert.match(app, /onRequestPatientSelection=\{\(\) => setPatientMenuOpen\(true\)\}/);
  assert.match(page, /Novo paciente\/tratamento/);
  assert.match(page, /Novo paciente/);
  assert.match(page, /Novo tratamento/);
  assert.match(page, /onRequestNewPatient\?\.\(\)/);
  assert.match(page, /onRequestPatientSelection\?\.\(\)/);
  assert.match(page, /Pesquisar paciente/);
  assert.match(app, /<MenuPacientesModal/);
});

test('Novo tratamento re-renderiza a pagina ativa quando o estado de abertura muda', () => {
  const activePageMemo = app.match(/const activePage = useMemo\(\(\) => \{[\s\S]*?\n  \}, \[([\s\S]*?)\n  \]\);/);
  assert.ok(activePageMemo, 'activePage deve ser calculada por useMemo');
  assert.match(activePageMemo[1], /fichaNewTreatmentOpen/);
});

test('R3.2 usa os dois assets oficiais novos e preserva a ordem dos oito botoes', () => {
  const css = fs.readFileSync(path.join(here, '../src/features/fichaClinica/fichaClinica.css'), 'utf8');
  assert.match(page, /ico_novo_paciente_transp\.png/);
  assert.match(page, /ico_ficha_pesquisar\.png/);
  assert.doesNotMatch(page, /key: 'novo'.*ico_dashboard_novo\.png/s);
  assert.doesNotMatch(page, /key: 'pesquisa'.*ico_odontograma_toolbar_prc_lupa\.png/s);
  for (const icon of ['ico_filtro.PNG', 'ico_select.png', 'ico_trocar.png', 'ico_tabelas_auxiliares.PNG', 'ico_orcamento.png', 'ico_odonto_imprime.png']) {
    assert.match(page, new RegExp(icon.replace('.', '\\.')));
  }
  assert.match(css, /ficha-clinica-action-bar \.ficha-clinica-odontogram-toolbar-icon \{ width: 24px; height: 24px;/);
});

test('R3.3 usa os oito nomes oficiais e normaliza o tamanho optico', () => {
  const css = fs.readFileSync(path.join(here, '../src/features/fichaClinica/fichaClinica.css'), 'utf8');
  assert.match(page, /ico_filtro\.PNG/);
  assert.match(page, /ico_select\.(?:PNG|png)/);
  assert.match(page, /ico_trocar\.(?:PNG|png)/);
  assert.match(page, /ico_tabelas_auxiliares\.PNG/);
  assert.match(page, /ico_orcamento\.(?:PNG|png)/);
  assert.match(page, /ico_odonto_imprime\.(?:PNG|png)/);
  assert.match(page, /ficha-clinica-odontogram-toolbar-button-\$\{item\.key\}/);
  assert.match(css, /\.ficha-clinica-action-bar \.ficha-clinica-odontogram-toolbar-icon \{ width: 24px; height: 24px;/);
  assert.match(css, /button-menu \.ficha-clinica-odontogram-toolbar-icon \{ width: 30px; height: 30px;/);
});

test('CC reproduz o painel visual do Novo contato sem misturar Boca/Dente', () => {
  const css = fs.readFileSync(path.join(here, '../src/features/fichaClinica/fichaClinica.css'), 'utf8');
  assert.match(page, /function UpperOdontogramPanel/);
  assert.match(page, /ficha-clinica-upper-odontogram-panel/);
  assert.match(page, /type="card"/);
  assert.match(page, /activeKey="empty"/);
  assert.match(page, /Odontograma sem tratamento/);
  assert.match(page, /<UpperOdontogramPanel \/>/);
  assert.match(page, /ficha-clinica-odontogram-footer/);
  assert.match(page, /tabPosition="bottom"/);
  assert.doesNotMatch(page, /tab-novo/);
  assert.doesNotMatch(page, /tx_dt_inicio/);
  assert.match(css, /\.ficha-clinica-upper-odontogram-panel/);
  assert.match(css, /padding: 0 14px 6px/);
  assert.match(css, /min-width: 84px/);
  assert.match(css, /height: 30px/);
  assert.match(css, /background: #f5f0e6/);
});

test('R2 usa faixa neutra compacta e limita a largura visual', () => {
  const css = fs.readFileSync(path.join(here, '../src/features/fichaClinica/fichaClinica.css'), 'utf8');
  assert.match(css, /\.brana-shell-band\.ficha-clinica-shell-band \{ background: transparent/);
  assert.match(css, /display: inline-flex/);
  assert.doesNotMatch(css, /1180px/);
  assert.match(css, /padding: 0; background: transparent/);
  assert.match(css, /\.ficha-clinica-action-bar \.ficha-clinica-odontogram-toolbar \{[^}]*margin: 0/);
});

test('R2.3 restringe o rail ao shell da Ficha e compacta verticalmente', () => {
  const app = fs.readFileSync(path.join(here, '../src/app/App.jsx'), 'utf8');
  const css = fs.readFileSync(path.join(here, '../src/features/fichaClinica/fichaClinica.css'), 'utf8');
  assert.match(app, /ficha-clinica-shell-body/);
  assert.match(css, /ficha-clinica-shell-body > \.brana-icon-rail \{[^}]*height: auto; min-height: 100%/);
  assert.match(css, /line-height: 1\.05/);
  assert.match(css, /font-size: 11px/);
  assert.match(css, /width: 44px !important; height: 44px !important/);
});

test('R2.4 faz o rail da Ficha começar no topo do shell', () => {
  const css = fs.readFileSync(path.join(here, '../src/features/fichaClinica/fichaClinica.css'), 'utf8');
  assert.match(css, /\.brana-shell-band\.ficha-clinica-shell-band::before[^}]*width: var\(--brana-rail-width, 72px\)/);
  assert.match(css, /\.ficha-clinica-shell-body > \.brana-icon-rail \{ height: auto; min-height: 100%/);
});
