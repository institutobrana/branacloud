# Auditoria EasyDental virgem - Subetapa 8V-A - auditoria do setup para usuarios criados posteriormente

## 1. Contexto

- A Subetapa 8U-C foi concluida com validacao manual da nova conta.
- A nova conta passou apos 8P, 8K, 8R e 8U, e apos a correcao do helper `_apply_user_links`.
- Depois da validacao, o usuario observou que a tela de setup tambem apareceu para um usuario criado posteriormente dentro da conta.
- Isso nao deve acontecer.
- A regra desejada e manter setup apenas para o primeiro acesso do ADM inicial da nova conta, sem abrir setup para usuarios criados depois.
- Esta etapa e somente documental e nao implementa nada.

## 2. Seguranca e limites

- Nenhum codigo foi alterado.
- Nenhum banco foi alterado.
- Nenhuma conta foi criada ou excluida.
- O setup nao foi alterado.
- O EasyDental nao foi alterado.
- A blindagem textual/mojibake foi respeitada.

## 3. Fluxo atual do setup

### Frontend

- `frontend/app.js` chama `/me` para carregar a sessao.
- Se a resposta vier com `setup_completed === false`, o frontend abre a tela de setup com `abrirTelaSetup(data)`.
- `frontend/app.js` tambem interpreta o detalhe `setup_required` retornado por 403 e direciona para o fluxo de primeiro acesso.
- `frontend/index.html` contem o painel `panel-setup` e o botao `Concluir primeiro acesso`.

### Backend

- `backend/security/dependencies.py:get_current_user()` verifica `setup_completed` do usuario logado.
- Se `setup_completed` for falso, o backend bloqueia qualquer rota fora das excecoes permitidas e retorna `403 setup_required`.
- As excecoes atuais antes do setup sao:
  - `/me`
  - `/logout`
  - `/auth/setup/complete`

### Endpoint de conclusao

- `backend/routes/auth_routes.py:/auth/setup/complete` grava a conclusao do setup.
- O endpoint exige senha e confirmacao de senha.
- O endpoint nao depende de uma flag de clinica para concluir o setup.

### Campo de estado

- `setup_completed` e um campo do usuario, nao da clinica.
- `senha_interna_hash` tambem e um campo do usuario.
- `backend/models/clinica.py` nao possui campo de setup proprio.

## 4. O que o setup grava

- `senha_interna_hash = hash_password(senha)`
- `setup_completed = True`
- `forcar_troca_senha = False`
- `online = True`

Impacto:

- O efeito e individual por usuario.
- Nao ha escrita de flag de setup na clinica.
- Nao ha escrita de setup em tabelas de procedimentos, prestadores ou unidade.

## 5. Fluxo de criacao de usuario posterior

### Rotas de criacao

- `backend/routes/user_admin_routes.py:admin_create_user()`
- `backend/routes/superadmin_routes.py` na rota de criacao de usuario da area superadmin

### Campos preenchidos na criacao posterior

- `codigo`
- `nome`
- `apelido`
- `tipo_usuario`
- `email`
- `senha_hash`
- `clinica_id`
- `is_admin`
- `ativo`
- `online = False`
- `forcar_troca_senha`
- `is_system_user = False`
- `prestador_id` e `unidade_atendimento_id` via helper de vinculo, quando aplicavel
- `permissoes_json`

### Campos ausentes na criacao posterior

- `setup_completed` nao e setado explicitamente
- `senha_interna_hash` nao e setado explicitamente

### Efeito tecnico

- O modelo `Usuario` tem `setup_completed` com default `False`.
- O campo `senha_interna_hash` e nullable e nasce vazio.
- Assim, usuarios criados depois entram com `setup_completed = False`.
- Como o backend e o frontend usam esse campo como gatilho, o usuario posterior cai no setup.

### ADM inicial

- O fluxo de `backend/services/signup_service.py:criar_conta_saas()` cria o ADM inicial com `setup_completed = False` de forma proposital.
- Esse e o unico usuario que deve nascer com setup pendente.

## 6. Diagnostico tecnico

- Causa provavel: o setup esta sendo tratado como estado de usuario, e os usuarios criados depois estao nascendo com `setup_completed = False` por default.
- Condicao exata: `setup_completed === false` no frontend e `not setup_completed` no backend via `get_current_user()`.
- Risco de mudar apenas o frontend: o backend continuaria bloqueando com `403 setup_required`.
- Risco de mudar apenas o backend: o frontend ainda poderia abrir a tela com base no `/me`, causando comportamento inconsistente.
- Risco para contas antigas: qualquer regra global mal desenhada pode alterar o primeiro acesso ja validado das contas existentes.

## 7. Comparacao EasyDental

- A referencia da trilha 8T-C confirmou que nao ha setup generico obrigatorio para todo usuario novo no legado consultado na trilha.
- Nesta etapa nao houve nova consulta complementar ao UNC.
- Limitacao: a conclusao segue apoiada na trilha documental e no contrato ja fechado, nao em uma nova escrita ou abertura de telas no EasyDental.

## 8. Contrato tecnico proposto para 8V-B

- Setup so para o ADM inicial da nova conta.
- Setup nao para usuarios criados posteriormente.
- Login SaaS permanece obrigatorio.
- Usuarios posteriores entram normalmente.
- Contas existentes sao preservadas.
- Opcoes do Sistema ficam fora do escopo.

## 9. Opcoes de implementacao avaliadas

| Opcao | Arquivos afetados | Risco | Vantagem | Recomendacao |
| --- | --- | --- | --- | --- |
| Ocultar a tela apenas no frontend | `frontend/app.js`, `frontend/index.html` | Alto, porque o backend ainda bloquearia com `setup_required` | Mudanca rapida | Nao recomendada |
| Criar uma nova regra global de setup por clinica | `backend/security/dependencies.py`, `backend/routes/auth_routes.py`, possivelmente `backend/models/clinica.py` | Medio/alto, porque pode afetar contas antigas e introduzir nova semantica global | Centraliza a decisao | So se houver contrato posterior claro |
| Inicializar usuarios criados depois com `setup_completed = True` | `backend/routes/user_admin_routes.py`, `backend/routes/superadmin_routes.py` e qualquer outra rota criadora de usuario | Baixo, se limitado a usuarios posteriores | Preserva o ADM inicial e evita setup em usuarios novos | Recomendado |

## 10. Implementacao recomendada

- A menor alteracao segura e manter o `setup_completed = False` apenas para o ADM inicial criado em `criar_conta_saas()`.
- Para usuarios criados depois, o caminho minimo e inicializar `setup_completed = True` no momento da criacao.
- Arquivos provaveis da proxima implementacao:
  - `backend/routes/user_admin_routes.py`
  - `backend/routes/superadmin_routes.py`
  - eventualmente outros pontos que criem `Usuario` fora do signup inicial
- Checks recomendados:
  - `python -m py_compile` nos arquivos alterados
  - import seguro dos modulos alterados
  - teste manual criando um usuario posterior na conta validada
- Teste manual obrigatorio:
  - o ADM inicial continua vendo setup no primeiro acesso
  - um usuario criado depois faz login SaaS normal
  - um usuario criado depois nao entra na tela de setup

## 11. Fora de escopo

- Implementacao nesta etapa.
- Opcoes do Sistema.
- Auditoria.
- Controle de usuarios/senhas.
- Alteracao de senha.
- Correcao textual da tela setup.
- Tabelas de procedimentos.
- Unidade.
- Prestadores.
- Usuario ADM.
- EasyDental.

## 12. Proxima subetapa recomendada

- `8V-B` - implementacao isolada do bloqueio de setup para usuarios criados posteriormente.
- Se houver risco adicional nao resolvido, fazer investigacao complementar antes de implementar.

## 13. Plano de verificacao

- Somente este documento novo e o roadmap foram alterados.
- Frontend nao foi alterado.
- Backend nao foi alterado.
- Banco/schema/migrations/seeds/endpoints nao foram alterados.
- Nenhuma conta foi criada ou excluida.
- O setup nao foi alterado.
- O EasyDental nao foi alterado.
