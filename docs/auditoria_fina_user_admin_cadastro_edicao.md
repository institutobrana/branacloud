# Auditoria fina documental — user_admin_routes.py no cadastro, edição e vínculo de usuários

## Resumo executivo

`backend/routes/user_admin_routes.py` concentra o contrato geral de cadastro, edição, vínculo e estado de usuários. Esse contrato é distinto do contrato de permissões por usuário já auditado, mas ainda compartilha a mesma estrutura de proteção por clínica, conta de sistema e validação administrativa.

O arquivo responde por:

- listar usuários da clínica;
- gerar próximo código;
- criar usuário;
- editar usuário;
- verificação de senha;
- carregamento de perfis de acesso;
- vínculo com prestador e unidade;
- ativação/inativação;
- flags administrativas como `is_admin` e `forcar_troca_senha`.

A superfície é sensível porque o cadastro de usuário já nasce acoplado ao contexto clínico e ao modelo de acesso.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `backend/routes/user_admin_routes.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `frontend/app.js`
- Documentos de auditoria anteriores desta trilha

## Endpoints de `user_admin_routes.py` ligados a cadastro, edição e vínculo

| Endpoint/fluxo | Entrada aparente | Saída aparente | Regra crítica | Dependência | Risco | Observação |
|---|---|---|---|---|---|---|
| `GET /admin/users` | sem payload | lista de usuários da mesma clínica | admin obrigatório | `get_current_user`, `_require_admin` | alto | base da tela de administração |
| `GET /admin/users/proximo-codigo` | sem payload | `{ "codigo": ... }` | admin obrigatório e código clínico | `get_current_user`, `_require_admin` | médio | usado para sugerir novo código |
| `POST /admin/users` | cadastro do usuário | usuário criado com dados normalizados | valida nome, senha, código, vínculo e clínica | `_require_admin`, validações locais | crítico | criação já nasce com vínculos e permissões base |
| `PATCH /admin/users/{user_id}` | edição cadastral | usuário atualizado | impede conta de sistema e valida mesma clínica | `_load_user_from_same_clinic`, `_assert_not_system_user` | crítico | principal fluxo de edição cadastral |
| `POST /admin/users/{user_id}/verify-password` | senha informada | confirmação de senha | conta de sistema bloqueada | `_load_user_from_same_clinic`, `_assert_not_system_user` | médio | usado no painel de usuário, trocas e validações |
| `GET /admin/users/{user_id}/profiles` | sem payload | perfis e vínculos | mesma clínica e não-sistema | `_load_user_from_same_clinic`, `_assert_not_system_user` | alto | mistura vínculo com perfis de acesso |

## Fluxo de leitura de dados cadastrais

### Sequência observada

1. O frontend lista usuários via `GET /admin/users`.
2. O backend filtra por `clinica_id` da sessão.
3. A saída é construída por `_user_to_dict()`.
4. O retorno inclui dados cadastrais, vínculo e estado do usuário.

### Campos aparentes de saída

- `id`
- `codigo`
- `codigo_definido`
- `nome`
- `apelido`
- `tipo_usuario`
- `email`
- `is_system_user`
- `is_admin`
- `ativo`
- `online`
- `forcar_troca_senha`
- `prestador_row_id`
- `prestador_nome`
- `unidade_row_id`
- `unidade_nome`
- `clinica_id`
- `clinica_nome`
- `tipo_conta`
- `permissoes`

## Fluxo de criação de usuário

### Sequência observada

1. O frontend envia nome, senha, confirmação, tipo, e-mail e vínculos.
2. O backend valida o nome e a senha.
3. Se houver confirmação de senha, ela precisa bater.
4. O código é calculado ou validado.
5. O código da conta base `Clínica` é bloqueado.
6. O nome e o código precisam estar disponíveis na clínica.
7. O prestador e a unidade são carregados da mesma clínica.
8. O e-mail é resolvido por `_resolve_email_for_new_user()`.
9. O usuário é criado com `clinica_id`, `is_admin`, `ativo`, `forcar_troca_senha` e `is_system_user=False`.
10. O usuário recebe permissões iniciais por `sanitize_permissions()`.
11. Os vínculos são aplicados por `_apply_user_links()`.
12. O usuário é persistido e devolvido com `_user_to_dict()`.

### Campos de entrada aparentes

- `codigo`
- `nome`
- `senha`
- `confirma_senha`
- `email`
- `apelido`
- `tipo_usuario`
- `prestador_row_id`
- `unidade_row_id`
- `forcar_troca_senha`
- `is_admin`

## Fluxo de edição de usuário

### Sequência observada

1. O frontend envia nome, e-mail, apelido, tipo, vínculos, estado e flags.
2. O backend valida o nome.
3. O usuário é carregado pela mesma clínica.
4. Conta de sistema é bloqueada.
5. O nome precisa continuar único na clínica.
6. Prestador e unidade são recarregados pela mesma clínica.
7. O tipo de usuário é normalizado.
8. O e-mail é recalculado por `_resolve_email_for_existing_user()`.
9. `is_admin`, `ativo`, `online` e `forcar_troca_senha` são atualizados.
10. Os vínculos são reaplicados.
11. O usuário é persistido e devolvido atualizado.

### Campos de entrada aparentes

- `nome`
- `email`
- `apelido`
- `tipo_usuario`
- `prestador_row_id`
- `unidade_row_id`
- `ativo`
- `forcar_troca_senha`
- `is_admin`

## Fluxo de vínculo com clínica, unidade e prestador

### Sequência observada

1. Prestador e unidade são carregados por helpers dedicados.
2. A consulta sempre respeita `clinica_id`.
3. O vínculo final é aplicado por `_apply_user_links()`.
4. O usuário pode sair com `prestador_id`, `unidade_atendimento_id` e, quando aplicável, `usuario_id` do prestador.

### Regras críticas

- vínculo fora da clínica não é aceito;
- prestador e unidade não podem ser associados de forma cruzada;
- o vínculo faz parte do cadastro, não apenas de uma tela auxiliar.

## Fluxo de senha / reset / ativação

### Sequência observada

1. `POST /admin/users/{user_id}/verify-password` confirma a senha informada.
2. O arquivo também atualiza `forcar_troca_senha` na criação e na edição.
3. A inativação em edição limpa o estado `online`.

### Observação

- O reset de senha completo não aparece como fluxo separado no trecho auditado; o que existe de forma clara é a verificação e a gestão de `forcar_troca_senha`.

## Regras de mesma clínica / tenant

- todo usuário lido ou alterado precisa pertencer à mesma `clinica_id`;
- a listagem já filtra por `clinica_id`;
- o código e o nome são validados no escopo da clínica;
- prestador e unidade também são validados no mesmo tenant clínico.

## Regras de conta de sistema

- contas de sistema não podem ser editadas em massa;
- contas de sistema não podem ser usadas em permissões e perfis como um usuário comum;
- a conta base `Clínica` recebe bloqueio adicional por código reservado;
- essa regra aparece em múltiplos pontos e é parte rígida do contrato.

## Como o backend distingue cadastro, vínculo, perfil admin e permissões

| Dimensão | Como aparece | Observação |
|---|---|---|
| Cadastro | `POST /admin/users` e `PATCH /admin/users/{user_id}` | trata nome, e-mail, apelido, tipo, estado e senha |
| Vínculo | `_apply_user_links()`, `prestador_row_id`, `unidade_row_id` | conecta usuário à clínica, unidade e prestador |
| Perfil admin | `is_admin` | influencia permissões e comportamento padrão |
| Permissões | campo `permissoes_json` e rotas de permissões separadas | já foi auditado em documento próprio, mas ainda é tocado indiretamente na criação/edição |

## Pontos mais frágeis

- mistura de cadastro com permissões base no momento da criação;
- validação de nome/código por clínica;
- vínculo de prestador e unidade ao mesmo tempo;
- regra de conta de sistema espalhada em vários pontos;
- atualização de `permissoes_json` durante a edição cadastral;
- dependência de helpers privados para resolver e-mail e vínculos.

## Riscos críticos

- alterar usuário de outra clínica;
- editar conta de sistema por engano;
- quebrar a geração de código da clínica;
- perder vínculo com prestador/unidade;
- regressão em `is_admin` e `forcar_troca_senha`;
- impactar o contrato de retorno usado pelo frontend;
- confundir cadastro com permissões e deslocar a responsabilidade do arquivo.

## O que não deve ser modularizado ainda

- contrato de criação/edição de usuários;
- vínculo com clínica/unidade/prestador;
- regra de conta de sistema;
- geração e validação de código;
- resolução de e-mail;
- gestão de `forcar_troca_senha`;
- acoplamento do cadastro com permissões base.

## Lacunas restantes

- auditoria fina dos fluxos de alteração de senha fora da verificação;
- auditoria fina do painel de perfis de usuário;
- auditoria fina da interface que consome a listagem e a edição;
- auditoria fina do comportamento quando um vínculo não existe na clínica.

## Próxima auditoria fina recomendada

- Auditoria fina da interface administrativa de usuários no `frontend/app.js`, separando cadastro, vínculo, alteração de senha e inativação do restante do menu administrativo.
