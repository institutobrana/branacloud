# Frontend React - Remoção do texto MENU CONTEXTUAL

## Objetivo da etapa

Remover apenas o texto "MENU CONTEXTUAL" do topo do painel contextual/submenu lateral, preservando o título do grupo, o botão X e o fechamento automático por mouseleave.

## Pedido do usuário

- Remover o texto "MENU CONTEXTUAL" que aparece no topo do submenu lateral.

## Arquivos lidos

- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/frontend_react_ajusta_miolo_e_mouseleave_submenu.md`
- `docs/frontend_react_alinha_faixa_e_rail_mesmo_nivel.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/styles/globals.css`

## Arquivos criados

- `docs/frontend_react_remove_texto_menu_contextual.md`

## Arquivos alterados

- `frontend-react/src/layout/BranaContextPanel.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Como o texto "MENU CONTEXTUAL" foi removido

- Removi somente a linha que renderizava o texto "MENU CONTEXTUAL" no cabeçalho do painel contextual.
- Mantive o título do grupo ativo logo abaixo/na mesma área do cabeçalho.
- Não alterei os itens do submenu nem a estrutura de abertura/fechamento.

## Confirmações

- O título do grupo foi preservado.
- O botão X foi preservado.
- O fechamento automático por mouseleave foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- A quina rail/faixa e o Dashboard não foram alterados.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
