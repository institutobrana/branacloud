# Auditoria fina documental — user_admin_routes.py e o contrato de permissões por usuário

## Resumo executivo

`backend/routes/user_admin_routes.py` é o ponto de entrada real para leitura e gravação de permissões por usuário. Ele não apenas expõe o esquema para o frontend, mas também traduz entre o formato interno de permissões e o modo fácil baseado em módulos/funções.

O contrato é rígido porque o mesmo endpoint precisa atender:

- leitura do esquema de permissões;
- leitura do estado atual de permissões de um usuário;
- gravação em modo completo;
- gravação em modo fácil;
- preservação de `permissoes_json` como estrutura canônica;
- proteção adicional para contas e contextos sensíveis.

Qualquer alteração pequena nesse fluxo pode quebrar o painel administrativo de usuários, a visibilidade do frontend e a compatibilidade com o legado de permissões.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `backend/routes/user_admin_routes.py`
- `backend/security/permissions.py`
- `backend/security/dependencies.py`
- `frontend/app.js`
- Documentos de auditoria anteriores desta trilha

## Endpoints de `user_admin_routes.py` ligados a permissões

| Endpoint/fluxo | Entrada aparente | Saída aparente | Regra crítica | Dependência | Risco | Observação |
|---|---|---|---|---|---|---|
| `GET /admin/users/permissions/schema` | sem payload | `modules`, `levels`, `profiles`, `functions_by_module`, e opcionalmente `easy_modules_schema`, `easy_levels`, `easy_functions_by_module` | só admin acessa | `get_current_user`, `_require_admin` | alto | é o contrato base para montar a UI de permissões |
| `GET /admin/users/{user_id}/permissions` | `user_id` na rota | `permissoes`, `easy_modules`, `easy_funcoes`, `profiles`, `functions_by_module`, etc. | valida mesma clínica e impede conta de sistema | `_load_user_from_same_clinic`, `_assert_not_system_user`, `_require_admin` | crítico | serve de leitura do painel de permissões |
| `PATCH /admin/users/{user_id}/permissions` | payload de permissões | `detail`, `user_id`, `permissoes` | reconhece modo fácil e modo completo | `_load_user_from_same_clinic`, `_assert_not_system_user`, `_require_admin` | crítico | principal ponto de gravação do contrato |

## Fluxo de leitura de permissões por usuário

### Sequência observada

1. O frontend chama `GET /admin/users/permissions/schema` para obter o esquema.
2. Depois chama `GET /admin/users/{user_id}/permissions`.
3. O backend carrega o usuário da mesma clínica.
4. O backend impede acesso a conta de sistema.
5. O backend lê `permissoes_json`.
6. O backend sanitiza o mapa interno com `sanitize_permissions()`.
7. O backend extrai `easy_modules` e `easy_funcoes` quando existirem.
8. O frontend escolhe entre o modo fácil e o modo completo com base no payload retornado.

### Contratos rígidos

- O retorno precisa conter `permissoes` no formato interno.
- Se houver modo fácil, o retorno também precisa carregar `easy_modules` e `easy_funcoes`.
- O esquema com `modules`, `levels`, `profiles` e `functions_by_module` precisa continuar estável para não quebrar a UI.

## Fluxo de gravação e salvamento de permissões por usuário

### Sequência observada

1. O frontend monta o payload com `usersPermBuildPayload()`.
2. Em modo completo, envia `permissoes`.
3. Em modo fácil, envia `easy_modules`, `easy_funcoes` e `easy_mode:true`.
4. O backend valida o usuário alvo da mesma clínica.
5. O backend impede alterar conta de sistema.
6. O backend decide entre:
   - `sanitize_easy_permissions()` + `compute_internal_permissions_from_easy()`
   - ou `sanitize_permissions()` direto
7. O backend reconcilia tudo em `merge_permissions_payload()`.
8. O JSON final é gravado em `permissoes_json`.

### Contratos rígidos

- O backend precisa aceitar tanto `permissoes` quanto `easy_modules/easy_funcoes`.
- O `permissoes_json` precisa continuar sendo o repositório canônico.
- O frontend espera resposta com `detail`, `user_id` e `permissoes`.

## Papel de `modules`, `easy_modules`, `easy_funcoes` e `permissoes_json`

| Elemento | Papel prático | Risco se mudar |
|---|---|---|
| `modules` | mapa interno principal de permissões por módulo | quebra do acesso no frontend e nas dependências de segurança |
| `easy_modules` | modo amigável baseado em módulos legados | quebra de compatibilidade com a UI fácil e legado CSV |
| `easy_funcoes` | detalhamento por função no modo fácil | quebra do granular de permissões e do painel de usuário |
| `permissoes_json` | armazenamento canônico no banco | perda total do contrato entre backend, frontend e migração de legado |

## Regra especial de grant protegido para `usuarios/configuracao`

- O grant protegido para módulo sensível é tratado em `security/dependencies.py`.
- O papel de `user_admin_routes.py` é respeitar essa camada e operar com o usuário já autorizado.
- O fluxo de permissões do usuário não reimplementa essa regra, mas depende do ecossistema de autorização que a suporta.
- O frontend também trata `usuarios` como área sensível e pode herdar o grant quando a origem é `configuracao`.

## Papel do perfil admin/acesso total

- `admin` recebe permissões habilitadas em todos os módulos pelo `permissions.py`.
- Em `user_admin_routes.py`, `is_admin=True` influencia a base de permissões ao criar ou atualizar o usuário.
- Na leitura e gravação, o usuário admin continua passando pelos mesmos contratos, mas com base permissiva total.
- Não é um nível de módulo; é um estado/perfil do usuário.

## Validações e decisões críticas

- somente usuários da mesma clínica podem ser lidos ou alterados;
- conta de sistema não pode ser manipulada;
- o código reservado para conta base `Clínica` é bloqueado;
- o payload de permissões precisa ser saneado;
- o modo fácil só é aceito quando o payload o declara ou quando o retorno anterior já contém `easy_modules`;
- o modo completo reconcilia diretamente `permissoes` com o esquema interno;
- a resposta do esquema pode incluir fallback de `easy_modules_schema` se o CSV legado estiver disponível.

## Pontos mais frágeis

- alternância entre modo fácil e modo completo;
- preservação de `permissoes_json` quando o payload vem incompleto;
- regra de conta de sistema;
- dependência do esquema legado para o modo fácil;
- interpretação do retorno pelo frontend;
- compatibilidade entre nomes de chaves e o contrato antigo.

## Riscos críticos

- quebrar o painel de permissões do frontend;
- gravar permissões em formato incorreto e perder acesso por módulo;
- misturar permissões de usuários de clínicas diferentes;
- perder compatibilidade com o modo fácil do legado;
- destruir o mapeamento entre `easy_modules` e `modules`;
- desalinhar a resposta do endpoint com o que o frontend espera;
- alterar `permissoes_json` e afetar leitura de sessão, menu e controle de acesso.

## O que não deve ser modularizado ainda

- o contrato de leitura/gravação de permissões por usuário;
- o formato canônico `permissoes_json`;
- a reconciliação entre modo fácil e modo completo;
- a proteção de conta de sistema;
- a regra de mesma clínica;
- a integração do painel de permissões com o frontend administrativo.

## Lacunas restantes

- auditoria fina do comportamento quando o CSV legado não existe;
- auditoria fina da UI do painel de permissões em modo fácil;
- auditoria fina das diferenças entre perfis padrão e permissões editadas;
- auditoria fina da persistência de permissões em usuários especiais.

## Próxima auditoria fina recomendada

- Auditoria fina do fluxo de criação/edição de usuários em `user_admin_routes.py`, para separar o contrato de permissões do contrato geral de cadastro, senha, vínculo e perfil.
