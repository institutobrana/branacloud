# Matriz de paridade do Painel ADM legado para o React

## 1. Objetivo

Registrar a correspondência funcional entre o Painel ADM legado e a futura implementação modular em React, sem copiar a arquitetura monolítica.

## 2. Matriz de controle

| ID | Area | Elemento/Função | Legado - arquivo | Legado - função | Endpoint | Método | Permissão | Risco | Módulo React de destino | Componente React previsto | Service previsto | Hook previsto | Teste previsto | Backend reutilizável | Ajuste necessário | Status | Critério de paridade |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ADM-001 | Entrada | Menu Painel ADM | `frontend/index.html` | `menu-superadmin-action` | n/a | n/a | superadmin | alto | `admin/dashboard` | `AdminEntryMenu` | n/a | `useAdminAccess` | visibilidade por perfil | n/a | n/a | fundacao existente | item visivel somente para perfis autorizados |
| ADM-002 | Entrada | Botao do painel administrador | `frontend/index.html` | `btn-open-users` | n/a | n/a | admin da clinica | alto | `admin/users` | `AdminQuickAccessButton` | n/a | `useAdminAccess` | abrir painel por perfil | n/a | n/a | fundacao existente | acesso rapido apenas no perfil correto |
| ADM-003 | Plataforma | Atualizar visão geral | `frontend/app.js` | `saRecarregarTudo` | `/superadmin/overview` | GET | superadmin | medio | `admin/dashboard` | `AdminDashboardPage` | `superadminApi` | `useSuperadminOverview` | refresh | sim | possivel ajuste de shape | pendente de contrato | refazer os mesmos indicadores do legacy |
| ADM-004 | Plataforma | Buscar clínicas | `frontend/app.js` | `saCarregarClinicas` | `/superadmin/clinicas` | GET | superadmin | medio | `admin/clinics` | `ClinicsPage` | `adminClinicsApi.getAdminClinics` | `useAdminClinics` | busca textual, tabela e seleção | sim | sem ajuste backend nesta fase | leitura implementada | mesma lista e seleção; controles administrativos visuais desabilitados; busca expõe somente `q` |
| ADM-005 | Plataforma | Buscar usuários | `frontend/app.js` | `saCarregarUsuarios` | `/superadmin/usuarios` | GET | superadmin | medio | `admin/users` | `UsersPage` | `adminUsersApi.getAdminUsers` | `useAdminUsers` | filtro, tabela e selecao | sim | `setup_completed` ausente no endpoint atual | leitura implementada | mesma consulta real, tabela compacta e sem acoes mutaveis |
| ADM-006 | Plataforma | Exportar CSV | `frontend/app.js` | `saExportarUsuariosCsv` | `/superadmin/usuarios/export.csv` | GET | superadmin | medio | `admin/users` | `UsersExportAction` | `superadminApi` | `useUsersExport` | download CSV | sim | nome de arquivo e colunas | pendente de contrato | mesmo arquivo/colunas |
| ADM-007 | Plataforma | Redefinir senha usuário | `frontend/app.js` | `saResetarSenhaUsuario` | `/superadmin/usuarios/{id}/reset-senha` | POST | superadmin | alto | `admin/users` | `UserResetPasswordAction` | `superadminApi` | `useUserActions` | confirmação + sucesso/erro | sim | confirmar contrato de senha | bloqueado até contrato | mesma proteção e auditoria |
| ADM-008 | Plataforma | Alterar status usuário | `frontend/app.js` | `saAlterarStatusUsuario` | `/superadmin/usuarios/{id}/status` | PATCH | superadmin | alto | `admin/users` | `UserStatusAction` | `superadminApi` | `useUserActions` | confirmação | sim | proteção owner/system | bloqueado até contrato | bloquear owner e usuário de sistema |
| ADM-009 | Plataforma | Alterar perfil usuário | `frontend/app.js` | `saAlterarPerfilUsuario` | `/superadmin/usuarios/{id}/perfil` | PATCH | superadmin | alto | `admin/users` | `UserAdminToggleAction` | `superadminApi` | `useUserActions` | confirmação | sim | bloquear owner/system | bloqueado até contrato | preservar proteção de proprietário |
| ADM-010 | Plataforma | Criar usuário de clínica | `frontend/app.js` | `saCriarUsuarioClinica` | `/superadmin/usuarios` | POST | superadmin | alto | `admin/users` | `UserCreateDialog` | `superadminApi` | `useUserCreate` | confirmação | sim | validar payload e perfil | bloqueado até contrato | mesma criação e ativação opcional |
| ADM-011 | Plataforma | Alterar status clínica | `frontend/app.js` | `saAlterarStatusClinica` | `/superadmin/clinicas/{id}/status` | PATCH | superadmin | alto | `admin/clinics` | `ClinicStatusAction` | `superadminApi` | `useClinicActions` | confirmação | sim | proteção MASTER | bloqueado até contrato | bloquear clínica MASTER e auditar |
| ADM-012 | Plataforma | Alterar plano clínica | `frontend/app.js` | `saAlterarPlanoClinica` | `/superadmin/clinicas/{id}/plano` | PATCH | superadmin | crítico | `admin/clinics` | `ClinicPlanAction` | `superadminApi` | `useClinicActions` | confirmação + dias | sim | aplicar plano e manter ativo | bloqueado até contrato | mesma mudança de plano e trial |
| ADM-013 | Plataforma | Prorrogar trial | `frontend/app.js` | `saProrrogarTesteClinica` | `/superadmin/clinicas/{id}/trial-extra` | PATCH | superadmin | crítico | `admin/clinics` | `ClinicTrialExtendAction` | `superadminApi` | `useClinicActions` | confirmação | sim | proteger MASTER | bloqueado até contrato | mesma extensão e auditoria |
| ADM-014 | Plataforma | Excluir clínica | `frontend/app.js` | `saExcluirClinica` | `/superadmin/clinicas/{id}` | DELETE | superadmin | crítico | `admin/clinics` | `ClinicDeleteAction` | `superadminApi` | `useClinicActions` | confirmação forte | sim | rollback/limpeza de dependências | bloqueado até contrato | mesma remoção definitiva e limpeza |
| ADM-015 | Plataforma | Listar cobranças | `frontend/app.js` | `saCarregarCobrancas` | `/superadmin/cobrancas` | GET | superadmin | medio | `admin/billing` | `BillingTablePage` | `adminBillingApi` | `useAdminBilling` | tabela read-only | sim | normalizar valor/status/data e preservar limite | contrato definido | mesma consulta e mesmas 7 colunas do legado |
| ADM-016 | Plataforma | Listar auditoria | `frontend/app.js` | `saCarregarAuditoria` | `/superadmin/auditoria` | GET | superadmin | medio | `admin/audit` | `AuditTablePage` | `superadminApi` | `useAuditList` | tabela | sim | payload/segredo | pendente de contrato | mesma ordenação e mesma retenção |
| ADM-017 | Plataforma | Listar assinaturas | `frontend/app.js` | `saRecarregarTudo` | `/superadmin/assinaturas` | GET | superadmin | medio | `admin/billing` | `SubscriptionsPage` | `adminBillingApi` | `useSubscriptionsList` | tabela complementar | sim | separar de billing se preciso | pos-fase 1 | visão derivada de plano/estado, não tabela principal inicial |
| ADM-018 | Plataforma | Indicadores do overview | `frontend/app.js` | `saRenderOverview` | `/superadmin/overview` | GET | superadmin | medio | `admin/dashboard` | `AdminKpiGrid` | `superadminApi` | `useSuperadminOverview` | KPI cards | sim | fórmulas derivadas do backend | pendente de contrato | mesma origem e mesmos valores |
| ADM-019 | Clínica | Painel de usuários da clínica | `frontend/index.html` e `frontend/app.js` | `showUsersPanel` | `/admin/users` | GET | admin da clínica | alto | `admin/users` | `ClinicUsersPage` | `usersApi` | `useClinicUsers` | lista e ações | sim | separar por módulo | pronto para implementação | mesma proteção e mesma lista |
| ADM-020 | Sistema | Licença e status do plano | `frontend/app.js` | `licCarregarInfo` | `/licenca/info` | GET | owner/superadmin | medio | `admin/billing` | `LicensePanelPage` | `licenseApi` | `useLicenseInfo` | card/modal | sim | contrato separado | pendente de contrato | mesma leitura do estado |

## 3. Classificação resumida

- Fundação existente: menu ADM, rota base e proteção inicial no React.
- Pendentes de contrato: dashboard, clínicas, usuários, billing, audit, license.
- Bloqueados por contrato: ações destrutivas e sensíveis.
- Prontos para implementação: nenhum módulo funcional administrativo real nesta etapa.

## 4. Critérios de paridade

- Mesma área funcional.
- Mesmos filtros e colunas relevantes.
- Mesma regra de permissão.
- Mesma resposta de backend.
- Mesma auditoria.
- Mesmo efeito de banco.
- Sem dependência do `app.js` legado.

## 5. Atualizacao desta etapa

- A navegacao lateral ADM agora esta organizada como agrupador proprio no rail principal.
- O acesso passou a depender de `is_master` vindo da sessao.
- O submenu ADM ficou restrito a cinco itens: Visão geral, Clínicas, Usuários, Cobranças e Auditoria.
- `Planos e licenças` e `Configurações` nao fazem mais parte do submenu desta frente.

## 6. Atualização da visão geral

- A visão geral funcional inicial passou a usar `OverviewPage` no React.
- O service de leitura é `adminOverviewApi.getAdminOverview`.
- O hook de orquestração é `useAdminOverview`.
- Os indicadores foram mantidos como leitura direta do backend, sem cálculo duplicado no frontend.

## 7. Atualizacao do ultimo acesso

- A coluna `Ultimo acesso` da tabela da visao geral usa `usuarios.ultimo_login_em`.
- O campo e preenchido somente no login bem-sucedido do usuario responsavel pela clinica.
- Null real significa `Nao registrado`; campo ausente no payload legado significa `Nao disponivel`.

## 8. Atualizacao - Clinicas fase 1 leitura

- `ADM-004` passou para leitura implementada no React.
- O modulo usa `GET /superadmin/clinicas` com `q` e `limit` no service React.
- Os filtros visuais `Status`, `Ativo`, `Plano` e `Limpar filtros` foram removidos da toolbar React; os parametros backend seguem preservados no endpoint.
- A toolbar React exibe controles administrativos visuais desabilitados à esquerda e `Buscar clinica` no grupo direito, sem handlers de escrita.
- A tabela React entrega `ID`, `Clinica`, `Usuarios`, `Plano`, `Trial ate` e `Status`.
- A tabela de Clinicas foi padronizada pelo modelo de `Tabelas -> Servicos de Protetico`, com `BranaTable`, `TableColumnFilterHeader`, ordenacao/filtro/visibilidade por coluna, rolagem vertical compacta, rodape integrado e botoes da toolbar reutilizando `auxiliary-shell-button`.
- O botao `Atualizar` foi removido da toolbar de Clinicas; o refetch interno permanece para busca, carregamento e mutacoes.
- `ADM-013` teve a primeira implementacao real: `+Teste` chama `PATCH /superadmin/clinicas/{id}/trial-extra` com `{ dias }`, valor inicial `10`, limites `1..3650`, confirmacao Ant Design e auditoria backend `clinica_trial_extend`.
- A coluna `Acoes` permanece fora da tabela; todas as operacoes POST/PUT/PATCH/DELETE permanecem adiadas, exceto `+Teste` conforme contrato desta etapa.

## 9. Atualizacao - Clinicas Suspender / Ativar

- `ADM-011` passou para implementado no React.
- Legado: `saAlterarStatusClinica(id, ativo)`.
- Endpoint reutilizado: `PATCH /superadmin/clinicas/{id}/status`.
- Payload: `{ ativo, motivo }`, com motivo opcional.
- React: `updateAdminClinicStatus`, `useUpdateClinicStatus`, modal controlado em `ClinicsPage.jsx` e toolbar apenas por props.
- Protecao MASTER e auditoria `clinica_status_update` permanecem no backend.
- Demo, Mensal, Anual, Super Admin, Novo usuario e Excluir seguem pendentes.
## Atualizacao - ADM Clinicas Demo

- Legado auditado: `saAlterarPlanoClinica(id, "DEMO")`.
- React implementado: `setAdminClinicDemo`, `useSetClinicDemo`, modal controlado em `ClinicsPage.jsx` e prop `onDemo` na toolbar.
- Endpoint em paridade: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload em paridade para React: `{ plano: "DEMO", manter_ativo: true }`.
- Diferenca deliberada de UI: o legado usa `window.confirm` e `window.prompt`; o React usa modal controlado e nao envia `dias`, deixando o backend aplicar o padrao de 7 dias.
- Semantica preservada: plano Demo, `tipo_conta = "DEMO 7 dias"`, trial reiniciado pelo backend e clinica ativa.
- Pendentes: Mensal, Anual, Super Admin, Novo usuario, Excluir, runtime final, commit, push e AWS.

## Atualizacao - ADM Clinicas Mensal

- Legado auditado: `saAlterarPlanoClinica(id, "MENSAL")`.
- React implementado: `setAdminClinicMonthlyPlan`, `useSetClinicMonthlyPlan`, modal controlado em `ClinicsPage.jsx` e prop `onMonthly` na toolbar.
- Endpoint em paridade: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload em paridade para React: `{ plano: "MENSAL", manter_ativo: true }`.
- Diferenca deliberada de UI: o legado usa `window.confirm` e `window.prompt`; o React usa modal controlado e nao envia `dias`, deixando o backend aplicar o padrao de 30 dias.
- Semantica preservada: plano Mensal, `tipo_conta = "Mensal"`, validade reiniciada pelo backend, `data_ativacao` atualizada e clinica ativa.
- Cobranca: paridade preservada, sem criacao de boleto, Pix, checkout ou cobranca pelo endpoint.
- Pendentes: Anual, Super Admin, Novo usuario, Excluir, runtime final, commit, push e AWS.

## Atualizacao - ADM Clinicas Anual

- Legado auditado: `saAlterarPlanoClinica(id, "ANUAL")`.
- React implementado: `setAdminClinicAnnualPlan`, `useSetClinicAnnualPlan`, modal controlado em `ClinicsPage.jsx` e prop `onAnnual` na toolbar.
- Endpoint em paridade: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload em paridade para React: `{ plano: "ANUAL", manter_ativo: true }`.
- Diferenca deliberada de UI: o legado usa `window.confirm` e `window.prompt`; o React usa modal controlado e nao envia `dias`, deixando o backend aplicar o padrao de 365 dias.
- Semantica preservada: plano Anual, `tipo_conta = "Anual"`, validade reiniciada pelo backend, `data_ativacao` atualizada e clinica ativa.
- Cobranca: paridade preservada, sem criacao de boleto, Pix, checkout ou cobranca pelo endpoint; assinatura derivada recebe `proxima_cobranca_em`.
- Pendentes: Super Admin, Novo usuario, Excluir, runtime final, commit, push e AWS.

## Atualizacao - ADM Clinicas Super Admin

- Legado auditado: `saAlterarPlanoClinica(id, "SUPERADMIN")`.
- Classificacao: A, mudanca apenas de plano da clinica.
- React implementado: `setAdminClinicSuperAdminPlan`, `useSetClinicSuperAdminPlan`, modal controlado em `ClinicsPage.jsx` e props `superAdmin*` na toolbar.
- Endpoint em paridade: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload em paridade para React: `{ plano: "SUPERADMIN", manter_ativo: true }`.
- Diferenca deliberada de UI: o legado usa `window.confirm`; o React usa modal controlado. Nao ha prompt de dias para `SUPERADMIN` no legado nem no React.
- Semantica preservada: plano Super Admin, `tipo_conta = "Super Admin"`, validade padrao de 365 dias, `data_ativacao` atualizada e clinica ativa.
- Usuario: paridade preservada, sem promocao de usuario, sem usuario alvo e sem escrita em `is_admin`, `is_master` ou `is_superadmin`.
- Cobranca: paridade preservada, sem criacao de boleto, Pix, checkout ou cobranca pelo endpoint.
- Pendentes: Novo usuario, Excluir, runtime final, commit, push e AWS.

## Atualizacao - ADM Usuarios Fase 1 leitura

- `ADM-005 Buscar usuarios` foi implementado no React usando `GET /superadmin/usuarios`.
- A tela usa o shell global em `App.jsx` e nao cria faixa local.
- A tabela entrega selecao unica, filtros por coluna, ordenacao, visibilidade de colunas, rodape e estados de loading/erro/vazio.
- A toolbar possui apenas `Atualizar` e `Buscar usuario`.
- `ADM-006 Exportar CSV` foi implementado como acao read-only, usando `GET /superadmin/usuarios/export.csv`, token Bearer no header, download por blob e nome seguro.
- `ADM-007` a `ADM-010` seguem pendentes/bloqueados por contrato e sem codigo mutavel novo nesta fase.

## Atualizacao - ADM-006 Exportar CSV

- Status React: implementado read-only em `frontend-react/src/features/admin/users/`.
- Toolbar: `Atualizar`, `Exportar CSV`, `Buscar usuario`.
- Service: `adminUsersApi.exportAdminUsersCsv`.
- Hook: `useExportAdminUsersCsv`.
- Download: `adminUsersCsvDownload`.
- Filtros enviados: busca server-side atual (`q`) e `limit=5000`.
- Filtros locais por coluna, ordenacao e selecao: preservados, nao enviados ao backend nesta etapa.
- Mutacoes relacionadas a usuarios: continuam fora do escopo.

## Atualizacao - ADM-006b Ver detalhes de usuario

- Status React: implementado read-only em `frontend-react/src/features/admin/users/`.
- Toolbar: `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Buscar usuario`.
- Fonte de dados: objeto normalizado retornado por `GET /superadmin/usuarios`.
- Endpoint novo: nenhum.
- Mutacao: nenhuma.
- Modal: `Detalhes do usuario`, somente leitura, footer unico `Fechar`.
- Campos ausentes: `Nao disponivel`.
- Protecao: badge `Protegido` quando `is_system_user` ou indicador proprietario confiavel estiver presente.
- Comportamento de selecao: fechar preserva selecao; busca/filtro/refresh que removem o usuario selecionado limpam a selecao e fecham o modal.
- Pendentes: `Novo usuario`, editar, ativar/inativar, alterar perfil, resetar senha e excluir.

## Atualizacao - ADM-006c Ver conta

- Status React: implementado read-only em `frontend-react/src/features/admin/users/` e `frontend-react/src/features/admin/clinics/`.
- Toolbar: `Atualizar`, `Exportar CSV`, `Ver detalhes`, `Ver conta`, `Buscar usuario`.
- Origem: `/app/adm/usuarios`.
- Destino: `/app/adm/clinicas`.
- Identificador: `clinica_id` do usuario selecionado.
- Mecanismo: estado transitorio controlado por `App.jsx` com `selectedClinicId`.
- Selecao: Clinicas procura por ID exato, seleciona a linha encontrada e limpa filtros locais apenas se ocultarem a linha alvo.
- Mutacao: nenhuma.
- Endpoint novo: nenhum.

## Atualizacao - ADM Cobranca auditoria

- Auditoria documental e tecnica concluida em 2026-07-22 para `ADM -> Cobranca`.
- O legado usa `saCarregarCobrancas()` e `GET /superadmin/cobrancas?limit=80`.
- A tabela visual do legado possui 7 colunas: `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data`.
- O endpoint backend retorna tambem campos tecnicos como `clinica_id`, `payment_id`, `external_reference`, `moeda` e `atualizado_em`.
- `GET /superadmin/assinaturas` existe, mas foi classificado como visao complementar derivada para etapa posterior.
- Primeira fase segura definida: listagem read-only de cobrancas de plataforma, sem checkout, Pix, boleto, sincronizacao Mercado Pago, confirmacao de pagamento, webhook ou mutacao financeira.

## Atualizacao - ADM Cobrancas Fase 1 leitura

- Status React: implementado read-only em `frontend-react/src/features/admin/billing/`.
- Rota: `/app/adm/cobrancas`.
- Fonte de dados: `GET /superadmin/cobrancas`.
- Paridade visual inicial: `ID`, `Clinica`, `Plano`, `Status`, `Valor`, `Origem` e `Data`.
- Recursos adicionais seguros: selecao unica, filtros por coluna, ordenacao, controle de colunas visiveis, rodape, refresh manual e busca textual local.
- Fora da paridade inicial: checkout, Pix, boleto, confirmacao manual, sincronizacao Mercado Pago, webhook, cancelamento, reembolso, `payload_json`, modal de detalhes, exportacao CSV e qualquer mutacao financeira.

## Atualizacao - ADM Cobrancas dados vazios

- Auditoria somente leitura confirmou que `GET /superadmin/cobrancas?limit=80` retorna HTTP 200 com `[]` quando `plataforma_cobrancas` esta vazia.
- Banco local: `plataforma_cobrancas` com 0 registros; `plataforma_assinaturas` com registros de estado derivado.
- A alimentacao de cobrancas vem dos fluxos de licenca/checkout/pagamento, nao de seed/manual padrao.
- Proxima paridade segura: `Ver conta` por `clinica_id`, sem mutacao e sem endpoint novo.
- `Exportar CSV` pode usar o GET atual; `Ver detalhes` deve permanecer sem `payload_json` ate contrato especifico.

## Atualizacao - ADM Cobrancas Ver conta

- `Ver conta` foi implementado como acao read-only em `ADM -> Cobrancas`.
- Origem: `/app/adm/cobrancas`.
- Destino: `/app/adm/clinicas`.
- Identificador: `clinica_id` da cobranca selecionada.
- Mecanismo: estado transitorio controlado por `App.jsx` com `selectedClinicId`.
- Mutacao: nenhuma.
- Endpoint novo: nenhum.

## Atualizacao - ADM Cobrancas Exportar CSV

- `Exportar CSV` foi implementado como acao read-only em `ADM -> Cobrancas`.
- Origem dos dados: linhas ja carregadas/visiveis no frontend.
- Endpoint novo: nenhum.
- Nova requisicao HTTP: nenhuma.
- Mutacao: nenhuma.
- `Ver detalhes`, pagamento, baixa, cancelamento, reembolso, checkout, webhook e Mercado Pago permanecem fora do escopo.

## Atualizacao - ADM Cobrancas Ver detalhes

- `Ver detalhes` foi implementado como acao read-only em `ADM -> Cobrancas`.
- Origem dos dados: linha selecionada ja carregada/normalizada no frontend.
- Endpoint novo: nenhum.
- Nova requisicao HTTP: nenhuma.
- `payload_json`: nao exibido.
- Mutacao: nenhuma.
- Pagamento, baixa, cancelamento, reembolso, checkout, webhook e Mercado Pago permanecem fora do escopo.
