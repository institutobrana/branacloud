import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const modalPath = path.resolve('frontend-react/src/features/prestadores/components/PrestadorModal.jsx');
const detailsPath = path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/PrestadorDetalhesTab.jsx');
const cssPath = path.resolve('frontend-react/src/features/prestadores/prestadores.css');
const overridePath = path.resolve('frontend/prestadores_override.js');

const modalSource = fs.readFileSync(modalPath, 'utf8');
const detailsSource = fs.readFileSync(detailsPath, 'utf8');
const cssSource = fs.readFileSync(cssPath, 'utf8');
const overrideSource = fs.readFileSync(overridePath, 'utf8');

test('Detalhes do modal usa componente próprio e nao placeholder', () => {
  assert.match(modalSource, /import \{ PrestadorDetalhesTab \} from '\.\/prestadorForm\/PrestadorDetalhesTab\.jsx';/);
  assert.match(modalSource, /children: <PrestadorDetalhesTab draft=\{draft\} updateDraft=\{updateDraft\} \/>/);
  assert.doesNotMatch(modalSource, /EmptyTab label="Detalhes"/);
});

test('Contrato visual da aba Detalhes segue a estrutura do legado', () => {
  assert.match(detailsSource, /Banco/);
  assert.match(detailsSource, /Agência/);
  assert.match(detailsSource, /Nº Conta/);
  assert.match(detailsSource, /Nome da conta/);
  assert.match(detailsSource, /Modo de pagamento/);
  assert.match(detailsSource, /Faculdade/);
  assert.match(detailsSource, /Formatura/);
  assert.match(detailsSource, /Alerta para agendamentos/);
  assert.match(detailsSource, /Especialidades que executa/);
  assert.match(detailsSource, /Cirurgia/);
  assert.match(detailsSource, /Dentística/);
  assert.match(detailsSource, /Diagnóstico/);
  assert.match(detailsSource, /Endodontia/);
  assert.match(detailsSource, /Estética/);
  assert.match(detailsSource, /Gerais/);
  assert.match(detailsSource, /Harmonização Facial/);
  assert.match(detailsSource, /Implantodontia/);
  assert.match(detailsSource, /Odontopediatria/);
  assert.match(detailsSource, /Ortodontia/);
  assert.match(detailsSource, /Periodontia/);
  assert.match(detailsSource, /Prevenção/);
  assert.match(detailsSource, /Prótese/);
  assert.match(detailsSource, /Radiologia/);
});

test('Detalhes carrega catálogos reais com fallback do legado e ordem preservada', () => {
  assert.match(detailsSource, /listarAuxiliares\('Bancos'\)/);
  assert.match(detailsSource, /listarAuxiliares\('Tipos de pagamento'\)/);
  assert.match(detailsSource, /listarEspecialidadesAtivas\(\)/);
  assert.match(detailsSource, /DEFAULT_BANK_OPTIONS/);
  assert.match(detailsSource, /DEFAULT_PAYMENT_OPTIONS/);
  assert.match(detailsSource, /DEFAULT_SPECIALITIES/);
  assert.match(detailsSource, /orderSpecialities/);
});

test('CSS da aba Detalhes mantém a grade compacta e o grupo de especialidades em colunas', () => {
  assert.match(cssSource, /prestadores-modal-tab--detalhes/);
  assert.match(cssSource, /prestadores-modal-grid--detalhes-row1/);
  assert.match(cssSource, /prestadores-modal-grid--detalhes-row2/);
  assert.match(cssSource, /prestadores-modal-grid--detalhes-row3/);
  assert.match(cssSource, /prestadores-modal-grid--detalhes-row4/);
  assert.match(cssSource, /prestadores-modal-specialities-grid/);
  assert.match(cssSource, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(cssSource, /prestadores-modal-specialities-title/);
});

test('Legacy override confirma o contrato antigo dos detalhes', () => {
  assert.match(overrideSource, /prest-detalhes-grid/);
  assert.match(overrideSource, /Banco/);
  assert.match(overrideSource, /Modo de pagamento/);
  assert.match(overrideSource, /Especialidades que executa/);
  assert.match(overrideSource, /Cirurgia/);
  assert.match(overrideSource, /Radiologia/);
});
