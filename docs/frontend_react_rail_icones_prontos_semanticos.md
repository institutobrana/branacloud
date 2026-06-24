# Frontend React - Rail com icones semanticos prontos

## Objetivo da etapa

Substituir os SVGs locais da rail lateral por icones prontos e semanticos do `@ant-design/icons`, mantendo a ordem dos grupos, o comportamento de hover/mouseleave e o visual compacto do shell.

## Mudanca solicitada

- Abandonar os desenhos SVG locais da rail.
- Usar icones semanticamente claros e prontos do Ant Design.
- Manter a rail turquesa, os labels por tooltip e o submenu contextual atual.
- Nao alterar topbar, faixa principal nem dashboard.

## Mapeamento adotado

- Atendimento -> `TeamOutlined`
- Cadastro -> `UserOutlined`
- Financeiro -> `DollarOutlined`
- Tabelas -> `TableOutlined`
- Relatorios -> `FileTextOutlined`
- Configuracao -> `SettingOutlined`
- Ferramentas -> `ToolOutlined`
- Ajuda -> `CustomerServiceOutlined`

## Arquivos alterados

- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/styles/globals.css`
- `docs/11_roadmap_desenvolvimento.md`

## Arquivos removidos

- `frontend-react/src/layout/BranaRailIcons.jsx`

## Confirmacoes

- Nao instalou dependencias novas.
- Nao copiou SVGs ou imagens da internet.
- Nao copiou icones do EasyDental.
- A ordem dos grupos da rail foi preservada.
- O submenu continua abrindo no hover.
- O submenu continua fechando no mouseleave.
- A topbar horizontal nao foi alterada.
- A faixa turquesa e o dashboard nao foram alterados.
- Backend, frontend legado, banco e migrations nao foram alterados.

## Resultado esperado

Os icones prontos devem ficar mais legiveis e consistentes com a navegação principal, sem depender de desenhos locais customizados.
