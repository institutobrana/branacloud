# Frontend React - Conexão visual da barra turquesa com a rail lateral

## Objetivo da etapa

Eliminar a sensação de emenda/degrau entre a rail lateral turquesa e a faixa turquesa horizontal do `Dashboard`, fazendo-as parecer uma única estrutura operacional.

## Problema relatado pelo usuário

- A barra turquesa horizontal parecia nascer separada da rail lateral.
- Existia uma emenda visual clara entre a lateral e a faixa horizontal.
- A barra horizontal parecia uma peça distinta, não uma continuação da lateral.

## Causa técnica encontrada

- A faixa horizontal ainda começava exatamente na borda do conteúdo do dashboard.
- Isso deixava visível a separação entre a rail e a faixa.
- Não havia sobreposição visual suficiente para encobrir a transição.

## Arquivos lidos

- `docs/frontend_react_alinha_barra_turquesa_refino_final_quadro.md`
- `docs/frontend_react_refino_proporcao_quadro_avisos.md`
- `docs/frontend_react_ajuste_largura_miolo_barra_integrada.md`
- `docs/frontend_react_fix_workspace_dashboard_visibilidade.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/app/App.jsx`

## Arquivos alterados

- `frontend-react/src/features/dashboard/dashboard.css`
- `docs/11_roadmap_desenvolvimento.md`

## Solução adotada para conectar visualmente barra horizontal e rail lateral

- A faixa horizontal recebeu uma extensão visual à esquerda via pseudo-elemento, cobrindo a emenda.
- A barra continuou sem badge, sem arredondamento e sem sombra de card.
- A largura útil do miolo foi mantida ampla para preservar a leitura operacional.

## Confirmações

- O badge `BRANA CLOUD` não voltou.
- A coluna direita não voltou.
- Topbar, submenu lateral e Pacientes foram preservados.
- `/app` continua abrindo o Quadro de avisos.
- `Dashboard` continua voltando para o Quadro de avisos.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
