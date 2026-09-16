import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { appPath } from '../src/app/basePath.js';
import { buildApiUrl } from '../src/services/api.js';
import { completeFirstAccess } from '../src/features/firstAccess/firstAccessApi.js';
import {
  buildFirstAccessPayload,
  validateFirstAccessValues,
} from '../src/features/firstAccess/firstAccessValidation.js';

test('rota de primeiro acesso usa o prefixo React em /app', () => {
  assert.equal(appPath('primeiro-acesso'), '/app/primeiro-acesso');
});

test('validacao replica o contrato minimo do backend sem regra extra', () => {
  assert.equal(validateFirstAccessValues({ senha: '', confirmaSenha: '' }).valid, false);
  assert.equal(validateFirstAccessValues({ senha: '12345', confirmaSenha: '12345' }).valid, false);
  assert.equal(validateFirstAccessValues({ senha: '123456', confirmaSenha: '' }).valid, false);
  assert.equal(validateFirstAccessValues({ senha: '123456', confirmaSenha: '654321' }).valid, false);
  assert.equal(validateFirstAccessValues({ senha: '123456', confirmaSenha: '123456' }).valid, true);
  assert.equal(validateFirstAccessValues({ senha: '      ', confirmaSenha: '      ' }).valid, true);
});

test('payload do primeiro acesso envia apenas senha e confirmacao', () => {
  const payload = buildFirstAccessPayload({
    email: 'admin@clinica.test',
    senha: 'Senha123',
    confirmaSenha: 'Senha123',
  });

  assert.deepEqual(payload, {
    senha: 'Senha123',
    confirma_senha: 'Senha123',
  });
  assert.equal(Object.hasOwn(payload, 'email'), false);
});

test('service chama POST /auth/setup/complete com Bearer e JSON', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      json: async () => ({ detail: 'Configuracao inicial concluida com sucesso.' }),
    };
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const result = await completeFirstAccess({ senha: 'Senha123', confirma_senha: 'Senha123' }, 'token-a');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, buildApiUrl('/auth/setup/complete'));
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer token-a');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    senha: 'Senha123',
    confirma_senha: 'Senha123',
  });
  assert.deepEqual(result, { detail: 'Configuracao inicial concluida com sucesso.' });
});

test('service normaliza erros HTTP e preserva status', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 403,
    json: async () => ({ detail: 'Conta sistemica sem setup interativo.' }),
  });

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await assert.rejects(
    () => completeFirstAccess({ senha: 'Senha123', confirma_senha: 'Senha123' }, 'token-a'),
    (error) => {
      assert.equal(error.status, 403);
      assert.equal(error.message, 'Conta sistemica sem setup interativo.');
      return true;
    },
  );
});

test('App.jsx aplica guard antes do shell e preserva login/app normal', () => {
  const app = readFileSync(resolve('frontend-react/src/app/App.jsx'), 'utf8');
  const guardIndex = app.indexOf('user?.setup_completed === false');
  const shellIndex = app.indexOf('className="brana-app brana-shell"');

  assert.match(app, /import \{ FirstAccessPage \} from '..\/features\/firstAccess\/FirstAccessPage.jsx';/);
  assert.match(app, /function isFirstAccessRoute\(\)/);
  assert.match(app, /window\.location\.replace\(appPath\('primeiro-acesso'\)\)/);
  assert.match(app, /return <FirstAccessPage \/>;/);
  assert.match(app, /if \(isFirstAccessRoute\(\)\) \{\s*window\.location\.replace\(appPath\(\)\);/);
  assert.equal(guardIndex > -1, true);
  assert.equal(shellIndex > -1, true);
  assert.equal(guardIndex < shellIndex, true);
});

test('pagina de primeiro acesso contem campos e nao renderiza controles proibidos', () => {
  const page = readFileSync(resolve('frontend-react/src/features/firstAccess/FirstAccessPage.jsx'), 'utf8');
  const css = readFileSync(resolve('frontend-react/src/features/firstAccess/firstAccess.css'), 'utf8');

  assert.match(page, /Primeiro acesso/);
  assert.match(page, /Estamos quase prontos para começar/);
  assert.match(page, /senha de segurança interna/);
  assert.match(page, /Esta NÃO é sua senha de login/);
  assert.match(page, /senha de login continua sendo a senha usada para acessar esta conta/);
  assert.match(page, /proteger ações importantes no sistema/);
  assert.match(page, /operações sensíveis/);
  assert.match(page, /alterá-la posteriormente nas configurações/);
  assert.match(page, /Esta etapa ocorre apenas no primeiro acesso/);
  assert.match(page, /readOnly/);
  assert.match(page, /initialValue=\{user\?\.email \|\| ''\}/);
  assert.match(page, /label="Senha interna"/);
  assert.match(page, /label="Confirmar senha interna"/);
  assert.match(page, /Concluir primeiro acesso/);
  assert.match(page, /Sair/);
  assert.match(page, /signOut/);
  assert.match(page, /refreshSession/);
  assert.match(page, /autoComplete="username"/);
  assert.match(page, /autoComplete="new-password"/);
  assert.match(page, /first-access-internal-password-alert/);
  assert.match(css, /first-access-internal-password-alert/);
  assert.match(css, /first-access-internal-password-copy/);
  assert.doesNotMatch(page, /nome da clinica/i);
  assert.doesNotMatch(page, /codigo por e-mail/i);
  assert.doesNotMatch(page, /window\.location\.reload/);
  assert.doesNotMatch(page, /window\.confirm|alert\(/);
  ['clÃƒ', 'NÃƒ', 'operaÃ', 'configuracao inicial', 'ï¿½'].forEach((text) => {
    assert.equal(page.includes(text), false, `Texto ambíguo/mojibake encontrado: ${text}`);
  });
});

test('hook bloqueia duplicidade, chama refreshSession e exige setup true', () => {
  const hook = readFileSync(resolve('frontend-react/src/features/firstAccess/useCompleteFirstAccess.js'), 'utf8');

  assert.match(hook, /if \(inFlightRef\.current\) \{\s*return null;/);
  assert.match(hook, /completeFirstAccess\(buildFirstAccessPayload\(values\), token/);
  assert.match(hook, /const nextUser = await refreshSession\(\);/);
  assert.match(hook, /nextUser\.setup_completed !== true/);
  assert.doesNotMatch(hook, /loginRequest|renewAuthToken|window\.location\.reload/);
});
