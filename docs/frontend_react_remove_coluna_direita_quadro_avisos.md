# Frontend React - Remoção da coluna direita do Quadro de avisos

## Objetivo da etapa

Remover a coluna direita de cards informativos do `Dashboard / Quadro de avisos` e manter o miolo principal alinhado à esquerda, com aparência mais operacional e mais próxima do EasyDental.

## Decisão do usuário

- Os cards da direita deixaram de ser importantes para o Brana Cloud neste momento.
- A prioridade passou a ser a leitura operacional do miolo esquerdo.

## Arquivos lidos

- `docs/frontend_react_refino_miolo_quadro_avisos.md`
- `docs/frontend_react_fix_dashboard_barra_alinhamento.md`
- `docs/frontend_react_dashboard_barra_turquesa_duas_colunas.md`
- `docs/frontend_react_refino_visual_quadro_avisos_easydental.md`
- `docs/frontend_react_fix_workspace_dashboard_visibilidade.md`
- `docs/frontend_react_dashboard_inicial_estilo_easydental.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`

## Arquivos alterados

- `frontend-react/src/features/dashboard/DashboardPage.jsx`
- `frontend-react/src/features/dashboard/dashboard.css`
- `docs/11_roadmap_desenvolvimento.md`

## Como a coluna direita foi removida

- Os cards laterais foram retirados do JSX do dashboard.
- As classes CSS específicas da coluna direita foram removidas do stylesheet.
- O conteúdo passou a ser renderizado em uma única coluna principal.

## Como o miolo principal foi reajustado

- A coluna principal recebeu largura confortável e alinhamento à esquerda.
- O conteúdo passou a ocupar melhor a área útil do workspace.
- O miolo manteve a barra turquesa, as abas, a saudação compacta e as barras de aviso.

## Confirmações

- A barra turquesa, as abas, a saudação e as barras de avisos foram preservadas.
- Topbar, rail lateral e submenu lateral não foram alterados.
- `/app` continua abrindo o Quadro de avisos imediatamente.
- `Dashboard` continua voltando para o Quadro de avisos.
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
