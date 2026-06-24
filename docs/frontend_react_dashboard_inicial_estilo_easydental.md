# Dashboard inicial do frontend-react no estilo EasyDental

## Objetivo da etapa

Refinar a tela inicial do `frontend-react` para aproximar o `Dashboard/Início` do painel inicial do EasyDental, preservando o shell atual e sem criar novas funcionalidades reais.

## Arquivos lidos

- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_ajuste_marca_topbar_icones_workspace.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/features/inicio/InicioPage.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/layout/BranaWorkspace.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/app/App.jsx`

## Arquivos alterados

- `frontend-react/src/features/inicio/InicioPage.jsx`
- `frontend-react/src/features/inicio/inicio.css`
- `docs/11_roadmap_desenvolvimento.md`

## Referência visual usada

- A tela inicial/dashboard do EasyDental enviada pelo usuário.

## Decisões registradas

- Manter a tela inicial como destino do botão `Dashboard`.
- Criar faixa operacional com filtros logo abaixo da toolbar principal.
- Criar abas `Avisos`, `Painel`, `Análise de agenda`, `Análise de vendas` e `Análise financeira`.
- Usar placeholders seguros e estáticos, sem novas APIs.

## Confirmações

- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e as migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.
- `Pacientes` somente leitura foi preservado.
- `Dashboard -> Início` foi preservado.
- Login e logout foram preservados.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
