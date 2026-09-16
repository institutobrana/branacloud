# Implementacao - Primeiro acesso no frontend React

## Contexto

Esta etapa implementa o fluxo de primeiro acesso no frontend React para usuarios autenticados com `setup_completed=False`.

O objetivo e liberar o caminho necessario para que, futuramente, `ADM -> Clinicas -> Nova conta` possa criar uma conta cujo administrador inicial conclua o setup no React.

## Arquitetura

A implementacao ficou modular em:

- `frontend-react/src/features/firstAccess/FirstAccessPage.jsx`;
- `frontend-react/src/features/firstAccess/firstAccessApi.js`;
- `frontend-react/src/features/firstAccess/useCompleteFirstAccess.js`;
- `frontend-react/src/features/firstAccess/firstAccessValidation.js`;
- `frontend-react/src/features/firstAccess/firstAccess.css`.

`frontend-react/src/app/App.jsx` apenas coordena o guard e a rota.

## Rota

Rota dedicada:

```text
/app/primeiro-acesso
```

## Guard global

Regra implementada:

- carregando autenticacao: mostra estado de validacao;
- nao autenticado: redireciona para `/app/login`;
- autenticado com `user.setup_completed === false`: redireciona para `/app/primeiro-acesso`;
- autenticado com setup pendente em `/app/primeiro-acesso`: renderiza somente `FirstAccessPage`;
- autenticado com setup concluido tentando abrir `/app/primeiro-acesso`: redireciona para `/app`;
- autenticado com setup concluido: entra normalmente no shell.

A comparacao usa explicitamente `false`, preservando compatibilidade com sessoes antigas que nao tragam o campo.

## Pagina

A pagina dedicada nao renderiza o shell principal, menu lateral, topbar ou workspace.

Campos:

- e-mail readonly, preenchido com `user.email`;
- senha interna;
- confirmar senha.

Acoes:

- `Concluir configuracao`;
- `Sair`.

## Validacoes

Frontend replica o contrato minimo do backend:

- senha obrigatoria;
- minimo de 6 caracteres;
- confirmacao obrigatoria;
- confirmacao igual a senha.

Nao foram adicionadas regras mais restritivas.

## Service

Service dedicado:

```text
POST /auth/setup/complete
```

Payload:

```json
{
  "senha": "...",
  "confirma_senha": "..."
}
```

O e-mail nao e enviado.

O service usa:

- `buildApiUrl`;
- `Content-Type: application/json`;
- `Authorization: Bearer <token>`;
- normalizacao de erro com `status` e `data`.

## Hook

`useCompleteFirstAccess` controla:

- `loading`;
- `error`;
- submit unico;
- abort no unmount;
- chamada ao service;
- `refreshSession()` apos sucesso;
- validacao de `setup_completed === true` antes de liberar entrada no app.

Se `refreshSession()` falhar ou nao retornar setup concluido, o hook nao simula sucesso.

## Logout

O botao `Sair` usa `signOut()` do `AuthProvider`.

Nao chama endpoint de setup, nao recarrega a pagina manualmente e preserva o fluxo de logout existente.

## Multi-abas e auth renewal

Nao foi criado mecanismo paralelo de sincronizacao.

O fluxo preserva:

- renovacao automatica atual;
- storage token atual;
- sincronizacao atual por storage/focus/visibility.

Quando outra aba concluir o setup, o refresh de sessao existente deve atualizar `user.setup_completed`.

## Backend

Backend produtivo preservado.

Foi reutilizado o endpoint existente:

```text
POST /auth/setup/complete
```

Nao houve:

- endpoint novo;
- migration;
- alteracao de banco;
- alteracao de provisionamento;
- alteracao do signup publico;
- alteracao de login, logout ou renew.

## Testes

Foram criados testes estruturais/contratuais em:

- `frontend-react/tests/firstAccess.test.js`.

Cobertura principal:

- rota `/app/primeiro-acesso`;
- validacao de senha;
- payload sem e-mail;
- endpoint/metodo/header/payload do service;
- normalizacao de erro;
- guard antes do shell;
- pagina com campos corretos;
- ausencia de `window.location.reload`, `window.confirm` e `alert`;
- hook com bloqueio de duplicidade e `refreshSession()`.

## Runtime

Validacao runtime local executada com conta descartavel cujo administrador inicial estava com `setup_completed=False`.

Conta usada:

- e-mail: `primeiro.acesso.react.1784653906@local.brana.test`;
- `clinica_id`: `16`;
- `user_id`: `39`;
- senha de login: conta descartavel local, nao registrada neste documento.

Resultado via backend local:

| Passo | Resultado |
|---|---|
| `POST /login` | 200, token gerado |
| `GET /me` antes | 200, `setup_completed=false` |
| rota operacional antes do setup | 403, `setup_required` |
| setup com confirmacao divergente | 400, `Confirmacao de senha invalida.` |
| setup valido | 200, `Configuracao inicial concluida com sucesso.` |
| `GET /me` depois | 200, `setup_completed=true` |
| logout | 200 |
| login posterior | 200, token gerado |
| `/me` final | 200, `setup_completed=true` |

Checklist:

1. login React;
2. `/me` com `setup_completed=false`;
3. redirecionamento para `/app/primeiro-acesso`;
4. shell ausente;
5. e-mail readonly;
6. senhas divergentes sem request;
7. senha valida com um unico `POST /api/auth/setup/complete`;
8. `refreshSession()`;
9. `/me` com `setup_completed=true`;
10. entrada em `/app`;
11. logout/login posterior sem reabrir setup.

Observacao: a validacao visual/interativa em navegador com captura de Network/Console nao foi concluida nesta rodada porque o pacote Playwright nao estava disponivel no ambiente local e o `node_repl` travou ao tentar carrega-lo. A validacao funcional HTTP e os testes estruturais do React cobriram o contrato principal; uma validacao visual manual ainda deve ser repetida se o criterio operacional exigir evidencia de tela.

## Relacao com Nova conta

Esta etapa remove a lacuna critica do primeiro acesso no React.

`ADM -> Clinicas -> Nova conta` permanece pendente ate implementacao propria.

## Correcao incremental da orientacao de senha interna

Em 2026-07-21, a pagina React de primeiro acesso recebeu ajuste textual/visual para alinhar a orientacao ao painel legado `frontend/index.html#panel-setup`.

O React agora explicita:

- a senha criada no primeiro acesso e uma senha interna/de seguranca interna;
- esta senha nao e a senha de login;
- a senha de login continua sendo a senha usada para acessar a conta;
- a senha interna protege acoes importantes e pode ser solicitada em operacoes sensiveis;
- ela pode ser alterada posteriormente nas configuracoes;
- esta etapa ocorre apenas no primeiro acesso.

Contratos preservados:

- rota `/app/primeiro-acesso`;
- endpoint `POST /auth/setup/complete`;
- payload `{ senha, confirma_senha }`;
- e-mail readonly fora do payload;
- `refreshSession`;
- `signOut`;
- guard antes do shell;
- ausencia do shell na pagina de primeiro acesso.

Detalhamento: `docs/correcao_orientacao_senha_interna_primeiro_acesso_react.md`.

## Git

Sem commit.

Sem push.
