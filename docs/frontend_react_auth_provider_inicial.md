# Frontend React - AuthProvider Inicial

## Objetivo da etapa

Criar a base inicial real de autenticação do `frontend-react\` com `AuthProvider`, `authApi.js`, `authStorage.js` e `useAuth.js`, seguindo o contrato documentado e sem alterar o backend.

## Arquivos criados/alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/auth/AuthProvider.jsx`
- `frontend-react/src/features/auth/authApi.js`
- `frontend-react/src/features/auth/authStorage.js`
- `frontend-react/src/features/auth/useAuth.js`
- `frontend-react/src/features/auth/LoginPage.jsx`
- `frontend-react/src/features/auth/login.css`
- `docs/frontend_react_auth_provider_inicial.md`
- `docs/11_roadmap_desenvolvimento.md`

## Endpoints usados

- `POST /login`
- `GET /me`
- `POST /logout`

## Formato identificado do `POST /login`

O login legado espera:

- `OAuth2PasswordRequestForm`
- envio como `application/x-www-form-urlencoded`
- campos `username` e `password`

Esse formato foi confirmado tanto no frontend legado quanto no backend atual.

## Como o token é salvo

O token continua sendo salvo com a mesma chave do legado:

- `brana_token`

O armazenamento é feito em `localStorage` por meio de `authStorage.js`.

## Como `GET /me` é chamado

O `AuthProvider`:

- lê `brana_token`
- chama `GET /me` no boot
- salva o usuário retornado em estado local
- remove o token se a sessão falhar

## Como logout é tratado

O `AuthProvider` expõe `signOut()` e:

- chama `POST /logout` quando possível
- limpa `brana_token`
- limpa a sessão local do provider

## O que ainda não foi implementado

- permissões no React
- Auth guard completo por rota
- integração com `react-router-dom`
- telas reais pós-login
- persistência além do token legado

## Confirmações

- O frontend legado não foi alterado.
- O backend não foi alterado.
- O banco de dados não foi alterado.

## Riscos remanescentes

- divergência futura entre o fluxo legado e o React se o contrato mudar
- tratamento de erro de sessão expirada precisa ser validado com usuário real
- redirecionamento temporário por `window.location.pathname` ainda é provisório
- permissões ainda não foram portadas para o React

## Próximos passos recomendados

1. Validar runtime do login React com usuário real em ambiente local.
2. Confirmar o comportamento de `/me` e `/logout`.
3. Evoluir para proteção simples de rotas se a sessão estiver estável.
4. Depois portar permissões e contexto multi-clínica para o React.
