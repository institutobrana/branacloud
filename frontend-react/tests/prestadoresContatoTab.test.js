import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const contatoPath = path.resolve('frontend-react/src/features/prestadores/components/prestadorForm/PrestadorContatoTab.jsx');
const contatoSource = fs.readFileSync(contatoPath, 'utf8');
const modalPath = path.resolve('frontend-react/src/features/prestadores/components/PrestadorModal.jsx');
const modalSource = fs.readFileSync(modalPath, 'utf8');
const backendRouteSource = fs.readFileSync(path.resolve('backend', 'routes', 'prestadores_routes.py'), 'utf8');

test('Aba Contato existe como componente proprio e substitui o placeholder', () => {
  assert.match(contatoSource, /export function PrestadorContatoTab/);
  assert.match(modalSource, /PrestadorContatoTab/);
  assert.doesNotMatch(modalSource, /EmptyTab label="Contato"/);
});

test('Aba Contato preserva a estrutura e os campos do legado', () => {
  assert.match(contatoSource, /Telefones:/);
  assert.match(contatoSource, /E-mail principal:/);
  assert.match(contatoSource, /Home-page:/);
  assert.match(contatoSource, /Endereço residencial:/);
  assert.match(contatoSource, /Nº:/);
  assert.match(contatoSource, /Complemento:/);
  assert.match(contatoSource, /Bairro:/);
  assert.match(contatoSource, /Cidade:/);
  assert.match(contatoSource, /CEP:/);
  assert.match(contatoSource, /UF:/);
  assert.match(contatoSource, /Residencial/);
  assert.match(contatoSource, /Comercial/);
  assert.match(contatoSource, /Celular/);
  assert.match(contatoSource, /Recado/);
  assert.match(contatoSource, /Tipos de logradouro/);
  assert.match(contatoSource, /Bairro/);
  assert.match(contatoSource, /Cidade/);
  assert.match(contatoSource, /UNIDADE_ATENDIMENTO_UFS/);
  assert.match(contatoSource, /<Select[\s\S]*placeholder="Selecione"[\s\S]*options=\{bairroOptions\}[\s\S]*showSearch[\s\S]*optionFilterProp="label"/);
  assert.doesNotMatch(contatoSource, /return <Input placeholder="Bairro" \/>/);
});

test('Aba Contato nao inventa POST nem integração de persistencia', () => {
  assert.doesNotMatch(contatoSource, /requestJson\(/);
  assert.doesNotMatch(contatoSource, /\bPOST\b/);
  assert.doesNotMatch(contatoSource, /onSubmit/);
  assert.doesNotMatch(contatoSource, /fetch\(/);
});

test('Backend ja possui os campos persistidos da aba Contato', () => {
  assert.match(backendRouteSource, /fone1_tipo/);
  assert.match(backendRouteSource, /fone2_tipo/);
  assert.match(backendRouteSource, /email/);
  assert.match(backendRouteSource, /homepage/);
  assert.match(backendRouteSource, /logradouro_tipo/);
  assert.match(backendRouteSource, /endereco/);
  assert.match(backendRouteSource, /numero/);
  assert.match(backendRouteSource, /complemento/);
  assert.match(backendRouteSource, /bairro/);
  assert.match(backendRouteSource, /cidade/);
  assert.match(backendRouteSource, /cep/);
  assert.match(backendRouteSource, /uf/);
});
