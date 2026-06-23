# Frontend React - Validação Runtime do Login

## Objetivo da etapa

Validar em runtime a base de login do `frontend-react\` com o backend atual, sem alterar backend, frontend legado, banco ou migrations.

## Ambiente testado

- `frontend-react` em modo dev com Vite
- backend atual em `http://127.0.0.1:8000`
- rota visual `http://127.0.0.1:5173/login`

## Comandos executados

- `npm.cmd run build`
- `npm.cmd run dev -- --host 127.0.0.1 --port 5173`
- `Invoke-WebRequest http://127.0.0.1:5173/login`
- `Invoke-WebRequest POST http://127.0.0.1:8000/login` com credenciais inválidas apenas para validar o formato
- `Invoke-WebRequest http://127.0.0.1:8000/me`
- `Invoke-WebRequest POST http://127.0.0.1:8000/logout`

## Resultado do build

O build concluiu com sucesso.

## Resultado do teste de login

Resultado parcial e controlado:

- a página `/login` respondeu corretamente no dev server
- o `POST /login` respondeu usando `application/x-www-form-urlencoded`
- sem credencial válida disponível neste ambiente, não foi possível concluir o login real

## POST /login

O endpoint aceitou o formato esperado pelo contrato:

- `username`
- `password`
- `Content-Type: application/x-www-form-urlencoded`

## GET /me

- `GET /me` respondeu com `401` sem token válido
- a validação da sessão real depende de um login bem-sucedido com credencial válida

## Logout

- `POST /logout` respondeu com `401` sem token válido
- o logout real depende de uma sessão autenticada válida

## brana_token

Não foi possível validar o salvamento/limpeza real de `brana_token` porque não houve login autenticado bem-sucedido nesta sessão.

## Problemas encontrados

- não havia credencial válida disponível para concluir o login real
- a validação runtime completa ficou parcialmente bloqueada por falta de usuário/senha de teste

## Correções feitas

- `authApi.js` foi ajustado para apontar diretamente ao backend local em `http://127.0.0.1:8000`
- o dev server voltou a servir `/login` corretamente como rota visual

## O que não foi implementado

- permissões
- proteção real de rotas
- tela de cadastro
- recuperação de senha
- Google login
- odontograma
- pacientes
- menu real do sistema

## Confirmações

- O frontend legado não foi alterado.
- O backend não foi alterado.
- O banco de dados não foi alterado.

## Riscos remanescentes

- validação runtime completa ainda depende de credenciais reais
- permissões ainda não foram portadas
- o roteamento temporário por `window.location.pathname` continua provisório

## Próximos passos recomendados

1. Executar a validação runtime completa com usuário e senha reais já existentes.
2. Se o login real funcionar, avançar para proteção simples de rotas.
3. Se o login real não funcionar, corrigir apenas o frontend-react em etapa específica.
