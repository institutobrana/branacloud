# Contrato de Autenticação do Frontend React

## Objetivo

Este contrato prepara a futura integração do `frontend-react\` com o login atual do Brana Cloud, sem alterar o backend nesta etapa e sem recriar um sistema de autenticação novo por suposição.

O objetivo principal é preservar:

- a sessão atual
- o vínculo com a clínica/tenant
- os dados do usuário autenticado
- as permissões
- o fluxo de primeiro acesso
- o comportamento de logout

## Estado atual do login legado

### Onde fica a tela/função de login atual

A tela de login atual fica em `frontend/index.html`, com os campos e botões do formulário de autenticação renderizados diretamente no HTML.

A lógica de login, cadastro, primeiro acesso, logout e boot da sessão fica em `frontend/app.js`.

### Endpoint chamado no login

O login atual chama:

- `POST /login`

O envio é feito como `application/x-www-form-urlencoded`, com os campos `username` e `password`.

### Como a sessão é armazenada

O token de acesso é salvo em `localStorage` com a chave `brana_token`.

O código também limpa `sessionStorage` no encerramento de sessão, mas o armazenamento efetivo da autenticação atual é o `localStorage`.

### Cookies, token, localStorage e sessionStorage

O fluxo atual identificado usa:

- `localStorage`: para guardar `brana_token`
- `sessionStorage`: apenas como limpeza auxiliar no logout
- cookie: não foi identificado como mecanismo principal de sessão no frontend legado analisado
- Authorization header: usado nas chamadas autenticadas como `Bearer <token>`

### Como o sistema valida a sessão ao abrir

No boot do frontend, `frontend/app.js` chama `carregarSessao()` no final da inicialização.

Esse fluxo:

- lê o token de `localStorage`
- executa `GET /me`
- atualiza `sessaoAtual`
- expõe `window.sessaoAtual`
- aplica regras de primeiro acesso, login e exibição do shell

### Como funciona o endpoint `/me`

O endpoint `GET /me` é protegido por `get_current_user`.

Ele retorna o contexto do usuário autenticado via `build_user_context`, incluindo informações de sessão, clínica, permissões e preferências.

### Como usuário, clínica e permissões são carregados

O backend monta o contexto do usuário em `backend/security/user_context.py`.

Os dados retornados incluem:

- `id`
- `codigo`
- `nome`
- `apelido`
- `tipo_usuario`
- `email`
- `clinica_id`
- `prestador_id`
- `unidade_atendimento_id`
- `is_system_user`
- `is_admin`
- `is_superadmin`
- `ativo`
- `forcar_troca_senha`
- `setup_completed`
- `permissoes`
- `preferencias_usuario_json`
- `preferencias_gerais`

### Como ocorre logout

O logout atual chama:

- `POST /logout`

No frontend, o logout:

- chama o endpoint autenticado
- apaga `brana_token` de `localStorage`
- limpa `sessionStorage`
- limpa `window.sessaoAtual`
- volta a exibir a tela de login

## Endpoints de autenticação identificados

Endpoints encontrados no código analisado:

- `POST /login`
- `GET /me`
- `POST /logout`
- `POST /signup/request-code`
- `POST /signup/confirm`
- `POST /password/forgot`
- `POST /password/reset`
- `POST /auth/setup/complete`
- `POST /auth/protected/unlock`
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `GET /auth/google/calendar/callback`

## Dados esperados pelo frontend React

O React vai precisar receber ou reconstruir, no mínimo:

- usuário autenticado
- `id`
- `codigo`
- `nome`
- `apelido`
- clínica/tenant
- `clinica_id`
- `prestador_id`
- `unidade_atendimento_id`
- permissões/perfil, se aplicável
- `is_admin`
- `is_superadmin`
- `permissoes`
- estado da sessão
- `setup_completed`
- mensagem de erro de login
- mensagem de sessão expirada

## Estratégia recomendada para o frontend React

O frontend React deve:

- criar um `AuthProvider` ou `SessionProvider`
- criar um serviço `authApi.js` ou equivalente
- validar a sessão no boot usando `GET /me`
- manter compatibilidade com o backend atual
- não alterar backend inicialmente
- não inventar novo sistema de login
- preservar a lógica de multi-clínica/tenant já existente

## Rotas futuras sugeridas no React

Estrutura recomendada para o futuro:

- `/login`
- `/app`
- `/app/inicio`
- `/app/pacientes`
- `/app/odontograma`
- `/app/tratamentos`
- `/app/agenda`
- `/app/financeiro`
- `/app/usuarios`

## Regras de segurança

- não salvar senha
- não expor token em log
- não recriar autenticação sem contrato
- não alterar backend sem etapa própria
- não quebrar login legado
- manter o frontend legado como referência até validação

## Plano de implementação futura

Etapas sugeridas:

1. Criar a tela visual de login no `frontend-react`, ainda sem API real.
2. Criar `AuthProvider` ou `SessionProvider`.
3. Criar `authApi.js` consumindo os endpoints reais encontrados.
4. Validar `GET /me` no boot do React.
5. Implementar logout.
6. Validar sessão com usuário real.
7. Comparar comportamento com o frontend legado.
8. Só depois avançar para a primeira tela piloto autenticada.

## Riscos conhecidos

- divergência entre login legado e React
- perda de tenant/clínica
- erro com cookie/CORS
- erro de sessão expirada
- permissões incompletas
- backend alterado sem necessidade
- frontend legado quebrado por alteração indevida

## Decisão final

Esta etapa é documental.

Nenhuma implementação de login foi feita.

O `frontend-react` continua isolado.

A próxima etapa recomendada será criar a tela visual de login ou iniciar o `AuthProvider`, conforme este contrato.
