# Auditoria de provisionamento para Nova conta em ADM Clinicas

## 1. Contexto

Esta auditoria mapeia, somente por leitura, como o Brana Cloude cria hoje uma nova conta completa pelo fluxo legado de cadastro publico e como esse provisionamento deve ser adaptado futuramente para uma acao administrativa protegida em `ADM -> Clinicas -> Nova conta`.

Nenhum codigo funcional foi alterado nesta rodada.

## 2. Decisoes funcionais ja definidas

- O rotulo final do produto e `Nova conta`.
- `Nova conta` significa provisionamento completo de conta, nao apenas `INSERT` em `clinicas`.
- O React nao deve expor cadastro publico na tela de login.
- A criacao de novas contas no React deve ocorrer exclusivamente em `ADM -> Clinicas -> Nova conta`.
- `Novo usuario` nao e sinonimo de `Nova conta`.
- `Novo usuario` cria administrador em clinica existente e deve ser preservado futuramente para `ADM -> Usuarios`.

## 3. Fluxo legado

### Botao/link visivel

Arquivo: `frontend/index.html`.

Na tela de login ha:

```html
<button id="btn-open-signup" class="login-link" type="button">Cadastrar</button>
```

Esse botao abre o painel:

```html
<section id="panel-signup" class="login-panel hidden">
```

### Campos exibidos no legado

O painel de cadastro exibe:

- `signup-nome`: Nome
- `signup-email`: E-mail
- `signup-senha`: Senha
- `signup-codigo`: Codigo de ativacao

Tambem exibe:

- botao `Solicitar codigo`
- botao `Confirmar cadastro`
- botao `Voltar`

Nao ha campos de telefone, documento, cidade, plano, dias de trial, limite de usuarios, unidade principal, aceite de termos ou captcha no HTML auditado.

### Eventos e funcoes JavaScript

Arquivo: `frontend/app.js`.

Eventos:

- `btn-open-signup` chama `showPanel(panelSignup)`;
- `btn-signup-code` chama `signupRequestCode()`;
- `btn-signup-confirm` chama `signupConfirm()`;
- `btn-back-login-from-signup` volta para `panelLogin`.

Funcao `signupRequestCode()`:

- monta payload com `nome`, `email`, `senha`;
- valida nome, e-mail e senha preenchidos;
- valida senha minima de 6 caracteres;
- chama `POST /signup/request-code`;
- exibe sucesso ou erro no status do login.

Funcao `signupConfirm()`:

- monta payload com `nome`, `email`, `senha`, `codigo`;
- valida todos preenchidos;
- valida senha minima de 6 caracteres;
- chama `POST /signup/confirm`;
- em sucesso grava `access_token` em `localStorage`;
- chama `carregarSessao()`.

## 4. Endpoint atual

O fluxo atual usa dois endpoints publicos em `backend/routes/auth_routes.py`:

- `POST /signup/request-code`
- `POST /signup/confirm`

O endpoint que cria efetivamente a conta e:

```text
POST /signup/confirm
```

## 5. Servico

O servico principal de provisionamento e:

```python
backend/services/signup_service.py::criar_conta_saas(db, nome, email, senha)
```

Esse servico concentra a criacao da clinica e dos recursos iniciais. A futura acao ADM nao deve duplicar esse fluxo manualmente.

## 6. Schemas

Arquivo: `backend/routes/auth_routes.py`.

Schema de solicitacao de codigo:

```python
class SignupRequest(BaseModel):
    nome: str
    email: str
    senha: str
```

Schema de confirmacao:

```python
class SignupConfirm(SignupRequest):
    codigo: str
```

Resposta de `POST /signup/request-code`:

```json
{
  "detail": "Codigo enviado para o e-mail informado."
}
```

Resposta de `POST /signup/confirm`:

```json
{
  "detail": "Conta criada com sucesso.",
  "access_token": "jwt",
  "token_type": "bearer"
}
```

## 7. Campos

### Campos obrigatorios atuais

- `nome`
- `email`
- `senha`
- `codigo` somente na confirmacao

### Campos opcionais atuais

- Nenhum no signup publico legado.

### Campos derivados pelo backend

- `clinicas.tipo_conta = "DEMO 7 dias"`
- `clinicas.trial_ate = datetime.utcnow() + timedelta(days=7)`
- `clinicas.ativo = True`
- `clinicas.nome_tabela_procedimentos = "Brana"`
- unidade principal `Principal / 0001`
- prestador sistemico `Clinica`
- usuario sistemico
- prestador ADM funcional
- usuario administrador inicial
- permissoes sanitizadas
- perfis base de acesso
- seeds odontologicos e financeiros
- diretorios de storage por clinica

### Campos fixos

- Plano inicial: `DEMO 7 dias`
- Trial inicial: 7 dias
- Usuario inicial: `codigo=1`
- Usuario inicial admin: `is_admin=True`
- Usuario inicial setup: `setup_completed=False`
- Usuario sistemico: `setup_completed=True`, `is_system_user=True`, `is_admin=False`
- Unidade principal: `source_id=1`, `codigo="0001"`, `nome="Principal"`
- Prestador ADM: `source_id=1`, `codigo="002"`, `tipo_prestador="Cirurgiao dentista"`

### Campos que nao devem ser expostos sem novo contrato

- `is_master`
- `is_superadmin`
- `clinica_id`
- `source_id`
- `codigo` tecnico de usuario/prestador/unidade
- `nome_tabela_procedimentos`
- `permissoes_json`
- `senha_hash`
- paths internos de storage
- qualquer chave idempotente improvisada sem contrato

## 8. Entidades criadas

| Entidade/Recurso | E criado? | Funcao/servico | Obrigatorio? | Rollback |
|---|---:|---|---:|---|
| Clinica | Sim | `criar_conta_saas` cria `Clinica(...)` | Sim | Pelo rollback da transacao SQL se falhar antes do commit |
| Usuario inicial | Sim | `criar_conta_saas` cria `Usuario(...)` admin | Sim | Pelo rollback SQL |
| Owner | Nao como campo | Owner/Master e derivado por e-mail em `is_owner_email`; signup nao grava owner | Nao | Nao aplicavel |
| Administrador | Sim | Usuario inicial com `is_admin=True` | Sim | Pelo rollback SQL |
| Unidade principal | Sim | `_garantir_unidade_principal_clinica` | Sim | Pelo rollback SQL |
| Plano | Sim como campo da clinica | `tipo_conta="DEMO 7 dias"` | Sim | Pelo rollback SQL |
| Trial | Sim | `trial_ate=agora+7 dias` | Sim | Pelo rollback SQL |
| Assinatura | Nao no signup atual | Nao ha `PlataformaAssinatura(...)` nem `sync_assinatura_from_clinica` em `criar_conta_saas` | Desejavel para ADM futuro, mas ausente hoje | Nao aplicavel |
| Cobranca | Nao | Nenhum `PlataformaCobranca(...)` no signup | Nao | Nao aplicavel |
| Preferencias | Parcial/derivadas | Permissoes e modelos/defaults; preferencias de usuario gerais nao sao modalizadas | Sim para operacao inicial | Pelo rollback SQL, exceto storage |
| Tabelas auxiliares | Sim | `garantir_auxiliares_raw_clinica`, `garantir_especialidades_padrao_clinica`, `garantir_convenios_planos_padrao_clinica`, `garantir_cid_padrao_clinica` | Sim | Pelo rollback SQL |
| Dados seed | Sim | listas, simbolos, procedimentos genericos, procedimentos, financeiro, indices, anamnese | Sim | Pelo rollback SQL |
| Storage | Sim | `_garantir_diretorios_modelos_clinica` | Sim para modelos/documentos | Fora do rollback SQL |
| Tenant/schema | Nao cria schema | Tenant e a clinica + `clinica_id` no schema compartilhado | Sim como isolamento logico | Schema nao aplicavel |
| Auditoria | Nao no signup atual | Nao chama `registrar_auditoria` | Recomendado no ADM futuro | Nao aplicavel |
| Sessao/token | Sim no endpoint publico | `signup_confirm` gera JWT apos criar conta | Sim no signup publico; nao recomendado para ADM | Nao aplicavel ao provisionamento SQL |
| E-mail/convite | Sim para codigo | `send_verification_code` envia codigo antes da criacao | Sim no signup publico; opcional/nao direto no ADM | Codigo fica em `email_codes` |

## 9. Tenant

Classificacao do modelo de tenant: A. mesmo schema e isolamento por `clinica_id`.

O projeto usa um unico banco/schema operacional compartilhado. A separacao entre contas ocorre por `clinica_id`.

Evidencias:

- `docs/05_banco_dados.md` registra que a maioria das tabelas operacionais possui `clinica_id`.
- `docs/06_seguranca.md` registra que `TenantMiddleware` captura `X-Tenant-ID`, mas o isolamento efetivo deve vir de `current_user.clinica_id`.
- Modelos como `Usuario`, `UnidadeAtendimento`, `PrestadorOdonto`, procedimentos, financeiro, materiais e anamnese usam `clinica_id`.

Nao ha:

- schema por clinica;
- banco por clinica;
- migration por tenant individual;
- banco separado por conta.

Ha storage separado por diretorio:

```text
storage/modelos/clinicas/{clinica_id}/
```

## 10. Usuario inicial

O usuario inicial criado pelo signup e:

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
- `permissoes_json` sanitizado para admin/dentista

Ele e vinculado a:

- clinica criada;
- prestador ADM funcional;
- unidade principal.

Ele recebe token no endpoint publico `POST /signup/confirm`, nao dentro do servico `criar_conta_saas`.

Senha:

- recebida do frontend;
- validada com minimo de 6 caracteres em `auth_routes.py`;
- armazenada como hash;
- nao retornada na resposta;
- nao aparece no payload de retorno.

Primeiro acesso:

- `setup_completed=False`;
- a UI pode abrir a tela de setup interno apos `/me`;
- esse setup e diferente da senha de login.

## 11. Unidade principal

Funcao: `_garantir_unidade_principal_clinica(db, clinica_id)`.

Regra:

- procura unidade existente da clinica por `source_id=1`, `codigo="0001"` ou `nome="principal"`;
- se nao existir, cria:

```text
source_id = 1
codigo = "0001"
nome = "Principal"
qtd_sala = 0
inativo = False
data_inclusao = data atual em dd/mm/YYYY
```

A unidade e vinculada ao usuario inicial por `_apply_user_links`.

## 12. Plano/trial

Plano padrao do signup:

- valor interno em `Clinica.tipo_conta`: `DEMO 7 dias`
- validade: `trial_ate = datetime.utcnow() + timedelta(days=7)`
- status da clinica: `ativo=True`

Nao ha escolha de plano no signup publico.

No futuro ADM, o produto pode optar por manter default no backend e, se expuser plano/dias, deve chamar regras compartilhadas como `normalize_plano_value`/`aplicar_plano_na_clinica` ou um wrapper administrativo que preserve defaults e auditoria.

## 13. Assinatura

O signup atual nao cria `PlataformaAssinatura` diretamente.

O servico existente para assinatura de plataforma e:

```python
services.platform_admin_service.sync_assinatura_from_clinica(db, clinica)
```

Ele e usado em rotas de licenca/ADM, mas nao aparece dentro de `criar_conta_saas`.

Conclusao: para `Nova conta` administrativa, ha uma lacuna a decidir:

- reutilizar o provisionamento atual exatamente e manter assinatura derivada/lazy;
- ou criar/sincronizar `PlataformaAssinatura` no novo endpoint administrativo, documentando o comportamento.

Sem essa decisao, nao se deve afirmar que a nova conta nasce com registro em `plataforma_assinaturas`.

## 14. Seeds

O signup executa os seguintes seeds/helpers:

- `garantir_padroes_etiqueta(db)`
- `garantir_modelos_etiqueta_clinica(db, clinica.id)`
- `_aplicar_bootstrap_access_profiles_clinica(db, clinica.id)`
- `garantir_lista_padrao_clinica(db, clinica.id)`
- `seed_simbolos_graficos(db, clinica.id)`
- `seed_procedimentos_genericos(db, clinica.id)`
- `seed_procedimentos(db, clinica.id)`
- `garantir_financeiro_padrao_clinica(db, clinica.id)`
- `garantir_indices_padrao_clinica(db, clinica.id)`
- `garantir_especialidades_padrao_clinica(db, clinica.id)`
- `garantir_auxiliares_raw_clinica(db, clinica.id)`
- `garantir_convenios_planos_padrao_clinica(db, clinica.id)`
- `garantir_cid_padrao_clinica(db, clinica.id)`
- `garantir_anamnese_padrao_clinica(db, clinica.id)`

Esses seeds tornam a conta utilizavel sem depender de cadastros manuais posteriores.

## 15. Storage

Funcao:

```python
_garantir_diretorios_modelos_clinica(clinica.id)
```

Caminho base:

```text
storage/modelos/clinicas/{clinica_id}/
```

Subdiretorios:

- `atestados`
- `receitas`
- `recibos`
- `etiquetas`
- `orcamentos`
- `email_agenda`
- `whatsapp_agenda`
- `outros`

O storage e criado no filesystem, fora da transacao SQL. Se uma falha ocorrer depois da criacao dos diretorios e antes do commit SQL, o banco pode fazer rollback, mas os diretorios podem ficar orfaos.

## 16. Transacao

`criar_conta_saas` usa a sessao recebida e chama `db.commit()` ao final.

Sequencia observada:

| Ordem | Operacao | Dentro da transacao SQL? | Pode falhar? | Rollback/compensacao |
|---:|---|---:|---:|---|
| 1 | Criar `Clinica` | Sim | Sim | Rollback SQL se excecao antes do commit |
| 2 | `db.flush()` para obter `clinica.id` | Sim | Sim | Rollback SQL |
| 3 | Definir `nome_tabela_procedimentos="Brana"` | Sim | Sim | Rollback SQL |
| 4 | Criar diretorios de storage | Nao, filesystem | Sim | Sem compensacao observada |
| 5 | Criar/garantir unidade principal | Sim | Sim | Rollback SQL |
| 6 | Garantir padroes/modelos de etiqueta | Sim | Sim | Rollback SQL |
| 7 | Criar prestador sistemico | Sim | Sim | Rollback SQL |
| 8 | Criar usuario sistemico | Sim | Sim | Rollback SQL |
| 9 | Criar perfis base de acesso | Sim | Sim | Rollback SQL |
| 10 | Criar prestador ADM funcional | Sim | Sim | Rollback SQL |
| 11 | Criar usuario admin inicial | Sim | Sim | Rollback SQL |
| 12 | Vincular usuario a prestador/unidade | Sim | Sim | Rollback SQL |
| 13 | Seeds de lista/procedimentos/simbolos/financeiro/indices/auxiliares/convenios/CID/anamnese | Sim | Sim | Rollback SQL |
| 14 | `db.commit()` | Fecha transacao | Sim | Apos commit nao ha compensacao automatica |
| 15 | Marcar codigo de e-mail como usado no endpoint | Nova persistencia apos service commit | Sim | Conta pode ja existir se falhar depois |
| 16 | Gerar token JWT | Fora do SQL | Sim | Nao altera banco |

## 17. Rollback

Rollback SQL:

- se `criar_conta_saas` falhar antes do `db.commit()`, as entidades SQL criadas pela mesma sessao tendem a ser revertidas quando a sessao/transacao for encerrada/rollbackada pelo framework;
- nao ha bloco `try/except` com rollback explicito dentro de `criar_conta_saas`.

Rollback fora do SQL:

- diretorios de storage nao possuem compensacao;
- codigo de e-mail ja criado em `/signup/request-code` permanece;
- se a conta for criada e a marcacao `record.used=True` falhar depois, pode haver conta criada com codigo ainda nao marcado como usado.

Testes de `tenant_provisioning` validam rollback para o script de tenant inicial, mas esse script e outro fluxo, nao o signup publico.

## 18. Idempotencia

O signup publico nao possui chave idempotente.

Protecoes atuais:

- `Usuario.email` unico;
- `Clinica.email` unico;
- `/signup/request-code` bloqueia e-mail ja cadastrado;
- `/signup/confirm` verifica se `Usuario.email` ja existe antes de criar;
- varios helpers internos usam `garantir_*` e chaves naturais por `clinica_id`, `source_id` ou nome.

Riscos:

- duplo clique em `Confirmar cadastro` pode disparar duas chamadas concorrentes;
- sem lock por e-mail ou chave idempotente;
- a segunda chamada deve tender a falhar por unicidade/checagem de e-mail, mas nao ha garantia transacional elegante contra corrida;
- storage pode ficar residual se uma tentativa falhar apos criar diretorios.

## 19. Seguranca

Endpoint atual:

- publico;
- nao exige token;
- usa verificacao de codigo por e-mail;
- nao usa captcha;
- nao possui rate limit observado no codigo auditado;
- nao possui aceite de termos observado;
- nao possui CSRF especifico; por ser API JSON/publica sem cookie de sessao, o risco principal e abuso/automacao, nao CSRF classico;
- valida e-mail por regex e bloqueia alguns dominios temporarios;
- valida senha minima;
- nao permite definir `is_master`;
- nao permite definir `is_superadmin`;
- nao permite escolher plano;
- nao permite escolher dias de trial;
- nao registra auditoria administrativa.

Risco de enumeracao:

- `/signup/request-code` retorna `E-mail ja cadastrado.` para e-mail existente em `usuarios` ou `clinicas`.

Senha:

- nao e retornada;
- nao deve aparecer em logs pelo caminho auditado;
- e recebida em payload HTTPS/API e armazenada com hash.

## 20. Riscos

- Endpoint publico nao deve ser reutilizado diretamente pelo ADM React.
- Signup publico retorna token e faz login automatico, comportamento inadequado para operador MASTER criando conta de terceiros.
- Falta auditoria administrativa no signup atual.
- Falta assinatura/plataforma criada diretamente no provisionamento atual.
- Nao ha rate limit/captcha observados para endpoint publico.
- Nao ha idempotency key nem lock por e-mail.
- Storage nao participa do rollback SQL.
- `criar_conta_saas` tem `commit()` interno, o que dificulta composicao por endpoint administrativo que queira auditar e sincronizar assinatura em uma unica transacao externa.
- O endpoint atual usa `nome` simultaneamente como nome da clinica e nome do responsavel/admin inicial; o futuro modal pode precisar separar esses conceitos.

## 21. Classificacao final

Classificacao do fluxo atual: D. Signup publico completo.

Justificativa:

- e publico;
- solicita codigo por e-mail;
- cria conta completa;
- provisiona clinica, usuario inicial e recursos operacionais;
- retorna token;
- faz login automatico no frontend legado.

Em termos de efeito de dominio, ele tambem e um provisionamento completo de conta. A classificacao final escolhida e D porque inclui a camada publica de cadastro, codigo por e-mail e login automatico.

## 22. Confirmacao do rotulo Nova conta

O rotulo `Nova conta` esta tecnicamente correto.

O fluxo auditado nao e apenas "Nova clinica": ele cria uma conta operacional completa, com clinica, admin inicial, unidade, prestadores, usuarios internos/sistemicos, perfis, seeds, trial e storage.

Nao recomendar `Nova clinica` como rotulo final.

## 23. Arquitetura administrativa recomendada

Opcao recomendada: B. React ADM -> novo endpoint administrativo protegido -> servico de provisionamento existente.

Nao recomendar:

- React ADM chamando endpoint publico atual;
- duplicar `criar_conta_saas` em outro service;
- usar `POST /superadmin/usuarios`, pois ele cria usuario em clinica existente, nao conta completa.

Endpoint futuro recomendado:

```text
POST /superadmin/clinicas/nova-conta
```

Autorizacao futura:

- exigir `get_current_user`;
- exigir `_require_superadmin`;
- preferencialmente exigir MASTER/owner se o produto quiser restringir criacao de conta ao dono da plataforma;
- registrar auditoria `clinica_create` ou `nova_conta_create`.

Servico reutilizado:

- extrair ou adaptar `criar_conta_saas` para permitir uso sem login automatico e, idealmente, sem `commit()` interno;
- manter todos os helpers de seed/provisionamento compartilhados.

Resposta futura recomendada:

```json
{
  "detail": "Conta criada com sucesso.",
  "clinica_id": 123,
  "clinica_nome": "Clinica Exemplo",
  "email_admin": "admin@example.com",
  "plano": "DEMO",
  "trial_ate": "ISO-8601"
}
```

Nao retornar token.

Nao fazer login automatico.

Nao misturar a sessao do operador com a conta criada.

## 24. Modal futuro

### A. Dados da conta

| Campo | Tipo | Obrigatorio | Validacao | Origem | Destino backend | Default | Risco |
|---|---|---:|---|---|---|---|---|
| Nome da clinica | texto | Sim | nao vazio | Operador ADM | `Clinica.nome` | nenhum | Hoje `nome` tambem vira nome do admin; separar exige ajuste de contrato |
| E-mail da conta/admin | email | Sim | formato e unicidade global | Operador ADM | `Clinica.email` e `Usuario.email` no fluxo atual | nenhum | Se separar e-mails, requer adaptar servico |
| Documento/CNPJ | texto | Nao no fluxo atual | nao existe no signup atual | Nao expor na primeira versao sem contrato | `Clinica.cnpj` se decidido | nulo | Inventar campo pode criar falsa validacao |
| Cidade | texto | Nao no fluxo atual | nao existe no signup atual | Nao expor sem contrato | unidade/prestador se decidido | nulo | Pode sugerir cadastro fiscal inexistente |

### B. Responsavel inicial

| Campo | Tipo | Obrigatorio | Validacao | Origem | Destino backend | Default | Risco |
|---|---|---:|---|---|---|---|---|
| Nome do responsavel | texto | Sim | nao vazio | Operador ADM | `Usuario.nome`, `PrestadorOdonto.nome` ADM | hoje igual a `nome` | Separar de clinica exige adaptar `criar_conta_saas` |
| E-mail do responsavel | email | Sim | unico global | Operador ADM | `Usuario.email` e hoje tambem `Clinica.email` | nenhum | Fluxo atual usa o mesmo e-mail para ambos |

### C. Acesso

| Campo | Tipo | Obrigatorio | Validacao | Origem | Destino backend | Default | Risco |
|---|---|---:|---|---|---|---|---|
| Senha | password | Sim se nao houver convite | minimo 6 | Operador ADM | `Usuario.senha_hash` via hash | nenhum | Exibir/copiar senha exige cuidado |
| Confirmar senha | password | Recomendado | igual a senha | UI React | nao persistir | nenhum | Signup atual nao tem confirmacao; ADM deve ter para reduzir erro |
| Enviar e-mail | boolean | Nao no fluxo atual | pendente de contrato | Produto | servico de e-mail futuro | falso | Nao inventar convite |

### D. Plano e trial

| Campo | Tipo | Obrigatorio | Validacao | Origem | Destino backend | Default | Risco |
|---|---|---:|---|---|---|---|---|
| Plano | select | Nao no signup atual | `DEMO`, `MENSAL`, `ANUAL`, `SUPERADMIN` se aprovado | Operador ADM | `Clinica.tipo_conta` | `DEMO 7 dias` | Escolha de plano deve reutilizar normalizador |
| Dias de trial | numero | Nao no signup atual | minimo 1 se exposto | Operador ADM | `Clinica.trial_ate` | 7 | Expor dias sem regra pode gerar abuso/erro |
| Ativar conta | boolean | Nao no signup atual | boolean | Operador ADM | `Clinica.ativo` | `True` | Suspensa no nascimento exige contrato |
| Limite de usuarios | numero | Nao existe no fluxo atual | nao expor | Nao aplicavel | nenhum campo confirmado | nenhum | Campo sem backend seria falso contrato |

### E. Configuracao inicial

| Campo | Tipo | Obrigatorio | Validacao | Origem | Destino backend | Default | Risco |
|---|---|---:|---|---|---|---|---|
| Unidade principal | texto | Nao no signup atual | nao vazio se exposto | Operador ADM | `UnidadeAtendimento.nome` | `Principal` | Alterar nome exige adaptar helper |
| Tabelas/seeds | fixo | Sim | nao editavel | Backend | varios helpers | defaults Brana | Nao expor ao operador |

### F. Confirmacao

O modal deve exibir resumo antes de criar:

- nome da conta;
- responsavel inicial;
- e-mail;
- plano/trial default;
- aviso de que criara conta completa;
- aviso de que nao fara login automatico;
- aviso se senha sera definida manualmente.

Campos proibidos:

- `is_master`
- `is_superadmin`
- `clinica_id`
- `source_id`
- `permissoes_json`
- `senha_hash`
- paths internos
- codigo de ativacao publico

## 25. Fluxo pos-criacao

Recomendacao futura:

- fechar modal ou mostrar resumo de sucesso;
- exibir ID da clinica;
- exibir nome da clinica;
- exibir e-mail criado;
- nao exibir hash;
- se senha foi digitada pelo operador, nao repetir em tela apos sucesso por padrao;
- nao retornar token;
- nao fazer login automatico;
- recarregar tabela de clinicas;
- selecionar/destacar a nova linha;
- preservar filtros quando possivel, ou avisar se filtro ocultar a nova conta;
- atualizar rodape/status;
- registrar auditoria administrativa;
- em falha, mostrar erro e informar se houve rollback;
- permitir "Criar outra" somente apos sucesso claro e com duplo clique bloqueado.

## 26. Relacao com ADM Usuarios

- `Novo usuario` deve sair de `ADM -> Clinicas` em etapa futura, mas nao nesta auditoria.
- O contrato de `Novo usuario` deve ser preservado.
- `Novo usuario` cria administrador dentro de uma clinica existente.
- `Nova conta` cria conta completa do zero.
- Os fluxos nao devem compartilhar botao nem modal.
- `POST /superadmin/usuarios` nao deve ser reutilizado para provisionar conta.
- A futura tela `ADM -> Usuarios` devera selecionar ou receber clinica alvo conforme contrato.

## 27. Pendencias

- Definir se endpoint administrativo deve exigir apenas Super Admin ou exclusivamente MASTER/owner.
- Refatorar `criar_conta_saas` para permitir transacao controlada pelo endpoint ADM, se necessario.
- Decidir se `PlataformaAssinatura` deve nascer no provisionamento administrativo.
- Decidir se o ADM podera escolher plano/dias ou se o backend sempre aplicara `DEMO 7 dias`.
- Definir se e-mail de convite sera implementado ou se senha sera sempre manual.
- Adicionar idempotencia/lock por e-mail para endpoint administrativo.
- Definir compensacao de storage em falha.
- Criar testes antes da implementacao: sucesso, sem auth, sem permissao, e-mail duplicado, rollback, duplo clique/idempotencia.

## 28. Ausencia de implementacao

Nao foi implementado:

- botao;
- modal;
- endpoint;
- hook;
- service React;
- migration;
- seed;
- teste;
- fixture;
- alteracao de backend;
- alteracao de frontend legado;
- alteracao de frontend React.

## 29. Sem commit

Nenhum commit foi criado nesta rodada.

## 30. Sem push

Nenhum push foi executado nesta rodada.
