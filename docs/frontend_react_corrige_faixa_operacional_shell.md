# Frontend React - Faixa operacional no shell

## Objetivo da etapa

Corrigir a raiz do alinhamento entre a rail lateral turquesa e a faixa operacional horizontal, movendo a faixa para o nível do shell para que pareça uma estrutura única, como no EasyDental.

## Problema relatado pelo usuário

- A barra turquesa horizontal ainda parecia separada da rail lateral.
- A tentativa anterior com pseudo-elemento não resolveu visualmente.
- A união continuava parecendo uma emenda artificial.

## Por que a solução anterior com pseudo-elemento não foi suficiente

- O pseudo-elemento apenas mascarava a transição visual.
- A faixa ainda estava presa ao dashboard/workspace, então a origem estrutural do desalinhamento continuava.
- O usuário validou que o remendo não passava a leitura correta de shell contínuo.

## Causa técnica real encontrada

- A faixa operacional horizontal estava sendo renderizada dentro do `DashboardPage`.
- A rail lateral pertence ao shell.
- Como as duas peças estavam em níveis estruturais diferentes, a transição visual parecia um degrau.

## Decisão adotada

- Levar a faixa operacional para o shell, acima do workspace.
- Remover o pseudo-elemento usado para cobrir a emenda.
- Manter a faixa acima das abas e o Quadro de avisos abaixo delas.

## Arquivos lidos

- `docs/frontend_react_alinha_barra_turquesa_com_rail.md`
- `docs/frontend_react_alinha_barra_turquesa_refino_final_quadro.md`
- `docs/frontend_react_ajuste_largura_miolo_barra_integrada.md`
- `docs/frontend_react_fix_workspace_dashboard_visibilidade.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `frontend-react/src/styles/globals.css`

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como a faixa turquesa foi conectada visualmente à rail/lateral

- A faixa operacional agora é renderizada no `App`, como camada do shell acima do workspace.
- A rail lateral continua abaixo da topbar, e a faixa passa a ocupar a linha estrutural anterior ao conteúdo do dashboard.
- Isso elimina a leitura de “peça colada” dentro do painel.

## Confirmações

- O pseudo-elemento/remendo foi removido.
- O badge `BRANA CLOUD` não voltou.
- A coluna direita não voltou.
- O Dashboard/Quadro de avisos foi preservado.
- Topbar, submenu lateral e Pacientes foram preservados.
- `/app` continua abrindo o Quadro de avisos.
- `Dashboard` continua voltando para o Quadro de avisos.
- `Cadastro -> Pacientes` foi preservado.
- `Pacientes` somente leitura foi preservado.
- Login/logout foram preservados.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
