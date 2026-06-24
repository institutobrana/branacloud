# Correção do Dashboard inicial sem depender de hover

## Objetivo da etapa

Garantir que `/app` renderize imediatamente o `Dashboard / Quadro de avisos`, sem depender de hover na lateral, e que o botão `Dashboard` da toolbar volte para essa mesma tela.

## Problema confirmado pelo usuário

- `/app` nascia vazio.
- O conteúdo do Dashboard aparecia apenas depois de passar o mouse na rail lateral.
- O botão `Dashboard` da toolbar horizontal não forçava a volta para o Dashboard/Quadro de avisos.

## Causa técnica encontrada

- O shell estava com o estado da tela demasiado dependente do fluxo de navegação lateral.
- A renderização inicial não estava suficientemente explícita para o `Dashboard`.
- O clique no botão `Dashboard` não estava reforçando o mesmo estado inicial da tela principal.

## Correção aplicada no estado inicial / workspace

- O estado inicial do workspace passou a ser explicitamente `dashboard`.
- Foi adicionado fallback seguro para `dashboard` quando não houver tela selecionada válida.
- O `DashboardPage` passou a ser o conteúdo padrão do `/app`.
- Foi adicionado um `key` de remount para impedir reaproveitamento visual indevido ao voltar para o Dashboard.

## Correção aplicada no botão Dashboard da toolbar

- O botão `Dashboard` passou a chamar a mesma ação interna usada para o Dashboard inicial.
- Ao clicar, ele volta explicitamente para o `Dashboard / Quadro de avisos`.
- O clique também limpa o painel contextual e reforça a posição inicial.

## Ajustes visuais feitos

- O Dashboard passou a aparecer imediatamente no carregamento.
- O espaço vazio superior foi reduzido.
- A faixa turquesa operacional, as abas e o quadro de avisos ficaram visíveis sem depender de hover.
- O visual permaneceu compacto e mais próximo do EasyDental/Brana legado.

## Arquivos lidos

- `docs/frontend_react_correcao_render_dashboard_quadro_avisos.md`
- `docs/frontend_react_dashboard_inicial_estilo_easydental.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_ajuste_marca_topbar_icones_workspace.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `frontend-react/src/features/inicio/InicioPage.jsx`
- `frontend-react/src/features/inicio/inicio.css`
- `frontend-react/src/styles/globals.css`

## Arquivos criados

- `docs/frontend_react_fix_dashboard_inicial_sem_hover.md`

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Confirmações

- `/app` renderiza o Dashboard imediatamente.
- O Dashboard não depende mais de hover na lateral.
- O botão `Dashboard` funciona e volta para o Dashboard/Quadro de avisos.
- `Cadastro -> Pacientes` foi preservado.
- `Pacientes` somente leitura foi preservado.
- Login/logout foram preservados.
- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e as migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
