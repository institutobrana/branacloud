# Auditoria fina documental — permissions.py por módulo

## Resumo executivo

`backend/security/permissions.py` é a base central do modelo de permissões do Brana Cloud. O arquivo define três níveis práticos de acesso por módulo, uma lista fixa de módulos suportados, perfis de acesso padrão e utilitários para serializar, normalizar e combinar permissões no formato usado pelo backend e pelo frontend administrativo de usuários.

O comportamento real confirma que a autorização por módulo não é apenas um detalhe interno: ela afeta `require_module_access()`, o painel de usuários, o esquema de permissões exposto ao frontend, a decisão de acesso em menus, e o desbloqueio protegido via senha/grant.

O ponto mais sensível é a coexistência de:

- níveis internos por módulo;
- perfis de acesso padrão por tipo de usuário;
- modo fácil com `easy_modules` e `easy_funcoes`;
- regras especiais para `usuarios` quando o módulo `configuracao` já foi desbloqueado.

Isso faz de `permissions.py` um contrato transversal e de alto risco para modularização precoce.

## Escopo e branch

- Branch: `modularizacao-segura-fase-1`
- Etapa: exclusivamente documental e de leitura
- Sem alteração de código, comportamento, payload, backend, banco, schema, migrations ou endpoints

## Arquivos analisados

- `backend/security/permissions.py`
- `backend/security/dependencies.py`
- `backend/security/user_context.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/*` que usam `require_module_access()`
- `frontend/app.js`
- Documentos de auditoria anteriores desta trilha

## Estrutura geral de `permissions.py`

O arquivo organiza a autorização em cinco blocos conceituais:

1. Constantes de níveis e listas centrais.
2. Esquema de módulos e perfis de acesso.
3. Leitura do esquema fácil via CSV legado.
4. Normalização, serialização e fusão de permissões.
5. Regras de consulta de acesso por usuário e por módulo.

### Estruturas principais

- `PERMISSION_LEVELS = ("desabilitado", "protegido", "habilitado")`
- `MODULE_PERMISSION_SCHEMA`
- `ACCESS_PROFILE_SCHEMA`
- `MODULE_FUNCTION_HINTS`
- `_load_easy_permission_schema()`
- `default_permissions()`
- `sanitize_permissions()`
- `get_module_access_level()`
- `user_can_access_module()`
- `get_access_profile_templates()`
- `get_module_function_hints()`

## Níveis de permissão identificados e significado prático

| Nível | Significado prático | Efeito real |
|---|---|---|
| `desabilitado` | acesso negado | módulo bloqueado sem tentativa de desbloqueio |
| `protegido` | acesso condicionado | depende de senha/grant protegido para liberar a ação |
| `habilitado` | acesso livre | módulo liberado sem barreira protegida |

### Observações importantes

- `admin` não é um nível de permissão; é um perfil/estado de usuário que, no código, equivale a acesso total.
- `superadmin` também não aparece como nível em `permissions.py`; ele é tratado fora deste arquivo, mas impacta a visibilidade e o fluxo geral de acesso.

## Perfis de acesso identificados

| Perfil | Tipo de usuário | Admin? | Regra prática |
|---|---|---:|---|
| `admin` | vazio / especial | sim | habilita todos os módulos |
| `clinica` | `Clínica` | não | acesso amplo com módulos sensíveis em `protegido` |
| `dentista` | `Cirurgião dentista` | não | agenda, materiais, procedimentos e anamnese com maior abertura; usuários e configuração bloqueados |
| `auxiliar` | `Auxiliar odontológico(a)` | não | perfil mais restrito |
| `func_admin` | `Funcionário(a) administrativo(a)` | não | privilegia configuração/financeiro/relatórios com bloqueios parciais |
| `gerente_admin` | `Gerente administrativo` | não | perfil administrativo intermediário |
| `atendente` | `Atendente` | não | perfil básico |

## Módulos/chaves de permissão identificados

O esquema central do arquivo define 9 módulos:

- `usuarios`
- `prestadores`
- `agenda`
- `financeiro`
- `materiais`
- `procedimentos`
- `anamnese`
- `relatorios`
- `configuracao`

Essas chaves são as que aparecem em `MODULE_PERMISSION_SCHEMA` e são também as chaves aceitas por `default_permissions()`, `sanitize_permissions()` e `get_module_access_level()`.

## Tabela por módulo/chave

| Chave/módulo | Domínio | Níveis | Grant protegido? | Uso backend | Impacto frontend | Risco | Observação |
|---|---|---|---|---|---|---|---|
| `usuarios` | administração de usuários/perfis/permissões | `desabilitado`, `protegido`, `habilitado` | sim, com exceção especial quando o grant veio de `configuracao` | `backend/routes/user_admin_routes.py` | painel de usuários, permissões e menu ligado ao admin | crítico | é o módulo mais sensível; pode ser desbloqueado por grant de `configuracao` quando direcionado a `usuarios` |
| `prestadores` | prestadores/credenciamento/comissão | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/prestadores_routes.py` | telas de prestadores, credenciamento e comissão | alto | afeta cadastro assistencial e financeiro indireto |
| `agenda` | agenda/contatos/retornos | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/agenda_routes.py` e correlatos | agenda principal, contatos e quadro de agenda | alto | domínio operacional com efeito imediato na rotina |
| `financeiro` | lançamentos, contas, índices e caixa | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/financeiro_routes.py`, `backend/routes/indices_financeiros_routes.py` | telas financeiras e de índices | crítico | alta sensibilidade por impacto monetário e de reajustes |
| `materiais` | estoque, materiais e movimentação | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/materiais_routes.py` | cadastro e movimentação de materiais | alto | mistura estoque, custo e uso clínico |
| `procedimentos` | procedimentos, tratamentos, orçamento, prótese | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/procedimentos_routes.py`, `backend/routes/tratamentos_routes.py`, `backend/routes/proteticos_routes.py`, `backend/routes/cadastros_routes.py` | editor de procedimentos, tabela, orçamento e vínculos | crítico | é um dos módulos com maior acoplamento funcional |
| `anamnese` | anamnese, medicamentos, restrições | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/anamnese_routes.py`, `backend/routes/medicamentos_routes.py` | anamnese e partes clínicas relacionadas | alto | domínio clínico sensível, com dados de saúde |
| `relatorios` | relatórios, exportações, pesquisas | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/relatorios_routes.py` | tela de relatórios e impressões associadas | médio/alto | risco cresce quando exporta dados sensíveis ou financeiros |
| `configuracao` | preferências, editor, convênios, unidades, opções e anexos administrativos | `desabilitado`, `protegido`, `habilitado` | sim | `backend/routes/editor_textos_routes.py`, `backend/routes/preferences_routes.py`, `backend/routes/system_options_routes.py`, `backend/routes/convenios_planos_routes.py`, `backend/routes/unidades_atendimento_routes.py`, `backend/routes/cadastros_routes.py` | menu de configuração e editor de textos | crítico | é a chave mais ampla; concentra editor, parametrização e parte da administração |

## Como as permissões são organizadas

### 1. Nível base

`PERMISSION_LEVELS` limita a autorização a `desabilitado`, `protegido` e `habilitado`.

### 2. Permissão por módulo

`default_permissions(tipo_usuario, is_admin)` define o mapa inicial por perfil.

### 3. Esquema fácil

O modo fácil lê:

- `sis_modulo_sql.csv`
- `sis_funcao_sql.csv`

E monta:

- `easy_modules`
- `easy_funcoes`
- `functions_by_module`
- `module_map`

### 4. Normalização

`sanitize_permissions()` e `sanitize_easy_permissions()` descartam chaves fora do esquema e forçam os níveis válidos.

### 5. Consumo

`get_module_access_level()` e `user_can_access_module()` são as funções de leitura real do acesso no backend.

## Uso backend identificado

### `backend/security/dependencies.py`

- `require_module_access(module_code)` consulta `get_module_access_level()`
- `desabilitado` gera `403`
- `protegido` permite senha admin ou grant protegido
- o grant protegido valida usuário, clínica e módulo
- existe exceção especial para `usuarios` quando o grant vem de `configuracao`

### `backend/routes/user_admin_routes.py`

- o router já nasce com `Depends(require_module_access("usuarios"))`
- também usa `Depends(require_admin_password_if_user_control_enabled("usuarios"))`
- expõe o esquema de permissões para o frontend
- lê e grava `permissoes_json`
- suporta modo fácil com `easy_modules` e `easy_funcoes`

### `backend/security/user_context.py`

- usa `parse_permissions_json()` e `sanitize_permissions()` para compor o contexto do usuário

### Outros usos por módulo

- `agenda`, `financeiro`, `materiais`, `procedimentos`, `anamnese`, `relatorios` e `configuracao` aparecem em rotas protegidas por módulo em `backend/routes/*`

## Impacto frontend identificado

### Administração de usuários

O frontend usa o esquema de permissões para montar o painel de permissões de usuários:

- `usersCarregarPermissoesSchema()`
- `usersAbrirPermissoes()`
- `usersPermBuildPayload()`
- `usersPermAutoSave()`
- `usersSalvarPermissoes()`

### Menu e navegação

O menu aplica o nível via:

- `menuActionAccessLevel()`
- `menuApplyPermissions()`
- `menuEnsurePermission()`

Essas funções leem `sessaoAtual.permissoes` e aplicam:

- bloqueio para `desabilitado`
- prompt de grant protegido para `protegido`
- acesso livre para `habilitado`

### Sessão

`sessaoAtual.is_admin` e `sessaoAtual.is_superadmin` funcionam como atalhos de acesso total no frontend.

## Acoplamentos com auth, sessão e grant protegido

- `permissions.py` depende do perfil do usuário e do conteúdo de `permissoes_json`
- `require_module_access()` usa `X-Protected-Password` e `X-Protected-Grant`
- o grant protegido é aceito por módulo e também pela exceção `configuracao -> usuarios`
- o frontend de menu reage diretamente ao nível retornado na sessão

## Módulos mais sensíveis

1. `usuarios`
2. `configuracao`
3. `financeiro`
4. `procedimentos`
5. `anamnese`
6. `materiais`
7. `agenda`

## Pontos mais frágeis

- coexistência de `modules`, `easy_modules` e `easy_funcoes`
- dependência do CSV legado para construir o esquema fácil
- compatibilidade com textos legados/mojibake nos nomes e aliases
- regra especial de grant para `usuarios`
- diferença entre nível de módulo e perfil de usuário
- inferência de permissões a partir de `tipo_usuario` e `is_admin`

## Riscos críticos

- liberar `usuarios` sem respeitar a exceção especial do grant
- quebrar o contrato `desabilitado/protegido/habilitado`
- desalinhar o modo fácil do modo interno
- alterar a leitura de `permissoes_json` e afetar todos os módulos
- remover a proteção de `configuracao` por engano e expor editor/configuração

## O que não deve ser modularizado ainda

- `permissions.py` como núcleo de autorização
- `require_module_access()` e dependências de segurança relacionadas
- painel de permissões de usuários
- modo fácil (`easy_modules` / `easy_funcoes`)
- grant protegido e sua exceção especial para `usuarios`
- regras de sessão que projetam permissões no frontend

## Lacunas restantes

- auditoria fina dos perfis de acesso por usuário real
- auditoria fina da diferença entre `modules` e `easy_modules` no banco
- auditoria fina da exceção `configuracao -> usuarios`
- auditoria fina do efeito dessas permissões nos menus fora do admin de usuários

## Próxima auditoria fina recomendada

- `backend/routes/user_admin_routes.py`, com foco no contrato de leitura e gravação de permissões por usuário, incluindo o modo fácil e a exceção de grant protegido para `usuarios`.
