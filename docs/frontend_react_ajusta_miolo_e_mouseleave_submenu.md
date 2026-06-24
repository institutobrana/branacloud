# Frontend React - Ajuste do miolo e fechamento automático do submenu

## Objetivo da etapa

Subir o miolo do Quadro de avisos para aproximá-lo das abas e fazer o submenu lateral/contextual fechar automaticamente quando o mouse sair da região combinada rail + painel.

## Problema relatado pelo usuário

- O miolo do Quadro de avisos ainda estava um pouco baixo.
- O submenu lateral/contextual só fechava ao clicar no X.
- O comportamento desejado era fechar sozinho ao sair da área do menu, como no EasyDental.

## Arquivos lidos

- `docs/frontend_react_corrige_quina_real_faixa_rail.md`
- `docs/frontend_react_alinha_faixa_e_rail_mesmo_nivel.md`
- `docs/frontend_react_refino_quina_faixa_rail.md`
- `docs/frontend_react_fix_workspace_dashboard_visibilidade.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`

## Arquivos criados

- `docs/frontend_react_ajusta_miolo_e_mouseleave_submenu.md`

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como o miolo do Quadro de Avisos foi aproximado das abas

- Reduzi o espaçamento vertical geral da página do dashboard.
- Reduzi o `padding-top` da área do corpo do dashboard.
- Reduzi a folga visual entre a barra de abas e o card de saudação.
- A faixa turquesa e a quina já corrigidas foram preservadas.

## Como o painel contextual passou a fechar ao sair com o mouse

- O estado de fechamento passou a usar uma pequena tolerância por timer.
- Ao sair da rail ou do painel, o fechamento é agendado com pequena demora.
- Se o mouse entrar novamente na rail ou no painel, o timer é cancelado.
- Isso permite o fechamento automático sem obrigar o clique no X.

## Como foi preservada a transição rail -> painel sem fechamento imediato

- A rail e o painel contextual agora compartilham a mesma lógica de região ativa.
- O fechamento não acontece instantaneamente na troca da rail para o painel.
- O pequeno atraso evita falso fechamento durante a travessia do mouse.

## Confirmações

- A quina rail/faixa não foi desfeita.
- O badge `BRANA CLOUD` não voltou.
- A coluna direita não voltou.
- Dashboard/Quadro de avisos foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- `Pacientes` somente leitura foi preservado.
- Login/logout foram preservados.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
