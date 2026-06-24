# Correção da visibilidade do dashboard no workspace

## Objetivo da etapa

Garantir que o `Dashboard / Quadro de avisos` apareça imediatamente em `/app`, sem depender de hover na lateral, corrigindo o posicionamento e a visibilidade do workspace.

## Problema confirmado

- `/app` nascia com a área central vazia.
- O Dashboard aparecia apenas após hover na rail lateral.
- O botão `Dashboard` da toolbar não resolvia a tela vazia.

## Causa técnica real encontrada

- O `BranaWorkspace` estava sendo auto-posicionado na segunda coluna do grid do shell.
- Quando o painel contextual não era renderizado, essa segunda coluna ficava com largura `0px`.
- Com isso, o workspace ficava espremido/oculto até o hover abrir o painel contextual e liberar espaço.

## Arquivos lidos

- `docs/frontend_react_fix_dashboard_inicial_sem_hover.md`
- `docs/frontend_react_correcao_render_dashboard_quadro_avisos.md`
- `docs/frontend_react_dashboard_inicial_estilo_easydental.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
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

- `docs/frontend_react_fix_workspace_dashboard_visibilidade.md`

## Arquivos alterados

- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

## Correção aplicada no workspace / shell / CSS

- O `BranaWorkspace` passou a ocupar explicitamente a terceira coluna do grid.
- O painel contextual passou a ocupar explicitamente a segunda coluna.
- A rail permaneceu fixa na primeira coluna.
- O conteúdo principal deixou de depender do painel contextual para ganhar largura.

## Correção aplicada no botão Dashboard

- O botão `Dashboard` continua chamando a tela `dashboard`.
- A ação reforça o retorno ao Quadro de avisos sem depender do menu lateral.

## Confirmações

- `/app` mostra o Quadro de avisos imediatamente.
- O Dashboard não depende mais de hover na lateral.
- Abrir/fechar o painel contextual não esconde mais o workspace.
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
