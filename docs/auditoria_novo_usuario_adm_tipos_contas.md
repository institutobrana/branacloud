# Auditoria - ADM Usuarios - Novo usuario, tipos e contas

Data: 2026-07-21

Escopo: auditoria tecnica e funcional, exclusivamente para preparar `ADM -> Usuarios -> Novo usuario`.

Nao houve implementacao funcional, alteracao de backend, frontend, banco, endpoint, toolbar, rota, menu, teste funcional, usuario ou dado persistido.

## Git inicial

- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Branch: `modularizacao-segura-fase-1`.
- Remote: `https://github.com/institutobrana/branacloud.git`.
- HEAD: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`.
- Divergencia com `origin/modularizacao-segura-fase-1`: `0 0`.
- Stage inicial: vazio.
- Status inicial: worktree suja por alteracoes preexistentes.

## Documentos lidos

- `docs/auditoria_painel_usuarios_adm_react.md`
- `docs/auditoria_toolbar_adm_usuarios_historico_atual.md`
- `docs/contrato_toolbar_adm_usuarios_react.md`
- `docs/auditoria_botao_novo_usuario_adm_clinicas.md`
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_nova_conta_adm_clinicas.md`
- `docs/implementacao_nova_conta_adm_clinicas.md`
- `docs/auditoria_primeiro_acesso_frontend_react.md`
- `docs/implementacao_primeiro_acesso_frontend_react.md`
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/11_roadmap_desenvolvimento.md`

## Arquivos de codigo auditados

- `backend/models/usuario.py`
- `backend/models/clinica.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/superadmin_routes.py`
- `backend/routes/auth_routes.py`
- `backend/security/permissions.py`
- `backend/security/system_accounts.py`
- `backend/security/superadmin.py`
- `backend/security/user_context.py`
- `backend/security/dependencies.py`
- `backend/services/signup_service.py`
- `backend/services/platform_admin_service.py`
- `backend/services/tenant_provisioning/provisioner.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend-react/src/features/firstAccess/FirstAccessPage.jsx`
- `frontend-react/src/features/firstAccess/firstAccessApi.js`
- `frontend-react/src/features/firstAccess/useCompleteFirstAccess.js`
- `frontend-react/src/features/admin/clinics/services/adminClinicsApi.js`
- `frontend-react/src/features/admin/users/services/adminUsersApi.js`

## Modelo `Usuario`

| Campo | Tipo | Origem | Uso | Obrigatorio | Editavel |
|---|---|---|---|---:|---:|
| `id` | Integer PK | `usuarios` | Identidade tecnica | sim | nao |
| `codigo` | Integer nullable | `usuarios` | Codigo legado por clinica; `255` reservado | nao | local sim, global nao |
| `nome` | String | `usuarios` | Exibicao, busca, login local por nome/codigo | sim | sim |
| `apelido` | String(60) nullable | `usuarios` | Exibicao/atalho legado | nao | sim |
| `tipo_usuario` | String(80) nullable | `usuarios` | Classificacao e base para permissoes default | nao | local sim |
| `email` | String unique | `usuarios` | Login e unicidade global | sim | sim com validacao |
| `senha_hash` | String | `usuarios` | Senha de login | sim | reset/troca/criacao |
| `senha_interna_hash` | String nullable | `usuarios` | Senha interna/protegida | nao | setup e fluxos protegidos |
| `clinica_id` | FK `clinicas.id` | `usuarios` | Tenant | sim | nao nos fluxos auditados |
| `prestador_id` | FK `prestador_odonto.id` nullable | `usuarios` | Vinculo profissional | nao | local sim |
| `unidade_atendimento_id` | FK `unidade_atendimento.id` nullable | `usuarios` | Unidade padrao | nao | local sim |
| `is_admin` | Boolean | `usuarios` | Admin local e permissao total; tambem usado por superadmin derivado | nao | sim |
| `is_system_user` | Boolean | `usuarios` | Protecao de conta base `Clinica` | nao | nao deve ser exposto |
| `setup_completed` | Boolean | `usuarios` | Primeiro acesso/senha interna | sim | setup/backend |
| `ativo` | Boolean | `usuarios` | Bloqueio de usuario | sim | sim |
| `online` | Boolean | `usuarios` | Status visual/session | sim | automatico |
| `ultimo_login_em` | DateTime nullable | `usuarios` | Ultimo acesso | nao | automatico |
| `forcar_troca_senha` | Boolean | `usuarios` | Fluxo legado/local | sim | local sim |
| `permissoes_json` | Text nullable | `usuarios` | Permissoes por modulo/funcoes | nao | local sim |

Conclusoes sobre `tipo_usuario`:

1. Existe campo real: sim, `usuarios.tipo_usuario`.
2. Armazenamento: coluna string livre `String(80)`, sem FK/enum no banco.
3. Validacao backend: normalizacao em `security/permissions.py::normalize_tipo_usuario`; nao ha schema fechado nem `extra=forbid` para tipos no endpoint atual.
4. Valores aceitos: string livre normalizada para aliases conhecidos.
5. Valores legados livres: sim; aliases incluem `Protético`, `Perito`, `CRC`, `THD` sem perfil nativo completo.
6. `tipo_usuario` nao determina sozinho autorizacao; ele influencia permissoes default.
7. `is_admin` e independente e, quando verdadeiro, concede todos os modulos.
8. Perfil funcional (`access_profile`) e conceito separado.

## Tipos reais encontrados

| Tipo encontrado | Valor persistido | Origem | Uso atual | Pode ser criado manualmente? |
|---|---|---|---|---:|
| Clinica | `Clínica` | `security/system_accounts.py`, usuario codigo 255 | Conta base sistemica, nao interativa | nao |
| Dentista | `Dentista (CD)` | `security/permissions.py`, `signup_service.py` | Admin inicial e tipo profissional padrao | sim, mas pode exigir prestador para contrato completo |
| Auxiliar odontologico | `Auxiliar odontológico(a)` | `ACCESS_PROFILE_SCHEMA` / permissao | Perfil/template de permissao | sim no local; no global precisa contrato |
| Funcionario administrativo | `Funcionário(a) administrativo(a)` | `ACCESS_PROFILE_SCHEMA` / permissao | Perfil/template de permissao | sim no local; elegivel no global |
| Gerente administrativo | `Gerente administrativo` | `ACCESS_PROFILE_SCHEMA` / permissao | Perfil/template de permissao | sim no local; elegivel no global |
| Atendente | `Atendente` | `ACCESS_PROFILE_SCHEMA` / permissao | Perfil/template de permissao | sim no local; elegivel no global |
| Protetico | `Protético` | alias em `normalize_tipo_usuario` | Valor normalizado sem template nativo completo | nao nesta primeira versao |
| Perito | `Perito` | alias em `normalize_tipo_usuario` | Valor normalizado sem template nativo completo | nao nesta primeira versao |
| CRC | `CRC` | alias em `normalize_tipo_usuario` | Valor normalizado sem template nativo completo | nao nesta primeira versao |
| THD | `THD` | alias em `normalize_tipo_usuario` | Valor normalizado sem template nativo completo | nao nesta primeira versao |

Observacao: o modulo local carrega opcoes de `Tipos de usuário` via `/cadastros/auxiliares?tipo=Tipos de usuário` e filtra `Clínica`. Como essa fonte e tenant/auxiliar e nao contrato global fechado, o modal global inicial deve usar lista backend contratada, nao hardcode frontend.

## Usuarios criados no nascimento de conta

Fonte: `backend/services/signup_service.py::provisionar_conta_saas`.

| Usuario inicial | Codigo | Tipo | is_admin | is_system_user | setup_completed | Perfil/permissao | Prestador | Unidade |
|---|---:|---|---:|---:|---:|---|---|---|
| Conta base `Clinica` | 255 | `Clínica` | false | true | true | `sanitize_permissions` para tipo Clinica | prestador sistemico | sem unidade direta |
| Administrador inicial | 1 | `Dentista (CD)` | true | false | false | permissoes admin habilitadas | prestador ADM funcional | Unidade Principal |

Nao nasce secretaria inicial. Nao nasce usuario comum inicial. A conta nasce com usuario sistemico e administrador inicial.

## Painel local `/admin/users`

O modulo local tem modal rico e cria usuario dentro da propria clinica atual.

| Opcao/controle legado | Valor enviado | Efeito backend | Ainda valida para ADM global inicial? |
|---|---|---|---:|
| Tipo de usuario | `tipo_usuario` string | Normaliza e influencia permissoes default | sim, mas via contrato backend |
| Prestador | `prestador_row_id` | Vincula `usuarios.prestador_id` e `prestador.usuario_id` | nao no modal minimo |
| Unidade | `unidade_row_id` | Define `usuarios.unidade_atendimento_id` | nao no modal minimo |
| Admin | `is_admin` | Permissoes totais se true | nao deve ser enviado arbitrariamente |
| Forcar troca senha | `forcar_troca_senha` | Flag local | nao no contrato novo |
| Ativo/Inativar | `ativo` | Status do usuario | nao no contrato novo |
| Senha | `senha`, `confirma_senha` | Cria senha de login | sim |

O endpoint local atual cria com `setup_completed=True`; portanto nao atende o contrato de primeiro acesso pendente.

## Perfis de acesso

Tipos e perfis nao sao a mesma coisa.

- `tipo_usuario`: string em `usuarios`, classificatoria.
- `permissoes_json`: permissoes efetivas por modulo/funcoes no usuario.
- `access_profile`: perfis funcionais por clinica, materializados por seed.
- `usuario_perfil_acesso`: vinculo `clinica_id + usuario_id + prestador_id + perfil_id`.

Respostas:

1. Tipo de usuario e perfil sao conceitos diferentes.
2. Tipo nao cria perfil automaticamente.
3. Um usuario pode ter multiplos vinculos em `usuario_perfil_acesso`, por perfil e prestador.
4. Perfis funcionais sao por clinica.
5. Administrador nao precisa de perfil funcional para ter acesso: `is_admin=True` habilita todos os modulos.
6. Secretaria nao aparece como valor oficial persistido no codigo; o equivalente operacional mais proximo e `Atendente` ou `Funcionário(a) administrativo(a)`.
7. Dentista tem tipo real `Dentista (CD)`, mas perfil funcional e separado.
8. Perfis funcionais default existem em `access_profiles_default.py`.
9. Novo usuario global nao deve receber perfil funcional automaticamente nesta primeira versao.
10. O endpoint local cria `permissoes_json`, mas nao cria `usuario_perfil_acesso` automaticamente.

## Prestador e unidade

O modal minimo definido nao inclui prestador/unidade.

Decisao:

- Tipos administrativos sem vinculo profissional obrigatorio podem entrar na primeira versao.
- Tipos profissionais que exigem prestador/unidade para experiencia completa devem ficar fora da primeira versao ou receber etapa propria.
- Nao adicionar campos silenciosamente ao modal minimo.

| Tipo | Exige prestador para contrato completo? | Exige unidade? | Elegivel no modal minimo? |
|---|---:|---:|---:|
| Administrador | nao obrigatorio para login/admin | nao | sim |
| Funcionario administrativo | nao confirmado como obrigatorio | nao | sim |
| Gerente administrativo | nao confirmado como obrigatorio | nao | sim |
| Atendente | nao confirmado como obrigatorio | nao | sim |
| Auxiliar odontologico | pode depender de contexto operacional | nao confirmado | nao nesta primeira versao |
| Dentista (CD) | sim para agenda/profissional completo | recomendado unidade/prestador | nao nesta primeira versao |
| Clinica | sistemico | nao aplicavel | nao |

## Contas ativas

Endpoint existente: `GET /superadmin/clinicas`.

Campos retornados:

- `id`
- `nome`
- `email`
- `ativo`
- `tipo_conta`
- `trial_ate`
- `data_ativacao`
- `assinatura_status`
- `usuarios_total`
- `usuarios_ativos`
- `is_owner_clinica`

Filtros existentes:

- `q`
- `status`
- `ativo`
- `limit`

Regra para combo:

- chamar `GET /superadmin/clinicas?ativo=true&limit=1000`;
- filtrar defensivamente `ativo === true` e `assinatura_status !== "suspensa"` no frontend;
- backend do novo create tambem deve validar `clinica.ativo is True`;
- valor enviado deve ser `clinica_id`;
- label recomendado: `Nome da conta - e-mail principal - ID`.

Conta suspensa:

- representada por `clinicas.ativo=False`;
- `assinatura_status_from_clinica` retorna `suspensa`;
- nao deve aparecer no combo;
- backend deve rejeitar mesmo se `clinica_id` for enviado manualmente;
- nao deve existir `ativar_clinica` no payload novo.

## Endpoint global atual de criacao

Endpoint: `POST /superadmin/usuarios`.

Payload atual:

```json
{
  "clinica_id": 17,
  "nome": "Nome",
  "email": "email@exemplo.com",
  "senha": "senha",
  "is_admin": true,
  "ativar_clinica": true
}
```

Achados:

- aceita `is_admin=false`, mas nao deriva isso de `tipo_usuario`;
- nao aceita `tipo_usuario`;
- nao aceita `confirma_senha`;
- nao valida conta ativa;
- pode reativar clinica por `ativar_clinica=true`;
- cria `setup_completed=True`;
- nao atribui prestador;
- nao atribui unidade;
- nao cria `permissoes_json` explicitamente;
- registra auditoria `usuario_create`;
- exige `_require_superadmin`, nao Owner-only;
- valida email de forma simples e unicidade global em `Usuario.email`;
- retorna usuario criado sem senha/hash/token.

Classificacao: **B. Pode ser reutilizado apenas com alteracao minima contratual no backend**.

Motivo: o caminho semantico e o recurso existem, mas o contrato novo exige mudar schema, validar conta ativa, remover `ativar_clinica`, aceitar tipo oficial, derivar `is_admin`, setar `setup_completed=False`, validar confirmacao e retornar campos seguros adicionais.

## Primeiro acesso

Contrato desejado: todo usuario criado por `ADM -> Usuarios -> Novo usuario` nasce com `setup_completed=False`.

Auditoria:

- `/auth/setup/complete` aceita qualquer usuario autenticado nao sistemico;
- o guard backend bloqueia rotas operacionais enquanto `setup_completed=False`;
- o React tem rota `/app/primeiro-acesso`;
- o payload de setup e `{ senha, confirma_senha }`;
- a senha interna grava `senha_interna_hash`, nao altera `senha_hash`;
- a tela atual ainda diz `do administrador da clínica`.

Classificacao: **B. Primeiro acesso precisa de ajuste textual** antes de obrigar usuarios comuns a passar pelo fluxo.

## Senha de login

Regras reais:

- senha minima: 6 caracteres;
- confirmacao deve bater quando schema/endpoint oferece confirmacao;
- login usa `senha_hash`;
- primeiro acesso usa `senha_interna_hash`;
- email e normalizado para lowercase;
- email de usuario e unico globalmente;
- senha nao deve ir para log/auditoria/response/docs com valor real.

## Autorizacao

`_require_superadmin` permite Owner ou admin de clinica com tipo de conta Super Admin/Master/Owner/Vitalicia. `Nova conta` ja foi restringida a Owner-only, mas `POST /superadmin/usuarios` atual nao e Owner-only.

Matriz recomendada para o novo contrato:

| Operador | Criar usuario comum | Criar administrador | Criar em qualquer conta |
|---|---:|---:|---:|
| Owner | sim | sim | sim |
| MASTER nao-Owner | sim, se produto aceitar superadmin operacional | nao na primeira versao | sim, com restricoes |
| Super Admin de clinica | sim, se produto aceitar superadmin operacional | nao na primeira versao | sim, com restricoes |
| Admin local | nao pelo ADM global | nao | nao |

Decisao de seguranca: nao assumir que leitura global implica criacao global irrestrita. A criacao de administrador deve ser limitada a Owner na primeira versao, ou exigir regra explicita separada.

## Payload futuro recomendado

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

Campos proibidos:

- `ativar_clinica`
- `is_system_user`
- `setup_completed`
- `senha_interna`
- `senha_interna_hash`
- `is_master`
- `is_owner`
- `is_admin`
- `perfil`
- `permissoes_json`
- `prestador_id`
- `unidade_atendimento_id`
- `clinica_nova`
- `assinatura`
- `plano`

## Response futura segura

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

Nao retornar senha, hash, senha interna, token, codigo ou dados sensiveis desnecessarios.

## Decisoes objetivas

1. Tipos reais existem como string livre normalizada em `usuarios.tipo_usuario`.
2. Tipos elegiveis iniciais: `administrador`, `funcionario_administrativo`, `gerente_administrativo`, `atendente`.
3. Tipos fora da primeira versao: `clinica`, `dentista_cd`, `auxiliar_odontologico`, `protetico`, `perito`, `crc`, `thd`.
4. Tipo e perfil sao diferentes.
5. Administrador deve ser tratado como tipo de contrato do modal que deriva `is_admin=True`; no banco, o marcador real e `is_admin`.
6. Secretaria nao existe como valor oficial confirmado; nao entra no combo com esse nome.
7. Dentista existe como tipo real `Dentista (CD)`, mas fica fora da primeira versao por exigir prestador/unidade para experiencia completa.
8. Modal minimo atende todos os tipos elegiveis acima.
9. Endpoint de contas: `GET /superadmin/clinicas`.
10. Endpoint atual de criacao: `POST /superadmin/usuarios`.
11. Classificacao: B.
12. Backend precisa mudar.
13. Conta suspensa deve ser bloqueada no combo e no backend.
14. Primeiro acesso precisa ajuste textual.
15. Proxima ordem: contrato backend, ajuste textual primeiro acesso, endpoint/schemas, frontend modal, testes, runtime.

## Validacao somente leitura

- `psql` nao estava disponivel no PATH.
- Python local e runtime empacotado nao tinham SQLAlchemy instalado; portanto nao foram executados SELECTs no banco.
- Auditoria foi fechada pelo codigo versionado e documentos obrigatorios.
- Nenhum INSERT/UPDATE/DELETE foi executado.
