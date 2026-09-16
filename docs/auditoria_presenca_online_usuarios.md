# Auditoria tecnica - ADM Usuarios - Presenca online

Data: 2026-07-22

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

HEAD: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`

Remote: `https://github.com/institutobrana/branacloud.git`

## 1. Escopo

Esta auditoria avalia a futura coluna `Online` em `ADM -> Usuarios`.

Nao houve implementacao funcional nesta rodada:

- nenhum frontend React alterado;
- nenhum backend alterado;
- nenhum model alterado;
- nenhuma migration criada;
- nenhum endpoint alterado;
- nenhuma coluna React criada;
- nenhum teste funcional criado.

## 2. Contexto atual

`ADM -> Usuarios` ja possui rota React `/app/adm/usuarios`, shell ADM em L, tabela real, `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Buscar usuario`, selecao unica, filtros, ordenacao, controle de colunas, rodape e usuario protegido identificado.

A melhoria futura desejada e uma coluna `Online`, posicionada depois de `Status`, separando:

- `Status`: usuario ativo/inativo;
- `Online`: atividade autenticada recente.

`Online` nao deve significar apenas token valido e nao deve reutilizar alteracao cadastral.

## 3. Documentos lidos

- `docs/auditoria_painel_usuarios_adm_react.md`
- `docs/implementacao_adm_usuarios_fase_1_leitura.md`
- `docs/implementacao_adm_usuarios_ver_detalhes.md`
- `docs/contrato_toolbar_adm_usuarios_react.md`
- `docs/auditoria_primeiro_acesso_frontend_react.md`
- `docs/implementacao_primeiro_acesso_frontend_react.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_sessao_autenticacao_renovacao_frontend_react.md`
- `docs/validacao_runtime_renovacao_sessao_frontend_react.md`

## 4. Arquivos auditados

Backend:

- `backend/routes/auth_routes.py`
- `backend/security/jwt_handler.py`
- `backend/security/dependencies.py`
- `backend/security/user_context.py`
- `backend/models/usuario.py`
- `backend/routes/superadmin_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/scripts/migrar_usuarios_ultimo_login_em.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`
- `backend/tests/test_auth_renew.py`

Frontend React:

- `frontend-react/src/features/auth/AuthProvider.jsx`
- `frontend-react/src/features/auth/authApi.js`
- `frontend-react/src/features/auth/authStorage.js`
- `frontend-react/src/features/auth/authRenewalController.js`
- `frontend-react/src/features/auth/authBrowserSessionSync.js`
- `frontend-react/src/features/auth/authProviderSession.js`
- `frontend-react/src/services/api.js`
- `frontend-react/src/features/admin/users/`

Frontend legado:

- `frontend/app.js`

## 5. Autenticacao atual

O token principal e JWT Bearer stateless.

Evidencias:

- `backend/security/jwt_handler.py` usa `jose.jwt.encode` com algoritmo `HS256`.
- Claims principais: `user_id`, `clinica_id`, `is_admin`, `exp`.
- O segredo vem obrigatoriamente de `JWT_SECRET_KEY`.
- `decode_token()` retorna `None` se o JWT for invalido ou expirado.
- Nao ha `jti`, `session_id`, blacklist, tabela de sessao ou refresh token persistido.

Respostas objetivas:

| Pergunta | Resposta |
|---|---|
| Token e JWT stateless? | Sim. |
| Token e persistido no banco? | Nao. |
| Existe `session_id`? | Nao localizado. |
| Existe `jti`? | Nao localizado. |
| Existe blacklist/revogacao? | Nao localizada. |
| Existe tabela de sessoes? | Nao localizada. |
| Existe expiracao? | Sim, `exp`, padrao 60 minutos. |
| Existe refresh token? | Nao. |
| Existe apenas access token renovavel? | Sim, `/auth/renew` emite novo access token. |
| Logout invalida backend? | Apenas marca `usuarios.online = False`; nao revoga JWT. |
| Fechar navegador e detectado? | Nao de forma confiavel. |
| Multiplos dispositivos sao distinguiveis? | Nao. |

## 6. Renew

`POST /auth/renew`:

- exige usuario autenticado via `get_current_user`;
- valida usuario, clinica ativa e usuario ativo;
- emite novo access token com TTL de 60 minutos;
- retorna `expires_in = 3600`;
- nao atualiza `ultimo_login_em`;
- nao atualiza `online`;
- nao registra `last_seen_at` porque o campo nao existe.

O teste `backend/tests/test_auth_renew.py` confirma `test_renew_does_not_update_last_login`.

Conclusao: `/auth/renew` pode ser um sinal futuro de presenca, mas hoje nao grava atividade e seu intervalo atual de 15 minutos no React e longo demais para uma janela de Online de 2 a 5 minutos.

## 7. Logout

`POST /logout`:

- carrega `current_user`;
- se `usuario.online` estiver `True`, grava `online = False`;
- nao limpa `ultimo_login_em`;
- nao revoga token;
- nao distingue aba/dispositivo.

Conclusao: logout explicito pode ajudar a derrubar presenca imediatamente em um modelo simples, mas nao pode ser a base principal porque fechamento abrupto, queda de rede e token stateless nao garantem chamada ao backend.

## 8. Frontend React de sessao

Arquivos auditados:

- `AuthProvider.jsx`
- `authRenewalController.js`
- `authBrowserSessionSync.js`
- `authStorage.js`

Achados:

- token salvo em `localStorage` como `brana_token`;
- renovacao automatica a cada `15 * 60 * 1000` ms;
- retries de 30s e 60s para falhas transitorias;
- `storage` sincroniza token/logout entre abas;
- `visibilitychange` e `focus` podem disparar `renewNow`;
- nao ha `BroadcastChannel`;
- nao ha lider eleito entre abas;
- nao ha heartbeat de presenca;
- nao ha `beforeunload` de presenca;
- nao ha endpoint de offline por fechamento.

Respostas objetivas:

| Pergunta | Resposta |
|---|---|
| Existe lider entre abas? | Nao. |
| Todas as abas renovam? | Cada AuthProvider autenticado pode iniciar seu controller. |
| Uma aba mantem a sessao das demais? | Indiretamente, por token compartilhado em `localStorage`; nao existe lider formal. |
| Fechamento da ultima aba e detectado? | Nao. |
| Ha evento que poderia registrar presenca? | Sim, renew/focus/visibility/request autenticada, mas nenhum grava presenca hoje. |
| Ha risco de multiplos heartbeats? | Sim, se heartbeat futuro for por aba sem coordenacao. |
| Ha risco de renovar sessao apenas para manter usuario online? | Sim, se presenca for acoplada indevidamente ao renew. |
| Heartbeat futuro deve ser separado do renew? | Sim, se usado. |

## 9. Frontend legado

O legado possui `SESSION_HEARTBEAT_MS = 60 * 1000` e chama `GET /me` a cada 60 segundos em `startSessionHeartbeat()`.

Esse heartbeat:

- revalida sessao;
- nao renova access token;
- nao grava timestamp de atividade no backend;
- e parado em setup, logout e bloqueios.

Conclusao: o legado mostra que um intervalo de 60s ja foi aceito operacionalmente para revalidacao, mas nao fornece presenca persistida no modelo atual.

## 10. Campos existentes

| Campo/Tabela | Entidade | Atualizado quando | Confiavel para presenca? |
|---|---|---|---:|
| `usuarios.online` | Usuario | Login, Google OAuth, setup, logout, inativacao local | Nao |
| `usuarios.ultimo_login_em` | Usuario | Login tradicional bem-sucedido | Nao |
| `preferencias_usuario_json.google_calendar_sync.updated_at` | Usuario prefs | OAuth Google Calendar | Nao |
| `criado_em` / `created_at` | Varias entidades | Criacao cadastral | Nao |
| `data_inclusao` / `data_alteracao` | Varias entidades | Auditoria/cadastro legado | Nao |
| `plataforma_auditoria.criado_em` | Auditoria plataforma | Acoes administrativas especificas | Nao |
| Tabela de sessoes | Inexistente | Nao aplicavel | Nao |
| `last_seen_at` | Inexistente | Nao aplicavel | Nao |

Respostas:

1. Existe ultimo login: sim, `usuarios.ultimo_login_em`.
2. Existe ultima atividade: nao.
3. Existe data de alteracao cadastral em algumas entidades: sim, mas nao em `usuarios` como presenca.
4. Timestamp que nao deve ser reutilizado: `updated_at`, `data_alteracao`, `criado_em`, `ultimo_login_em`.
5. `GET /superadmin/usuarios` retorna algo aproveitavel hoje: nao para presenca; nao retorna `online` nem `ultimo_login_em`.

## 11. Por que `online` atual nao serve

`usuarios.online` e booleano de estado manual/legado:

- fica `True` em login;
- fica `False` em logout ou inativacao;
- pode ficar preso em `True` se o usuario fechar navegador, perder internet ou travar a maquina;
- nao tem timestamp;
- nao permite diferenciar `Offline` de `Nunca acessou`;
- nao distingue abas ou dispositivos.

Conclusao: nao usar `online` como coluna futura sem redesenho.

## Atualizacao - Fase 1 backend

Em 2026-07-22 foi implementada a fundacao backend da presenca online:

- migration manual `backend/scripts/migrar_usuarios_last_seen_at.py`;
- coluna `usuarios.last_seen_at TIMESTAMP WITH TIME ZONE NULL`;
- sem default e sem backfill;
- model `Usuario.last_seen_at`;
- helper central `backend/services/user_presence_service.py`;
- throttle de 60 segundos;
- login, Google OAuth, setup complete e requests autenticadas registram atividade;
- requests autenticadas usam sessao curta propria para nao confirmar a transacao funcional;
- falhas de presenca sao fail-open com warning tecnico sem dados sensiveis.

Permanecem fora desta fase:

- retorno de `last_seen_at` e `is_online` em `GET /superadmin/usuarios`;
- coluna React `Online`;
- filtro, ordenacao e tooltip;
- heartbeat, Redis, WebSocket, SSE, sessoes persistidas e revogacao por dispositivo.

## Atualizacao - Fase 2 coluna Online

Em 2026-07-22 foi implementada a coluna `Online` em `ADM -> Usuarios`.

Achado sobre a coluna anterior:

- a coluna visual `Protecao` foi criada na Fase 1 de leitura do painel `ADM -> Usuarios`;
- arquivo da coluna: `frontend-react/src/features/admin/users/components/UsersTable.jsx`;
- chave: `protecao`;
- formatter: `formatAdminUserProtection(row)`;
- campos de origem: `isSystemUser` e `isOwnerAccount`, normalizados a partir de `is_system_user` e `is_owner_account`;
- valores visuais: `Sistema`, `Proprietario` e `Padrao`;
- a coluna nao era necessaria para nenhuma acao de escrita nesta fase.

Ajuste aplicado:

- `Protecao` saiu somente da tabela principal e do seletor de colunas;
- `Online` entrou imediatamente apos `Status`;
- `isSystemUser` e `isOwnerAccount` foram preservados;
- o subtitulo `Usuario de sistema` abaixo do nome foi preservado;
- o modal `Ver detalhes` continua exibindo protecao e badge `Protegido`;
- regras internas de protecao nao foram removidas.

Endpoint:

- `GET /superadmin/usuarios` agora retorna `last_seen_at` e `is_online`;
- janela: 3 minutos;
- usuario sistemico retorna `last_seen_at = null`, `is_online = false`;
- CSV e frontend fora da tabela de usuarios foram preservados.

## 12. Requisicoes autenticadas

Backend:

- `get_current_user` e o ponto central para rotas que usam dependencia de autenticacao;
- `require_module_access` e `require_admin_password_if_user_control_enabled` dependem dele;
- nao existe middleware global que grave atividade em toda request autenticada.

Frontend React:

- nao existe interceptor global de fetch;
- `frontend-react/src/services/api.js` apenas monta URL;
- cada service adiciona Authorization manualmente.

Conclusao: se a estrategia for registrar presenca por request autenticada, o menor ponto unico fica no backend, em helper/dependency, nao no frontend.

## 13. Estrategias avaliadas

| Estrategia | Precisao | Escritas no banco | Multi-abas | Complexidade | Recomendada |
|---|---:|---:|---:|---:|---:|
| A. Atualizar em toda request autenticada | Alta | Alta sem throttle; media com throttle | Boa, porque qualquer aba ativa sinaliza | Media | Parcial |
| B. Atualizar apenas em `/auth/renew` | Baixa para janela curta | Baixa | Razoavel, mas intervalo atual e 15 min | Baixa | Nao |
| C. Heartbeat dedicado | Alta | Controlavel | Exige lider/throttle para evitar duplicidade | Media/alta | Nao como primeira escolha |
| D. Requests autenticadas + heartbeat limitado | Alta | Controlavel com throttle | Boa se deduplicado | Alta | Futuro, nao primeira entrega |

Escolha: A com throttle backend como menor implementacao segura para a primeira versao, podendo evoluir para D se houver necessidade real de presenca mais fiel em telas ociosas.

## 14. Definicao de Online

Definicao futura:

`Online` significa atividade autenticada recente, nao garantia de que a pessoa esta olhando para a tela naquele segundo.

Janela recomendada: 3 minutos.

Comparacao:

| Janela | Vantagem | Limite |
|---|---|---|
| 1 minuto | Mais responsiva | Sensivel a abas em background e latencia. |
| 2 minutos | Boa responsividade | Pode oscilar se o usuario estiver lendo sem requests. |
| 3 minutos | Equilibrio entre responsividade e estabilidade | Ainda nao captura ocioso sem request. |
| 5 minutos | Menos oscilacao | Mais lento para refletir ausencia real. |

Justificativa: com throttle de 60s, janela de 3 minutos tolera um ciclo perdido e evita falsos offline por pequenas pausas. O renew atual de 15 minutos nao sustenta essa janela sozinho.

## 15. Campo ou tabela

| Opcao | Vantagens | Limitacoes | Migration | Complexidade |
|---|---|---|---:|---:|
| A. Campo `usuarios.last_seen_at` | Simples, suficiente para coluna global, sem N+1, baixo acoplamento | Nao distingue dispositivos/abas; logout remoto limitado | Sim | Baixa |
| B. Tabela `usuario_sessoes` | Dispositivos, revogacao, auditoria, logout remoto | Mais modelagem, limpeza, indices e UX | Sim | Alta |

Respostas:

1. Campo simples e suficiente para a coluna: sim.
2. Necessidade atual de multiplos dispositivos: nao comprovada.
3. Necessidade atual de logout remoto: nao contratada.
4. Necessidade atual de auditoria de sessao: nao contratada.
5. Criar tabela agora seria excesso: sim.
6. Opcao recomendada: `usuarios.last_seen_at`.

Decisao: B da lista final do pedido, criar `usuarios.last_seen_at`.

## 16. Frequencia de atualizacao

Recomendacao futura:

- gravar `last_seen_at` no login;
- gravar em requests autenticadas via ponto backend comum;
- aplicar throttle de 60 segundos por usuario;
- gravar apenas se `last_seen_at` estiver nulo ou anterior a `now - 60s`;
- usar UTC timezone-aware;
- nao depender apenas de `/auth/renew`;
- nao usar clique em `Atualizar` para registrar presenca de outros usuarios; ele apenas recarrega a lista ADM.

Multiplas abas:

- com campo unico, qualquer aba ativa pode atualizar o mesmo usuario;
- throttle backend reduz duplicidade;
- sem lider de abas na primeira versao.

Multiplos dispositivos:

- o campo unico representa a ultima atividade agregada do usuario;
- nao permite saber qual dispositivo esta ativo;
- suficiente para uma coluna simples.

## 17. Logout e fechamento

Respostas:

| Questao | Resposta |
|---|---|
| Logout explicito deve marcar offline imediatamente? | Sim, opcionalmente limpando `last_seen_at` ou mantendo timestamp e calculando offline por flag/evento. Para simplicidade, melhor nao depender disso e deixar timeout decidir; pode zerar `online` legado separadamente. |
| E possivel com JWT stateless? | Parcialmente; logout chamado pelo cliente grava banco, mas nao revoga tokens emitidos. |
| Fechamento do navegador e confiavel? | Nao. |
| `beforeunload` e confiavel? | Nao. |
| Deve existir endpoint offline? | Nao na primeira versao. |
| Melhor deixar expirar pela janela? | Sim. |
| Queda de internet | Usuario fica online ate a janela expirar. |
| Travamento | Usuario fica online ate a janela expirar. |
| Aba em background | Pode ficar offline se nao houver requests; aceitavel para "atividade recente". |

## 18. Endpoint ADM futuro

`GET /superadmin/usuarios` deve retornar futuramente:

```json
{
  "last_seen_at": "2026-07-22T17:30:00Z",
  "is_online": true
}
```

Regras:

- backend calcula `is_online` com base em `last_seen_at >= now_utc - 3 minutos`;
- backend retorna `last_seen_at` em UTC ISO 8601;
- frontend formata tooltip local em `DD/MM/AAAA HH:mm`;
- ordenacao usa `last_seen_at`;
- filtro usa estado derivado `online`, `offline`, `never`;
- sem N+1: campos ficam no proprio `Usuario`, ja carregado pela query de usuarios;
- usuario sistemico: retornar `last_seen_at = null`, `is_online = false`, e frontend exibe `Nao aplicavel`;
- Owner: tratado como usuario interativo comum se houver atividade.

## 19. Coluna React futura

Contrato visual:

- nome: `Online`;
- posicao: imediatamente apos `Status`;
- ordem futura principal: `ID | Nome | E-mail | Clinica | Plano | Perfil | Status | Online`;
- valores:
  - indicador verde + `Online`;
  - indicador cinza + `Offline`;
  - indicador neutro + `Nunca acessou`;
  - para usuario sistemico: `Nao aplicavel`.
- tooltip: `Ultima atividade: DD/MM/AAAA HH:mm`;
- filtro por presenca;
- ordenacao por `last_seen_at`;
- botao `Atualizar` apenas refaz `GET /superadmin/usuarios`;
- nenhuma atualizacao automatica obrigatoria no painel;
- nao misturar com `Status`.

Recomendacao para usuario sistemico: `Nao aplicavel`, porque conta sistemica nao deve ter sessao interativa.

## 20. Carga, AWS e banco

Impacto estimado:

- com throttle de 60s, limite pratico de 1 escrita/minuto por usuario ativo;
- em 100 usuarios simultaneos: ate 100 updates/minuto;
- em 1000 usuarios simultaneos: ate 1000 updates/minuto;
- PostgreSQL suporta esse volume em fase atual, mas updates frequentes em `usuarios` podem gerar bloat;
- indice em `last_seen_at` e util se houver filtro/ordenacao global por presenca;
- para somente listar por `id` e calcular status no payload, indice nao e obrigatorio inicialmente;
- multiplas tasks ECS nao causam incoerencia funcional se o throttle for no banco com comparacao por timestamp;
- Redis nao e necessario nesta fase;
- tabela separada reduziria bloat em `usuarios`, mas e excesso sem contrato de dispositivos/sessoes.

## 21. Privacidade

A coluna deve exibir somente:

- Online;
- Offline;
- Nunca acessou;
- Nao aplicavel para sistemico;
- ultima atividade no tooltip.

Nao exibir:

- IP;
- navegador;
- dispositivo;
- localizacao;
- token;
- session ID.

## 22. Testes futuros

Cobertura futura recomendada:

1. login atualiza `last_seen_at`;
2. request autenticada atualiza `last_seen_at`;
3. throttle evita escrita excessiva;
4. renew pode atualizar presenca, mas nao sozinho;
5. usuario sem atividade retorna `Nunca acessou`;
6. usuario dentro da janela retorna `Online`;
7. usuario fora da janela retorna `Offline`;
8. UTC/timezone;
9. multiplas abas;
10. multiplos dispositivos agregados;
11. usuario sistemico;
12. usuario inativo;
13. logout;
14. fechamento abrupto;
15. `GET /superadmin/usuarios`;
16. coluna `Online`;
17. filtro;
18. ordenacao;
19. botao `Atualizar`;
20. shell em L preservado.

## 23. Decisao final

Opcao escolhida: **B. Criar `usuarios.last_seen_at`**.

Janela: 3 minutos.

Frequencia maxima: 1 escrita por minuto por usuario.

Evento que grava presenca:

- login;
- requests autenticadas em ponto backend comum com throttle;
- `/auth/renew` tambem pode passar pelo mesmo helper, mas nao deve ser a unica fonte.

Logout:

- nao depender dele para presenca;
- opcionalmente manter `online` legado como compatibilidade;
- a coluna nova deve usar timeout por `last_seen_at`.

Fechamento abrupto:

- nao tentar resolver com `beforeunload`;
- offline por timeout.

Payload futuro:

- `last_seen_at`;
- `is_online`.

Migration necessaria:

- sim, adicionar `usuarios.last_seen_at TIMESTAMP WITH TIME ZONE NULL`;
- opcionalmente indice futuro em `usuarios(last_seen_at)`.

## 24. Ordem segura de implementacao futura

Fase 1:

- adicionar model/migration `usuarios.last_seen_at`;
- criar helper backend de registro de atividade com throttle;
- atualizar login e dependencia autenticada;
- testes backend.

Fase 2:

- retornar `last_seen_at` e `is_online` em `GET /superadmin/usuarios`;
- manter UTC;
- testes de endpoint.

Fase 3:

- normalizador React;
- coluna `Online` apos `Status`;
- filtro/ordenacao;
- tooltip;
- botao `Atualizar` apenas recarrega.

Fase 4:

- runtime com dois usuarios;
- logout;
- timeout;
- multiplas abas;
- tema claro/escuro.

## 25. Confirmacao de nao implementacao

Confirmado nesta auditoria:

- nenhuma migration criada;
- nenhum campo adicionado;
- nenhuma coluna React criada;
- nenhum endpoint alterado;
- nenhum teste funcional criado;
- nenhum arquivo funcional alterado;
- sem commit;
- sem push.
