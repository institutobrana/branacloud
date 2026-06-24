# Refino de contraste do submenu e remoção do logout da rail

## Objetivo da etapa

Reforçar a presença visual do submenu lateral contextual do `frontend-react`, deixando-o mais sólido, nítido e próximo de um menu desktop operacional, além de remover o botão `Sair` da rail inferior esquerda sem afetar o logout já disponível no menu do usuário da topbar.

## Arquivos lidos

- `docs/frontend_react_refino_submenu_lateral_estilo_easydental.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_toolbar_horizontal_operacional.md`
- `docs/frontend_react_ajuste_marca_topbar_icones_workspace.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaActionTopbar.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/app/App.jsx`

## Problema relatado pelo usuário

O submenu visualmente ainda parecia fraco, quase transparente, e o botão `Sair` na toolbar lateral inferior esquerda precisava ser removido.

## O que foi ajustado

- O painel contextual passou a ter fundo branco opaco e mais contraste.
- A borda e a sombra foram reforçadas para separar claramente o painel da rail e do workspace.
- O título do grupo ficou mais forte e legível.
- Os itens permaneceram em formato de lista operacional, sem aparência de cartões.
- O hover foi reforçado com cinza claro mais visível e leitura mais nítida.
- O botão `Sair` foi removido da rail lateral inferior.
- O logout da topbar foi preservado.

## Confirmações

- `Dashboard -> Início` foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- `Pacientes` somente leitura foi preservado.
- O login/logout não foram quebrados.
- Nenhuma API nova foi criada ou consumida.
- O backend não foi alterado.
- O frontend legado não foi alterado.
- O banco e as migrations não foram alterados.

## Resultado do build

- `cd frontend-react && npm.cmd run build`
- Build concluído com sucesso.
