# Correção do render do Dashboard / Quadro de avisos

## Objetivo da etapa

Corrigir o comportamento inicial do `frontend-react` para que `/app` renderize imediatamente o `Dashboard / Quadro de avisos`, com visual mais fiel ao EasyDental/Brana legado, sem depender de hover na lateral.

## Problema relatado pelo usuário

- A área central do `/app` aparecia praticamente vazia.
- A tela esperada de Dashboard / Quadro de avisos não aparecia de imediato.
- O conteúdo parecia surgir apenas ao passar o mouse na lateral.
- O miolo ainda parecia uma tela de migração, não um quadro de avisos operacional.
- O nome visível `Início` não representava bem a função real da tela.

## Decisão de modularização

- A tela passou a ser tratada como `Dashboard / Quadro de avisos`.
- Foi criado o módulo próprio `frontend-react/src/features/dashboard/DashboardPage.jsx`.
- `InicioPage.jsx` foi mantido apenas como compatibilidade, reexportando a nova página.

## Arquivos lidos

- `docs/frontend_react_dashboard_inicial_estilo_easydental.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_ajuste_marca_topbar_icones_workspace.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/features/inicio/InicioPage.jsx`
- `frontend-react/src/features/inicio/inicio.css`
- `frontend-react/src/styles/globals.css`

## Arquivos criados

- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `docs/frontend_react_correcao_render_dashboard_quadro_avisos.md`

## Arquivos alterados

- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/inicio/InicioPage.jsx`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `docs/11_roadmap_desenvolvimento.md`

## O que foi corrigido

- `/app` passou a renderizar diretamente o `Dashboard / Quadro de avisos`.
- O conteúdo inicial deixou de depender de hover na lateral.
- O título visível passou a ser `Quadro de avisos`.
- A faixa operacional turquesa ficou visível de imediato.
- As abas `Avisos`, `Painel`, `Análise de agenda`, `Análise de vendas` e `Análise financeira` ficaram posicionadas abaixo da faixa.
- O miolo antigo de cards de migração/status da sessão deixou de ser exibido nesta tela.

## Placeholders seguros

- Foram usados apenas dados estáticos ou já disponíveis em memória da sessão.
- Nenhuma API nova foi criada ou consumida.
- Nenhuma API de escrita foi usada.

## Confirmações

- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e as migrations não foram alterados.
- `Pacientes` somente leitura foi preservado.
- `Dashboard -> Início` foi preservado.
- Login e logout foram preservados.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
