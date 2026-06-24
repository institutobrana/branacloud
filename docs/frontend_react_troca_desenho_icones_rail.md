# Frontend React - Troca do desenho dos ícones da rail

## Objetivo da etapa

Ajustar os desenhos dos ícones da rail lateral para ficarem semanticamente mais próximos da referência EasyDental enviada pelo usuário, sem copiar assets proprietários e sem alterar comportamento ou layout.

## Esclarecimento do usuário

- O problema não era apenas o estilo visual.
- O problema principal era o desenho/representação dos ícones.
- A intenção agora é aproximar os glyphs da rail da referência EasyDental.

## Biblioteca de ícones usada

- `@ant-design/icons`

## Arquivos lidos

- `docs/frontend_react_refino_icones_rail_estilo_easydental.md`
- `docs/frontend_react_menu_lateral_grupos_submenus.md`
- `docs/frontend_react_contrato_shell_operacional_odontologico.md`
- `docs/11_roadmap_desenvolvimento.md`
- `frontend-react/package.json`
- `frontend-react/src/layout/BranaIconRail.jsx`
- `frontend-react/src/layout/BranaContextPanel.jsx`
- `frontend-react/src/styles/globals.css`

## Arquivos criados

- `docs/frontend_react_troca_desenho_icones_rail.md`

## Arquivos alterados

- `frontend-react/src/layout/BranaIconRail.jsx`
- `docs/11_roadmap_desenvolvimento.md`

## Mapeamento antes/depois dos ícones da rail

- Atendimento: `CalendarOutlined` -> `TeamOutlined`
- Cadastro: `UserOutlined` -> `UserOutlined`
- Financeiro: `DollarOutlined` -> `DollarOutlined`
- Tabelas: `DashboardOutlined` -> `TableOutlined`
- Relatórios: `FileTextOutlined` -> `FileTextOutlined`
- Configuração: `SettingOutlined` -> `SettingOutlined`
- Ferramentas: `TeamOutlined` -> `ToolOutlined`
- Ajuda: `SmileOutlined` -> `CustomerServiceOutlined`

## Justificativa de equivalência semântica com a referência EasyDental

- Atendimento ficou mais próximo de equipe/profissionais.
- Cadastro continua com perfil/pessoa.
- Financeiro continua com símbolo de dinheiro.
- Tabelas passou a usar desenho mais aderente a grade/tabela.
- Relatórios continua com documento textual.
- Ferramentas ficou mais alinhado a ferramenta/chave.
- Ajuda ficou mais próximo de suporte/atendimento ao usuário.

## Confirmações

- Não copiou assets, SVGs ou imagens do EasyDental.
- Não instalou dependências novas.
- A ordem e os grupos da rail foram preservados.
- O hover/mouseleave do submenu foi preservado.
- `Cadastro -> Pacientes` foi preservado.
- `Dashboard -> Quadro de Avisos` foi preservado.
- A faixa turquesa e o Quadro de Avisos não foram alterados.
- A topbar horizontal não foi alterada.
- Backend, frontend legado, banco e migrations não foram alterados.
- Nenhuma API nova foi criada ou consumida.

## Resultado do build

- `cd frontend-react`
- `npm.cmd run build`
- Build concluído com sucesso.
