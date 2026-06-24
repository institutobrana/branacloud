# Frontend React - Refino dos ícones da rail no estilo EasyDental

## Objetivo da etapa

Refinar somente a rail lateral do `frontend-react` para aproximar os ícones do estilo visual do EasyDental, com barra turquesa sólida, ícones brancos mais soltos e sem aparência de cards/botões modernos grandes.

## Referência visual enviada pelo usuário

- Prints dos ícones do EasyDental na barra lateral.
- Barra lateral turquesa sólida.
- Ícones brancos, simples e grandes.
- Visual desktop/ERP, sem cards modernos.

## Problema visual atual

- Os ícones da rail do Brana ainda pareciam botões/cards arredondados modernos.
- O visual estava mais próximo de app/SaaS do que de um software desktop como o EasyDental.

## Arquivos lidos

- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/frontend_react_shell_topbar_fullwidth_layout.md`
- `docs/frontend_react_alinha_faixa_e_rail_mesmo_nivel.md`
- `docs/frontend_react_refino_quina_faixa_rail.md`
- `docs/frontend_react_corrige_quina_real_faixa_rail.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/styles/globals.css`
- `frontend-react/src/app/App.jsx`

## Arquivos criados

- `docs/frontend_react_refino_icones_rail_estilo_easydental.md`

## Arquivos alterados

- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

## Decisão visual adotada

- Os ícones da rail foram mantidos brancos.
- Os ícones passaram a ficar mais soltos sobre a barra turquesa.
- O fundo da rail continuou sólido em `#16AAA1`.
- O destaque ativo e o hover ficaram discretos.

## Decisão de remover/reduzir cards, bordas e sombras

- O visual de card grande foi removido da rail.
- As bordas evidentes dos botões foram removidas.
- As sombras fortes foram removidas.
- O botão inferior passou a seguir o mesmo padrão discreto.

## Confirmações

- A ordem e os grupos da rail foram preservados.
- O hover/mouseleave do submenu foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- `Dashboard -> Quadro de Avisos` foi preservado.
- A faixa turquesa e o Quadro de Avisos não foram alterados.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
