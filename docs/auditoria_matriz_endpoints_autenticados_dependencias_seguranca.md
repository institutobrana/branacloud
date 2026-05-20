# Auditoria documental — Matriz de endpoints autenticados e dependências de segurança

## 1. Resumo executivo

Esta auditoria é exclusivamente documental e mapeia a matriz de endpoints autenticados e dependências de segurança do Brana Cloud. O foco é cruzar endpoints backend, arquivos de rota, dependências de segurança, uso de `current_user`, tenant/clínica, permissões, licença/trial/setup, superadmin, relação com `requestJson` e risco.

A leitura identificou 270 endpoints declarados em `backend/routes`. Considerando as rotas públicas de autenticação/cadastro/recuperação de senha e o webhook Mercado Pago, há aproximadamente 262 endpoints autenticados ou protegidos por token/middleware. Quase todos os endpoints autenticados passam pelo `TrialMiddleware`, que exige `Authorization: Bearer <token>`, valida usuário/clínica, define tenant por `clinica_id` e bloqueia conta suspensa/licença expirada fora de `/licenca`.

Conclusão principal: a segurança está distribuída em camadas. A primeira camada é global (`TrialMiddleware`). A segunda é o `get_current_user()` em cada rota. A terceira é o `require_module_access(...)` por router ou por endpoint. Em áreas críticas há ainda verificações próprias, como `_require_admin()`, `_require_superadmin()` e `require_admin_password_if_user_control_enabled(...)`. Qualquer refatoração futura deve preservar essas camadas sem tentar simplificá-las antes de nova revisão humana.

## 2. Confirmação de escopo e branch

- Diretório auditado: `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Branch confirmada: `modularizacao-segura-fase-1`.
- Commits de contexto confirmados:
- `b4aef99 Audita inventario mestre para refatoracao`.
- `3bd85f4 Audita usuarios permissoes login e sessao`.
- `1578be3 Audita contratos auth requestJson me security`.
- Escopo: somente leitura e criação deste documento.
- `git diff --stat` inicial: vazio.
- `git status --short` inicial: apenas untracked antigos/preexistentes em `docs/`, além de `?? git` e `?? modularizacao-segura-fase-1`; nada disso foi limpo, movido ou adicionado.

## 3. Blindagem textual/mojibake

Foi consultado `docs/regras_blindagem_correcoes_textuais_mojibake.md`. A regra foi respeitada. Textos/mojibake observados em arquivos funcionais foram apenas tratados como risco documental. Nada foi corrigido.

## 4. Arquivos analisados

Backend analisado:

- `backend/main.py`
- `backend/routes/*.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `backend/security/trial_middleware.py`
- `backend/security/tenant.py`
- `backend/security/tenant_context.py`
- `backend/security/superadmin.py`
- `backend/security/admin_password.py`
- `backend/security/jwt_handler.py`
- `backend/security/user_context.py`

Frontend analisado:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/*.js`
- `frontend/js/utils/*.js`

Documentos consultados:

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_contratos_auth_requestjson_me_security.md`

## 5. Critério usado para endpoint autenticado

Foi considerado endpoint autenticado/protegido quando:

- Não está na lista pública do `TrialMiddleware`.
- Não é rota estática (`/frontend`, `/desktop-assets`).
- Não é webhook público de licença (`/licenca/mercadopago/webhook`).
- Exige `Authorization: Bearer <token>` pelo `TrialMiddleware`.
- Ou usa `Depends(get_current_user)` diretamente.
- Ou usa `require_module_access(...)`, que por sua vez depende de `get_current_user()`.
- Ou exige `_require_admin()` / `_require_superadmin()` após autenticação.

Rotas públicas relevantes ao fluxo de auth, segundo leitura do middleware:

- `/login`
- `/auth/google/login`
- `/auth/google/callback`
- `/signup/request-code`
- `/signup/confirm`
- `/password/forgot`
- `/password/reset`
- `/licenca/mercadopago/webhook` por exceção de prefixo no middleware

Observação documental: `GET /auth/google/calendar/callback` existe em `auth_routes.py`, mas não aparece na lista pública do `TrialMiddleware`; isso deve ser auditado em etapa própria antes de qualquer ajuste.

## 6. Camadas de segurança identificadas

| Camada | Arquivo | Papel | Risco se alterada |
|---|---|---|---|
| Middleware global | `backend/security/trial_middleware.py` | Exige Bearer token, valida usuário/clínica, define tenant, bloqueia licença/trial/conta suspensa | Crítico |
| Tenant header/contexto | `backend/security/tenant.py`, `tenant_context.py` | Captura `X-Tenant-ID` e mantém `ContextVar` | Alto |
| Usuário atual | `backend/security/dependencies.py` | `get_current_user()` valida token, usuário, setup e owner | Crítico |
| Permissão de módulo | `backend/security/dependencies.py`, `permissions.py` | `require_module_access()` e níveis `desabilitado/protegido/habilitado` | Crítico |
| Senha/grant protegido | `dependencies.py`, `admin_password.py`, `auth_routes.py` | Libera módulo protegido com senha admin/grant | Crítico |
| Admin local | `user_admin_routes.py` | `_require_admin()` para CRUD/permissões de usuários | Crítico |
| Superadmin | `superadmin_routes.py`, `superadmin.py` | `_require_superadmin()` e owner/tipo de conta | Crítico |
| Frontend HTTP | `frontend/app.js` | `requestJson` injeta token, trata grant e sessão | Crítico |

## 7. Contagem por arquivo de rota

| Arquivo | Endpoints declarados | Proteção principal observada | Risco geral |
|---|---:|---|---|
| `agenda_contatos_routes.py` | 4 | `require_module_access("agenda")` + `current_user` | Alto |
| `agenda_legado_routes.py` | 22 | `require_module_access("agenda")` + `current_user` | Crítico |
| `anamnese_routes.py` | 11 | `require_module_access("anamnese")` + `current_user` | Alto |
| `auth_routes.py` | 12 | Rotas públicas e rotas com `get_current_user` | Crítico |
| `cadastros_routes.py` | 39 | Dependências por endpoint: procedimentos/financeiro/configuração | Crítico |
| `cenario_routes.py` | 3 | `require_module_access("financeiro")` | Alto |
| `cid_routes.py` | 4 | `require_module_access("anamnese")` | Médio/alto |
| `controle_proteticos_routes.py` | 2 | `require_module_access("procedimentos")` | Alto |
| `convenios_planos_routes.py` | 11 | `require_module_access("configuracao")` | Alto |
| `editor_textos_routes.py` | 20 | `require_module_access("configuracao")` | Crítico |
| `etiquetas_routes.py` | 6 | `require_module_access("relatorios")` | Médio/alto |
| `financeiro_routes.py` | 10 | `require_module_access("financeiro")` | Crítico |
| `indices_financeiros_routes.py` | 10 | `require_module_access("financeiro")` | Crítico |
| `licenca_routes.py` | 5 | `get_current_user` exceto webhook público | Crítico |
| `materiais_routes.py` | 10 | `require_module_access("materiais")` | Crítico |
| `medicamentos_routes.py` | 8 | `require_module_access("anamnese")` | Médio/alto |
| `preferences_routes.py` | 12 | `require_module_access("configuracao")` | Alto |
| `prestadores_routes.py` | 13 | `require_module_access("prestadores")` | Crítico |
| `procedimentos_routes.py` | 18 | `require_module_access("procedimentos")` | Crítico |
| `proteticos_routes.py` | 8 | `require_module_access("procedimentos")` | Crítico |
| `relatorios_routes.py` | 1 | `require_module_access("relatorios")` | Médio/alto |
| `superadmin_routes.py` | 15 | `get_current_user` + `_require_superadmin()` | Crítico |
| `system_options_routes.py` | 2 | `require_module_access("configuracao")` + senha/grant protegido | Crítico |
| `tratamentos_routes.py` | 3 | `require_module_access("procedimentos")` | Crítico |
| `unidades_atendimento_routes.py` | 6 | `require_module_access("configuracao")` | Alto |
| `user_admin_routes.py` | 15 | `require_module_access("usuarios")` + senha/grant + `_require_admin()` | Crítico |

## 8. Matriz — Auth/Login/Sessão

| Endpoint | Método | Arquivo | Dependência segurança | Tenant/clínica | Payload sensível | Risco |
|---|---|---|---|---|---|---|
| `/login` | POST | `auth_routes.py` | Público no middleware; valida senha e cria JWT | Usa `usuario.clinica_id` no token | email/senha | Crítico |
| `/auth/google/login` | GET | `auth_routes.py` | Público | OAuth externo | OAuth | Alto |
| `/auth/google/callback` | GET | `auth_routes.py` | Público | Cria/carrega usuário/clínica | OAuth token externo | Crítico |
| `/auth/google/calendar/callback` | GET | `auth_routes.py` | Não listado como público no middleware; decodifica state | Usa `clinica_id` do state | OAuth calendar tokens | Crítico / exige auditoria |
| `/signup/request-code` | POST | `auth_routes.py` | Público | Valida clínica/email | email/nome/senha | Alto |
| `/signup/confirm` | POST | `auth_routes.py` | Público; cria conta e retorna token | Cria clínica/usuário | código/senha | Crítico |
| `/password/forgot` | POST | `auth_routes.py` | Público | Busca usuário por email | email/código | Alto |
| `/password/reset` | POST | `auth_routes.py` | Público | Atualiza senha | código/nova senha | Crítico |
| `/auth/setup/complete` | POST | `auth_routes.py` | `get_current_user`; liberado durante setup | Usuário/clínica atuais | senha interna | Crítico |
| `/logout` | POST | `auth_routes.py` | `get_current_user`; liberado durante setup | Usuário atual | sessão/token | Alto |
| `/auth/protected/unlock` | POST | `auth_routes.py` | `get_current_user` + senha admin | Clínica atual | senha admin/module_code | Crítico |
| `/me` | GET | `auth_routes.py` | `get_current_user` | Usuário/clínica atuais | contrato de sessão | Crítico |

Relação frontend: `login()`, `signupConfirm()`, `setupComplete()`, `setupLogout()`, `requestJson`, `carregarSessao()`, `startSessionHeartbeat()`, `ensureProtectedGrant()`.

## 9. Matriz — Usuários/Admin

| Grupo | Endpoint(s) | Método(s) | Arquivo | Segurança | Payload/ação sensível | Risco |
|---|---|---|---|---|---|---|
| Lista/código/schema | `/admin/users`, `/proximo-codigo`, `/permissions/schema` | GET | `user_admin_routes.py` | `usuarios` + senha/grant + `_require_admin` | Enumeração de usuários/permissões | Crítico |
| CRUD estrutural | `/admin/users`, `/{user_id}` | POST/PATCH/DELETE | `user_admin_routes.py` | `usuarios` + senha/grant + `_require_admin` | cria/edita/exclui usuário, email, admin, ativo | Crítico |
| Permissões | `/{user_id}/permissions` | GET/PATCH | `user_admin_routes.py` | `usuarios` + senha/grant + `_require_admin` | permissões internas/Easy | Crítico |
| Senhas | `/{user_id}/verify-password`, `/{user_id}/reset-password`, `/change-password` | POST | `user_admin_routes.py` | `usuarios` + senha/grant + `_require_admin` ou usuário atual | senha atual/nova senha | Crítico |
| Perfis/vínculos | `/{user_id}/profiles` | GET/PATCH | `user_admin_routes.py` | `usuarios` + senha/grant + `_require_admin` | perfil/prestadores | Alto |
| Status/tipo conta | `/{user_id}/active`, `/{user_id}/account-type` | PATCH | `user_admin_routes.py` | `usuarios` + senha/grant + `_require_admin` | ativação, tipo de conta, clínica | Crítico |

Relação frontend: `carregarUsuarios`, `usersSalvarEstrutural`, `usersExcluirSelecionado`, `usersAbrirPermissoes`, `usersSalvarPermissoes`, `usersSalvarSenha`, `usersPerfLoad`, `usersPerfHandlePrestadorChange`.

## 10. Matriz — Superadmin

| Grupo | Endpoint(s) | Método(s) | Arquivo | Segurança | Payload/ação sensível | Risco |
|---|---|---|---|---|---|---|
| Visão plataforma | `/superadmin/overview`, `/clinicas`, `/cobrancas`, `/auditoria`, `/assinaturas` | GET | `superadmin_routes.py` | `get_current_user` + `_require_superadmin` | dados de plataforma | Crítico |
| Usuários plataforma | `/usuarios`, `/usuarios/export.csv` | GET/POST | `superadmin_routes.py` | superadmin | cria/lista/exporta usuários | Crítico |
| Senha/status/perfil | `/usuarios/{user_id}/reset-senha`, `/status`, `/perfil` | POST/PATCH | `superadmin_routes.py` | superadmin | senha, ativo, admin | Crítico |
| Clínica/plano/trial | `/clinicas/{clinica_id}/status`, `/plano`, `/trial-extra` | PATCH | `superadmin_routes.py` | superadmin | suspende/ativa, plano, trial | Crítico |
| Exclusão definitiva | `/clinicas/{clinica_id}` | DELETE | `superadmin_routes.py` | superadmin + regras owner/master | exclusão de clínica/dados | Crítico / não mexer |

Relação frontend: funções `sa*` no `frontend/app.js`; menu aparece apenas com `sessaoAtual.is_superadmin` vindo de `/me`.

## 11. Matriz — Licença/Trial

| Endpoint | Método | Arquivo | Segurança | Trial/licença | Payload sensível | Risco |
|---|---|---|---|---|---|---|
| `/licenca/info` | GET | `licenca_routes.py` | `get_current_user` | permitido mesmo em fluxo de regularização | clínica atual | Crítico |
| `/licenca/checkout` | POST | `licenca_routes.py` | `get_current_user` | cria checkout | plano/pagamento | Crítico |
| `/licenca/confirmar` | POST | `licenca_routes.py` | `get_current_user` | aplica pagamento | payment_id | Crítico |
| `/licenca/sincronizar` | POST | `licenca_routes.py` | `get_current_user` | sincroniza Mercado Pago | payment_id/plano | Crítico |
| `/licenca/mercadopago/webhook` | POST/GET | `licenca_routes.py` | público por exceção no middleware | aplica pagamento por webhook | payload externo Mercado Pago | Crítico / público controlado |

Relação frontend: `licCarregarInfo`, `licIniciarCheckout`, `licConfirmarPagamentoRetorno`, `licSincronizarStatus`. Relação middleware: `/licenca` é exceção para permitir regularização quando licença/trial bloqueiam outras rotas.

## 12. Matriz — Pacientes, procedimentos e intervenções

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Pacientes | `/cadastros/pacientes*` | `cadastros_routes.py` | `require_module_access("procedimentos")` | `current_user.clinica_id` | CRUD paciente, menu/preferências | Crítico |
| Procedimentos genéricos | `/cadastros/procedimentos-genericos*` | `cadastros_routes.py` | `procedimentos` | clínica atual | CRUD, detalhe, migrar | Crítico |
| Tabelas procedimentos | `/procedimentos/tabelas*` | `procedimentos_routes.py` | `procedimentos` | clínica atual | CRUD tabela, reajuste | Crítico |
| Procedimentos | `/procedimentos`, `/{procedimento_id}` | `procedimentos_routes.py` | `procedimentos` | clínica atual | CRUD, preço, custo, tempo | Crítico |
| Reajuste | `/procedimentos/tabelas/reajuste-preview`, `/reajuste-aplicar` | `procedimentos_routes.py` | `procedimentos` | clínica atual | reajuste de preços | Crítico / não mexer |
| Materiais vinculados | `/{procedimento_id}/materiais-vinculados*` | `procedimentos_routes.py` | `procedimentos` | clínica atual | vínculos procedimento-material | Crítico |
| Tratamentos | `/tratamentos/paciente/{paciente_id}`, `/novo/combos`, `/novo` | `tratamentos_routes.py` | `procedimentos` | clínica atual | cria tratamento/orçamento | Crítico |

Relação frontend: chamadas `requestJson` em blocos de ficha/pacientes, procedimentos, materiais vinculados, relatórios de tabela e tratamentos. Área com payload sensível e vínculos complexos.

## 13. Matriz — Materiais

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Índices/listas | `/materiais/indices`, `/listas`, `/listas/{lista_id}/proximo-codigo` | `materiais_routes.py` | `materiais` | clínica atual | tabela/lista de preços | Alto |
| CRUD lista | `/materiais/listas`, `/listas/{lista_id}` | `materiais_routes.py` | `materiais` | clínica atual | cria/altera/exclui lista | Crítico |
| CRUD material | `/materiais`, `/{material_id}` | `materiais_routes.py` | `materiais` | clínica atual | preço, custo, estoque, classificação | Crítico |

Relação frontend: `materiaisCarregar*`, `materiaisSalvarModal`, `materiaisExcluirSelecionado`, `materiaisTabelaSalvarModal`, `materiaisExcluirTabela`.

## 14. Matriz — Financeiro, conta corrente, cenário e índices

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Conta corrente | `/financeiro/lancamentos`, `/relatorio-cc`, `/fluxo-caixa` | `financeiro_routes.py` | `financeiro` | clínica atual | lançamentos, fluxo, relatório | Crítico |
| Auxiliares financeiros | `/financeiro/categorias`, `/formas-pagamento`, `/situacoes` | `financeiro_routes.py` | `financeiro` | clínica atual | categorias/formas | Alto |
| CRUD lançamento | `/financeiro/lancamentos`, `/{lancamento_id}` | `financeiro_routes.py` | `financeiro` | clínica atual | criar/editar/excluir lançamento | Crítico |
| Plano de contas | `/cadastros/grupos`, `/categorias*` | `cadastros_routes.py` | `financeiro` | clínica atual | grupos/categorias/migração | Crítico |
| Cenário | `/cenario`, `/cenario/calcular-fixos` | `cenario_routes.py` | `financeiro` | clínica atual | custos/cenário anual | Alto |
| Índices financeiros | `/indices-financeiros*` | `indices_financeiros_routes.py` | `financeiro` | clínica atual | índice/cotação/migração/exclusão | Crítico |

Relação frontend: blocos `cc`, `rcc`, `fcx`, `dash`, `cenario`, `plano`, `indices`; alto risco por dinheiro, preço, cálculo e exclusão.

## 15. Matriz — Agenda

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Agenda contatos | `/agenda-contatos` | `agenda_contatos_routes.py` | `agenda` | clínica atual | CRUD contatos | Alto |
| Agenda legado eventos | `/agenda-legado`, `/{item_id}`, `/repetir` | `agenda_legado_routes.py` | `agenda` | clínica atual | CRUD/repetição de agenda | Crítico |
| Avisos | `/avisos-agendamento*` | `agenda_legado_routes.py` | `agenda` | clínica atual | envio de avisos | Alto |
| Google Agenda | `/google-agenda/status`, `/oauth/start`, `/preview`, `/exportar` | `agenda_legado_routes.py` | `agenda` | clínica atual | OAuth/exportação externa | Crítico |
| Combos/buscas | `/horarios-livres`, `/prestadores`, `/unidades`, `/pacientes`, etc. | `agenda_legado_routes.py` | `agenda` | clínica atual | disponibilidade e dados paciente/prestador | Alto |

Relação frontend: agenda legado/semana/contatos e modo standalone. Risco alto por eventos complexos, horários, pacientes e integrações Google.

## 16. Matriz — Editor de textos, relatórios e etiquetas

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Editor mesclar/exportar | `/editor-textos/mesclar`, `/exportar-pdf`, `/assinar-pdf` | `editor_textos_routes.py` | `configuracao` | clínica atual | documentos/PDF/assinatura | Crítico |
| Modelos documento | `/editor-textos/modelos*` | `editor_textos_routes.py` | `configuracao` | clínica atual | CRUD modelos | Alto |
| Assistentes | `/assistente-receitas*`, `/assistente-atestado*` | `editor_textos_routes.py` | `configuracao` | clínica atual | conteúdo clínico/documental | Alto |
| Acrobat/local | `/preparar-pdf-acrobat`, `/abrir-no-acrobat`, `/abrir-arquivo-pdf-acrobat` | `editor_textos_routes.py` | `configuracao` | clínica atual | arquivo local/PDF | Crítico |
| Etiquetas | `/config/etiquetas/modelos*`, `/padroes`, `/arquivos` | `etiquetas_routes.py` | `relatorios` | clínica atual | modelos/arquivos | Médio/alto |
| Envio email | `/relatorios/enviar-email` | `relatorios_routes.py` | `relatorios` | clínica atual | envio externo | Alto |

Relação frontend: editor de textos tem modo standalone, PDF, assinatura local e integração com arquivos; deve ficar bloqueado para modularização funcional inicial.

## 17. Matriz — Protéticos e serviços de prótese

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Controle protético | `/controle-proteticos`, `/filtros` | `controle_proteticos_routes.py` | `procedimentos` | clínica atual | controle/listagem | Alto |
| Protéticos | `/proteticos`, `/{protetico_id}` | `proteticos_routes.py` | `procedimentos` | clínica atual | CRUD protético | Alto |
| Serviços prótese | `/{protetico_id}/servicos`, `/servicos/{servico_id}` | `proteticos_routes.py` | `procedimentos` | clínica atual | custos/preços/serviços | Crítico |

Relação frontend: blocos `prot`, `protServicos`, `ctrlProt`; acoplado a procedimentos, custos e relatórios.

## 18. Matriz — Configurações, preferências e cadastros auxiliares

| Grupo | Endpoint(s) | Arquivo | Segurança | Tenant/clínica | Operação sensível | Risco |
|---|---|---|---|---|---|---|
| Preferências | `/preferences/general`, `/models`, `/environment`, `/user-data`, `/odontogram`, `/report-config` | `preferences_routes.py` | `configuracao` | clínica/usuário | preferências e ambiente | Alto |
| Opções sistema | `/system-options` | `system_options_routes.py` | `configuracao` + senha/grant protegido | clínica atual | segurança/opções globais | Crítico |
| Convênios/planos | `/cadastros/convenios-planos/*` | `convenios_planos_routes.py` | `configuracao` | clínica atual | CRUD convênio/plano/calendário | Alto |
| Prestadores | `/cadastros/prestadores*` | `prestadores_routes.py` | `prestadores` | clínica atual | prestadores, credenciamento, comissão | Crítico |
| Unidades | `/cadastros/unidades-atendimento*` | `unidades_atendimento_routes.py` | `configuracao` | clínica atual | unidades/local de atendimento | Alto |
| Auxiliares | `/cadastros/auxiliares*` | `cadastros_routes.py` | `configuracao` | clínica atual | tabelas auxiliares | Alto |
| CID | `/cid*` | `cid_routes.py` | `anamnese` | clínica atual | doença/CID | Médio/alto |
| Medicamentos | `/medicamentos*` | `medicamentos_routes.py` | `anamnese` | clínica atual | CRUD medicamentos | Alto |
| Anamnese | `/anamnese/questionarios*`, `/perguntas*`, `/pacientes/{id}/respostas` | `anamnese_routes.py` | `anamnese` | clínica/paciente | questionários/respostas clínicas | Alto |

## 19. Endpoints protegidos por `TrialMiddleware`

Padrão observado:

- Todos os endpoints fora da lista pública e fora dos prefixos estáticos passam pelo `TrialMiddleware`.
- O middleware exige `Authorization: Bearer <token>`.
- O middleware decodifica token, busca usuário, valida `clinica_id`, define `tenant_clinica_id`, busca clínica e bloqueia conta suspensa/licença expirada.
- Rotas `/licenca/*` são exceção parcial para permitir regularização de licença.
- Webhook Mercado Pago é exceção pública.

Risco: um endpoint pode parecer protegido apenas por `Depends(get_current_user)`, mas na prática há uma proteção global anterior. Qualquer mudança na ordem dos middlewares ou na lista pública muda o contrato de todos os endpoints.

## 20. Relação com `requestJson` no frontend

Achados:

- `frontend/app.js` possui 256 ocorrências de `requestJson(`.
- `requestJson` injeta Bearer token quando `auth=true`.
- Quase todos os grupos autenticados mapeados aparecem em chamadas `requestJson` ou `postJson` no frontend.
- `requestJson` também trata `protected_password_required`, reexecutando com `X-Protected-Grant`.
- `requestJson` interpreta `401/403` de sessão/licença/setup e pode bloquear a aplicação.

Relação identificável por grupo:

| Grupo backend | Prefixos frontend observados | Risco de acoplamento |
|---|---|---|
| Auth/Login/Sessão | `login`, `signup`, `forgot`, `setup`, `carregarSessao`, `startSessionHeartbeat` | Crítico |
| Usuários/Admin | `users*`, `usersPerm*`, `usersPerf*` | Crítico |
| Superadmin | `sa*` | Crítico |
| Licença | `lic*` | Crítico |
| Financeiro | `cc`, `rcc`, `fcx`, `dash`, `plano`, `indices` | Crítico |
| Procedimentos/Pacientes | `proc*`, `ficha*`, `pgen*` | Crítico |
| Materiais | `materiais*` | Crítico |
| Agenda | `agenda*` | Alto/crítico |
| Editor | `editorTextos*` | Crítico |
| Configurações | `pref*`, `sysOpt*`, `convPlan*`, `prest*`, `unidade*`, `aux*` | Alto/crítico |

## 21. Relação com `/me` e sessão

`/me` alimenta `sessaoAtual`, que afeta:

- Visibilidade do painel de usuários.
- Visibilidade do menu superadmin.
- Níveis de permissão do menu.
- Grant protegido antes de abrir ações de menu.
- Setup obrigatório (`setup_completed=false`).
- Heartbeat de sessão.
- `clinica_id` usado em mensagens e chaves de storage.

Risco: a matriz de endpoints depende indiretamente de `/me` porque o frontend decide quais ações o usuário enxerga/tenta executar com base no payload de sessão. O backend ainda deve validar tudo de novo, o que cria dupla camada necessária.

## 22. Acoplamentos com permissões

Módulos em `permissions.py` usados pelos routers:

- `usuarios`
- `prestadores`
- `agenda`
- `financeiro`
- `materiais`
- `procedimentos`
- `anamnese`
- `relatorios`
- `configuracao`

Pontos importantes:

- `cadastros_routes.py` usa permissões diferentes por grupo de endpoint, não uma única permissão do router.
- `system_options_routes.py` combina `configuracao` com senha/grant protegido.
- `user_admin_routes.py` combina `usuarios`, senha/grant protegido e `_require_admin()`.
- `superadmin_routes.py` usa lógica própria de superadmin, não `require_module_access` comum.
- `licenca_routes.py` depende de usuário atual e exceções de trial, não de módulo de permissão comum.

## 23. Acoplamentos com tenant/clínica

Observações:

- Foram encontradas centenas de referências a `clinica_id`/`current_user.clinica_id` em rotas.
- A maioria dos endpoints filtra dados por `current_user.clinica_id`.
- `TrialMiddleware` define `tenant_clinica_id` a partir do usuário autenticado.
- `TenantMiddleware` também pode definir tenant via `X-Tenant-ID`.
- `superadmin_routes.py` opera explicitamente sobre `clinica_id` de outras clínicas.
- `licenca_routes.py` altera dados da clínica atual e também processa pagamento via webhook.

Risco: tenant/clínica é um contrato transversal. Não deve ser refatorado junto com endpoint, frontend ou permissão sem auditoria própria.

## 24. Endpoints com risco crítico

Críticos por autenticação/sessão/senha/permissão:

- `/login`
- `/signup/confirm`
- `/password/reset`
- `/auth/setup/complete`
- `/auth/protected/unlock`
- `/me`
- `/admin/users*`
- `/system-options`

Críticos por superadmin/licença/tenant:

- `/superadmin/*`
- `/licenca/*`
- `/licenca/mercadopago/webhook`

Críticos por financeiro/preços/custos/reajustes:

- `/financeiro/lancamentos*`
- `/financeiro/relatorio-cc`
- `/financeiro/fluxo-caixa`
- `/indices-financeiros*`
- `/cenario*`
- `/procedimentos/tabelas/reajuste-*`
- `/procedimentos*`
- `/materiais*`
- `/proteticos/*/servicos`

Críticos por pacientes/documentos/agenda:

- `/cadastros/pacientes*`
- `/tratamentos/*`
- `/editor-textos/*pdf*`
- `/editor-textos/assinar-pdf`
- `/agenda-legado/*`
- `/agenda-legado/google-agenda/*`

## 25. Endpoints com risco alto ou médio

Alto:

- `/cadastros/prestadores*`
- `/cadastros/convenios-planos*`
- `/cadastros/unidades-atendimento*`
- `/preferences/*`
- `/anamnese/*`
- `/medicamentos*`
- `/config/etiquetas*`
- `/relatorios/enviar-email`

Médio/baixo documental, mas ainda autenticado:

- Endpoints GET de combos/opções/listas auxiliares quando não alteram dados.
- Endpoints GET de filtros, status e catálogos.
- Mesmo estes passam por token, tenant e permissão, então não são candidatos automáticos a refatoração funcional.

## 26. Operações sensíveis por tipo

| Tipo de operação | Exemplos | Risco |
|---|---|---|
| Senha/token/sessão | `/login`, `/password/reset`, `/auth/setup/complete`, `/auth/protected/unlock`, `/me` | Crítico |
| Permissões/admin | `/admin/users/*`, `/system-options` | Crítico |
| Superadmin/plataforma | `/superadmin/*` | Crítico |
| Licença/pagamento | `/licenca/*`, webhook Mercado Pago | Crítico |
| Exclusão | DELETE em usuários, clínica, pacientes, procedimentos, materiais, financeiro, agenda, modelos | Crítico |
| Financeiro | lançamentos, relatórios, índices, cenário, plano de contas | Crítico |
| Reajuste/preço/custo | procedimentos, materiais, protéticos, índices | Crítico |
| Vínculos entre entidades | pacientes, tratamentos, procedimentos, materiais, prestadores, perfis | Crítico |
| Documentos/PDF/assinatura | editor, relatórios, etiquetas, email | Alto/crítico |
| Agenda/integração externa | agenda legado, Google Agenda | Alto/crítico |

## 27. Lacunas restantes

- A matriz não audita linha a linha todos os 270 endpoints.
- A matriz não audita individualmente as 256 chamadas `requestJson(`.
- Não foi gerado mapa exato endpoint frontend -> backend para cada chamada dinâmica com template string.
- Não foi auditado profundamente o conteúdo de payload de todos os endpoints.
- Não foi auditada a ordem real de todos os middlewares além da leitura de `backend/main.py`.
- Não foi auditado o consumo completo de `tenant_clinica_id` em services/models.
- Não foi auditado o contrato completo OAuth Google Calendar, especialmente a interação com `TrialMiddleware`.
- Não foi auditado profundamente Mercado Pago/webhook.
- Não foi auditado banco real, schema ou migrations além de leitura estrutural já feita em auditorias anteriores.
- Não foi feita validação funcional no navegador ou via API, por escopo documental.

## 28. O que NÃO deve ser modularizado ainda

Não modularizar ainda:

- `requestJson`, `requestJsonBase`, `postJson`.
- `/me` e `build_user_context()`.
- `get_current_user()`.
- `TrialMiddleware`.
- `TenantMiddleware` e `tenant_context`.
- `require_module_access()`.
- `require_admin_password_if_user_control_enabled()`.
- `permissions.py`.
- `auth_routes.py`.
- `user_admin_routes.py`.
- `superadmin_routes.py`.
- `licenca_routes.py`.
- Endpoints financeiros, de materiais, procedimentos, reajuste, pacientes, agenda, editor, assinatura, protéticos e webhook.
- Qualquer endpoint com `DELETE`, senha, permissão, tenant, licença, superadmin, pagamento, reajuste ou vínculo entre entidades.

## 29. Próxima etapa documental recomendada

A próxima etapa mais segura é uma auditoria documental de `requestJson` por categorias de uso, dividindo as 256 ocorrências em grupos:

1. Auth/sessão/grant.
2. GET simples com JSON.
3. POST/PATCH/PUT/DELETE com payload sensível.
4. `rawBody`/upload/FormData.
5. `blob`/download/exportação.
6. Endpoints com template string dinâmico.
7. Chamadas financeiras/procedimentos/materiais/pacientes.
8. Chamadas de superadmin/licença/webhook relacionadas.

Alternativa segura: auditoria documental de tenant/clínica, cruzando `TrialMiddleware`, `TenantMiddleware`, `tenant_context`, `current_user.clinica_id` e endpoints superadmin/licença.

## 30. Recomendação conservadora

Nenhuma alteração funcional deve ocorrer antes de revisão humana desta matriz. A segurança está em camadas sobrepostas e acopladas: middleware global, dependências por router, `current_user`, permissões, tenant/clínica, frontend `requestJson`, `/me` e menu. Qualquer refatoração futura deve começar por testes de contrato e por escopo mínimo, nunca por reorganização ampla de endpoints.

## 31. Confirmação final desta etapa

- Esta etapa não altera código.
- Esta etapa não altera `frontend/app.js`.
- Esta etapa não altera `frontend/index.html`.
- Esta etapa não altera `frontend/js/modules`.
- Esta etapa não altera `frontend/js/utils`.
- Esta etapa não altera CSS.
- Esta etapa não altera backend.
- Esta etapa não altera banco, schema, migrations ou endpoints.
- Esta etapa não altera `requestJson`, `/me`, login, logout, sessão, autenticação, autorização, token, headers, permissões, tenant, trial, licença, superadmin, grant protegido, senha, CRUD de usuários ou webhook Mercado Pago.
- Esta etapa não acessou pastas proibidas.
- Esta etapa respeitou a blindagem textual/mojibake.
