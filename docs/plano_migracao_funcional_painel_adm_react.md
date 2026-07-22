# Atualizacao - ADM Clinicas Suspender / Ativar

- A acao `Suspender`/`Ativar` de `ADM -> Clinicas` foi implementada no frontend React.
- O contrato reutiliza `PATCH /superadmin/clinicas/{id}/status`.
- O payload e `{ ativo, motivo }`, com motivo opcional.
- A implementacao usa service `updateAdminClinicStatus`, hook `useUpdateClinicStatus` e modal controlado em `ClinicsPage.jsx`.
- Apos sucesso, a tela faz refetch interno e preserva selecao, busca, filtros por coluna, ordenacao e colunas visiveis.
- Permanecem pendentes: Demo, Mensal, Anual, Super Admin, Novo usuario, Excluir, commit, push e AWS.
- Backend, banco, migration, login, renew e logout nao foram alterados.

# Plano de migracao funcional do Painel ADM para o React

## 1. Objetivo

Definir a ordem modular de migracao do Painel ADM legado para o frontend React, com base no comportamento real encontrado no codigo, sem copiar a arquitetura monolitica.

## 2. Premissas

- O backend e a fonte de verdade.
- O legado permanece ativo ate a paridade total.
- Cada modulo React deve ter hook, service, componente e teste proprio.
- A autorizacao precisa ser centralizada.
- A migracao nao deve depender de `frontend/app.js`.

## 3. Fase 0 - Refinamento da fundacao

### Escopo

- Remover textos provisórios.
- Compactar layout.
- Trocar rotas desabilitadas por navegação real.
- Garantir shell coerente para ADM.

### Itens

- `admin/dashboard`
- `admin/users`
- `admin/clinics`
- `admin/billing`
- `admin/audit`
- `admin/license`

### Risco

Baixo, mas depende da fundação já existente não quebrar a proteção atual.

### Critério de aceite

- Shell ADM coerente.
- Menu e rotas consistentes.
- Nenhuma funcionalidade falsa exibida como pronta.

## 4. Fase 1 - Dashboard / visao geral

### Escopo

- Reproduzir indicadores do overview.
- Reproduzir resumo online.
- Permitir refresh e filtros globais.

### Campos e dados

- Total clínicas.
- Total usuários.
- MRR.
- ARR.
- Ativas.
- Trial.
- Expiradas.
- Suspensas.
- Sem usuário.
- Arquivadas.
- Usuário/clínica online.

### Backend base

- `GET /superadmin/overview`

### Componentes

- `AdminDashboardPage`
- `AdminKpiGrid`
- `AdminOnlineSummary`

### Hooks / services

- `useSuperadminOverview`
- `superadminApi.getOverview`

### Testes

- Renderização de KPIs.
- Atualização manual.
- Estados vazios e erro.

## 5. Fase 2 - Clínicas

### Escopo

- Listagem.
- Filtros.
- Ações não destrutivas primeiro.
- Ações críticas depois.

### Dados

- ID.
- Clínica.
- Status.
- Plano.
- Trial até.
- Usuários.
- Ações.

### Backend base

- `GET /superadmin/clinicas`
- `PATCH /superadmin/clinicas/{id}/status`
- `PATCH /superadmin/clinicas/{id}/plano`
- `PATCH /superadmin/clinicas/{id}/trial-extra`
- `DELETE /superadmin/clinicas/{id}`

### Componentes

- `ClinicsPage`
- `ClinicsFilterBar`
- `ClinicsTable`
- `ClinicRowActions`

### Hooks / services

- `useClinicsList`
- `useClinicActions`
- `superadminApi`

### Riscos

Crítico por envolver plano, trial, exclusão e MASTER.

## 6. Fase 3 - Usuarios

### Escopo

- Listagem de usuários.
- Criação.
- Status.
- Perfil.
- Reset de senha.
- Exportação CSV.

### Dados

- ID.
- Nome.
- E-mail.
- Clínica.
- Plano.
- Status.
- Ativo.
- Perfil.
- Proteção de owner/system.

### Backend base

- `GET /superadmin/usuarios`
- `GET /superadmin/usuarios/export.csv`
- `POST /superadmin/usuarios`
- `PATCH /superadmin/usuarios/{id}/status`
- `PATCH /superadmin/usuarios/{id}/perfil`
- `POST /superadmin/usuarios/{id}/reset-senha`

### Componentes

- `UsersPage`
- `UsersFilterBar`
- `UsersTable`
- `UserFormDialog`
- `UserPasswordDialog`

### Hooks / services

- `useUsersList`
- `useUserActions`
- `useUsersExport`

### Riscos

Alto, porque envolve admin, owner, conta de sistema e auditoria.

## 7. Fase 4 - Planos e licenças

### Escopo

- Reproduzir leitura de licença/estado.
- Separar visão administrativa de billing.

### Backend base

- `GET /licenca/info`
- `POST /licenca/checkout`
- `POST /licenca/sincronizar`

### Componentes

- `LicensePage`
- `BillingStatusCard`

### Risco

Médio, com dependência de integrações externas.

## 8. Fase 5 - Cobranças

### Escopo

- Consulta de cobranças.
- Visão de pagamentos.
- Filtro opcional por status.

### Backend base

- `GET /superadmin/cobrancas`
- `GET /superadmin/assinaturas`

### Componentes

- `BillingPage`
- `BillingTable`
- `SubscriptionsTable`

### Risco

Médio, por ser essencialmente consulta, mas com informação financeira sensível.

## 9. Fase 6 - Auditoria

### Escopo

- Listagem de auditoria.
- Filtros e paginação.
- Proteção contra exibição indevida de payload sensível.

### Backend base

- `GET /superadmin/auditoria`

### Componentes

- `AuditPage`
- `AuditTable`
- `AuditDetailDrawer`

### Risco

Médio, por exposição de metadados operacionais.

## 10. Fase 7 - Configurações adicionais

### Escopo

- Reaproveitar áreas de configuração encontradas no legado, se confirmadas como parte do Painel ADM.

### Possíveis módulos

- opções do sistema;
- preferências administrativas;
- rotas correlatas de plataforma.

## 11. Ordem recomendada

1. Dashboard.
2. Clínicas.
3. Usuários.
4. Cobranças.
5. Auditoria.
6. Licença/plano.
7. Configurações adicionais.

## 12. Justificativa da ordem

- Dashboard valida o contrato de leitura e indicadores.
- Clínicas valida o coração da administração de plataforma.
- Usuários valida permissões, proteção e exportação.
- Cobranças e auditoria consolidam visão operacional sem grande risco de escrita.
- Licença/plano depende de integração e deve vir após estabilização dos dados básicos.
- Configurações adicionais só entram depois que o núcleo estiver estável.

## 13. Estrutura modular recomendada

- `frontend-react/src/features/admin/dashboard/`
- `frontend-react/src/features/admin/clinics/`
- `frontend-react/src/features/admin/users/`
- `frontend-react/src/features/admin/billing/`
- `frontend-react/src/features/admin/audit/`
- `frontend-react/src/features/admin/license/`

Cada pasta deve conter:

- `Page.jsx`
- `components/`
- `services/`
- `hooks/`
- `tests/`
- `types` ou schema local, se necessário

## 14. Estratégia de rollback

- Reverter apenas o módulo entregue.
- Manter a fundação ADM e os módulos anteriores intactos.
- Evitar mudanças amplas no `App.jsx`.

## 15. Critérios de paridade

- Mesmos dados.
- Mesmos filtros.
- Mesmas colunas.
- Mesmas permissões.
- Mesmas confirmações.
- Mesma auditoria.
- Mesma proteção de owner/MASTER/system user.
- Sem dependência do legado após a migração.

## 16. Próximo passo recomendado

Iniciar a Fase 0 visual e estrutural do ADM React, antes de conectar qualquer módulo real de leitura ou escrita.

## 17. Ajuste desta etapa

- O ponto de entrada do ADM passou a ser o rail lateral principal.
- O acesso ficou dependente de `is_master` derivado do `/me`.
- O submenu desta fase ficou reduzido a cinco rotas: Visão geral, Clínicas, Usuários, Cobranças e Auditoria.
- `Planos e licenças` ficou fora do submenu nesta etapa e deve ser tratado junto da frente de Clínicas quando o modulo funcional correspondente entrar.

## 18. Atualização desta entrega

- A Fase 1 recebeu a primeira fatia funcional em `OverviewPage`.
- O endpoint real integrado é `GET /superadmin/overview`.
- A toolbar da visão geral foi limitada ao controle `Atualizar`.
- Filtros globais foram adiados porque o contrato atual do backend não os expõe.

## Atualizacao - ultimo acesso da Visao geral

- Auditoria de ultimo acesso concluida.
- Campo `usuarios.ultimo_login_em` criado por migration manual reversivel.
- Exibicao na tabela da Visao geral concluida por leitura de `GET /superadmin/overview`.
- Login bem-sucedido atualiza o campo; renew e logout nao alteram o valor.
- Proxima validacao manual recomendada: login real, abrir `/app/adm`, acionar `Atualizar` e conferir a data.

## Atualizacao - Clinicas fase 1 leitura

- A primeira fatia funcional de `ADM -> Clinicas` foi implementada em leitura.
- Backend base usado: `GET /superadmin/clinicas`.
- Toolbar de Clinicas atualizada com campo numerico, `+Teste`, `Suspender`, `Demo`, `Mensal`, `Anual`, `Super Admin`, `Nova conta`, `Excluir` e busca textual à direita; combos de status, ativo, plano, `Limpar filtros`, botao `Atualizar` e o antigo rotulo `Novo usuário` permanecem fora da implementacao ativa.
- `+Teste` passou a ser a primeira acao administrativa real, reutilizando `PATCH /superadmin/clinicas/{id}/trial-extra`; os demais controles administrativos de escrita continuam desabilitados nesta fase.
- A tabela React exibe `ID`, `Clinica`, `Usuarios`, `Plano`, `Trial ate` e `Status`, sem coluna de acoes.
- Selecao unica de linha implementada sem acao de escrita vinculada.
- A tabela foi padronizada pelo modelo de `Tabelas -> Servicos de Protetico`: `BranaTable`, `TableColumnFilterHeader`, filtros/ordenacao/visibilidade por coluna, rolagem `480`, linhas compactas, rodape integrado e toolbar com `auxiliary-shell-button`.
- Permanecem pendentes e bloqueadas para fases futuras: status/plano alem de `+Teste`, criacao de usuario, owner/Super Admin, exclusao, exportacao e demais escritas.
## Atualizacao - ADM Clinicas Demo

- A acao isolada `Demo` foi implementada no React usando o endpoint existente `PATCH /superadmin/clinicas/{id}/plano`.
- A implementacao nao cria rota, tabela, migration ou alteracao estrutural de banco.
- O fluxo usa service modular, hook dedicado, modal controlado, loading proprio, bloqueio contra clique duplicado e refetch apos sucesso.
- `+Teste` e `Suspender/Ativar` permanecem preservados.
- `Mensal`, `Anual`, `Super Admin`, `Novo usuario` e `Excluir` seguem pendentes e sem escrita real.
- Demo deve ser considerado operacionalmente concluido somente apos validacao runtime autenticada com clinica descartavel/local.

## Atualizacao - ADM Clinicas Mensal

- A acao isolada `Mensal` foi implementada no React usando o endpoint existente `PATCH /superadmin/clinicas/{id}/plano`.
- A implementacao nao cria rota, tabela, migration ou alteracao estrutural de banco.
- O fluxo usa service modular, hook dedicado, modal controlado, loading proprio, bloqueio contra clique duplicado e refetch apos sucesso.
- `+Teste`, `Suspender/Ativar` e `Demo` permanecem preservados.
- `Anual`, `Super Admin`, `Novo usuario` e `Excluir` seguem pendentes e sem escrita real.
- Mensal deve ser considerado operacionalmente concluido somente apos validacao runtime autenticada com clinica descartavel/local.

## Atualizacao - ADM Clinicas Anual

- A acao isolada `Anual` foi implementada no React usando o endpoint existente `PATCH /superadmin/clinicas/{id}/plano`.
- A implementacao nao cria rota, tabela, migration ou alteracao estrutural de banco.
- O fluxo usa service modular, hook dedicado, modal controlado, loading proprio, bloqueio contra clique duplicado e refetch apos sucesso.
- `+Teste`, `Suspender/Ativar`, `Demo` e `Mensal` permanecem preservados.
- `Super Admin`, `Novo usuario` e `Excluir` seguem pendentes e sem escrita real.
- Anual deve ser considerado operacionalmente concluido somente apos validacao runtime autenticada com clinica descartavel/local.

## Atualizacao - ADM Clinicas Super Admin

- A acao isolada `Super Admin` foi implementada no React usando o endpoint existente `PATCH /superadmin/clinicas/{id}/plano`.
- A implementacao nao cria rota, tabela, migration ou alteracao estrutural de banco.
- O fluxo usa service modular, hook dedicado, modal controlado, loading proprio, bloqueio contra clique duplicado e refetch apos sucesso.
- A semantica foi classificada como mudanca apenas de plano da clinica; nao ha promocao de usuario nem escolha de usuario alvo.
- `+Teste`, `Suspender/Ativar`, `Demo`, `Mensal` e `Anual` permanecem preservados.
- `Novo usuario` e `Excluir` seguem pendentes e sem escrita real.
- Super Admin deve ser considerado operacionalmente concluido somente apos validacao runtime autenticada com clinica descartavel/local.

## Atualizacao - ADM Usuarios Fase 1 leitura

- A rota `/app/adm/usuarios` foi conectada ao endpoint real `GET /superadmin/usuarios`.
- A implementacao React foi criada de forma modular em `frontend-react/src/features/admin/users/`.
- A tela entrega somente leitura: toolbar com `Atualizar` e `Buscar usuario`, tabela compacta, selecao unica, filtros por coluna, ordenacao, controle de colunas e rodape.
- Acoes mutaveis de usuarios continuam pendentes: criar, alterar, ativar/inativar, alternar perfil administrativo, resetar senha e excluir.

## Atualizacao - ADM Usuarios Exportar CSV

- `Exportar CSV` foi implementado na toolbar global como acao read-only.
- O frontend usa `GET /superadmin/usuarios/export.csv` com token Bearer no header.
- O download usa blob, nome de arquivo do `Content-Disposition` e fallback `usuarios-adm-YYYY-MM-DD.csv`.
- A exportacao envia a busca server-side atual (`q`) e preserva filtros locais, ordenacao e selecao da tabela sem converter esses estados em parametros ainda nao contratados.
- As acoes mutaveis de usuarios continuam pendentes: criar, alterar, ativar/inativar, alternar perfil administrativo, resetar senha e excluir.
- Nenhum endpoint POST, PUT, PATCH ou DELETE foi adicionado nesta fase.

## Atualizacao - ADM Usuarios Ver detalhes

- `Ver detalhes` foi implementado na toolbar global como acao read-only.
- O frontend nao criou endpoint novo e nao chama metodos mutaveis.
- O modal usa o usuario selecionado na tabela e os dados ja normalizados pela listagem.
- O botao fica desabilitado sem selecao e durante o carregamento inicial.
- O modal fecha sem limpar selecao; se a lista visivel perder o usuario selecionado por busca, filtro ou refresh, a selecao e limpa e o modal fecha.
- Campos nao presentes no contrato atual aparecem como `Nao disponivel`.
- `Novo usuario`, alterar, ativar/inativar, alternar perfil administrativo, resetar senha e excluir seguem pendentes.

## Atualizacao - ADM Usuarios Ver conta

- `Ver conta` foi implementado na toolbar global como acao read-only.
- O frontend navega de `/app/adm/usuarios` para `/app/adm/clinicas` usando estado transitorio controlado por `App.jsx` com `selectedClinicId`.
- O identificador usado e exclusivamente `clinica_id`.
- A pagina de Clinicas seleciona a conta vinculada por ID exato, preserva ordenacao e colunas visiveis e limpa filtros locais somente quando ocultam a linha alvo.
- Nenhum backend, banco, migration ou metodo mutavel foi adicionado nesta fase.
