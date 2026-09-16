# Auditoria - Primeiro acesso no frontend React

## 1. Contexto

Esta auditoria mapeia o fluxo atual de primeiro acesso de uma conta recem-criada e prepara a migracao para o frontend React.

Escopo desta rodada:

- somente leitura de codigo funcional;
- criacao deste documento de auditoria;
- nenhuma implementacao;
- nenhum teste novo;
- nenhum endpoint novo;
- nenhum commit;
- nenhum push.

Dependencia direta: a futura acao `ADM -> Clinicas -> Nova conta` so deve ser publicada quando o administrador inicial da nova clinica conseguir concluir o primeiro acesso no React.

## 2. Dependencia de Nova conta

O provisionamento atual cria a clinica completa e dois usuarios:

| Usuario | Codigo | is_system_user | is_admin | setup_completed | Interativo |
|---|---:|---:|---:|---:|---:|
| Conta base `Clinica` | 255 | True | False | True | Nao |
| Administrador inicial | 1 | False | True | False | Sim |

Fluxo futuro esperado:

```text
Owner
-> ADM -> Clinicas -> Nova conta
-> provisionamento completo
-> tabela atualizada
-> Owner permanece na sessao atual

Administrador criado
-> Login React
-> autenticacao
-> setup_completed=False
-> primeiro acesso React
-> POST /auth/setup/complete
-> refetch de /me
-> setup_completed=True
-> entrada no sistema
```

Conclusao: `Nova conta` pode ser implementada tecnicamente antes, mas nao deve ser publicada para uso operacional sem primeiro acesso React funcional, salvo feature flag fechada e caminho legado explicitamente aceito.

## 3. Documentacao existente

| Documento | Regra encontrada | Estado | Divergencia com codigo |
|---|---|---|---|
| `docs/04_funcionalidades.md` | Usuario sem `setup_completed` acessa apenas caminhos permitidos; token invalido retorna 401. | Atual em alto nivel. | Nao descreve a tela React ausente. |
| `docs/07_fluxos.md` | `setup_completed` falso fora da lista permitida retorna 403 `setup_required`. | Atual. | Nao detalha campos do primeiro acesso. |
| `docs/11_roadmap_desenvolvimento.md` | Frontend abre setup quando `/me` retorna `setup_completed === false`; backend bloqueia outras rotas; setup grava `senha_interna_hash`, `setup_completed`, `forcar_troca_senha` e `online`. | Atual, mas historico/roadmap nao deve ser tratado como fonte operacional unica. | O codigo atual confirma a regra. |
| `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md` | Diagnostico antigo apontava conflito: setup gravava em `senha_hash`. | Historico. | Diverge do codigo atual, que grava em `senha_interna_hash`. |
| `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md` | Corrigiu separacao entre senha de login e senha interna. | Atual quanto a decisao. | Compatibilidade deve ser conferida no codigo atual. |
| `docs/primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md` | Registra que a separacao da senha interna permaneceu correta. | Atual em alto nivel. | Nao cobre frontend React. |
| `docs/pre_contrato_funcional_usuarios_novas_contas.md` | Primeiro acesso deve exibir tela especial e configurar senha administrativa/protegida. | Contratual. | Campos reais atuais sao apenas e-mail readonly, senha interna e confirmacao. |
| `docs/auditoria_provisionamento_nova_conta_adm_clinicas.md` | Usuario inicial nasce com `setup_completed=False`; sistemico nasce com `setup_completed=True`. | Alinhado. | Nao resolve a lacuna React. |
| `docs/contrato_nova_conta_adm_clinicas.md` | Documenta que React ainda precisa suportar primeiro acesso antes da publicacao de Nova conta. | Alinhado. | Esta auditoria detalha o fluxo. |

## 4. Login com setup pendente

Arquivo: `backend/routes/auth_routes.py`.

Rota: `POST /login`.

Comportamento real:

- normaliza e-mail;
- busca `Usuario` por e-mail;
- bloqueia usuario sistemico;
- bloqueia usuario inativo, exceto owner;
- valida senha contra `usuario.senha_hash`;
- atualiza `ultimo_login_em`;
- marca `online=True`;
- gera token com `user_id`, `clinica_id` e `is_admin`;
- nao inclui `setup_completed` no token.

Resposta:

```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

Conclusoes:

- usuario com `setup_completed=False` consegue autenticar;
- backend retorna token normalmente;
- token nao contem informacao de setup;
- o campo de setup pendente vem de `/me`, nao do token.

## 5. `/me` e campo de setup

Arquivo: `backend/routes/auth_routes.py`.

Rota: `GET /me`.

Implementacao:

```python
@router.get("/me")
def me(current_user = Depends(get_current_user)):
    is_super = is_platform_superadmin_user(current_user)
    return build_user_context(current_user, is_superadmin=is_super)
```

Arquivo: `backend/security/user_context.py`.

Campo retornado:

```python
"setup_completed": bool(getattr(usuario, "setup_completed", False))
```

Conclusoes:

- `/me` retorna `setup_completed`;
- `setup_completed=False` e a condicao real do primeiro acesso;
- React recebe esse campo se `/me` for concluido com sucesso.

## 6. Bloqueio backend enquanto setup esta pendente

Arquivo: `backend/security/dependencies.py`.

Lista permitida:

```python
SETUP_ALLOWED_PATHS = {
    "/me",
    "/logout",
    "/auth/renew",
    "/auth/setup/complete",
}
```

Regra:

```python
setup_completed = bool(getattr(usuario, "setup_completed", False))
if not setup_completed:
    path = (request.url.path or "").strip()
    if path not in SETUP_ALLOWED_PATHS:
        raise HTTPException(status_code=403, detail="setup_required")
```

Conclusoes:

- o bloqueio principal e backend;
- legado tambem bloqueia visualmente o shell ao detectar `setup_completed=False`;
- usuario pendente nao deve conseguir acessar modulos operacionais;
- `/me`, `/logout`, `/auth/renew` e `/auth/setup/complete` permanecem liberados.

## 7. Fluxo legado de primeiro acesso

Arquivos auditados:

- `frontend/app.js`;
- `frontend/index.html`.

Deteccao:

```javascript
if(data.setup_completed===false){
  stopSessionHeartbeat();
  abrirTelaSetup(data);
  menuApplyPermissions();
  return;
}
```

Funcao que abre a tela:

```javascript
function abrirTelaSetup(user){
  if(setupEmailEl)setupEmailEl.value=String(user?.email||"");
  if(setupSenhaEl)setupSenhaEl.value="";
  if(setupConfirmaEl)setupConfirmaEl.value="";
  loginWrap.classList.remove("hidden");
  shell.classList.add("hidden");
  showPanel(panelSetup||panelLogin);
  setLoginStatus("Primeiro acesso: defina a senha interna para continuar.",false)
}
```

Tela HTML:

- `section#panel-setup`;
- texto de boas-vindas;
- e-mail readonly;
- senha interna;
- confirmacao de senha;
- botao `Concluir primeiro acesso`;
- botao `Sair`.

Campos exibidos:

| Campo | Aparece no legado? | Obrigatorio? | Entidade destino | Pode ser automatico? |
|---|---:|---:|---|---:|
| nome da clinica | Nao | Nao | `clinicas` | Sim, provisionamento |
| nome do administrador | Nao | Nao | `usuarios` / `prestador_odonto` | Sim, provisionamento |
| telefone | Nao | Nao | Nao alterado | Sim |
| CRO | Nao | Nao | Nao alterado | Sim |
| CPF | Nao | Nao | Nao alterado | Sim |
| especialidade | Nao | Nao | Nao alterado | Sim |
| unidade | Nao | Nao | Nao alterado | Sim, unidade Principal / 0001 |
| endereco | Nao | Nao | Nao alterado | Sim |
| cidade | Nao | Nao | Nao alterado | Sim |
| UF | Nao | Nao | Nao alterado | Sim |
| CEP | Nao | Nao | Nao alterado | Sim |
| nome fantasia | Nao | Nao | Nao alterado | Sim |
| razao social | Nao | Nao | Nao alterado | Sim |
| documento | Nao | Nao | Nao alterado | Sim |
| e-mail | Sim, readonly | Sim como contexto | `usuarios.email`, ja existente | Nao no setup |
| senha interna | Sim | Sim | `usuarios.senha_interna_hash` | Nao |
| confirmacao de senha | Sim | Sim | Validacao apenas | Nao |
| preferencias | Nao | Nao | Nao alterado | Sim |
| horario | Nao | Nao | Nao alterado | Sim |
| dados do prestador | Nao | Nao | Nao alterado | Sim, provisionamento |

Validacoes no legado:

- senha e confirmacao devem estar preenchidas;
- senha deve ter no minimo 6 digitos;
- senha e confirmacao devem ser iguais.

Payload:

```json
{
  "senha": "...",
  "confirma_senha": "..."
}
```

Sucesso:

- mostra mensagem;
- chama `carregarSessao()`;
- se `/me` vier com `setup_completed=True`, esconde login e mostra shell.

Erro:

- exibe `data.detail` ou mensagem generica.

Cancelamento:

- nao ha botao de fechar setup;
- ha botao `Sair`;
- recarregar pagina ou logout/login reabre o setup enquanto `setup_completed=False`.

## 8. Endpoint de conclusao

Rota: `POST /auth/setup/complete`.

Arquivo: `backend/routes/auth_routes.py`.

Autorizacao:

- exige `get_current_user`;
- portanto exige token valido;
- permitido mesmo com `setup_completed=False` por `SETUP_ALLOWED_PATHS`.

Schema de entrada:

```python
class SetupCompleteRequest(BaseModel):
    senha: str
    confirma_senha: str
```

Schema de saida:

```json
{
  "detail": "Configuracao inicial concluida com sucesso."
}
```

Campos obrigatorios:

- `senha`;
- `confirma_senha`.

Campos opcionais:

- nenhum.

Entidades alteradas:

- apenas `usuarios`.

Campos alterados:

- `senha_interna_hash = hash_password(senha)`;
- `forcar_troca_senha = False`;
- `setup_completed = True`;
- `online = True`.

Entidades nao alteradas:

- `clinicas`;
- `unidade_atendimento`;
- `prestador_odonto`;
- permissoes;
- seeds;
- storage;
- assinatura;
- plano.

Ordem:

1. valida senha;
2. valida confirmacao;
3. bloqueia usuario sistemico;
4. recarrega usuario por id;
5. grava hash da senha interna;
6. zera `forcar_troca_senha`;
7. marca `setup_completed=True`;
8. marca `online=True`;
9. `db.commit()`;
10. retorna `detail`.

Transacao e rollback:

- ha um unico `db.commit()` ao fim;
- nao ha `try/except` local;
- em erro antes do commit, a sessao nao persiste as mudancas;
- rollback explicito fica a cargo do ciclo de vida da sessao/dependencia.

Idempotencia:

- chamar duas vezes com senha valida troca a senha interna novamente e mantem `setup_completed=True`;
- nao ha bloqueio para usuario ja configurado;
- nao ha resposta 409 para setup duplicado.

Erros observados no codigo:

- 400: senha invalida ou confirmacao divergente;
- 401: token ausente/invalido em `get_current_user`;
- 403: usuario sistemico ou rota nao permitida em outro endpoint;
- 404: usuario nao encontrado apos token;
- 422: payload ausente/malformado pelo Pydantic;
- 500: falha inesperada de banco/infra;
- 409: nao usado.

## 9. Estado antes/depois

| Item | Antes do setup | Depois do setup |
|---|---|---|
| `setup_completed` | `False` no administrador inicial | `True` |
| Clinica | Ja criada, ativa, demo/trial conforme provisionamento | Sem alteracao |
| Administrador | Ja criado, ativo, senha de login ja definida, `senha_interna_hash` vazia/nula | `senha_interna_hash` definida, `online=True`, `forcar_troca_senha=False` |
| Unidade principal | Ja criada pelo provisionamento | Sem alteracao |
| Prestador | Ja criado/vinculado pelo provisionamento | Sem alteracao |
| Permissoes | Ja criadas/sanitizadas pelo provisionamento | Sem alteracao |
| Login | Permitido, gera token | Permitido normalmente |
| Acesso ao sistema | Rotas operacionais bloqueadas por `setup_required` | Rotas liberadas conforme permissoes |

Respostas objetivas:

- a conta ja esta funcional em estrutura antes do setup;
- o setup complementa a senha interna de protecao;
- modulos que exigem senha interna ou dependem de usuario configurado podem falhar sem setup;
- sem setup, o backend bloqueia modulos operacionais;
- campos de clinica, unidade e prestador podem permanecer como vieram do provisionamento;
- indispensaveis no setup atual: senha interna e confirmacao.

## 10. Estado atual do frontend React

Arquivos auditados:

- `frontend-react/src/features/auth/AuthProvider.jsx`;
- `frontend-react/src/features/auth/LoginPage.jsx`;
- `frontend-react/src/features/auth/authApi.js`;
- `frontend-react/src/features/auth/authBrowserSessionSync.js`;
- `frontend-react/src/features/auth/authProviderSession.js`;
- `frontend-react/src/app/App.jsx`;
- `frontend-react/tests/*auth*`;
- `frontend-react/tests/*admin*`.

Achados:

- existe login React;
- existe `getMe(token)`;
- existe `refreshSession`;
- existe `signOut`;
- existe renovacao de token por `POST /auth/renew`;
- existe sincronizacao multi-abas por storage/focus/visibility;
- `AuthProvider` armazena o objeto `me` completo em `user`;
- portanto React recebe `setup_completed` quando `/me` retorna sucesso;
- nao ha pagina de primeiro acesso;
- nao ha rota dedicada de setup;
- nao ha service para `POST /auth/setup/complete`;
- nao ha hook de primeiro acesso;
- nao ha guard global para `user.setup_completed === false`;
- nao ha teste de primeiro acesso React;
- `LoginPage` redireciona para `/app` apos `signIn`;
- `AppContent` renderiza shell quando `isAuthenticated`;
- nao ha tratamento especial para usuario autenticado com setup pendente;
- se usuario pendente tentar navegar para modulo operacional, backend retorna `403 setup_required`;
- o React tende a tratar 403 de `/me` como sessao invalida quando ocorre em sincronizacao, mas `/me` em si e permitido para usuario pendente.

Risco atual:

- o usuario pendente pode entrar no shell React porque `isAuthenticated` fica verdadeiro apos `/me`;
- ao acionar APIs operacionais, recebera `403 setup_required`;
- nao ha caminho visual para concluir setup no React;
- pode haver experiencia quebrada ou loop entre login/app se alguma validacao futura tratar `setup_required` como erro fatal sem rota de setup.

## 11. Lacunas

Lacunas para migrar primeiro acesso ao React:

- rota dedicada;
- guard global;
- service de setup;
- hook de submit;
- pagina/tela com campos reais;
- tratamento de `setup_required`;
- bloqueio para nao renderizar shell antes da conclusao;
- logout disponivel durante setup;
- refetch de `/me` apos sucesso;
- testes backend de contrato atual;
- testes frontend de redirecionamento e bloqueio;
- runtime com conta descartavel.

## 12. Arquitetura recomendada

Opcao recomendada: A. Pagina dedicada de primeiro acesso.

Rota recomendada:

```text
/app/primeiro-acesso
```

Justificativa:

- evita renderizar shell completo antes da conclusao;
- separa onboarding de login;
- preserva logout;
- facilita testes;
- evita concentrar fluxo em `App.jsx`;
- combina com o bloqueio backend.

## 13. Guard recomendado

Regra global:

```text
nao autenticado -> /app/login
autenticado + setup_completed=False -> /app/primeiro-acesso
autenticado + setup_completed=True -> /app
```

Detalhes:

- `/app/primeiro-acesso` deve ser acessivel apenas para usuario autenticado pendente;
- usuario configurado que tente abrir `/app/primeiro-acesso` deve voltar para `/app`;
- usuario pendente que tente abrir rota interna manualmente deve ser redirecionado para `/app/primeiro-acesso`;
- shell nao deve piscar antes do redirect;
- o guard deve rodar antes da renderizacao do shell principal.

## 14. Service recomendado

Modulo futuro sugerido:

```text
frontend-react/src/features/firstAccess/firstAccessApi.js
```

Funcao:

```text
completeFirstAccess({ senha, confirmaSenha }, token)
-> POST /auth/setup/complete
```

Erros a tratar:

- 400: senha invalida/confirmacao divergente;
- 401: sessao expirada;
- 403: conta sistemica ou bloqueio inesperado;
- 422: payload invalido;
- 500: falha inesperada.

## 15. Hook recomendado

Modulo futuro sugerido:

```text
frontend-react/src/features/firstAccess/useFirstAccessSetup.js
```

Responsabilidades:

- estado `loading`;
- estado `error`;
- bloqueio de submit duplicado;
- chamada ao service;
- `refreshSession()` apos sucesso;
- redirecionamento para `/app`;
- manter `signOut()` disponivel;
- nao renovar token em duplicidade manualmente se `AuthProvider` ja cobre isso.

## 16. Pagina recomendada

Modulo futuro sugerido:

```text
frontend-react/src/features/firstAccess/FirstAccessPage.jsx
```

Campos reais atuais:

- e-mail readonly, vindo de `user.email`;
- senha interna;
- confirmacao de senha.

Validacoes:

- senha obrigatoria;
- minimo de 6 caracteres;
- confirmacao obrigatoria;
- senha e confirmacao iguais.

Comportamento:

- pagina dedicada;
- sem shell;
- com botao `Concluir primeiro acesso`;
- com botao `Sair`;
- sucesso chama `refreshSession`;
- apos `/me` retornar `setup_completed=True`, redireciona para `/app`.

## 17. Atualizacao da sessao

Depois do sucesso:

1. chamar `refreshSession()`;
2. atualizar `user.setup_completed`;
3. redirecionar para `/app`;
4. nao exigir novo login;
5. manter token atual, pois o backend nao troca token no setup.

## 18. Logout

Durante setup:

- `signOut()` deve continuar disponivel;
- deve chamar `POST /logout`;
- deve limpar token local;
- deve redirecionar para login;
- deve propagar logout para outras abas via mecanismo atual.

## 19. Multiplas abas

Riscos:

- uma aba conclui setup e outra continua parada na tela de primeiro acesso;
- storage/focus/visibility pode renovar sessao e receber `setup_completed=True`;
- Broadcast/storage deve evitar limpar sessao indevidamente;
- `setup_required` nao deve ser tratado como logout automatico em APIs operacionais.

Recomendacao:

- apos foco/visibility, `refreshSession()` deve atualizar `user`;
- se `user.setup_completed=True`, sair da pagina de setup;
- se `user.setup_completed=False`, manter pagina de setup;
- nao usar BroadcastChannel novo sem necessidade se storage sync atual ja for suficiente;
- se BroadcastChannel for introduzido futuramente, deve deduplicar eventos de logout/refresh.

## 20. Relacao com Nova conta

Respostas:

1. A criacao de `Nova conta` depende funcionalmente da migracao do primeiro acesso para React para ser publicavel.
2. Pode implementar `Nova conta` antes em branch/feature flag, mas nao deve liberar uso final.
3. Nao deve publicar `Nova conta` antes de o administrador inicial conseguir concluir primeiro acesso no React.
4. Deve existir feature flag ou gating operacional se a implementacao de `Nova conta` chegar antes do setup React.
5. Ordem correta:
   - implementar primeiro acesso React;
   - testar login pendente e setup;
   - validar runtime com conta descartavel;
   - implementar `Nova conta`;
   - testar fluxo completo Owner cria conta e administrador inicial entra.

## 21. Testes backend futuros

Contratos de teste recomendados:

- login de usuario com `setup_completed=False` retorna token;
- `/me` retorna `setup_completed=False`;
- rota operacional retorna 403 `setup_required`;
- `/logout` permitido com setup pendente;
- `/auth/renew` permitido com setup pendente;
- setup valido grava `senha_interna_hash` e `setup_completed=True`;
- senha curta retorna 400;
- confirmacao divergente retorna 400;
- usuario sistemico retorna 403;
- usuario ja configurado chamado novamente permanece consistente;
- token de outro usuario nao altera outra clinica;
- falha de banco nao deixa estado parcial;
- auditoria deve ser avaliada se produto exigir trilha para setup.

## 22. Testes frontend futuros

Contratos de teste recomendados:

- login com setup pendente redireciona para `/app/primeiro-acesso`;
- shell nao aparece antes do setup;
- tela mostra e-mail readonly, senha e confirmacao;
- valida senha obrigatoria;
- valida minimo de 6 caracteres;
- valida confirmacao igual;
- submit unico evita duplo POST;
- sucesso chama service e `refreshSession`;
- erro mostra mensagem;
- logout funciona durante setup;
- refresh da pagina reabre setup se pendente;
- usuario configurado nao acessa setup;
- usuario pendente nao acessa modulos por URL manual;
- renovacao de auth preserva sessao;
- multi-abas sincroniza conclusao/logout.

## 23. Runtime futuro

Validacao manual recomendada:

1. criar conta descartavel pelo fluxo existente ou pelo futuro `Nova conta`;
2. autenticar administrador inicial no React;
3. confirmar redirecionamento para primeiro acesso;
4. confirmar que shell nao aparece;
5. concluir setup;
6. confirmar `POST /auth/setup/complete`;
7. confirmar refetch de `/me`;
8. confirmar entrada no sistema;
9. fazer logout/login;
10. confirmar que setup nao reaparece.

## 24. Riscos

- publicar `Nova conta` sem setup React prende o administrador inicial em uma experiencia incompleta.
- tratar `setup_required` como sessao invalida pode causar logout indevido.
- renderizar shell antes do guard pode expor UI que nao funciona.
- duplicar logica de token fora do `AuthProvider` pode quebrar renovacao e multi-abas.
- mudar endpoint/backend junto com frontend aumenta risco desnecessario; backend atual ja tem contrato suficiente para a primeira migracao.

## 25. Ausencia de implementacao

Nesta rodada:

- nenhum frontend React foi alterado;
- nenhum frontend legado foi alterado;
- nenhum backend foi alterado;
- nenhum teste foi criado ou alterado;
- nenhuma migration foi criada;
- nenhum roadmap foi marcado como concluido;
- apenas este documento foi criado.

## 26. Implementacao posterior no React

A etapa posterior implementou o primeiro acesso no frontend React em feature modular `frontend-react/src/features/firstAccess/`.

Resumo:

- rota dedicada `/app/primeiro-acesso`;
- guard global em `frontend-react/src/app/App.jsx`;
- pagina sem shell;
- e-mail readonly;
- senha interna e confirmacao;
- service `POST /auth/setup/complete`;
- payload `{ senha, confirma_senha }`;
- `refreshSession()` apos sucesso;
- logout com `signOut()`;
- backend produtivo preservado.

`ADM -> Clinicas -> Nova conta` permanece pendente de implementacao propria.

## 27. Correcao posterior da orientacao sobre senha interna

Em 2026-07-21, a pagina React de primeiro acesso foi alinhada ao painel legado `section#panel-setup` quanto ao texto explicativo da senha interna.

A orientacao final explicita que:

- a senha criada no primeiro acesso nao e a senha de login;
- a senha de login continua sendo usada para acessar a conta;
- a senha interna protege acoes importantes no sistema;
- ela pode ser solicitada em operacoes sensiveis;
- ela pode ser alterada posteriormente nas configuracoes;
- a etapa ocorre apenas no primeiro acesso.

Labels finais:

- `Senha interna`;
- `Confirmar senha interna`.

Botao principal final:

- `Concluir primeiro acesso`.

Detalhamento: `docs/correcao_orientacao_senha_interna_primeiro_acesso_react.md`.
