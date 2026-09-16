# Contrato - ADM Usuarios - Novo usuario React

Data: 2026-07-21

Status: contrato preparado. Nao implementado.

## Objetivo

Implementar futuramente o botao `Novo usuario` em `ADM -> Usuarios`, abrindo modal para criar usuario em uma conta existente ativa.

O fluxo nao cria clinica, conta, tenant, assinatura, unidade, storage, seeds ou usuario sistemico.

## Toolbar futura

Adicionar `Novo usuario` na toolbar global de `/app/adm/usuarios` apos `Exportar CSV` e antes da busca:

1. `Atualizar`
2. `Exportar CSV`
3. `Novo usuario`
4. `Buscar usuario`

## Modal

Titulo: `Novo usuario`.

Campos, nesta ordem:

1. Conta
2. Tipo de usuario
3. Nome
4. E-mail
5. Senha de login
6. Confirmar senha de login

Botoes:

- `Cancelar`
- `Cadastrar usuario`

## Tipos elegiveis iniciais

O frontend deve exibir labels amigaveis, mas enviar somente codigo oficial contratado. O backend deve derivar valor persistido e privilegios.

| Tipo exibido | Valor frontend | Valor persistido | is_admin | Perfil inicial | Prestador | Unidade | Primeiro acesso |
|---|---|---|---:|---|---:|---:|---:|
| Administrador | `administrador` | `Dentista (CD)` ou vazio conforme decisao backend final | true | permissoes admin | nao | nao | sim |
| Funcionario administrativo | `funcionario_administrativo` | `Funcionário(a) administrativo(a)` | false | permissoes default nao-admin | nao | nao | sim |
| Gerente administrativo | `gerente_administrativo` | `Gerente administrativo` | false | permissoes default nao-admin | nao | nao | sim |
| Atendente | `atendente` | `Atendente` | false | permissoes default nao-admin | nao | nao | sim |

Observacao: para `Administrador`, o banco nao possui tipo especifico `Administrador`; o privilegio real e `is_admin=True`. A decisao final do backend deve preservar essa distincao e impedir envio arbitrario de `is_admin`.

## Tipos nao elegiveis na primeira versao

| Tipo | Motivo |
|---|---|
| Clinica | Usuario sistemico codigo 255, nao interativo |
| Dentista (CD) | Exige prestador/unidade para experiencia profissional completa |
| Auxiliar odontologico | Pode exigir contrato operacional adicional |
| Protetico | Alias sem template nativo completo no contrato global |
| Perito | Alias sem template nativo completo no contrato global |
| CRC | Alias sem template nativo completo no contrato global |
| THD | Alias sem template nativo completo no contrato global |
| Secretaria | Nao confirmado como valor oficial persistido |

## Conta

Endpoint de opcoes:

```text
GET /superadmin/clinicas?ativo=true&limit=1000
```

Label recomendado:

```text
Nome da conta - e-mail principal - ID
```

Valor enviado:

```text
clinica_id
```

Regras:

- listar somente contas com `ativo=true`;
- nao listar `assinatura_status=suspensa`;
- desambiguar nomes repetidos por e-mail e ID;
- backend deve revalidar `clinica.ativo=True`;
- conta suspensa deve retornar erro e nunca ser reativada.

## Endpoint futuro

Recomendacao: evoluir `POST /superadmin/usuarios` com schema novo e fechado, mantendo compatibilidade apenas se isso nao quebrar o legado.

Classificacao do endpoint atual: **B - reutilizavel apenas com alteracao minima contratual**.

Mudancas obrigatorias:

- aceitar `tipo_usuario`;
- aceitar `confirma_senha`;
- proibir `ativar_clinica`;
- proibir `is_admin` no payload;
- derivar `is_admin` a partir do tipo;
- validar conta existente e ativa;
- criar com `setup_completed=False`;
- criar com `ativo=True`;
- criar com `is_system_user=False`;
- definir `permissoes_json` pelo backend;
- rejeitar campos extras;
- retornar response segura.

## Payload final

```json
{
  "clinica_id": 17,
  "tipo_usuario": "funcionario_administrativo",
  "nome": "Nome",
  "email": "email@exemplo.com",
  "senha": "senha",
  "confirma_senha": "senha"
}
```

| Campo | Tipo | Obrigatorio | Normalizacao |
|---|---|---:|---|
| `clinica_id` | integer | sim | inteiro positivo |
| `tipo_usuario` | string enum | sim | codigo oficial |
| `nome` | string | sim | trim, collapse spaces |
| `email` | string email | sim | lowercase/trim |
| `senha` | string | sim | minimo 6 |
| `confirma_senha` | string | sim | deve bater com `senha` |

Campos proibidos: `ativar_clinica`, `is_admin`, `is_system_user`, `setup_completed`, `senha_interna`, `senha_interna_hash`, `is_master`, `is_owner`, `perfil`, `permissoes_json`, `prestador_id`, `unidade_atendimento_id`, `plano`, `assinatura`, `clinica`.

Schema backend deve usar `extra="forbid"`.

## Response final

Status esperado: `201 Created`.

```json
{
  "id": 123,
  "clinica_id": 17,
  "nome": "Nome",
  "email": "email@exemplo.com",
  "tipo_usuario": "Funcionário(a) administrativo(a)",
  "is_admin": false,
  "ativo": true,
  "setup_completed": false
}
```

Nao retornar senha, hash, senha interna, token, codigo, permissoes completas ou dados sensiveis desnecessarios.

## Erros esperados

- `400`: senha fraca, confirmacao divergente, tipo proibido semanticamente.
- `401`: sem autenticacao.
- `403`: operador sem permissao para criar.
- `404`: conta inexistente.
- `409`: conta suspensa/inativa ou e-mail ja cadastrado.
- `422`: schema invalido/campo extra/tipo fora de enum.
- `500`: falha inesperada.

## Autorizacao

Regra recomendada para primeira implementacao:

- Owner pode criar usuario comum e administrador em qualquer conta ativa.
- MASTER nao-Owner e Super Admin de clinica podem criar apenas usuario comum, se o produto aceitar essa permissao.
- Criar administrador fora de Owner deve ficar bloqueado ate contrato explicito.
- Admin local nao acessa o ADM global.

## Primeiro acesso

Todo usuario criado por esse fluxo deve nascer com:

```text
setup_completed = false
```

No primeiro login:

1. usa e-mail e senha de login;
2. React redireciona para `/app/primeiro-acesso`;
3. usuario define senha interna;
4. backend grava `senha_interna_hash`;
5. backend marca `setup_completed=True`;
6. usuario entra no sistema.

Antes de liberar para usuarios comuns, ajustar texto de `FirstAccessPage.jsx`, pois hoje menciona `administrador da clínica`.

## Arquitetura React futura

Arquivos sugeridos:

- `frontend-react/src/features/admin/users/components/CreateUserModal.jsx`
- `frontend-react/src/features/admin/users/components/UserTypeSelect.jsx`
- `frontend-react/src/features/admin/users/components/ActiveClinicSelect.jsx`
- `frontend-react/src/features/admin/users/hooks/useCreateAdminUser.js`
- `frontend-react/src/features/admin/users/hooks/useActiveClinicsOptions.js`
- `frontend-react/src/features/admin/users/services/adminUsersApi.js`
- `frontend-react/src/features/admin/users/validators/createAdminUserValidator.js`

Comportamento:

- abrir pelo botao `Novo usuario`;
- nao depender da linha selecionada;
- carregar contas ativas;
- carregar tipos contratados;
- validar localmente antes do request;
- submit unico com loading;
- fechar no sucesso;
- recarregar tabela;
- selecionar usuario criado;
- preservar busca, filtros locais e ordenacao;
- limpar senhas ao fechar;
- nao persistir senha em storage/log.

## Testes futuros

- toolbar exibe `Novo usuario` na ordem correta;
- modal abre sem selecao de linha;
- combo de conta usa apenas contas ativas;
- conta suspensa nao aparece;
- payload nao envia `is_admin`, `setup_completed`, `ativar_clinica` nem senha interna;
- senha divergente bloqueia request;
- submit duplo gera uma requisicao;
- sucesso fecha modal, refaz listagem e seleciona usuario;
- erro 409 de conta suspensa e exibido;
- erro 409 de e-mail duplicado e exibido;
- usuario criado nasce com `setup_completed=False`;
- usuario comum pendente entra em `/app/primeiro-acesso`;
- texto de primeiro acesso generalizado;
- sem `window.alert`, `confirm`, `prompt` ou logs de senha.

## Ordem de implementacao

1. Ajustar texto do primeiro acesso para linguagem geral.
2. Alterar backend/schemas de `POST /superadmin/usuarios` ou criar rota versionada equivalente.
3. Adicionar testes backend do contrato novo.
4. Criar service/hook React para contas ativas e criacao.
5. Criar modal React.
6. Ligar botao `Novo usuario` na toolbar.
7. Criar testes frontend estruturais e funcionais.
8. Validar runtime com conta ativa descartavel.
9. Validar que conta suspensa nao aparece e e rejeitada por payload manual.

## Ausencia de implementacao nesta rodada

Nao criado:

- botao;
- modal;
- formulario;
- hook funcional;
- service novo;
- endpoint;
- schema;
- migration;
- teste funcional;
- usuario;
- dado fake;
- conta;
- perfil.

Sem commit. Sem push.
