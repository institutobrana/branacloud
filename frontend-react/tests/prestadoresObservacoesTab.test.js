import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const observationsPath = path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/PrestadorObservacoesTab.jsx');
const modalPath = path.resolve('frontend-react/src/features/prestadores/components/PrestadorModal.jsx');
const backendRouteSource = fs.readFileSync(path.resolve('backend', 'routes', 'prestadores_routes.py'), 'utf8');

const observationsSource = fs.readFileSync(observationsPath, 'utf8');
const modalSource = fs.readFileSync(modalPath, 'utf8');

test('Aba Observações existe como componente proprio', () => {
  assert.match(observationsSource, /export function PrestadorObservacoesTab/);
  assert.match(observationsSource, /Input\.TextArea/);
  assert.match(observationsSource, /rows=\{13\}/);
  assert.match(modalSource, /PrestadorObservacoesTab/);
  assert.doesNotMatch(modalSource, /EmptyTab label="Observações"/);
});

test('Observações usa o campo backend correto sem persistencia nova', () => {
  assert.match(backendRouteSource, /observacoes/);
  assert.match(backendRouteSource, /item\.observacoes = _clean_text\(payload\.observacoes\)/);
  assert.doesNotMatch(observationsSource, /requestJson\(/);
  assert.doesNotMatch(observationsSource, /POST/);
  assert.doesNotMatch(observationsSource, /PUT/);
  assert.doesNotMatch(observationsSource, /DELETE/);
});
