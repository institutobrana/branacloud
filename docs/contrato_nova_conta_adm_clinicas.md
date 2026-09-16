# Contrato de Nova conta em ADM Clinicas

## 1. Contexto

Este documento fecha o contrato tecnico e funcional para a futura acao `ADM -> Clinicas -> Nova conta`.

Esta rodada foi exclusivamente documental. Nenhum backend, frontend, rota, schema, model, migration, teste funcional, seed ou dado persistido foi alterado.

## 2. Decisao de produto

- O rotulo final e `Nova conta`.
- `Nova conta` significa criar uma conta completa do zero.
- O fluxo publico de signup nao deve aparecer no login do frontend React.
- A criacao administrativa deve existir apenas em `ADM -> Clinicas -> Nova conta`.
- A acao deve ser visivel e executavel somente pelo Owner real da plataforma.
- `Novo usuario` nao pertence ao modulo `Clinicas`; deve ser preservado para futura tela `ADM -> Usuarios`.

## 3. Mudanca de ponto de entrada

Fluxo atual:

```text
Login publico
-> Cadastrar
-> nome/e-mail/senha
-> codigo por e-mail
-> confirmacao
-> provisionamento
-> token
-> login automatico
-> primeiro acesso quando setup_completed=false
```

Fluxo futuro:

```text
Owner autenticado
-> ADM -> Clinicas
-> Nova conta
-> modal
-> confirmacao administrativa
-> provisionamento
-> auditoria
-> refetch da tabela
-> Owner permanece na mesma sessao
```

No fluxo futuro:

- nao havera codigo de confirmacao;
- nao havera token da nova conta na resposta;
- nao havera login automatico;
- nao havera troca da sessao do Owner;
- nao havera carregamento do onboarding da nova conta dentro da sessao do Owner;
- o administrador criado fara o primeiro acesso no login proprio;
- a conta nascera `DEMO 7 dias`, ativa, com validade inicial de 7 dias;
- o provisionamento continuara criando os dois usuarios obrigatorios.

## 4. Documentacao auditada

| Documento | Regra encontrada | Estado | Divergencia com codigo |
|---|---|---|---|
| `docs/auditoria_provisionamento_nova_conta_adm_clinicas.md` | Signup publico cria conta completa; recomenda endpoint administrativo protegido sem token. | Atual e alinhado. | Nenhuma relevante; registra que assinatura nao nasce diretamente no signup. |
| `docs/auditoria_botao_novo_usuario_adm_clinicas.md` | `Novo usuario` cria admin em clinica existente, nao nova conta. | Atual e alinhado. | Nenhuma. |
| `docs/05_banco_dados.md` | Tenant e isolamento por `clinica_id`; provisionamento inicial cria clinica, unidade, prestador, usuario admin e perfil. | Parcial; cobre tenant inicial e arquitetura. | Fluxo de signup atual cria mais seeds do que o resumo do tenant inicial. |
| `docs/06_seguranca.md` | Isolamento real vem de `current_user.clinica_id`; Owner vem de regras de seguranca; Superadmin requer cuidado. | Atual. | Nao detalha o contrato Owner-only de `Nova conta`, que e novo. |
| `docs/07_fluxos.md` | Signup usa `POST /signup/request-code` e `POST /signup/confirm`; setup bloqueia rotas quando `setup_completed=false`. | Atual em alto nivel. | Nao detalha os dois usuarios do provisionamento. |
| `docs/08_setup_execucao.md` | Tenant inicial via script separado com plan/apply/validate; variaveis de codigo de signup. | Atual para tenant inicial. | E outro fluxo, nao o signup publico completo. |
| `docs/10_continuidade.md` | Reforca storage por clinica e cautela com rollback/migrations. | Atual. | Nao fecha endpoint administrativo futuro. |
| `docs/11_roadmap_desenvolvimento.md` | Historico: nova conta nasce com usuario sistemico, admin inicial, unidade Principal / 0001, Brana, seeds, setup do ADM inicial. | Historico util, mas nao fonte unica. | Alguns trechos antigos refletem etapas intermediarias; codigo atual e fonte operacional. |
| `backend/tests/test_tenant_provisioning_*.py` | Script de tenant inicial tem testes de apply, rollback e lock. | Atual para script. | Nao testa `criar_conta_saas` publico. |

Regra de leitura: quando documentacao e codigo divergem, o codigo atual e a realidade operacional.

## 5. Fluxo publico atual

Frontend legado:

- Botao: `frontend/index.html`, `btn-open-signup`, texto `Cadastrar`.
- Painel: `panel-signup`.
- Funcoes: `signupRequestCode()` e `signupConfirm()` em `frontend/app.js`.

Backend:

- `POST /signup/request-code` em `backend/routes/auth_routes.py`.
- `POST /signup/confirm` em `backend/routes/auth_routes.py`.
- Service principal: `backend/services/signup_service.py::criar_conta_saas(db, nome, email, senha)`.

### A. Solicitacao do codigo

Campos informados antes do codigo:

- `nome`
- `email`
- `senha`

O frontend guarda esses valores nos inputs do browser ate a confirmacao. A senha e enviada nesta etapa para validacao de tamanho, mas nao e persistida como usuario ainda.

Backend:

- normaliza e valida e-mail;
- valida senha minima;
- bloqueia e-mail ja existente em `usuarios`;
- bloqueia e-mail ja existente em `clinicas`;
- cria `EmailCode` com `purpose="signup"`;
- envia codigo por e-mail.

O codigo:

- e vinculado ao e-mail;
- e armazenado como hash;
- expira conforme `SIGNUP_CODE_EXP_MINUTES`, default 10 minutos;
- nao ha limite de tentativas observado;
- pode haver multiplos codigos, e a validacao procura registros nao usados mais recentes.

### B. Confirmacao

Campos reenviados:

- `nome`
- `email`
- `senha`
- `codigo`

A senha e enviada novamente. O provisionamento so comeca apos validacao do codigo.

### C. Provisionamento

`signup_confirm` chama:

```python
criar_conta_saas(db, nome=payload.nome.strip(), email=email, senha=payload.senha)
```

Os dois usuarios sao criados dentro de `criar_conta_saas`, depois da clinica, storage, unidade, etiquetas e prestador sistemico.

### D. Token

Apos o service fazer commit e apos `record.used=True`, `signup_confirm` gera JWT com:

- `user_id`
- `clinica_id`
- `is_admin`

### E. Login automatico

O frontend legado grava `data.access_token` em `localStorage` e chama `carregarSessao()`.

### F. Primeiro acesso

Se `/me` retorna `setup_completed === false`, `carregarSessao()` abre `panel-setup`.

## 6. Fluxo administrativo futuro

O fluxo administrativo deve pular apenas as partes publicas:

- sem `EmailCode`;
- sem envio de codigo;
- sem token retornado;
- sem login automatico.

Nao deve pular o provisionamento:

- clinica;
- usuario sistemico `Clinica`;
- administrador inicial;
- unidade principal;
- prestadores;
- perfis;
- seeds;
- storage;
- setup do administrador inicial.

## 7. Owner-only

Regra real de Owner:

Arquivo: `backend/security/superadmin.py`.

```python
def is_owner_email(email):
    return email normalizado in _owner_emails()
```

`_owner_emails()` usa:

- `OWNER_BYPASS_EMAILS`;
- ou `OWNER_MASTER_EMAIL`;
- ou fallback `gleissontel@gmail.com`.

Nao ha campo persistido `is_master` no modelo `Usuario`. `is_master` em payload de sessao e derivado por e-mail owner.

`_require_superadmin` nao e suficiente para `Nova conta`, porque `is_platform_superadmin_user()` tambem aceita usuario `is_admin=True` dentro de clinica cujo `tipo_conta` seja Super Admin, Master, Owner ou Vitalicia.

Contrato:

- somente Owner pode ver o botao;
- somente Owner pode usar o endpoint;
- ocultar botao nao substitui protecao backend;
- endpoint futuro deve checar `is_owner_email(current_user.email)`;
- se nao for Owner, retornar `403`;
- tentativa nao autorizada deve ser auditavel futuramente sem vazar detalhes.

Helper recomendado:

```python
def _require_owner(current_user):
    if not is_owner_email(current_user.email):
        raise HTTPException(status_code=403, detail="Acesso restrito ao Owner da plataforma.")
```

## 8. Usuario sistemico `clinica`

Arquivo: `backend/services/signup_service.py`.

Funcao: `_garantir_usuario_sistemico_clinica(db, clinica_id, prestador)`.

Ordem:

1. `criar_conta_saas` cria a clinica.
2. Cria storage.
3. Garante unidade principal.
4. Garante padroes/modelos de etiqueta.
5. Cria/garante prestador sistemico.
6. Cria/garante usuario sistemico.
7. Depois cria perfis e administrador inicial.

Dados:

- `codigo=255`
- `nome=SYSTEM_USER_NOME`, valor atual `Clinica` com acento no codigo fonte mojibakeado como `ClÃ­nica`
- `apelido=SYSTEM_USER_NOME`
- `tipo_usuario=SYSTEM_USER_TIPO`, valor atual `Clinica`
- `email=build_system_user_email(clinica_id)`, formato `clinica.255.c{clinica_id}@system.brana.local`
- `senha_hash=hash_password(f"system::{clinica_id}::{SYSTEM_USER_CODIGO}")`
- `clinica_id=clinica_id`
- `is_admin=False`
- `ativo=True`
- `online=False`
- `forcar_troca_senha=False`
- `setup_completed=True`
- `is_system_user=True`
- `prestador_id` do prestador sistemico, quando existe
- `permissoes_json` sanitizado para tipo `Clinica`, sem admin.

Autenticacao:

- tecnicamente possui `senha_hash` deterministica, nao aleatoria;
- nao deve autenticar interativamente porque `get_current_user()` bloqueia `is_system_user(usuario)` com `403 Conta sistemica sem sessao interativa`;
- mesmo que um token fosse emitido indevidamente, dependencias autenticadas bloqueiam a sessao.

Identificacao tecnica:

- primario: flag `is_system_user=True`;
- fallback: `codigo == 255`, `tipo_usuario == SYSTEM_USER_TIPO`, `nome == SYSTEM_USER_NOME`;
- e-mail sistemico tambem e padronizado, mas nao e a unica protecao;
- prestador relacionado usa `source_id=255`, `codigo="001"`, `is_system_prestador=True`.

Listagem/contagem:

- aparece na listagem de usuarios da clinica via `GET /admin/users`, com `is_system_user=True`;
- aparece na listagem Super Admin de usuarios com `is_system_user`;
- entra na contagem `usuarios_total`;
- entra em `usuarios_ativos` porque `ativo=True`.

Protecoes:

- `backend/security/dependencies.py::get_current_user()` bloqueia sessao interativa.
- `backend/routes/user_admin_routes.py::_assert_not_system_user()` bloqueia edicao, permissoes, perfil, status/ativo, reset de senha, troca de senha e exclusao.
- `backend/routes/user_admin_routes.py::admin_create_user()` bloqueia codigo 255.
- `backend/routes/superadmin_routes.py` bloqueia reset de senha, status e perfil de usuario sistemico.
- `backend/routes/prestadores_routes.py` bloqueia alteracao/exclusao do prestador base `Clinica`.
- `backend/security/admin_password.py` exclui usuarios sistemicos dos candidatos a senha administrativa.

Classificacao da protecao: A. Protecao completa no backend para sessao, edicao/exclusao de usuario e prestador base nos fluxos auditados.

Risco residual:

- a protecao depende de todos os novos endpoints futuros chamarem os helpers corretos;
- a criacao por signup nao deve enfraquecer `is_system_user=True`;
- se surgir rota nova que manipule usuario sem `_assert_not_system_user`, a protecao pode virar parcial nesse ponto.

Finalidade:

- representar a propria clinica em processos internos;
- manter vinculo com prestador sistemico;
- sustentar compatibilidade com rotinas que precisam de entidade base/reservada;
- impedir que a conta fique sem registros estruturais esperados.

Sem ele, podem quebrar referencias ao prestador/usuario base, listagens protegidas, rotinas de prestadores e contratos herdados do nascimento da conta.

## 9. Administrador inicial

Arquivo: `backend/services/signup_service.py`.

Funcao: `criar_conta_saas(db, nome, email, senha)`.

Criacao:

- ocorre depois do usuario sistemico, dos perfis base e do prestador ADM funcional;
- instancia `Usuario(...)` diretamente.

Dados:

- `codigo=1`
- `nome=nome`
- `apelido=primeiro nome`
- `tipo_usuario=TIPO_USUARIO_DENTISTA`
- `email=email`
- `senha_hash=hash_password(senha)`
- `clinica_id=clinica.id`
- `is_admin=True`
- `online=False`
- `setup_completed=False`
- `is_system_user=False`
- `permissoes_json` sanitizado para admin/dentista.

Vinculos:

- `_apply_user_links` vincula ao prestador ADM funcional;
- `_apply_user_links` vincula a unidade Principal / 0001;
- nao recebe vinculo com o usuario sistemico.

Nao recebe:

- `is_master`;
- campo `is_superadmin`;
- owner da plataforma;
- `is_system_user`.

Login:

- usa endpoint `POST /login`;
- pode autenticar com e-mail e senha de login;
- apos `/me`, como `setup_completed=False`, deve abrir primeiro acesso;
- a conta ja esta provisionada antes do primeiro acesso.

Primeiro acesso:

- solicita senha interna;
- grava `senha_interna_hash`;
- marca `setup_completed=True`;
- marca `online=True`;
- nao cria seeds nem completa provisionamento estrutural.

O administrador inicial nao deve conseguir alterar ou remover o usuario `Clinica`, pois as rotas de usuarios bloqueiam `_assert_not_system_user`.

## 10. Comparacao entre os usuarios

| Aspecto | Usuario sistemico `clinica` | Administrador inicial |
|---|---|---|
| Finalidade | Conta base interna da clinica/processos sistemicos | Usuario real que administra a nova clinica |
| Nome | `Clinica`/`Clínica` vindo de `SYSTEM_USER_NOME` | Valor `nome` recebido pelo signup/service |
| E-mail | `clinica.255.c{clinica_id}@system.brana.local` | E-mail informado no cadastro/modal |
| Senha | Hash deterministico `system::{clinica_id}::255` | Senha informada, armazenada com hash |
| Pode autenticar | Nao deve; `get_current_user` bloqueia sessao sistemica | Sim, via `/login` |
| is_admin | `False` | `True` |
| is_master | Nao; derivacao por e-mail owner nao se aplica | Nao; so se e-mail coincidir com Owner, o que deve ser proibido/evitado |
| setup_completed | `True` | `False` |
| Clinica vinculada | Nova clinica criada | Nova clinica criada |
| Unidade vinculada | Nao recebe `unidade_atendimento_id` no helper atual | Unidade Principal / 0001 |
| Editavel | Nao nos fluxos auditados | Sim conforme modulo Usuarios/permissoes |
| Excluivel | Nao nos fluxos auditados | Sim, exceto ultimo admin/proprio usuario conforme regras |
| Aparece em listagem | Sim, com `is_system_user=True` | Sim |
| Conta na coluna Usuarios | Sim | Sim |
| Primeiro acesso | Nao participa | Sim, por `setup_completed=False` |
| Dependencias | Prestador sistemico, protecoes, rotinas internas | Login, administracao da clinica, prestador ADM, unidade principal |

## 11. Protecao do usuario sistemico

Classificacao: A. Protecao completa no backend nos fluxos auditados.

A protecao nao e apenas frontend. Ela existe em:

- autenticacao: `get_current_user`;
- CRUD de usuarios: `_assert_not_system_user`;
- criacao de usuario: codigo 255 reservado;
- Super Admin usuarios: bloqueio de reset/status/perfil;
- prestadores: bloqueio da conta/prestador `Clinica`;
- senha administrativa: exclusao de candidatos sistemicos.

Futura blindagem recomendada:

- qualquer novo endpoint de `ADM -> Usuarios` deve reutilizar `_assert_not_system_user`;
- listagens podem exibir `is_system_user`, mas a UI deve ocultar ou bloquear acoes;
- testes devem cobrir alteracao/exclusao/reset do usuario sistemico.

## 12. Campos do modal

### Campos obrigatorios para provisionamento

- Nome da clinica.
- Nome do administrador inicial.
- E-mail do administrador inicial.
- Senha inicial.

### Campos obrigatorios para login inicial

- E-mail do administrador inicial.
- Senha inicial.

### Campos obrigatorios apenas no frontend

- Confirmar senha.
- Confirmacao administrativa antes de criar.

### Campos derivados automaticamente

- Usuario sistemico `Clinica`.
- E-mail do usuario sistemico.
- Codigo 255.
- Unidade Principal.
- Codigo da unidade `0001`.
- Plano `DEMO`.
- Trial 7 dias.
- Conta ativa.
- Storage.
- Seeds.
- Perfis/permissoes.
- Prestadores.

### Campos que nao devem aparecer

- Usuario sistemico `Clinica`.
- E-mail do usuario sistemico.
- `is_master`.
- `is_superadmin`.
- `is_admin` do admin inicial, se sempre verdadeiro.
- `clinica_id`.
- `source_id`.
- seeds.
- storage.
- unidade principal, se automatica.
- plano, se fixo.
- dias de trial, se fixos.
- ativo, se regra fixa.
- limite de usuarios, sem campo/regra backend confirmada.
- termos, sem fluxo administrativo definido.
- codigo de confirmacao.

### Avaliacao item a item

| Item | Classificacao |
|---|---|
| Nome da clinica | Deve aparecer |
| Nome do administrador inicial | Deve aparecer |
| E-mail | Deve aparecer |
| Senha | Deve aparecer ou ser substituida por convite futuro; contrato atual pede senha |
| Confirmar senha | Deve aparecer no frontend |
| Plano | Derivado/fixo por enquanto |
| Dias de trial | Derivado/fixo por enquanto |
| Ativo | Derivado/fixo |
| Nome do usuario sistemico | Nao deve aparecer |
| E-mail do usuario sistemico | Nao deve aparecer |
| Unidade principal | Derivado |
| Codigo da unidade | Derivado |
| Limite de usuarios | Nao aplicavel hoje |
| Documento | Nao aplicavel hoje |
| Telefone | Nao aplicavel hoje |
| Cidade | Nao aplicavel hoje |
| Termos | Nao aplicavel no fluxo administrativo atual |
| Codigo de confirmacao | Nao deve aparecer |

## 13. Nome da clinica versus nome do administrador

Assinatura atual:

```python
criar_conta_saas(db, nome, email, senha)
```

Uso atual de `nome`:

- `Clinica.nome = nome`;
- usuario administrador inicial `nome=nome`;
- usuario administrador inicial `apelido` derivado do mesmo nome;
- prestador ADM funcional usa `nome_conta=nome`;
- unidade principal nao usa esse nome; permanece `Principal`.

O cadastro legado solicita apenas `Nome`, sem separar nome da clinica e nome da pessoa.

Para o modal ADM, o contrato correto e separar:

- `nome_clinica`;
- `nome_administrador`.

Essa separacao exige adaptar o service sem quebrar o signup legado.

Assinatura futura segura sugerida:

```python
provisionar_conta_saas(
    db,
    nome_clinica,
    admin_nome,
    admin_email,
    admin_senha,
    origem="signup" | "admin",
    commit=True,
)
```

Compatibilidade:

- signup legado pode chamar passando `nome_clinica=nome` e `admin_nome=nome`;
- endpoint administrativo pode passar nomes separados.

## 14. Plano DEMO 7 dias

O signup atual define:

- `tipo_conta="DEMO 7 dias"`;
- `trial_ate=datetime.utcnow() + timedelta(days=7)`;
- `ativo=True`.

Contrato futuro:

- plano inicial fixo `DEMO`;
- validade inicial fixa 7 dias;
- conta ativa;
- nao expor plano/dias/ativo no modal inicial se o produto mantiver essa regra fixa.

## 15. Unidade principal

Funcao: `_garantir_unidade_principal_clinica`.

Cria ou reaproveita:

- `source_id=1`;
- `codigo="0001"`;
- `nome="Principal"`;
- `qtd_sala=0`;
- `inativo=False`;
- `data_inclusao` atual.

O administrador inicial e vinculado a essa unidade. O usuario sistemico nao recebe `unidade_atendimento_id` diretamente no helper atual.

## 16. Prestadores

Prestador sistemico:

- criado por `_garantir_prestador_sistemico_clinica`;
- `source_id=255`;
- codigo `"001"`;
- nome `Clinica`;
- `is_system_prestador=True`;
- protegido contra alteracao/exclusao em `prestadores_routes.py`.

Prestador ADM funcional:

- criado por `_garantir_prestador_adm_funcional_clinica`;
- `source_id=1`;
- codigo `"002"`;
- nome vem do cadastro atual;
- tipo `Cirurgiao dentista`;
- vinculado ao administrador inicial.

## 17. Perfis e permissoes

O provisionamento chama:

- `_aplicar_bootstrap_access_profiles_clinica`;
- `ensure_default_access_profiles_for_clinic`.

O admin inicial recebe `permissoes_json` sanitizado para admin/dentista.

O usuario sistemico recebe permissoes sanitizadas para tipo `Clinica`, sem admin.

## 18. Seeds

O fluxo atual executa:

- etiquetas;
- access profiles;
- lista padrao;
- simbolos graficos;
- procedimentos genericos;
- procedimentos;
- financeiro;
- indices;
- especialidades;
- auxiliares raw;
- convenios/planos;
- CID;
- anamnese.

O endpoint futuro nao deve reimplementar esses seeds: deve reutilizar o nucleo de provisionamento.

## 19. Storage

Funcao: `_garantir_diretorios_modelos_clinica`.

Caminho:

```text
storage/modelos/clinicas/{clinica_id}/
```

Subpastas:

- `atestados`
- `receitas`
- `recibos`
- `etiquetas`
- `orcamentos`
- `email_agenda`
- `whatsapp_agenda`
- `outros`

Storage esta fora do rollback SQL e pode deixar diretorio orfao se houver falha depois da criacao.

## 20. Primeiro acesso

Frontend legado:

- HTML: `frontend/index.html`, `panel-setup`.
- JS: `frontend/app.js`, `abrirTelaSetup(user)` e `setupComplete()`.

Condicao:

- `carregarSessao()` chama `/me`;
- se `data.setup_completed === false`, abre `panel-setup`.

Backend:

- campo: `usuarios.setup_completed`;
- dependencia: `get_current_user()` bloqueia rotas fora de `/me`, `/logout`, `/auth/renew`, `/auth/setup/complete` quando `setup_completed=False`;
- endpoint: `POST /auth/setup/complete`.

Dados exibidos/solicitados:

- exibe e-mail readonly;
- solicita senha interna e confirmacao.

O que salva:

- `senha_interna_hash=hash_password(senha)`;
- `forcar_troca_senha=False`;
- `setup_completed=True`;
- `online=True`.

O usuario sistemico nao participa e e explicitamente bloqueado no setup.

React:

- busca em `frontend-react/src` nao encontrou fluxo equivalente para `setup_completed`, `setup_required` ou `/auth/setup/complete`;
- pendencia critica: antes de criar contas exclusivamente pelo ADM React, o React precisa suportar o primeiro acesso do administrador inicial, ou o admin criado dependera do legado para finalizar setup.

## 21. Contagem de usuarios

Query da listagem ADM:

- `superadmin_list_clinicas()` calcula `usuarios_total` com `count(Usuario.id)` agrupado por `clinica_id`;
- calcula `usuarios_ativos` com `count(Usuario.id)` filtrando `Usuario.ativo == True`.

Ela conta:

- usuario sistemico;
- administrador inicial;
- usuarios inativos apenas no total.

Valor esperado logo apos criar nova conta:

- usuario sistemico ativo + admin inicial ativo;
- portanto `usuarios_ativos=2` e `usuarios_total=2`;
- coluna esperada: `2/2`.

A regra atual e coerente como contagem tecnica, mas pode confundir visualmente porque inclui usuario sistemico. Futuramente, se o produto quiser contagem de usuarios humanos, sera necessario novo contrato para excluir `is_system_user` da contagem visual sem alterar a contagem operacional.

## 22. Servico reutilizado

Servico atual:

```python
criar_conta_saas(db, nome, email, senha) -> Clinica
```

Efeitos:

- cria clinica;
- cria storage;
- cria unidade;
- cria prestadores;
- cria usuario sistemico;
- cria admin inicial;
- cria perfis e seeds;
- faz `db.commit()`;
- retorna `Clinica`.

Nao depende de:

- contexto HTTP;
- codigo de signup;
- token;
- request/response.

Depende de:

- sessao DB;
- helpers de seed;
- filesystem de storage.

Adaptacoes necessarias:

- permitir nome da clinica separado do nome do administrador;
- permitir endpoint administrativo sem token/login automatico;
- idealmente separar nucleo transacional de `commit()` interno para compor auditoria e assinatura;
- manter `criar_conta_saas` como wrapper compativel do signup publico;
- retornar dados administrativos suficientes;
- nao duplicar seeds.

Auditoria administrativa:

- deve ficar na rota administrativa ou em camada de application service que receba `actor`;
- nao deve ficar acoplada ao signup publico.

## 23. Endpoint futuro

Contrato recomendado:

```text
POST /superadmin/clinicas/nova-conta
```

Metodo:

- `POST`.

Autorizacao:

- `get_current_user`;
- Owner-only por `is_owner_email(current_user.email)`;
- nao usar apenas `_require_superadmin`.

Regras:

- plano fixo DEMO;
- trial fixo 7 dias;
- conta ativa;
- sem codigo;
- sem token;
- sem login automatico;
- sem troca de sessao;
- sem envio de codigo;
- auditoria obrigatoria;
- resultado parcial proibido.

Erros:

- `400`: payload semanticamente invalido, senha fraca, confirmacao divergente;
- `401`: sem autenticacao;
- `403`: autenticado mas nao Owner;
- `409`: e-mail/conta duplicada;
- `422`: schema invalido;
- `500`: falha inesperada/seed/storage nao tratada.

Duplo clique/reexecucao:

- frontend deve bloquear botao enquanto pendente;
- backend deve ter protecao por e-mail e idealmente idempotency/lock por e-mail;
- segunda chamada com mesmo e-mail deve retornar `409`.

Falha de seed/storage:

- falha de seed SQL deve provocar rollback SQL;
- falha de storage deve ser erro antes de seguir;
- se storage for criado e depois SQL falhar, registrar risco/compensacao futura.

## 24. Schema futuro

Entrada recomendada:

```json
{
  "nome_clinica": "Clinica Exemplo",
  "admin_nome": "Dra. Exemplo",
  "admin_email": "admin@example.com",
  "admin_senha": "Senha123",
  "admin_confirma_senha": "Senha123"
}
```

Campos proibidos:

- `clinica_id`;
- `tipo_conta`;
- `trial_ate`;
- `dias`;
- `ativo`;
- `is_admin`;
- `is_master`;
- `is_superadmin`;
- `is_system_user`;
- `source_id`;
- `permissoes_json`;
- `codigo`;
- `senha_hash`;
- `access_token`.

## 25. Resposta futura

Resposta recomendada:

```json
{
  "detail": "Conta criada com sucesso.",
  "clinica_id": 123,
  "clinica_nome": "Clinica Exemplo",
  "admin_user_id": 456,
  "admin_email": "admin@example.com",
  "plano": "DEMO",
  "tipo_conta": "DEMO 7 dias",
  "trial_dias": 7,
  "trial_ate": "2026-07-28T00:00:00",
  "usuarios_ativos": 2,
  "usuarios_total": 2
}
```

Nao retornar:

- senha;
- hash;
- token;
- dados do usuario sistemico alem de contagem, salvo necessidade diagnostica futura.

## 26. Auditoria administrativa

A rota futura deve registrar:

- ator Owner;
- acao `nova_conta_create` ou `clinica_create`;
- `clinica_id`;
- `admin_email`;
- origem `adm_clinicas`;
- resultado;
- IP quando disponivel.

Tentativas nao autorizadas podem ser logadas sem criar registro de auditoria persistente, ou auditadas em mecanismo proprio se disponivel.

## 27. Rollback

SQL:

- hoje `criar_conta_saas` faz `db.commit()` interno;
- falhas antes do commit tendem a reverter pela transacao/sessao;
- para endpoint administrativo, o ideal e refatorar nucleo sem commit interno, permitindo auditoria e assinatura no mesmo limite transacional.

Storage:

- fora da transacao;
- precisa de compensacao futura ou aceitacao documentada de diretorio orfao em falha.

Idempotencia:

- hoje nao ha chave idempotente;
- helper usa varias garantias idempotentes internas, mas a criacao da conta por e-mail nao tem lock dedicado;
- endpoint futuro deve bloquear duplo clique no frontend e tratar duplicidade no backend.

## 28. Riscos

- Confundir Owner com Super Admin e permitir criacao por admin de clinica Super Admin.
- Separar nome de clinica/admin sem adaptar corretamente o service.
- Retornar token da nova conta e trocar sessao do Owner.
- Criar conta sem suporte React ao primeiro acesso.
- Duplicar seeds em vez de reutilizar service.
- Enfraquecer protecao do usuario sistemico.
- Manter `commit()` interno e dificultar auditoria/rollback atomicos.
- Storage orfao em falha.
- Contagem `2/2` parecer dois usuarios humanos.

## 29. Pendencias

- Implementar suporte React para primeiro acesso/setup ou definir ponte temporaria segura.
- Criar helper Owner-only.
- Refatorar service para separar nomes e controlar transacao.
- Definir se `PlataformaAssinatura` deve ser sincronizada no nascimento administrativo.
- Criar testes de endpoint futuro: Owner ok, Super Admin nao-owner bloqueado, admin comum bloqueado, e-mail duplicado, rollback, sem token.
- Definir politica de storage rollback.
- Definir se contagem visual deve incluir ou ocultar usuario sistemico.

## 30. Relacao com ADM Usuarios

- `Novo usuario` deve ser preservado para `ADM -> Usuarios`.
- `Novo usuario` cria administrador em clinica existente.
- `Nova conta` cria conta completa do zero.
- Os fluxos nao devem compartilhar botao, modal ou endpoint.
- `POST /superadmin/usuarios` nao deve provisionar conta.

## 31. Ausencia de implementacao

Nao foi criado:

- botao;
- modal;
- hook;
- service;
- endpoint;
- schema;
- migration;
- clinica;
- usuario;
- seed;
- fixture;
- teste novo;
- dado persistido.

Nao foi alterado codigo funcional.

## 32. Sem commit

Nenhum commit foi criado nesta rodada.

## 33. Sem push

Nenhum push foi executado nesta rodada.

## 34. Dependencia de primeiro acesso React

A lacuna critica do primeiro acesso no React foi tratada em etapa posterior com:

- rota `/app/primeiro-acesso`;
- guard global para `setup_completed === false`;
- pagina dedicada sem shell;
- service reutilizando `POST /auth/setup/complete`;
- `refreshSession()` apos sucesso.

Esta implementacao prepara o caminho para `ADM -> Clinicas -> Nova conta`, mas nao implementa a criacao de nova conta.

## 35. Implementacao React/FastAPI em 2026-07-21

A etapa `ADM -> Clinicas -> Nova conta` foi implementada no frontend React e no backend FastAPI.

Contrato ativo:

- `POST /superadmin/clinicas/nova-conta`;
- acesso restrito ao Owner real por `is_owner_email(current_user.email)`;
- payload fechado com `nome_clinica`, `admin_nome`, `admin_email`, `admin_senha` e `admin_confirma_senha`;
- recusa de campos extras no schema;
- reutilizacao do provisionamento completo do signup via `provisionar_conta_saas`;
- preservacao de `criar_conta_saas` para manter o cadastro publico sem mudanca comportamental;
- criacao de clinica ativa, plano `DEMO 7 dias`, validade inicial de 7 dias, usuario sistemico codigo 255 e administrador inicial codigo 1 com `setup_completed=False`;
- sem criacao de token, sem login automatico e sem troca da sessao Owner;
- auditoria `clinica_nova_conta_create`;
- compensacao de storage local da nova clinica em falhas antes do sucesso.

Frontend ativo:

- a toolbar de `ADM -> Clinicas` usa o rotulo `Nova conta`;
- `Novo usuario` nao pertence mais a esta toolbar e fica reservado para a frente futura `ADM -> Usuarios`;
- o modal e controlado por React, sem `Modal.confirm`, `window.confirm`, `alert` ou `prompt`;
- apos sucesso, a tabela e recarregada e a nova clinica e selecionada pelo `clinica_id` retornado.
