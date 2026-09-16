# Implementacao ADM Clinicas - Fase 1 leitura

## Objetivo

Implementar `ADM -> Clinicas` no frontend React do Brana Cloude como modulo somente leitura, usando o endpoint real de plataforma e preservando o shell ADM existente.

## Escopo atual

- Toolbar de leitura com superficie administrativa visual à esquerda e busca textual `Buscar clinica` à direita.
- Tabela real de clinicas.
- Selecao unica de linha.
- Loading, refreshing, erro e vazio.
- Service, hook, normalizer e formatters modulares.
- Testes frontend de contrato e limpeza.

## Fora do escopo

- POST, PUT, PATCH, DELETE.
- Alterar plano.
- Prorrogar trial.
- Suspender ou ativar clinica.
- Excluir clinica.
- Criar usuario.
- Definir owner ou Super Admin.
- Backend, banco, migration, login, renew, logout, token e `/me`.
- Commit, push e deploy.

## Estado inicial do Git

- Branch: `modularizacao-segura-fase-1`.
- Remote: `origin https://github.com/institutobrana/branacloud.git`.
- HEAD: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`.
- Stage inicial: vazio.
- Worktree ja estava sujo por frentes anteriores e foi preservado.

## Endpoint

- `GET /superadmin/clinicas`

## Autorizacao

- O endpoint chama `_require_superadmin(current_user)`.
- `_require_superadmin` usa `is_platform_superadmin_user(current_user)`.
- A rota React continua protegida antes da renderizacao por `canAccessPlatformAdmin(user)`, que exige `user.is_master`.
- SUPERADMIN nao MASTER, admin comum, usuario comum e sessao ausente continuam bloqueados no frontend.
- O backend permanece como fonte de verdade.

## Contrato backend preservado

Query params reais do endpoint:

- `q`: busca textual por nome ou e-mail da clinica.
- `status`: status calculado da assinatura/clinica, preservado no backend.
- `ativo`: bool parseado pelo backend quando enviado, preservado no backend.
- `limit`: limite entre 1 e 1000, default 200.

Na interface React atual:

- Somente `q` e `limit` sao enviados por `adminClinicsApi.js`.
- `status`, `ativo` e `plano` nao sao expostos na toolbar.
- `plano` nunca foi query param do endpoint de clinicas e nao e mais filtrado localmente nesta fase.
- Os controles administrativos visuais estao desabilitados nesta fase e nao possuem handlers de escrita.

## Colunas

Colunas React da fase 1:

- `ID`
- `Clinica` com nome e e-mail
- `Usuarios`
- `Plano`
- `Trial ate`
- `Status`

Coluna adiada:

- `Acoes`

## Busca

- Busca por nome/e-mail da clinica.
- Enviada ao backend como `q`.
- Debounce de `350ms`.
- Nao coloca token na URL.

## Selecao

- Selecao unica por radio.
- Clique na linha tambem seleciona.
- A selecao e mantida apos refresh se o ID ainda existir.
- A selecao e limpa quando o registro desaparece.
- Nenhuma acao de escrita fica ligada a selecao nesta fase.

## Arquitetura

Arquivos ativos em `frontend-react/src/features/admin/clinics/`:

- `ClinicsPage.jsx`
- `components/ClinicsToolbarContent.jsx`
- `components/ClinicsTable.jsx`
- `components/ClinicsLoadingState.jsx`
- `components/ClinicsErrorState.jsx`
- `components/ClinicsEmptyState.jsx`
- `hooks/useAdminClinics.js`
- `hooks/useClinicsTableState.js`
- `services/adminClinicsApi.js`
- `utils/adminClinicsFormatters.js`
- `utils/adminClinicsNormalizer.js`
- `utils/adminClinicsTable.js`

Arquivo removido nesta limpeza:

- `utils/adminClinicsFilters.js`

## Limpeza obrigatoria da toolbar

Elementos removidos da interface:

- Combo de Status.
- Combo de Ativo.
- Combo de Plano.
- Botao `Limpar filtros`.
- Grupo visual `.admin-clinics-toolbar-filters` usado pela toolbar antiga de filtros.

Elementos presentes na toolbar final:

- Lado esquerdo: campo numerico, `+Teste`, `Suspender`, `Demo`, `Mensal`, `Anual`, `Super Admin`, `Novo usuario` e `Excluir`.
- Lado direito: `Buscar clinica`.
- `+Teste` e a primeira acao administrativa real conectada nesta fase.
- Os demais controles administrativos permanecem visuais/desabilitados nesta fase.

Estados removidos:

- `filters`.
- `setFilters`.
- valores iniciais `status`, `ativo` e `plano`.

Handlers removidos:

- `updateFilter`.
- `clearFilters`.
- props `onFilterChange` e `onClearFilters`.

Imports removidos:

- `Select` de `antd` em `ClinicsToolbarContent.jsx`.
- `ADMIN_CLINICS_STATUS_OPTIONS`.
- `ADMIN_CLINICS_ACTIVE_OPTIONS`.
- `ADMIN_CLINICS_PLAN_OPTIONS`.
- `hasActiveClinicFilters`.
- `normalizeClinicsFilters`.
- `filterClinicsByPlan`.

Constantes/opcoes removidas:

- Opcoes de Status.
- Opcoes de Ativo.
- Opcoes de Plano.
- `ADMIN_CLINICS_DEFAULT_FILTERS`.

CSS removido:

- `.admin-clinics-toolbar-filters`.
- `.admin-clinics-toolbar-filters .ant-input-search`.
- `.admin-clinics-toolbar-filters .ant-select`.

CSS mantido/adicionado:

- `.admin-clinics-toolbar-search`, usado exclusivamente pelo campo textual de busca.
- `.admin-clinics-toolbar-actions`, usado para agrupar os controles administrativos à esquerda.
- `.admin-clinics-toolbar-days`, usado para o campo numerico visual.
- Os botoes da toolbar de Clinicas reutilizam `auxiliary-shell-button` dentro de `materiais-estoque-toolbar-actions`, o mesmo contrato visual usado por `Tabelas -> Servicos de Protetico`.
- `Button` do Ant Design deixou de ser usado na toolbar de Clinicas; apenas `InputNumber` e `Input.Search` permanecem do Ant Design.
- O botao `Atualizar` foi removido; o refetch interno permanece para carregamento, busca e mutacoes reais.

## Acao +Teste

- Legado auditado: `saProrrogarTesteClinica(id, dias)` em `frontend/app.js`.
- Endpoint reutilizado: `PATCH /superadmin/clinicas/{id}/trial-extra`.
- Payload: `{ dias }`.
- Valor inicial do Spin: `10`.
- Minimo: `1`.
- Maximo: `3650`.
- Unidade: dias.
- O React rejeita valor vazio, decimal, abaixo do minimo e acima do maximo antes de enviar request.
- Confirmacao: `Modal.confirm`.
- Loading: exclusivo no botao `+Teste`.
- Clique duplicado: bloqueado por `useExtendClinicTrial`.
- Sucesso: refetch interno de Clinicas e mensagem discreta.
- Auditoria backend preservada: `clinica_trial_extend`.
- Documentacao detalhada: `docs/implementacao_acao_mais_teste_adm_clinicas.md` e `docs/contrato_acoes_adm_clinicas.md`.

Contrato visual auditado em `Servicos de Protetico`:

- Componente: `button` HTML nativo.
- Classe base: `auxiliary-shell-button`.
- Variacoes: `primary` para acao principal e `danger` para acao destrutiva.
- Container: `materiais-estoque-toolbar-actions servicos-protetico-toolbar-actions`.
- Gap: `8px`.
- Altura minima no container de Materiais: `28px`.
- Padding: `4px 10px`.
- Fonte: `12px`, `font-weight: 600`, `line-height: 1`.
- Raio: `8px`.
- Fundo normal: transparente; primario com `rgba(255, 255, 255, 0.16)`.
- Hover: `rgba(255, 255, 255, 0.12)`.
- Texto: `#ffffff`.
- `danger`: mantem texto branco e sem operacao destrutiva conectada nesta fase de Clinicas.

## Padronizacao da tabela pelo modelo Servicos de Protetico

- `ClinicsTable.jsx` passou a usar `BranaTable` e `TableColumnFilterHeader`, alinhando a estrutura com `Tabelas -> Servicos de Protetico`.
- Todas as colunas finais (`ID`, `Clinica`, `Usuarios`, `Plano`, `Trial ate`, `Status`) possuem cabecalho com ordenacao, filtro textual local e controle de visibilidade.
- A lista de checkboxes do popup segue a mesma ordem: `ID`, `Clinica`, `Usuarios`, `Plano`, `Trial ate`, `Status`.
- Larguras finais: `ID` 76px, `Clinica` 360px, `Usuarios` 100px, `Plano` 130px, `Trial ate` 130px e `Status` 120px.
- A selecao unica por radio foi preservada e nao entra no controle de visibilidade.
- A ultima coluna de dados visivel nao pode ser ocultada.
- A rolagem vertical segue `ADMIN_CLINICS_TABLE_SCROLL_Y = 480`.
- O CSS da tabela define cabecalho e linhas com `32px`, frame com borda unica e rodape integrado de `24px`, seguindo o padrao visual compacto das tabelas auxiliares.
- O contador solto da pagina foi removido e substituido por rodape integrado no frame da tabela.
- A documentacao especifica desta padronizacao esta em `docs/padronizacao_tabela_adm_clinicas_modelo_servicos_protetico.md`.

Testes atualizados:

- A query do service agora valida somente `q` e `limit`.
- A toolbar valida a superficie administrativa visual, a busca em grupo separado e a ausencia de `Select`, `Limpar filtros`, handlers e props dos filtros antigos.
- A limpeza valida ausencia do arquivo `adminClinicsFilters.js`.
- A normalizacao deixou de filtrar plano localmente.
- A tabela valida uso de `BranaTable`, `TableColumnFilterHeader`, rolagem `480`, rodape integrado, filtros/ordenacao por coluna, nova ordem de colunas e protecao/restauracao da ultima coluna visivel.
- A toolbar valida reutilizacao de `auxiliary-shell-button`, ausencia de `Button` do Ant Design e ausencia de chamadas de escrita.
- A acao `+Teste` valida endpoint, metodo, payload, token, limites e remocao do botao `Atualizar`.

Itens relacionados mantidos e justificativa:

- Coluna `Status`: permanece porque e dado de tabela retornado pelo backend.
- Coluna `Plano`: permanece porque e dado de tabela retornado pelo backend.
- `normalizePlanValue` e `normalizePlanLabel`: permanecem porque a coluna `Plano` continua exibida.
- Endpoint backend com `status` e `ativo`: preservado porque pode atender legado ou integracoes e nao pertence a esta limpeza de interface React.
- `limit`: preservado no service para manter limite defensivo da listagem.

## Validacao

Comandos esperados ao final:

- Busca estatica por residuos da toolbar antiga.
- Testes frontend incluindo `frontend-react/tests/adminClinics.test.js`.
- Build com `npm run build` em `frontend-react`.
- `git diff --check`.

## Ausencia de commit e push

- Sem commit.
- Sem push.
- Stage final deve permanecer vazio.
## Atualizacao - acao Suspender / Ativar

- `ADM-011` teve a implementacao real no React.
- O endpoint reutilizado e `PATCH /superadmin/clinicas/{id}/status`.
- O payload e `{ ativo, motivo }`, com motivo opcional.
- O legado usa `saAlterarStatusClinica(id, ativo)` e alterna o botao entre `Suspender` e `Ativar`.
- O React usa modal controlado, hook `useUpdateClinicStatus`, service `updateAdminClinicStatus`, loading proprio e refetch interno apos sucesso.
- Busca, filtros por coluna, ordenacao, colunas visiveis, selecao, scroll, rodape e `+Teste` permanecem preservados.
- Demo, Mensal, Anual, Super Admin, Novo usuario e Excluir continuam pendentes.
- Backend, banco, migration, login, renew, logout, commit, push e AWS nao foram alterados.

## Atualizacao - acao Demo

- `ADM -> Clinicas` passou a conectar o botao `Demo` ao endpoint legado existente.
- Funcao legado auditada: `saAlterarPlanoClinica(id, "DEMO")`.
- Endpoint reutilizado: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "DEMO", manter_ativo: true }`.
- O React nao envia `dias`; o backend aplica o padrao real de 7 dias.
- Semantica: muda `tipo_conta` para `DEMO 7 dias`, define `trial_ate` para agora + 7 dias, mantem/reativa `ativo = True` e sincroniza `PlataformaAssinatura`.
- Diferenca para `+Teste`: `+Teste` acrescenta dias; `Demo` altera o plano e reinicia a validade padrao do plano Demo.
- Service: `setAdminClinicDemo`.
- Hook: `useSetClinicDemo`.
- Modal: controlado em `ClinicsPage.jsx`, sem `Modal.confirm`, `window.confirm`, `window.prompt` ou `alert`.
- Refetch: apos sucesso chama `clinics.refresh()` e preserva selecao, busca, filtros por coluna, ordenacao e colunas visiveis quando o ID permanece.
- `Mensal`, `Anual`, `Super Admin`, `Novo usuario` e `Excluir` permanecem sem escrita real.
- Backend, banco, migration, login, renew, logout, commit, push e AWS nao foram alterados.
- Documentacao detalhada: `docs/implementacao_acao_demo_adm_clinicas.md`.

## Atualizacao - acao Mensal

- `ADM -> Clinicas` passou a conectar o botao `Mensal` ao endpoint legado existente.
- Funcao legado auditada: `saAlterarPlanoClinica(id, "MENSAL")`.
- Endpoint reutilizado: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "MENSAL", manter_ativo: true }`.
- O React nao envia `dias`; o backend aplica o padrao real de 30 dias.
- Semantica: muda `tipo_conta` para `Mensal`, define `trial_ate` para agora + 30 dias, mantem/reativa `ativo = True`, atualiza `data_ativacao` e sincroniza `PlataformaAssinatura`.
- Cobranca: o endpoint nao cria boleto, Pix, checkout ou registro financeiro; apenas sincroniza a assinatura derivada.
- Service: `setAdminClinicMonthlyPlan`, reutilizando `setAdminClinicPlan`.
- Hook: `useSetClinicMonthlyPlan`.
- Modal: controlado em `ClinicsPage.jsx`, sem `Modal.confirm`, `window.confirm`, `window.prompt` ou `alert`.
- Refetch: apos sucesso chama `clinics.refresh()` e preserva selecao, busca, filtros por coluna, ordenacao e colunas visiveis quando o ID permanece.
- `Anual`, `Super Admin`, `Novo usuario` e `Excluir` permanecem sem escrita real.
- Backend, banco, migration, login, renew, logout, commit, push e AWS nao foram alterados.
- Documentacao detalhada: `docs/implementacao_acao_mensal_adm_clinicas.md`.

## Atualizacao - acao Anual

- `ADM -> Clinicas` passou a conectar o botao `Anual` ao endpoint legado existente.
- Funcao legado auditada: `saAlterarPlanoClinica(id, "ANUAL")`.
- Endpoint reutilizado: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "ANUAL", manter_ativo: true }`.
- O React nao envia `dias`; o backend aplica o padrao real de 365 dias.
- Semantica: muda `tipo_conta` para `Anual`, define `trial_ate` para agora + 365 dias, mantem/reativa `ativo = True`, atualiza `data_ativacao` e sincroniza `PlataformaAssinatura`.
- Cobranca: o endpoint nao cria boleto, Pix, checkout ou registro financeiro; apenas sincroniza a assinatura derivada e `proxima_cobranca_em`.
- Service: `setAdminClinicAnnualPlan`, reutilizando `setAdminClinicPlan`.
- Hook: `useSetClinicAnnualPlan`.
- Modal: controlado em `ClinicsPage.jsx`, sem `Modal.confirm`, `window.confirm`, `window.prompt` ou `alert`.
- Refetch: apos sucesso chama `clinics.refresh()` e preserva selecao, busca, filtros por coluna, ordenacao e colunas visiveis quando o ID permanece.
- `Super Admin`, `Novo usuario` e `Excluir` permanecem sem escrita real.
- Backend, banco, migration, login, renew, logout, commit, push e AWS nao foram alterados.
- Documentacao detalhada: `docs/implementacao_acao_anual_adm_clinicas.md`.

## Atualizacao - acao Super Admin

- `ADM -> Clinicas` passou a conectar o botao `Super Admin` ao endpoint legado existente.
- Classificacao: A, mudanca apenas de plano da clinica.
- Funcao legado auditada: `saAlterarPlanoClinica(id, "SUPERADMIN")`.
- Endpoint reutilizado: `PATCH /superadmin/clinicas/{id}/plano`.
- Payload React: `{ plano: "SUPERADMIN", manter_ativo: true }`.
- O React nao envia `dias`; o backend aplica o padrao real de 365 dias.
- Semantica: muda `tipo_conta` para `Super Admin`, define `trial_ate` para agora + 365 dias, mantem/reativa `ativo = True`, atualiza `data_ativacao` e sincroniza `PlataformaAssinatura`.
- Usuario: nao promove usuario, nao altera `is_admin`, nao grava `is_master`, nao grava `is_superadmin`, nao escolhe usuario alvo e nao define owner.
- Acesso ADM: efeito indireto para usuarios admin da clinica, pois o backend deriva `is_superadmin` de `usuario.is_admin` + `clinica.tipo_conta` Super Admin.
- Cobranca: o endpoint nao cria boleto, Pix, checkout ou registro financeiro.
- Service: `setAdminClinicSuperAdminPlan`, reutilizando `setAdminClinicPlan`.
- Hook: `useSetClinicSuperAdminPlan`.
- Modal: controlado em `ClinicsPage.jsx`, sem `Modal.confirm`, `window.confirm`, `window.prompt` ou `alert`.
- Refetch: apos sucesso chama `clinics.refresh()` e preserva selecao, busca, filtros por coluna, ordenacao e colunas visiveis quando o ID permanece.
- `Novo usuario` e `Excluir` permanecem sem escrita real.
- Backend, banco, migration, login, renew, logout, commit, push e AWS nao foram alterados.
- Documentacao detalhada: `docs/implementacao_acao_super_admin_adm_clinicas.md`.

## Correcao textual - modal Suspender / Ativar

- O modal de `Suspender`/`Ativar` teve mojibake confirmado em runtime.
- A origem foi string fixa corrompida no JSX, nao resposta de API nem charset do HTML.
- Os textos do modal e mensagens relacionadas foram corrigidos para UTF-8 real.
- Testes de regressao textual foram adicionados para bloquear `clÃ`, `clÃƒ`, `UsuÃ`, `suspensÃ`, `ativaÃ`, `confirmaÃ`, `Ã‚` e `�`.
- A frente `Suspender`/`Ativar` permanece pendente de validacao runtime funcional completa antes de iniciar `Demo`.
